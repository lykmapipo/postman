'use strict';

/**
 * @name smtp
 * @module smtp
 * @description nodemailer smtp transport
 * @see {@link https://nodemailer.com/smtp/}
 * @license MIT
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */

/* dependencies */
const _ = require('lodash');
const async = require('async');
const { stripHtmlTags } = require('@lykmapipo/common');
const { getString, getBoolean, getNumber } = require('@lykmapipo/env');
const nodemailer = require('nodemailer');

const { SEND_MODE_PUSH } = require('../common');

/**
 * @name defaults
 * @description default configuration options
 * @type {Object}
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
exports.defaults = {
  //default mail sender if non provided during send
  from: getString('SMTP_FROM_ADDRESS') || getString('SMTP_FROM'),

  //default smtp port to connect
  port: getNumber('SMTP_PORT', 567),

  //default smtp server hostname or IP address to connect
  host: getString('SMTP_HOST'),

  //defines if the connection should use SSL
  secure: getBoolean('SMTP_SECURE', false),

  // default authentication data
  auth: {
    user: getString('SMTP_USERNAME'), //username
    pass: getString('SMTP_PASSWORD'), //password for the user
  },

  // default TLS options
  tls: {
    rejectUnauthorized: getBoolean('SMTP_TLS_REJECTUNAUTHORIZED', true),
  },
};

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
exports.countryCode = undefined;

/**
 * @name name
 * @description name of the transport
 * @type {String}
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */
exports.name = 'smtp';

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
    exports.options = _.merge({}, exports.defaults, exports.options, options);

    //create transport
    //initiate nodemailer smtp transport
    //@see {@link https://nodemailer.com/smtp/}
    exports.transport = nodemailer.createTransport(exports.options);
  }
};

/**
 * @name _send
 * @function _send
 * @description send email message using smtp transport
 * @param {Message} message valid message instance
 * @param {Function} done a callback to invoke on success or failure
 * @see {@link https://community.nodemailer.com/}
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
exports._send = function (message, done) {
  //ensure transport is initialized
  exports.init();

  async.waterfall(
    [
      //verify your SMTP configuration
      //if ready to accept messages
      function verifyTransport(next) {
        exports.transport.verify(next);
      },

      //send email
      function sendEmail(isReady, next) {
        // TODO validate emails

        //convert message to nodemailer email payload
        let email = message.toObject();

        // allow reply to
        email.replyTo = email.replyTo || email.sender;

        // ensure from
        // TODO add from details into message
        email.from = {
          name: getString('SMTP_FROM_NAME'),
          address: getString('SMTP_FROM_ADDRESS') || getString('SMTP_FROM'),
        };

        // set mail html body
        if (message.isHtml()) {
          email.html = email.body;
        }

        //always set mail text body
        email.text = stripHtmlTags(email.body || email.subject);

        //send actual email
        exports.transport.sendMail(email, next);
      },
    ],
    done
  );
};

/**
 * @name send
 * @function send
 * @description send email via transport
 * @param {Message} message valid message instance
 * @param {Function} done callback to invoke on success or failure
 * @return {Object|Error} send result or error
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */
exports.send = function (message, done) {
  //ensure email sender
  message.sender =
    message.sender || getString('SMTP_FROM_ADDRESS') || getString('SMTP_FROM');
  message.mode = SEND_MODE_PUSH;

  //perform actual smtp sending
  exports._send(message, done);
};
