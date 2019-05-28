'use strict';


/**
 * @name push
 * @module push
 * @description fcm(gcm) push notification transport
 * @see {@link https://github.com/ToothlessGear/node-gcm}
 * @license MIT
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */


/* dependencies */
const _ = require('lodash');
const { getString } = require('@lykmapipo/env');
const gcm = require('node-gcm');


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
  //Google FCM API Key
  apiKey: getString('PUSH_FCM_API_KEY'),
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
exports.name = 'fcm-push';


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
    exports.options =
      _.merge({}, exports.defaults, exports.options, options);

    //ensure Google FCM API Key
    const { apiKey } = exports.options;

    //create transport
    //initiate node GCM(FCM) sender
    //@see {@link https://github.com/ToothlessGear/node-gcm#example-application}
    exports.transport = new gcm.Sender(apiKey);

  }

};


/**
 * @name _send
 * @function _send
 * @description send push notification message using fcm(gcm) transport
 * 
 * Note!: message options may contain push message data & notification
 * 
 * @param {Message} message valid message instance
 * @param {Function} done a callback to invoke on success or failure
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
exports._send = function (message, done) {

  //ensure transport is initialized
  exports.init();

  //prepare FCM push notification compliant payload
  let payload =
    _.merge({}, message.options, {
      notification: {
        title: message.subject,
        body: message.body,
        sound: 'default'
      }
    });

  //prepare push notification recipients
  const to = message.to && message.to.length > 1 ? message.to : message.to[0];

  //instantiate node-gcm message
  payload = new gcm.Message(payload);

  //perform actual send
  exports.transport.send(payload, to, function (error, response) {

    //check for reachability
    //@see {@link https://github.com/ToothlessGear/node-gcm/blob/master/lib/sender.js#L153}
    if (error && _.isNumber(error) && error >= 500) {
      error = new Error('GCM(FCM) Server Unavailable');
      error.status = 'Internal Server Error';
      error.code = error;
    }

    //check for authorization
    //@see {@link https://github.com/ToothlessGear/node-gcm/blob/master/lib/sender.js#L157}
    if (error && _.isNumber(error) && error === 401) {
      error = new Error(
        'Unauthorized (401). Check that your API token is correct.'
      );
      error.status = 'Unauthorized';
      error.code = error;
    }

    //check failure response
    //@see {@link https://github.com/ToothlessGear/node-gcm/blob/master/lib/sender.js#L161}
    if (error && _.isNumber(error) &&
      error !== 200 && error !== 401 && error <= 500) {
      error = new Error('Invalid Request');
      error.status = 'Invalid Request';
      error.code = error;
    }

    //respond with error
    if (error) {
      done(error);
    }

    //respond with success result
    else {
      //merge default response details
      response.success = response.success === 1 ? true : false;

      //process push results if available
      if (response.results) {
        response.results = _.map(message.to, function (val, index) {
          return _.merge({}, { to: val }, response.results[index]);
        });
      }
      done(null, response);
    }

  });

};


/**
 * @name send
 * @function send
 * @description send push notification via transaport
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
    (message.sender || getString('PUSH_FCM_SENDER_ID', exports.name));

  //perform actual push notification sending
  exports._send(message, done);

};