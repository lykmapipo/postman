'use strict';

/**
 * @name smssync
 * @module smssync
 * @description smssync transport
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */

/* dependencies */
const _ = require('lodash');
const { waterfall, parallel } = require('async');
const { getString, getBoolean } = require('@lykmapipo/env');
const { smssync } = require('smssync');

const {
  TYPE_SMS,
  SEND_MODE_PULL,
  STATE_UNKNOWN,
  STATE_QUEUED,
  STATE_DELIVERED,
} = require('../common');

/**
 * @name defaults
 * @description default configuration options
 *
 * @type {Object}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
exports.defaults = {
  endpoint: getString('SMSSYNC_ENDPOINT', 'smssync'),
  secret: getString('SMSSYNC_SECRET', 'smssync'),
  reply: getBoolean('SMSSYNC_REPLY', true),
  error: getBoolean('SMSSYNC_ERROR', true),
};

/**
 * @name countryCode
 * @description transport country code
 *
 * @type {String}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */
exports.countryCode = undefined;

/**
 * @name countryName
 * @description transport country name
 *
 * @type {String}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */
exports.countryCode = undefined;

/**
 * @name name
 * @description name of the transport
 *
 * @type {String}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */
exports.name = 'smssync';

/**
 * @function toObject
 * @name toObject
 * @description convert transport details into object
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */
exports.toObject = function toObject() {
  const object = {
    name: exports.name,
    countryCode: exports.countryCode,
    countryName: exports.countryName,
  };
  return object;
};

/**
 * @name init
 * @function init
 * @description initialize transport
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
exports.init = function(options, Message) {
  // merge options
  if (!exports.transport) {
    const handlers = {
      onReceive: exports.onReceive(Message), // TODO: accept from options
      onSend: exports.onSend(Message),
      onSent: exports.onSent(Message),
      onQueued: exports.onQueued(Message),
      onDelivered: exports.onDelivered(Message),
    };
    exports.options = _.merge(
      {},
      exports.defaults,
      exports.options,
      handlers,
      options
    );
    exports.transport = smssync(exports.options);
  }

  // return self
  return exports;
};

/**
 * @name _send
 * @function _send
 * @description send message using smssync transport
 * @param {Message} message valid message instance
 * @param {Function} done a callback to invoke on success or failure
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
exports._send = function(message, done) {
  // reply with results
  const result = {
    success: true,
  };
  done(null, result);
};

/**
 * @name send
 * @function send
 * @description smssync message via transport
 * @param {Message} message valid message instance
 * @param {Function} done callback to invoke on success or failure
 * @return {Object|Error} send result or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */
exports.send = function(message, done) {
  // ensure message sender
  message.sender = message.sender || exports.name;
  message.type = TYPE_SMS;
  message.mode = SEND_MODE_PULL;
  // message.state = STATE_SENT;
  // message.sentAt = new Date();
  message.queuedAt = new Date();

  // perform actual smssync sending
  exports._send(message, done);
};

/**
 * @name onReceived
 * @description handle received sms from smssync device
 * @param  {Object}   sms  valid smssync message
 * @param  {Function} done a callback to invoke after receiving sms
 * @return {Object}   a message to return to a sender
 * @see  {@link http://smssync.ushahidi.com/developers/}
 * @private
 * @since  0.1.0
 * @version 0.1.0
 */
exports.onReceive = (/*Message*/) => (sms, done) => {
  //see http://smssync.ushahidi.com/developers/
  //for the structure of the sms send by smssync to be saved

  // TODO: implement
  return done(new Error('Not Allowed'));
};

/**
 * @name onSend
 * @description obtain list of sms(message) to be send by smssync device
 * @param  {Function} done a callback to invoke after receiving sms
 * @return {[Object]} collection of message to be send by smssync device
 * @see  {@link http://smssync.ushahidi.com/developers/}
 * @private
 * @since  0.1.0
 * @version 0.1.0
 */
