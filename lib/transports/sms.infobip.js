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
const { getString } = require('@lykmapipo/env');
const { toE164 } = require('@lykmapipo/phone');
const Transport = require('bipsms');

const { SEND_MODE_PUSH } = require('../common');

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
  const body = message.body || message.subject;

  //prepare destinations
  /*@todo ensure e164 format */
  const to = toE164(message.to);

  //prepare infobip compliant sms payload
  const payload = _.merge(
    {},
    {
      from: message.sender,
      to: to,
      text: body,
    }
  );

  //perform actual send
  exports.transport.sendSingleSMS(payload, done);
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
  //update message with transport details
  message.sender = message.sender || getString('SMS_INFOBIP_DEFAULT_SENDER_ID');
  message.mode = SEND_MODE_PUSH;

  //perform actual sms sending
  exports._send(message, done);
};
