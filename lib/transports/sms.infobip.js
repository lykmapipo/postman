'use strict';


/**
 * @name infobip-sms
 * @module infobip-sms
 * @description infobip sms transport
 * @see {@link https://github.com/lykmapipo/bipsms}
 * @see {@link https://www.infobip.com/}
 * @license MIT
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */


/* dependencies */
const _ = require('lodash');
const env = require('@lykmapipo/env');
const Transport = require('bipsms');
const { getBoolean } = env;


/**
 * @name countryCode
 * @description transport country code
 * @type {String}
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */
exports.countryCode = undefined;


/**
 * @name countryName
 * @description transport country name
 * @type {String}
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */
exports.countryName = undefined;


/**
 * @name name
 * @description name of the transport
 * @type {String}
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */
exports.name = 'infobip-sms';


/**
 * @name toObject
 * @function toObject
 * @description convert transport details into object
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */
exports.toObject = function toObject() {
  const object = {
    name: exports.name,
    countryCode: exports.countryCode,
    countryName: exports.countryName
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
exports.init = function (options) {

  //initialize transport if not exist
  if (!exports.transport) {

    //merge options
    exports.options = _.merge({}, exports.options, options);

    //create transport
    exports.transport = new Transport(exports.options);

  }

};


/**
 * @name _send
 * @function _send
 * @description send sms message using infobip transport
 * @param {Message} message valid message instance
 * @param {Function} done a callback to invoke on success or failure
 * @see {@link https://github.com/lykmapipo/bipsms#send-single-sms-to-multiple-destination}
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
exports._send = function (message, done) {

  //ensure transport is initialized
  exports.init();

  //prepare message body
  /* @todo ensure compiled */
  const body = (message.body || message.subject);

  //prepare destinations
  /*@todo ensure e164 format */
  const to = message.to;

  //prepare infobip compliant sms payload
  const payload = _.merge({}, {
    from: message.sender,
    to: to,
    text: body
  });

  //set message sent time
  message.sentAt = message.sentAt || new Date();

  //perform actual send
  exports.transport.sendSingleSMS(payload, function (error, result) {

    //handle error
    if (error) {
      message.failedAt = new Date();
      message.result = _.merge({}, { success: false }, {
        message: error.message,
        code: error.code,
        status: error.status
      });
    }

    //handle result
    else {

      //normalize send result
      const _result = _.merge({}, result);
      _result.success = true; //infobip always accept sms
      message.result = _result;

      //set delivery date
      message.deliveredAt = new Date();

    }

    //continue
    done(error, message);

  });

};


/**
 * @name send
 * @function send
 * @description send sms via transport 
 * @param {Message} message valid message instance
 * @param {Function} done callback to invoke on success or failure
 * @return {Object|Error} send result or error
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */
exports.send = function (message, done) {

  //check for debug flags
  const DEBUG = getBoolean('DEBUG', false);

  //update message with transport details
  message.transport = exports.name;
  message.sender = message.sender || env('SMS_INFOBIP_DEFAULT_SENDER_ID');

  //debug sms sending
  if (DEBUG) {
    //update message details
    message.sentAt = message.sentAt || new Date();
    message.deliveredAt = new Date();
    message.result = { success: true };
    done(null, message);
  }

  //perform actual sms sending
  else {
    exports._send(message, done);
  }

};