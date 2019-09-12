'use strict';

/**
 * @module Message
 * @name Message
 * @description A discrete unit of communication intended by the source(sender)
 * for consumption by some recipient(receiver) or group of recipients(receivers).
 *
 * A message may be delivered by various means(transports) including email, sms,
 * push notification etc.
 *
 * @see {@link https://en.wikipedia.org/wiki/Message}
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @version 0.1.0
 * @since 0.1.0
 * @public
 */

/* @todo country data */
/* @todo transport data */
/* @todo message form alert, announcement, reminder etc */
/* @todo support recipient name */

/* dependencies */
const _ = require('lodash');
const { parallel, waterfall } = require('async');
const { hashOf, mergeObjects } = require('@lykmapipo/common');
const { getString, getBoolean } = require('@lykmapipo/env');
const {
  model,
  Schema,
  Mixed,
  ObjectId,
} = require('@lykmapipo/mongoose-common');
const actions = require('mongoose-rest-actions');
const exportable = require('@lykmapipo/mongoose-exportable');
const isHtml = require('is-html');
const { plugin: runInBackground, worker } = require('mongoose-kue');

/* transports */
const ECHO_TRANSPORT_NAME = 'echo';
const DEFAULT_TRANSPORT_NAME = getString(
  'DEFAULT_TRANSPORT_NAME',
  ECHO_TRANSPORT_NAME
);
const DEFAULT_SMTP_TRANSPORT_NAME = getString('DEFAULT_SMTP_TRANSPORT_NAME');
const DEFAULT_SMS_TRANSPORT_NAME = getString('DEFAULT_SMS_TRANSPORT_NAME');
const DEFAULT_PUSH_TRANSPORT_NAME = getString('DEFAULT_PUSH_TRANSPORT_NAME');

/* load transports */
const transports = {
  'infobip-sms': require('./transports/sms.infobip'),
  'tz-ega-sms': require('./transports/sms.tz.ega'),
  smtp: require('./transports/smtp'),
  'fcm-push': require('./transports/push.fcm'),
};

/* message directions */
const DIRECTION_OUTBOUND = 'Outbound';
const DIRECTION_INBOUND = 'Inbound';
const DIRECTIONS = [DIRECTION_INBOUND, DIRECTION_OUTBOUND];

/* message types */
const TYPE_SMS = 'SMS';
const TYPE_EMAIL = 'EMAIL';
const TYPE_PUSH = 'PUSH';
const TYPES = [TYPE_SMS, TYPE_EMAIL, TYPE_PUSH];

/* message mime types. Used to tell what is mime of the message body.
 * It used mostly in smtp transports to decide which content to send i.e email
 * or text.
 */
const MIME_TEXT = 'text/plain';
const MIME_HTML = 'text/html';
const MIMES = [MIME_TEXT, MIME_HTML];

/* messages priorities */
const PRIORITY_LOW = 'low';
const PRIORITY_NORMAL = 'normal';
const PRIORITY_MEDIUM = 'medium';
const PRIORITY_HIGH = 'high';
const PRIORITY_CRITICAL = 'critical';
const PRIORITIES = [
  PRIORITY_LOW,
  PRIORITY_NORMAL,
  PRIORITY_MEDIUM,
  PRIORITY_HIGH,
  PRIORITY_CRITICAL,
];

/* transport send modes */
const SEND_MODE_PULL = 'Pull';
const SEND_MODE_PUSH = 'Push';
const SEND_MODES = [SEND_MODE_PULL, SEND_MODE_PUSH];

/* model name for the message */
const CAMPAIGN_MODEL_NAME = getString('CAMPAIGN_MODEL_NAME', 'Campaign');
const MODEL_NAME = getString('MESSAGE_MODEL_NAME', 'Message');

/* collection name for the message */
const COLLECTION_NAME = getString('MESSAGE_COLLECTION_NAME', 'messages');

