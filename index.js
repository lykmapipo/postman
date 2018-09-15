'use strict';


/* dependencies */
const path = require('path');
const _ = require('lodash');
const env = require('@lykmapipo/env');
const libPath = path.join(__dirname, 'lib');
const Message = require(path.join(libPath, 'message.model'));


/* constants */
const { TYPE_EMAIL, TYPE_SMS } = Message;
const DEFAULT_SMTP_TRANSPORT_NAME = env('DEFAULT_SMTP_TRANSPORT_NAME');
const DEFAULT_SMS_TRANSPORT_NAME = env('DEFAULT_SMS_TRANSPORT_NAME');


/**
 * @module postman
 * @name postman
 * @description collective notifications for nodejs
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 1.0.0
 * @public
 */
function postman() {

}


/* export postman message model */
postman.Message = Message;


/* export postman email message factory */
postman.Email = function Email(payload) {
  const _payload =
    _.merge({}, payload, { transport: DEFAULT_SMTP_TRANSPORT_NAME, type: TYPE_EMAIL });
  return new Message(_payload);
};


/* export postman sms message factory */
postman.SMS = function SMS(payload) {
  const _payload =
    _.merge({}, { transport: DEFAULT_SMS_TRANSPORT_NAME }, payload, { type: TYPE_SMS });
  return new Message(_payload);
};


/* export postman utils */
postman.utils = require(path.join(libPath, 'utils'));


/* export postman */
exports = module.exports = postman;