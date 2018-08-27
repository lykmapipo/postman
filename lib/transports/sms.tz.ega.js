'use strict';


/**
 * @name tz-ega-sms
 * @module tz-ega-sms
 * @description tanzania eGA sms transport
 * @see {@link https://github.com/lykmapipo/tz-ega-sms}
 * @see {@link http://ega.go.tz/}
 * @license MIT
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */


/* dependencies */
const _ = require('lodash');
const env = require('@lykmapipo/env');
const transport = require('@lykmapipo/tz-ega-sms');
const { getBoolean } = env;
const DEBUG = getBoolean('DEBUG', false);


/**
 * @name countryCode
 * @description transport country code
 * @type {String}
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */
exports.countryCode = 'TZ';


/**
 * @name countryName
 * @description transport country name
 * @type {String}
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */
exports.countryCode = 'Tanzania';


/**
 * @name name
 * @description name of the transport
 * @type {String}
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */
exports.name = 'tz-ega-sms';


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
    exports.transport = transport(exports.options);

  }

};


/**
 * @name _send
 * @description send sms message using infobip transport
 * @see {@link https://github.com/lykmapipo/bipsms#send-single-sms-to-multiple-destination}
 * @param  {Message}   message valid open311-message instance
 * @param  {Function} done    a callback to invoke on success or failure
 * @type {Function}
 * @since 0.1.0
 * @private
 */
exports._send = function (message, done) {

  //ensure transport is initialized
  exports.init();

  //prepare ega compliant sms payload
  const payload = _.merge({}, {
    message: (message.body || message.subject),
    /* @todo ensure compiled */
    'sender_id': (message.from || {}.shortcode),
    'mobile_service_id': (message.from || {}.service),
    recipients: message.to.phone /*@todo ensure e164 format */
  });

  //set message sent time
  message.sentAt = new Date();

  //perform actual send
  exports.transport.send(payload, function (error, result) {

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
      _result.success = !_result.error;
      message.result = _result;

      //set delivery date
      if (_result.success) {
        message.deliveredAt = new Date();
      }

      //set failed date
      else {
        message.failedAt = new Date();
      }

    }

    //continue
    done(error, message);

  });

};


/**
 * @name send
 * @description send sms via transport 
 * @param {Message} message valid message instance
 * @param {Function} done callback to invoke on success or failure
 * @return {Object|Error} send result or error
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */
exports.send = function (message, done) {

  //debug sms sending
  if (DEBUG) {
    //update message details
    message.sentAt = new Date();
    message.deliveredAt = new Date();
    message.result = { success: true };
    done(null, message);
  }

  //perform actual sms sending
  else {
    exports._send(message, done);
  }

};