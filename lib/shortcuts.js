'use strict';

const { map } = require('lodash');
const { uniq } = require('@lykmapipo/common');
const {
  getString,
  getStringSet,
  getBoolean,
  isProduction,
} = require('@lykmapipo/env');
const { toE164 } = require('@lykmapipo/phone');
const { copyInstance } = require('@lykmapipo/mongoose-common');

const { CHANNEL_EMAIL, TYPE_EMAIL, TYPE_SMS, TYPE_PUSH } = require('./common');
const { Email, Push, SMS } = require('./message.model');
const Campaign = require('./campaign.model');

/**
 * @function sendCampaign
 * @name sendCampaign
 * @description Send a given campaign
 * @param {Object} optns valid campaign instance or definition
 * @param {Function} done a callback to invoke on success or failure
 * @return {Error|Object} campaign instance or error
 * @see {@link Message}
 * @see {@link Campaign}
 * @author lally elias <lallyelias87@mail.com>
 * @since 0.19.0
 * @version 0.1.0
 * @public
 * @static
 * @example
 *
 * sendCampaign(optns, (error, campaign) => { ... });
 */
exports.sendCampaign = (optns, done) => {
  // prepare campaign
  const options = copyInstance(optns);

  // ensure campaign channels
  let channels = [].concat(options.channels).concat(CHANNEL_EMAIL);
  channels = getStringSet('DEFAULT_CAMPAIGN_CHANNELS', channels);
  options.channels = channels;

  // instantiate campaign
  const campaign = new Campaign(options);

  // queue campaign in production
  // or if is asynchronous send mode
  const enableSyncTransport = getBoolean(
    'DEFAULT_ENABLE_SYNC_TRANSPORT',
    false
  );
  if (isProduction() && !enableSyncTransport) {
    campaign.queue();
    return done(null, campaign);
  }

  // direct send campaign in development & test
  // or in synchronous send mode
  else {
    return campaign.send(done);
  }
};

/**
 * @name sendEmail
 * @description Send a given email
 * @param {Object} optns valid email instance or definition
 * @param {Function} done a callback to invoke on success or failure
 * @return {Error|Object} email instance or error
 * @see {@link Message}
 * @see {@link Campaign}
 * @author lally elias <lallyelias87@mail.com>
 * @since 0.19.0
 * @version 0.1.0
 * @public
 * @static
 * @example
 *
 * sendEmail(optns, (error, email) => { ... });
 */
exports.sendEmail = (optns, done) => {
  // prepare message
  const message = copyInstance(optns);

  // force message type to email
  message.type = TYPE_EMAIL;

  // ensure message sender
  message.sender =
    message.sender ||
    getString('SMTP_FROM') ||
    getString('DEFAULT_SENDER_EMAIL');

  // ensure unique receivers emails
  const receivers = uniq([].concat(message.to));
  message.to = receivers;

  // ensure unique cc'ed
  const cced = uniq([].concat(message.cc));
  message.cc = cced;

  // ensure unique bcc'ed
  const bcced = uniq([].concat(message.bcc));
  message.bcc = bcced;

  // instantiate email
  const email = new Email(message);

  // queue email in production
  // or if is asynchronous send mode
  const enableSyncTransport = getBoolean(
    'DEFAULT_ENABLE_SYNC_TRANSPORT',
    false
  );
  if (isProduction() && !enableSyncTransport) {
    email.queue();
    return done(null, email);
  }

  // direct send email in development & test
  // or in synchronous send mode
  else {
    return email.send(done);
  }
};

/**
 * @name sendPush
 * @description Send a given push notification
 * @param {Object} optns valid push notification instance or definition
 * @param {Function} done a callback to invoke on success or failure
 * @return {Error|Object} push notification instance or error
 * @see {@link Message}
 * @see {@link Campaign}
 * @author lally elias <lallyelias87@mail.com>
 * @since 0.19.0
 * @version 0.1.0
 * @public
 * @static
 * @example
 *
 * sendPush(optns, (error, push) => { ... });
 */
exports.sendPush = (optns, done) => {
  // prepare message
  const message = copyInstance(optns);

  // force message type to push
  message.type = TYPE_PUSH;

  // ensure message sender
  message.sender = message.sender || getString('DEFAULT_SENDER_PUSH');

  // ensure unique receivers pushs
  const receivers = uniq([].concat(message.to));
  message.to = receivers;

  // instantiate push
  const push = new Push(message);

  // queue push in production
  // or if is asynchronous send mode
  const enableSyncTransport = getBoolean(
    'DEFAULT_ENABLE_SYNC_TRANSPORT',
    false
  );
  if (isProduction() && !enableSyncTransport) {
    push.queue();
    return done(null, push);
  }

  // direct send push in development & test
  // or in synchronous send mode
  else {
    return push.send(done);
  }
};

/**
 * @name sendSMS
 * @description Send a given sms
 * @param {Object} optns valid sms instance or definition
 * @param {Function} done a callback to invoke on success or failure
 * @return {Error|Object} sms instance or error
 * @see {@link Message}
 * @see {@link Campaign}
 * @author lally elias <lallyelias87@mail.com>
 * @since 0.19.0
 * @version 0.1.0
 * @public
 * @static
 * @example
 *
 * sendSMS(optns, (error, sms) => { ... });
 */
exports.sendSMS = (optns, done) => {
  // prepare message
  const message = copyInstance(optns);

  // force message type to sms
  message.type = TYPE_SMS;

  // ensure message sender
  message.sender = message.sender || getString('DEFAULT_SENDER_SMS');

  // ensure unique receivers smss
  const receivers = map(uniq([].concat(message.to)), (receiver) => {
    return toE164(receiver);
  });
  message.to = receivers;

  // instantiate sms
  const sms = new SMS(message);

  // queue sms in production
  // or if is asynchronous send mode
  const enableSyncTransport = getBoolean(
    'DEFAULT_ENABLE_SYNC_TRANSPORT',
    false
  );
  if (isProduction() && !enableSyncTransport) {
    sms.queue();
    return done(null, sms);
  }

  // direct send sms in development & test
  // or in synchronous send mode
  else {
    return sms.send(done);
  }
};
