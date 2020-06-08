'use strict';

/**
 * @name echo
 * @module echo
 * @description echo transport
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */

/* dependencies */
const _ = require('lodash');

const { SEND_MODE_PUSH } = require('../common');

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
exports.defaults = {};

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
exports.name = 'echo';

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
exports.init = function (options) {
  // merge options
  exports.options = _.merge({}, exports.defaults, exports.options, options);
};

/**
 * @name _send
 * @function _send
 * @description send message using echo transport
 * @param {Message} message valid message instance
 * @param {Function} done a callback to invoke on success or failure
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
exports._send = function (message, done) {
  // ensure transport is initialized
  exports.init();

  // reply with results
  const result = {
    success: true,
  };
  done(null, result);
};

/**
 * @name send
 * @function send
 * @description echo message via transport
 * @param {Message} message valid message instance
 * @param {Function} done callback to invoke on success or failure
 * @return {Object|Error} send result or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */
exports.send = function (message, done) {
  // ensure message sender
  message.sender = message.sender || exports.name;
  message.mode = SEND_MODE_PUSH;

  // perform actual echo sending
  exports._send(message, done);
};