/* schema options */
const SCHEMA_OPTIONS = {
  timestamps: true,
  emitIndexErrors: true,
  collection: COLLECTION_NAME,
};

/* message hash fields */
const HASH_FIELDS = [
  'type',
  'direction',
  'bulk',
  'sender',
  'to',
  'transport',
  'body',
  'priority',
  'createdAt',
];

/* messages state */

//state assigned to a message received from a transport
const STATE_RECEIVED = 'Received';

//state assigned to message to be sent by a transport mainly poll transport
const STATE_UNKNOWN = 'Unknown';

//state assigned to a message once a poll transport receive a message to send
const STATE_SENT = 'Sent';

//state assigned to a message after receiving acknowledge from poll transport
//that message have been queued for sending
const STATE_QUEUED = 'Queued';

//state assigned to a message once successfully delivered to a receiver(s)
const STATE_DELIVERED = 'Delivered';

//state assigned to a message once transport failed to deliver
const STATE_FAILED = 'Failed';

//states
const STATES = [
  STATE_RECEIVED,
  STATE_UNKNOWN,
  STATE_SENT,
  STATE_QUEUED,
  STATE_DELIVERED,
  STATE_FAILED,
];

/**
 * @name MessageSchema
 * @description message schema
 * @type {Schema}
 * @author lally elias <lallyelias87@gmail.com>
 * @version 0.1.0
 * @since 0.1.0
 * @private
 */
