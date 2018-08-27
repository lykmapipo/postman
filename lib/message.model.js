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

/* dependencies */
const _ = require('lodash');
const async = require('async');
const mongoose = require('mongoose');
const env = require('@lykmapipo/env');
const actions = require('mongoose-rest-actions');
const { plugin: runInBackground } = require('mongoose-kue');
const hash = require('object-hash');
const isHtml = require('is-html');
const Schema = mongoose.Schema;
const { Mixed } = Schema.Types;


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
  PRIORITY_LOW, PRIORITY_NORMAL, PRIORITY_MEDIUM,
  PRIORITY_HIGH, PRIORITY_CRITICAL
];


/* transport send modes */
const SEND_MODE_PULL = 'Pull';
const SEND_MODE_PUSH = 'Push';
const SEND_MODES = [SEND_MODE_PULL, SEND_MODE_PUSH];


/* model name for the message */
const MODEL_NAME = env('MODEL_NAME', 'Message');


/* collection name for the message */
const COLLECTION_NAME = env('COLLECTION_NAME', 'messages');


/* schema options */
const SCHEMA_OPTIONS =
  ({ timestamps: true, emitIndexErrors: true, collection: COLLECTION_NAME });


/* message hash fields */
const HASH_FIELDS = [
  'type', 'direction', 'from', 'to',
  'transport', 'body', 'priority', 'createdAt'
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


//states
const STATES = [
  STATE_RECEIVED, STATE_UNKNOWN, STATE_SENT,
  STATE_QUEUED, STATE_DELIVERED
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
let MessageSchema = new Schema({
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
    fake: true
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
    fake: true
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
    fake: true
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
    fake: true
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
    fake: true
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
    lowercase: true,
    required: true,
    index: true,
    searchable: true,
    fake: { generator: 'internet', type: 'email' }
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
    type: [String],
    required: true,
    index: true,
    searchable: true,
    fake: { generator: 'internet', type: 'email' }
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
    fake: { generator: 'internet', type: 'email' }
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
    fake: { generator: 'internet', type: 'email' }
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
    fake: { generator: 'lorem', type: 'sentence' }
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
    fake: { generator: 'lorem', type: 'sentence' }
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
    fake: { generator: 'date', type: 'past' }
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
    fake: { generator: 'date', type: 'recent' }
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
    fake: { generator: 'date', type: 'recent' }
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
    fake: { generator: 'helpers', type: 'createTransaction' }
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
    default: env('DEFAULT_TRANSPORT_NAME'),
    fake: true
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
    fake: true
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
    unique: true,
    required: true,
    trim: true,
    fake: { generator: 'random', type: 'uuid' }
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
    fake: { generator: 'address', type: 'city' }
  }

}, SCHEMA_OPTIONS);


/*-----------------------------------------------------------------------------
 Hooks
------------------------------------------------------------------------------*/


/**
 * @name onPreValidate
 * @description message schema pre validate hook
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
 * @type {Function}
 * @since 0.1.0
 * @private
 */
MessageSchema.methods.preValidate = function preValidate(next) {

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
    this.createdAt = this.creaatedAt || new Date();
    const _hash = _.pick(this, HASH_FIELDS);
    this.hash = hash(_hash);
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

  next(null, this);

};


/**
 * @name _send
 * @description send this message using actual transport
 * @param {Function} done a callback to invoke on success or failure
 * @return {Message|Error} an instance of message or error
 * @type {Function}
 * @since 0.1.0
 * @private
 */
MessageSchema.methods._send = function (done) {

  //this refer to Message instance context

  try {
    //obtain message transport
    const transport = require(this.transport);

    //obtain transport queue
    //to be used to notify on success sent or failure
    const queue = transport._queue;

    //TODO notify message queue for success send

    //NOTE! poll transport should return state on the result
    //cause they will later pick messages for sending

    async.waterfall([

      function send(next) {

        //this refer to Message instance context

        transport.send(this, function (error, result) {

          //this refer to Message instance context

          //update last send fail details
          if (error) {
            this.failedAt = new Date();

            //obtain error details
            if (error instanceof Error) {
              error = {
                code: error.code,
                message: error.message,
                status: error.status
              };
            }

            //notify send error
            //TODO make use of redis message bus
            if (queue) {
              queue.emit('message:sent:error', error);
            }

            this.result = error;
          }

          //update success details
          else {
            this.sentAt = new Date();
            this.state = _.get(result, 'state', STATE_DELIVERED);
            this.result = result;

          }

          next(null, this);

        }.bind(this));

      }.bind(this),

      function update(message, next) {
        message.save(function (error, _message) {
          if (!error && queue) {
            //notify send success
            //TODO make use of redis message bus
            queue.emit('message:sent:success', _message);
          }
          next(error, _message);
        });
      }

    ], done);

  } catch (error) {
    done(error);
  }

};


/**
 * @name send
 * @description send this message using actual transport or log it on console
 * @param {Object} [options] valid send options
 * @param {Boolean} [options.fake] send fake message
 * @param {Function} done a callback to invoke on success or failure
 * @return {Message|Error} an instance of message or error
 * @type {Function}
 * @since 0.1.0
 * @private
 * @example
 *
 * //fake send
 * message.send({fake:true}, function(error, message){
 *   ...
 * });
 *
 * //actual send
 * message.send(function(error, message){
 *  ...
 * });
 */
MessageSchema.methods.send = function send(options, done) {

  //this refer to Message instance context

  //normalize args
  if (options && _.isFunction(options)) {
    done = options;
    options = {};
  }

  //merge options
  options = _.merge({}, options);

  //send fake message
  if (options.fake) {

    this.sentAt = new Date();

    //fake message result
    this.response = {
      message: 'success'
    };

    this.save(function (error, message) {
      done(error, message);
    });

  }

  //send message using actual transport
  else {
    this._send(done);
  }

};


/**
 * @name queue
 * @description queue message for later send
 * @param {Object}  [options] valid queue options
 * @param {Number}  [options.attempts] number of retries
 * @param {Number}  [options.backoff] backoff strategy
 * @events message:queue:error, message:queue:success
 * @fire {Message|Error} an instance of queued message or error
 * @type {Function}
 * @since 0.1.0
 * @private
 * @example
 * 
 * message.queue();
 *
 * or with options
 *
 * message.queue(options);
 * 
 */
MessageSchema.methods.queue = function queue(options) {

  //this refer to Message instance context

  //reference
  const Message = mongoose.model(MODEL_NAME);

  //merge options
  options = _.merge({}, {

    //number of attempts to send message
    //@see {@link https://github.com/Automattic/kue#failure-attempts}
    attempts: 3,

    // back-off strategy to use on each sent failure
    // @see {@link https://github.com/Automattic/kue#failure-backoff}
    backoff: 'exponential'

  }, options);

  //ensure state to be unknown for poll transport
  if (this.mode === SEND_MODE_PULL) {
    this.state = STATE_UNKNOWN;
  }

  //persist message
  this.save(function (error, message) {

    //there is no message queue
    if (!Message._queue) {
      if (error) {
        throw error;
      }
    }

    //we have message queue
    else {
      //notify error
      if (error) {
        Message._queue.emit('message:queue:error', error);
      }

      //notify message queued successfully
      //since a poll transport will later pull for the message to send
      else if (message.mode === SEND_MODE_PULL) {
        Message._queue.emit('message:queue:success', message);
      }

      //queue message for later send
      //push transport are notified in their worker to send the message
      else {

        //prepare job details
        const title = (message.subject || message.type);
        const jobDetails = _.merge({}, { title: title }, message.toObject());

        //create message sent job and queue it
        let job =
          Message._queue.create(message.queueName, jobDetails);

        //set job prioroty
        job.priority(message.priority);

        //set job number of attempt to try send message
        job.attempts(options.attempts);

        //set backoff strategy to use on message sending failures
        job.backoff({ type: options.backoff });

        //ensure message has been queued
        job.save(function (error) {
          if (error) {
            Message._queue.emit('message:queue:error', error);
          } else {
            Message._queue.emit('message:queue:success', message);
          }
        });

      }
    }

  });

};


/*-----------------------------------------------------------------------------
Statics
------------------------------------------------------------------------------*/


/* schema options*/
MessageSchema.statics.MODEL_NAME = MODEL_NAME;
MessageSchema.statics.COLLECTION_NAME =
  COLLECTION_NAME;


/* message directions */
MessageSchema.statics.DIRECTION_INBOUND = DIRECTION_INBOUND;
MessageSchema.statics
  .DIRECTION_OUTBOUND = DIRECTION_OUTBOUND;
MessageSchema.statics.DIRECTIONS =
  DIRECTIONS;


/* message types */
MessageSchema.statics.TYPE_SMS = TYPE_SMS;
MessageSchema.statics.TYPE_EMAIL =
  TYPE_EMAIL;
MessageSchema.statics.TYPE_PUSH = TYPE_PUSH;
MessageSchema.statics
  .TYPES = TYPES;


/* message mime types */
MessageSchema.statics.MIME_TEXT = MIME_TEXT;
MessageSchema.statics.MIME_HTML =
  MIME_HTML;
MessageSchema.statics.MIMES = MIMES;


/* mesage priorities */
MessageSchema.statics.PRIORITY_LOW = PRIORITY_LOW;
MessageSchema.statics.PRIORITY_NORMAL =
  PRIORITY_NORMAL;
MessageSchema.statics.PRIORITY_MEDIUM = PRIORITY_MEDIUM;
MessageSchema
  .statics.PRIORITY_HIGH = PRIORITY_HIGH;
MessageSchema.statics.PRIORITY_CRITICAL =
  PRIORITY_CRITICAL;
MessageSchema.statics.PRIORITIES = PRIORITIES;


/* transaport sending mode */
MessageSchema.statics.SEND_MODE_PULL = SEND_MODE_PULL;
MessageSchema.statics
  .SEND_MODE_PUSH = SEND_MODE_PUSH;
MessageSchema.statics.SEND_MODES =
  SEND_MODES;


/* message states */
MessageSchema.statics.STATE_RECEIVED = STATE_RECEIVED;
MessageSchema.statics
  .STATE_UNKNOWN = STATE_UNKNOWN;
MessageSchema.statics.STATE_SENT =
  STATE_SENT;
MessageSchema.statics.STATE_QUEUED = STATE_QUEUED;
MessageSchema
  .statics.STATE_DELIVERED = STATE_DELIVERED;
MessageSchema.statics.STATES =
  STATES;


/**
 * @name unsent
 * @description obtain unsent message(s)
 * @param {Object} [criteria] valid mongoose query criteria
 * @param {Function} done a callback to invoke on success or failure
 * @type {Function}
 * @return {Array[Message]} collection of unsent messages
 * @since 0.1.0
 * @public
 * @example
 *
 * Message.unsent(function(error, unsents){
 *     ...
 *     //process error
 *     //process unsents
 *     ...
 * });
 *
 * or specify criteria
 *
 * Message.unsent(criteria, function(error, unsents){
 *     ...
 *     //process error
 *     //process unsents
 *     ...
 * });
 * 
 */
MessageSchema.statics.unsent = function unsent(criteria, done) {

  //this refer to Message static context


  //normalize arguments
  if (criteria && _.isFunction(criteria)) {
    done = criteria;
    criteria = {};
  }

  criteria = _.merge({}, {
    sentAt: null //ensure message have not been sent
  }, criteria);

  //find unsent messages
  this.find(criteria, done);

};


/**
 * @name sent
 * @description obtain already sent message(s)
 * @param {Object} [criteria] valid mongoose query criteria
 * @param {Function} done a callback to invoke on success or failure
 * @type {Function}
 * @return {Array[Message]} collection of already sent message(s)
 * @public
 * @since 0.1.0
 * @example
 *
 * Message.sent(function(error, sents){
 *     ...
 *     //process error
 *     //process sents
 *     ...
 * })
 *
 * or specify criteria
 *
 * Message.sent(criteria, function(error, sents){
 *     ...
 *     //process error
 *     //process sents
 *     ...
 * })
 * 
 */
MessageSchema.statics.sent = function sent(criteria, done) {

  //this refer to Message static context

  //normalize arguments
  if (criteria && _.isFunction(criteria)) {
    done = criteria;
    criteria = {};
  }

  criteria = _.merge({}, {
    sentAt: { $ne: null } //ensure message have been sent
  }, criteria);

  //find sent message
  this.find(criteria, done);

};


/**
 * @name resend
 * @description re-send all failed message(s) based on specified criteria
 * @param {Object} [criteria] valid mongoose query criteria
 * @param {Function} done a callback to invoke on success or failure
 * @type {Function}
 * @return {Array[Message]} collection of resend message(s)
 * @since 0.1.0
 * @public
 * @example
 *
 * Message.resend(fuction(error, sents){
 *     ...
 *     //process error
 *     //process sents
 *     ...
 * });
 *
 * or specify additional criteria
 *
 * Message.resend(criteria, function(error, sents){
 *     ...
 *     //process error
 *     //process sents
 *     ...
 * });
 * 
 */
MessageSchema.statics.resend = function resend(criteria, done) {

  //this refer to Message static context

  //normalize arguments
  if (criteria && _.isFunction(criteria)) {
    done = criteria;
    criteria = {};
  }

  //reference Message
  const Message = this;

  //resend fail or unsent message(s)
  async.waterfall([

    function findUnsentMessages(next) {
      Message.unsent(criteria, next);
    },

    function resendMessages(unsents, next) {

      //check for unsent message(s)
      if (unsents) {

        //prepare send work
        //TODO make use of multi process possibly paralleljs
        unsents = _.map(unsents, function (unsent) {
          return function (_next) {
            unsent.send(_next);
          };
        });

        async.parallel(_.compact(unsents), next);

      } else {
        next(null, unsents);
      }

    }

  ], done);

};


/**
 * @name requeue
 * @description requeue all failed message(s) based on specified criteria
 * @param {Object} [criteria] valid mongoose query criteria
 * @type {Function}
 * @events message:requeue:error, message:requeue:success, 
 *         message:queue:error, message:queue:success
 * @fire {Array[Message]|Error} collection of requeued messages or error
 * @since 0.1.0 
 * @public
 * @example
 * 
 * //requeue without criteria
 * Message.requeue();
 *
 * //requeue with criteria
 * Message.requeue(criteria);
 * 
 */
MessageSchema.statics.requeue = function (criteria) {

  //this refer to Message static context

  //merge criteria
  criteria = _.merge({}, criteria);

  //reference Message
  const Message = this;

  //find all unsent message(s) for requeue
  Message.unsent(criteria, function (error, unsents) {

    //there is no message queue
    if (!Message._queue) {
      if (error) {
        throw error;
      }
    }

    //there is message queue
    else {
      //fire requeue error
      if (error) {
        Message._queue.emit('message:requeue:error', error);
      }

      //re-queue all unsent message(s)
      else {
        //fire requeue success
        Message._queue.emit('message:requeue:success', unsents);

        //re-queue unsent message
        _.forEach(unsents, function (unsent) {
          unsent.queue();
        });
      }
    }

  });

};


/**
 * @name process
 * @description used by worker process to process message and send them
 * @param  {Job}   job  valid instance of kue job
 * @param  {Function} done a callback to invoke on success send or failure
 * @return {Object}        message result or error
 * @since 0.2.0
 * @public
 */
MessageSchema.statics.process = function (job, done) {

  //reference Message
  const Message = mongoose.model('Message');

  async.waterfall([

    function findMessageById(next) {
      Message.findById(job.data._id, next);
    },

    function sendMessage(message, next) {

      //send message if exists
      if (message) {
        message.send(next);
      }

      //do nothing and continue
      else {
        next();
      }

    }

  ], done);

};


/*-----------------------------------------------------------------------------
Plugins
------------------------------------------------------------------------------*/
MessageSchema.plugin(actions);
MessageSchema.plugin(runInBackground, { types: TYPES });


/**
 * export message schema
 * @type {Schema}
 * @private
 */
exports = module.exports = mongoose.model(MODEL_NAME, MessageSchema);