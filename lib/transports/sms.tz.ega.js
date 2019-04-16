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
const { getString } = require('@lykmapipo/env');
const transport = require('@lykmapipo/tz-ega-sms');


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
exports.countryName = 'Tanzania';


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
 * @see {@link https://github.com/lykmapipo/tz-ega-sms}
 * @param {Message} message valid message instance
 * @param {Function} done    a callback to invoke on success or failure
 * @type {Function}
 * @since 0.1.0
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
  const to = [].concat(message.to);

  //prepare ega compliant sms payload
  const payload = _.merge({}, {
    'sender_id': message.sender,
    message: body,
    recipients: to
  });

  //perform actual send
  exports.transport.send(payload, done);

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

  //update message with transport details
  message.sender = message.sender || getString('SMS_EGA_TZ_DEFAULT_SENDER_ID');

  //perform actual sms sending
  exports._send(message, done);

};