const MessageSchema = new Schema(
  {
    /**
     * @name role
     * @description campaign underwhich a message belongs.
     *
     * @since 0.1.0
     * @version 0.1.0
     * @instance
     */
    campaign: {
      type: ObjectId,
      ref: CAMPAIGN_MODEL_NAME,
      index: true,
      default: undefined,
    },

    /**
     * @name type
     * @description message type i.e SMS, e-mail, push etc
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    type: {
      type: String,
      enum: TYPES,
      trim: true,
      default: TYPE_EMAIL,
      index: true,
      searchable: true,
      fake: true,
    },

    /**
     * @name mime
     * @description message mime type i.e text/plain, text/html etc
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    mime: {
      type: String,
      enum: MIMES,
      trim: true,
      default: MIME_TEXT,
      index: true,
      searchable: true,
      fake: true,
    },

    /**
     * @name direction
     * @description message direction i.e received or sending
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    direction: {
      type: String,
      enum: DIRECTIONS,
      trim: true,
      default: DIRECTION_OUTBOUND,
      index: true,
      searchable: true,
      fake: true,
    },

    /**
     * @name state
     * @description message state i.e Received, Sent, Queued etc
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    state: {
      type: String,
      enum: STATES,
      trim: true,
      default: STATE_UNKNOWN,
      index: true,
      searchable: true,
      fake: true,
    },

    /**
     * @name mode
     * @description message transport send mode i.e Pull or Push etc
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    mode: {
      type: String,
      enum: SEND_MODES,
      trim: true,
      default: SEND_MODE_PUSH,
      index: true,
      searchable: true,
      fake: true,
    },

    /**
     * @name bulk
     * @description unique identifier used to track group messages which have been
     * send together.
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    bulk: {
      type: String,
      trim: true,
      index: true,
      searchable: true,
      fake: {
        generator: 'random',
        type: 'uuid',
      },
    },

    /**
     * @name sender
     * @description sender of the message
     * i.e e-mail sender, message sender etc
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    sender: {
      type: String,
      trim: true,
      required: true,
      index: true,
      searchable: true,
      fake: {
        generator: 'internet',
        type: 'email',
      },
    },

    /**
     * @name to
     * @description receiver(s) of the message
     * i.e e-mail receiver, message receiver etc
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    to: {
      // todo must me a receiver
      type: [String],
      required: true,
      index: true,
      searchable: true,
      fake: {
        generator: 'internet',
        type: 'email',
      },
    },

    /**
     * @name cc
     * @description receiver(s) of the carbon copy of the message
     * i.e e-mail cc receiver
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    cc: {
      type: [String],
      index: true,
      searchable: true,
      fake: {
        generator: 'internet',
        type: 'email',
      },
    },

    /**
     * @name bcc
     * @description receiver(s) of the blind carbon copy of the message
     * i.e e-mail cc receiver
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    bcc: {
      type: [String],
      index: true,
      searchable: true,
      fake: {
        generator: 'internet',
        type: 'email',
      },
    },

    /**
     * @name replyTo
     * @description actual sender of the message i.e e-mail sender etc
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    replyTo: {
      type: String,
      trim: true,
      index: true,
      searchable: true,
      fake: {
        generator: 'internet',
        type: 'email',
      },
    },

    /**
     * @name subject
     * @description subject of the message
     * i.e email title etc
     * e.g Hello
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    subject: {
      type: String,
      trim: true,
      index: true,
      searchable: true,
      fake: {
        generator: 'lorem',
        type: 'sentence',
      },
    },

    /**
     * @name body
     * @description content of the message to be conveyed to receiver(s)
     * e.g Hello
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    body: {
      type: String,
      trim: true,
      index: true,
      searchable: true,
      fake: {
        generator: 'lorem',
        type: 'sentence',
      },
    },

    /**
     * @name queuedAt
     * @description time when message was queued successfully for sending.
     *
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    queuedAt: {
      type: Date,
      index: true,
      fake: {
        generator: 'date',
        type: 'past',
      },
    },

    /**
     * @name sentAt
     * @description time when message was send successfully to a receiver.
     *
     * If message send succeed, set the result and update sent time.
     *
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    sentAt: {
      type: Date,
      index: true,
      fake: {
        generator: 'date',
        type: 'past',
      },
    },

    /**
     * @name failedAt
     * @description latesst time when message sned to receiver(s) failed.
     *
     * If message send failed just set the result and set failed time.
     *
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    failedAt: {
      type: Date,
      index: true,
      fake: {
        generator: 'date',
        type: 'recent',
      },
    },

    /**
     * @name deliveredAt
     * @description latest time when message delivered to receiver(s).
     *
     * If message delivered just set the result and set delivery time.
     *
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    deliveredAt: {
      type: Date,
      index: true,
      fake: {
        generator: 'date',
        type: 'recent',
      },
    },

    /**
     * @name readAt
     * @description latest time when receiver read the message delivered.
     *
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    readAt: {
      type: Date,
      index: true,
      fake: {
        generator: 'date',
        type: 'recent',
      },
    },

    /**
     * @name result
     * @description message send result i.e success or failure response
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    result: {
      type: Mixed,
      fake: {
        generator: 'helpers',
        type: 'createTransaction',
      },
    },

    /**
     * @name transport
     * @description method used to actual send the message. It must be set-ed
     * by a transport used to send message.
     *
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    transport: {
      type: String,
      trim: true,
      default: DEFAULT_TRANSPORT_NAME,
      index: true,
      searchable: true,
      fake: true,
    },

    /**
     * @name priority
     * @description message sending priority
     * @see {@link https://github.com/Automattic/kue#job-priority}
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    priority: {
      type: String,
      enum: PRIORITIES,
      trim: true,
      default: PRIORITY_NORMAL,
      index: true,
      searchable: true,
      fake: true,
    },

    /**
     * @name hash
     * @description unique message hash that is set by a transport.
     *
     * It allow for a transport to uniquely identify a message.
     *
     * A quick scenarion is when sms is received and you dont want to receive
     * a message previous received from a transport.
     *
     * You can use transport hash to check for sms existance or upserting
     * a message.
     *
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    hash: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      searchable: true,
      fake: {
        generator: 'random',
        type: 'uuid',
      },
    },

    /**
     * @name tags
     * @description additional tags(or labels) used to identified sent message
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    tags: {
      type: [String],
      index: true,
      searchable: true,
      fake: {
        generator: 'address',
        type: 'city',
      },
    },

    /**
     * @name options
     * @description additional message sending options(or extra transport options)
     * i.e push sending options, email sending options etc
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    options: {
      type: Mixed,
      fake: {
        generator: 'helpers',
        type: 'createTransaction',
      },
    },

    // template: String|Predefine, //template used for sending
    // metadata: Mixed, //extra message data
  },
  SCHEMA_OPTIONS
);

/*-----------------------------------------------------------------------------
 Hooks
------------------------------------------------------------------------------*/

/**
 * @name onPreValidate
 * @description message schema pre validate hook
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
MessageSchema.pre('validate', function onPreValidate(next) {
  this.preValidate(next);
});

/*-----------------------------------------------------------------------------
Instance
------------------------------------------------------------------------------*/

/**
 * @name preValidate
 * @function preValidate
 * @description run logics before message validation
 * @param {Function} done a callback to invoke on success or failure
 * @return {Message|Error} an instance of message or error
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
MessageSchema.methods.preValidate = function preValidate(next) {
  // TODO set bulk from campaign
  //
  //ensure `to` field is in array format
  if (this.to && _.isString(this.to)) {
    this.to = [].concat(this.to);
  }

  //ensure `cc` field is in array format
  if (this.cc && _.isString(this.cc)) {
    this.cc = [].concat(this.cc);
  }

  //ensure `bcc` field is in array format
  if (this.bcc && _.isString(this.bcc)) {
    this.bcc = [].concat(this.bcc);
  }

  //ensure `tags` field is in array format
  if (this.tags && _.isString(this.tags)) {
    this.tags = [].concat(this.tags);
  }

  //ensure message hash if not set by a transport
  if (!this.hash || _.isEmpty(this.hash)) {
    this.createdAt = this.createdAt || new Date();
    const _hash = _.pick(this, HASH_FIELDS);
    this.hash = hashOf(_hash);
  }

  //set mime type
  if (isHtml(this.body)) {
    this.mime = MIME_HTML;
  } else {
    this.mime = MIME_TEXT;
  }

  //compact and lowercase to, cc, bcc & tags
  this.to = _.map(_.uniq(_.compact(this.to)), _.toLower);
  this.cc = _.map(_.uniq(_.compact(this.cc)), _.toLower);
  this.bcc = _.map(_.uniq(_.compact(this.bcc)), _.toLower);
  this.tags = _.map(_.uniq(_.compact(this.tags)), _.toLower);

  //ensure state to be unknown for poll transport
  if (this.mode === SEND_MODE_PULL) {
    this.state = STATE_UNKNOWN;
  }

  //ensure transport
  if (_.isEmpty(this.transport)) {
    this.transport = DEFAULT_TRANSPORT_NAME;
  }

  next(null, this);
};

/**
 * @name isHtml
 * @function isHtml
 * @description check if message body is html
 * @return {Boolean} true or false
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 */
MessageSchema.methods.isHtml = function _isHtml() {
  return this.mime === MIME_HTML || isHtml(this.body);
};

/**
 * @name _send
 * @function _send
 * @description send this message using actual transport
 * @param {Function} done a callback to invoke on success or failure
 * @return {Message|Error} an instance of message or error
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
MessageSchema.methods._send = function(done) {
  //this refer to Message instance context

  try {
    //obtain actual message transport
    const transport = transports[this.transport];

    //NOTE! poll transport should return state on the result
    //cause they will later pick messages for sending

    waterfall(
      [
        function send(next) {
          //this refer to Message instance context

          //set send data
          this.sentAt = new Date();
          this.state = STATE_SENT;

          //update message with transport and country details
          // this.country = transport.toObject().countryName;
          // this.transport = transport.toObject();

          //send message via transport
          transport.send(
            this,
            function(error, result) {
              //prepare result
              let _result = _.merge(
                {},
                {
                  success: true,
                },
                result
              );

              //handle error
              if (error) {
                //set failed date
                this.failedAt = new Date();
                this.state = STATE_FAILED;

                //obtain error details
                if (error instanceof Error) {
                  _result = _.merge(
                    {},
                    {
                      success: false,
                    },
                    {
                      message: error.message,
                      code: error.code,
                      status: error.status,
                    }
                  );
                }
              }

              //update message sending details
              if (!this.failedAt) {
                this.deliveredAt = this.deliveredAt || new Date();
                this.state = STATE_DELIVERED;
              }
              this.result = _result;

              next(null, this);
            }.bind(this)
          );
        }.bind(this),

        function update(message, next) {
          message.put(next);
        },
      ],
      done
    );
  } catch (error) {
    done(error);
  }
};

/**
 * @name send
 * @function send
 * @description send this message using actual transport or debug it
 * @param {Function} done a callback to invoke on success or failure
 * @return {Message|Error} an instance of message or error
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 * @example
 *
 * message.send(cb);
 *
 */
MessageSchema.methods.send = function send(done) {
  //this refer to Message instance context

  /* @todo format <to> based on message type */
  /* @todo format <to> as e164 phone numbers */

  //send via echo transport
  const useEchoTransport =
    _.isEmpty(this.transport) || this.transport === ECHO_TRANSPORT_NAME;

  //check for debug flags
  const DEBUG = getBoolean('DEBUG', false);

  if (useEchoTransport) {
    //update message
    this.sentAt = new Date();
    this.deliveredAt = new Date();
    this.result = {
      success: true,
    };
    this.failedAt = undefined;
    this.state = STATE_DELIVERED;

    //ensure echo transport
    this.transport = this.transport || ECHO_TRANSPORT_NAME;

    //persist message
    return this.put(done);
  }

  //handle debug message sending
  else if (DEBUG) {
    //update message
    this.sentAt = this.sentAt || new Date();
    this.deliveredAt = new Date();
    this.result = {
      success: true,
    };
    this.state = STATE_DELIVERED;

    //persist message
    return this.put(done);
  }

  //send message using actual transport
  else {
    return this._send(done);
  }
};

/**
 * @name queue
 * @function queue
 * @description queue message for later send
 * @events job error, job success
 * @fire {Message|Error} an instance of queued message or error
 * @since 0.1.0
 * @instance
 * @example
 *
 * message.queue();
 *
 */
MessageSchema.methods.queue = function queue(done) {
  //this refer to Message instance context

  // normalize arguments
  const cb = _.isFunction(done) ? done : _.noop;

  // update message details
  this.queuedAt = new Date();
  this.state = STATE_QUEUED;

  //persist message
  this.save(function(error, message) {
    //notify error
    if (error) {
      worker.queue.emit('job error', error);
      return cb(error);
    }

    //notify message queued successfully
    //since a poll transport will later pull the message
    //for actul send
    else if (message.mode === SEND_MODE_PULL) {
      worker.queue.emit('job queued', message);
    }

    //queue message for later send
    //push transport are notified in their worker to send the message
    else {
      //prepare job details
      const jobType = message.type || getString('KUE_DEFAULT_JOB_TYPE');
      const title = message.subject || jobType;
      const jobDefaults = {
        method: 'send',
        title: title,
        type: jobType,
      };
      const jobDetails = _.merge({}, jobDefaults, message.toObject());

      const job = message.runInBackground(jobDetails);

      //ensure message has been queued
      job.save(function(error) {
        if (error) {
          worker.queue.emit('job error', error);
          return cb(error);
        } else {
          worker.queue.emit('job queued', message);
          return cb(null, message);
        }
      });
    }
  });
};

/*-----------------------------------------------------------------------------
Statics
------------------------------------------------------------------------------*/

/* schema options*/
MessageSchema.statics.MODEL_NAME = MODEL_NAME;
MessageSchema.statics.COLLECTION_NAME = COLLECTION_NAME;

/* message directions */
MessageSchema.statics.DIRECTION_INBOUND = DIRECTION_INBOUND;
MessageSchema.statics.DIRECTION_OUTBOUND = DIRECTION_OUTBOUND;
MessageSchema.statics.DIRECTIONS = DIRECTIONS;

/* message types */
MessageSchema.statics.TYPE_SMS = TYPE_SMS;
MessageSchema.statics.TYPE_EMAIL = TYPE_EMAIL;
MessageSchema.statics.TYPE_PUSH = TYPE_PUSH;
MessageSchema.statics.TYPES = TYPES;

/* message mime types */
MessageSchema.statics.MIME_TEXT = MIME_TEXT;
MessageSchema.statics.MIME_HTML = MIME_HTML;
MessageSchema.statics.MIMES = MIMES;

/* mesage priorities */
MessageSchema.statics.PRIORITY_LOW = PRIORITY_LOW;
MessageSchema.statics.PRIORITY_NORMAL = PRIORITY_NORMAL;
MessageSchema.statics.PRIORITY_MEDIUM = PRIORITY_MEDIUM;
MessageSchema.statics.PRIORITY_HIGH = PRIORITY_HIGH;
MessageSchema.statics.PRIORITY_CRITICAL = PRIORITY_CRITICAL;
MessageSchema.statics.PRIORITIES = PRIORITIES;

/* transaport sending mode */
MessageSchema.statics.SEND_MODE_PULL = SEND_MODE_PULL;
MessageSchema.statics.SEND_MODE_PUSH = SEND_MODE_PUSH;
MessageSchema.statics.SEND_MODES = SEND_MODES;

/* message states */
MessageSchema.statics.STATE_RECEIVED = STATE_RECEIVED;
MessageSchema.statics.STATE_UNKNOWN = STATE_UNKNOWN;
MessageSchema.statics.STATE_SENT = STATE_SENT;
MessageSchema.statics.STATE_QUEUED = STATE_QUEUED;
MessageSchema.statics.STATE_DELIVERED = STATE_DELIVERED;
MessageSchema.statics.STATES = STATES;

/**
 * @name unsent
 * @function unsent
 * @description obtain unsent message(s)
 * @param {Object} [criteria] valid mongoose query criteria
 * @param {Function} done a callback to invoke on success or failure
 * @return {Message[]|Error} collection of unsent messages
 * @since 0.1.0
 * @version 0.1.0
 * @public
 * @static
 * @example
 *
 * Message.unsent(cb);
 * Message.unsent(criteria, cb);
 * Message.unsent().exec(cb);
 * Message.unsent(criteria).exec(cb);
 *
 */
MessageSchema.statics.unsent = function unsent(criteria, done) {
  //this refer to Message static context
  let _criteria = criteria;
  let _done = done;

  //normalize arguments
  if (criteria && _.isFunction(criteria)) {
    _done = criteria;
    _criteria = {};
  }

  //ensure unsent criteria
  _criteria = _.merge(
    {},
    {
      sentAt: null,
    },
    _criteria
  );

  //find unsent messages
  return this.find(_criteria, _done);
};

/**
 * @name sent
 * @function sent
 * @description obtain already sent message(s)
 * @param {Object} [criteria] valid mongoose query criteria
 * @param {Function} done a callback to invoke on success or failure
 * @return {Message[]|Error} collection of already sent message(s)
 * @since 0.1.0
 * @version 0.1.0
 * @public
 * @static
 * @example
 *
 * Message.sent(cb);
 * Message.sent(criteria, cb);
 * Message.sent().exec(cb);
 * Message.sent(criteria).exec(cb);
 *
 */
MessageSchema.statics.sent = function sent(criteria, done) {
  //this refer to Message static context
  let _done = done;
  let _criteria = criteria;

  //normalize arguments
  if (criteria && _.isFunction(criteria)) {
    _done = criteria;
    _criteria = {};
  }

  //ensure sent criteria
  _criteria = _.merge(
    {},
    {
      sentAt: {
        $ne: null,
      },
    },
    _criteria
  );

  //find sent message
  return this.find(criteria, _done);
};

/**
 * @name resend
 * @function resend
 * @description re-send all failed message(s) based on specified criteria
 * @param {Object} [criteria] valid mongoose query criteria
 * @param {Function} done a callback to invoke on success or failure
 * @return {Message[]|Error} collection of resend message(s)
 * @since 0.1.0
 * @version 0.1.0
 * @public
 * @example
 *
 * Message.resend(criteria, cb);
 * Message.resend(cb);
 *
 */
MessageSchema.statics.resend = function resend(criteria, done) {
  //this refer to Message static context

  /* @todo use stream */

  let _done = done;
  let _criteria = criteria;

  //normalize arguments
  if (criteria && _.isFunction(criteria)) {
    _done = criteria;
    _criteria = {};
  }

  //reference Message
  const Message = this;

  //resend fail or unsent message(s)
  waterfall(
    [
      function findUnsentMessages(next) {
        Message.unsent(_criteria, next); /* @todo also failedAt is set */
      },

      function resendMessages(unsents, next) {
        //check for unsent message(s)
        if (unsents) {
          /* @todo make use of parallelism */
          //prepare send work
          unsents = _.map(unsents, function(unsent) {
            return function(_next) {
              unsent.send(_next); /* @todo spies test */
            };
          });

          parallel(_.compact(unsents), next);
        } else {
          next(null, unsents);
        }
      },
    ],
    done
  );
};

/**
 * @name requeue
 * @description requeue all failed message(s) based on specified criteria
 * @param {Object} [criteria] valid mongoose query criteria
 * @type {Function}
 * @events job error, job success
 * @fire {Message[]|Error} collection of requeued messages or error
 * @since 0.1.0
 * @version 0.1.0
 * @public
 * @static
 * @example
 *
 * Message.requeue();
 * Message.requeue(criteria);
 *
 */
MessageSchema.statics.requeue = function(criteria) {
  //this refer to Message static context

  /* @todo use stream */

  //merge criteria
  let _criteria = _.merge({}, criteria);

  //reference Message
  const Message = this;

  //find all unsent message(s) for requeue
  Message.unsent(_criteria, function(error, unsents) {
    //there is no message queue
    if (!worker.queue) {
      if (error) {
        throw error;
      }
    }

    //there is message queue
    else {
      //fire requeue error
      if (error) {
        worker.queue.emit('job error', error);
      }

      //re-queue all unsent message(s)
      else {
        //fire requeue success
        worker.queue.emit('job success', unsents);

        //re-queue unsent message
        _.forEach(unsents, function(unsent) {
          unsent.queue();
        });
      }
    }
  });
};

/*-----------------------------------------------------------------------------
Plugins
------------------------------------------------------------------------------*/
MessageSchema.plugin(actions);
MessageSchema.plugin(exportable);
MessageSchema.plugin(runInBackground, {
  types: TYPES,
});

const Message = model(MODEL_NAME, MessageSchema);

/**
 * export message model
 * @type {Model}
 * @private
 */
exports.Message = Message;

/**
 * export email factory
 * @type {Model}
 * @private
 */
exports.Email = function Email(payload) {
  const _payload = mergeObjects(payload, {
    transport: DEFAULT_SMTP_TRANSPORT_NAME,
    type: TYPE_EMAIL,
  });
  return new Message(_payload);
};

/**
 * export SMS factory
 * @type {Model}
 * @private
 */
exports.SMS = function SMS(payload) {
  const copyOfpayload = mergeObjects(
    { transport: DEFAULT_SMS_TRANSPORT_NAME },
    payload,
    { type: TYPE_SMS }
  );
  return new Message(copyOfpayload);
};

/**
 * export Push factory
 * @type {Model}
 * @private
 */
exports.Push = function Push(payload) {
  const _payload = mergeObjects(
    { transport: DEFAULT_PUSH_TRANSPORT_NAME },
    payload,
    { type: TYPE_PUSH }
  );
  return new Message(_payload);
};