exports.onSend = Message => done => {
  //TODO generate individual message to send
  //TODO update status to sent
  //TODO clear once sent

  waterfall(
    [
      function findUnsent(next) {
        //TODO update status=sent use update
        const criteria = {
          type: TYPE_SMS,
          mode: SEND_MODE_PULL,
          transport: exports.name,
          state: STATE_UNKNOWN,
        };
        Message.unsent(criteria, next);
      },

      function normalize(messages, next) {
        const smss = [];
        _.forEach(messages, function(message) {
          _.forEach([].concat(message.to), function(to) {
            smss.push({
              to: to,
              message: message.body,
              uuid: [message._id, to].join(':'),
            });
          });
        });

        next(null, smss);
      },
    ],
    done
  );
};

/**
 * @name onSent
 * @description received queued sms from smssync device
 * @param {[String]} queued collection of message(sms) uuids from smssync
 * device
 * @param  {Function} done a callback to invoke after receiving sms
 * @return {[Object]} collection of message to be send by smssync device
 * @see  {@link http://smssync.ushahidi.com/developers/}
 * @private
 * @since  0.1.0
 * @version 0.1.0
 */
exports.onSent = Message => (queued, done) => {
  //obtained queued sms ids
  let ids = _.map(queued, function(sms) {
    return _.first(sms.split(':')); //obtain sms id
  });
  ids = _.uniq(ids);

  //update message status to sent
  waterfall(
    [
      function findMessages(next) {
        Message.find(
          {
            type: TYPE_SMS,
            mode: SEND_MODE_PULL,
            transport: exports.name,
            _id: { $in: ids }, //TODO use status=sent
          },
          next
        );
      },

      function updateMessageStateToQueued(messages, next) {
        const updates = _.map(messages, function(message) {
          //update message state to queued
          return function(then) {
            message.state = STATE_QUEUED;
            message.save(function(error, saved) {
              then(error, saved);
            });
          };
        });

        //update in parallel fashion
        parallel(updates, next);
      },

      function returnUuidsOfProcessedMessage(messages, next) {
        const uuids = [];
        _.forEach(messages, function(message) {
          _.forEach([].concat(message.to), function(to) {
            uuids.push([message._id, to].join(':'));
          });
        });
        next(null, uuids);
      },
    ],
    done
  );
};

/**
 * @name onQueued
 * @description obtain message(sms) waiting delivery report and send them to
 * smssync device
 * @param  {Function} done a callback to invoke on success or failure
 * @return {[Object]} collection of message uuids waiting delivery status
 * from smssync device
 * @see  {@link http://smssync.ushahidi.com/developers/}
 * @private
 * @since  0.1.0
 * @version 0.1.0
 */
exports.onQueued = Message => done => {
  waterfall(
    [
      function findMessagesWaitingDeliveryReport(next) {
        Message.find(
          {
            type: TYPE_SMS,
            mode: SEND_MODE_PULL,
            transport: exports.name,
            state: STATE_QUEUED,
          },
          next
        );
      },

      function returnUuidsOfQueuedMessages(messages, next) {
        const uuids = [];
        _.forEach(messages, function(message) {
          _.forEach([].concat(message.to), function(to) {
            uuids.push([message._id, to].join(':'));
          });
        });

        next(null, uuids);
      },
    ],
    done
  );
};

/**
 * @name onQueued
 * @description receive delivery status from smssync device
 * @param  {Function} done a callback to invoke on success or failure
 * @return {[Object]} collection of message
 * @see  {@link http://smssync.ushahidi.com/developers/}
 * @private
 * @since  0.1.0
 * @version 0.1.0
 */
exports.onDelivered = Message => (delivered, done) => {
  //obtained delivered sms ids
  let ids = _.map(delivered, function(report) {
    let uuid = report.uuid || '';
    return _.first(uuid.split(':')); //obtain sms id
  });
  ids = _.uniq(_.compact(ids));

  //update message status to delivered
  waterfall(
    [
      function findMessages(next) {
        Message.find(
          {
            type: TYPE_SMS,
            mode: SEND_MODE_PULL,
            transport: exports.name,
            _id: { $in: ids }, //TODO use status=queued
          },
          next
        );
      },

      function updateMessageStateToDelivered(messages, next) {
        const updates = _.map(messages, function(message) {
          //update message state to delivered
          return function(then) {
            message.state = STATE_DELIVERED;
            message.save(function(error, saved) {
              then(error, saved);
            });
          };
        });

        //update in parallel fashion
        parallel(updates, next);
      },
    ],
    done
  );
};
