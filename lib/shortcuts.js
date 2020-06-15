'use strict';

const { getStringSet, getBoolean, isProduction } = require('@lykmapipo/env');
const { copyInstance } = require('@lykmapipo/mongoose-common');

const { CHANNEL_EMAIL } = require('./common');
// const { Message, Email, SMS, Push } = require('./message.model');
const Campaign = require('./campaign.model');

/**
 * @name campaign
 * @description Send a given campaign
 * @param {Object} optns valid campaign instance or definition
 * @param {Function} done a callback to invoke on success or failure
 * @return {Error|Object} campaign instance or error
 * @see {@link Message}
 * @see {@link Campaign}
 * @author lally elias <lallyelias87@mail.com>
 * @since 0.1.0
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
  // or in synchronou send mode
  else {
    return campaign.send(done);
  }
};
