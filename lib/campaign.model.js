'use strict';

/**
 * @module Campaign
 * @name Campaign
 * @description A representation of communication intended by the source(sender)
 * for consumption by some recipient(receiver) or group of recipients(receivers).
 *
 * A campaign may be delivered by various means(transports or channels)
 * including email, sms, push notification etc.
 *
 * @see {@link https://en.wikipedia.org/wiki/Campaign}
 * @see {@link https://en.wikipedia.org/wiki/Advertising_campaign}
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @version 0.1.0
 * @since 0.9.0
 * @public
 */

const _ = require('lodash');
const { waterfall, parallel } = require('async');
const { getString } = require('@lykmapipo/env');
const { mergeObjects, stringify, parse, uniq } = require('@lykmapipo/common');
const {
  model,
  copyInstance,
  Schema,
  Mixed,
  SCHEMA_OPTIONS,
} = require('@lykmapipo/mongoose-common');
const actions = require('mongoose-rest-actions');
const exportable = require('@lykmapipo/mongoose-exportable');
const { plugin: runInBackground, worker } = require('mongoose-kue');
const { Message, Email, SMS, Push } = require('./message.model');

/* constants */
const MODEL_NAME = getString('CAMPAIGN_MODEL_NAME', 'Campaign');
const {
  Contact,
  FORM_ALERT,
  FORM_INFORMATION,
  FORM_WARNING,
  FORM_ANNOUNCEMENT,
  FORM_REMINDER,
  FORMS,
  CHANNEL_SMS,
  CHANNEL_EMAIL,
  CHANNEL_PUSH,
  CHANNELS,
  AUDIENCE_REPORTERS,
  AUDIENCE_CUSTOMERS,
  AUDIENCE_SUBSCRIBERS,
  AUDIENCE_EMPLOYEES,
  AUDIENCE_ALL,
  AUDIENCES,
} = require('./common');

/**
 * @name CampaignSchema
 * @type {Schema}
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
const CampaignSchema = new Schema({
    /**
     * @name form
     * @description campaign form i.e Alert, Announcement etc
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    form: {
      type: String,
      trim: true,
      enum: FORMS,
      default: FORM_INFORMATION,
      index: true,
      searchable: true,
      taggable: true,
      fake: true,
    },

    /**
     * @name title
     * @alias name
     * @description title of the campaign i.e email title etc
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    title: {
      type: String,
      trim: true,
      index: true,
      searchable: true,
      taggable: true,
      fake: { generator: 'lorem', type: 'sentence' },
    },

    /**
     * @name sender
     * @description sender of the campaign messages i.e e-mail sender, sms sender
     * etc.
     * @type {Contact}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    sender: Contact,

    /**
     * @name to
     * @description receiver(s) of the campaign message i.e e-mail receiver,
     * sms receiver etc.
     *
     * Used for campaign with receiver(s) less than 100. For larger receiver list
     * use criteria and supply `fetchContacts` to postman.
     *
     * @type {Contact[]}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    to: [Contact],

    /**
     * @name subject
     * @description subject of the campaign i.e email title etc
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    subject: {
      type: String,
      trim: true,
      index: true,
      searchable: true,
      fake: { generator: 'lorem', type: 'sentence' },
    },

    /**
     * @name message
     * @description content of the campaign to be conveyed to receiver(s) or
     * recepient(s) as message body.
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    message: {
      type: String,
      trim: true,
      required: true,
      index: true,
      searchable: true,
      fake: { generator: 'lorem', type: 'sentence' },
    },

    /**
     * @name audiences
     * @description Target audiences for a campaign
     * e.g Customers, Employees etc.
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    audiences: {
      type: [String],
      enum: AUDIENCES,
      default: [AUDIENCE_ALL],
      index: true,
      searchable: true,
      taggable: true,
      fake: true,
    },

    /**
     * @name channels
     * @description Allowed channels to be used to send a campaign
     * e.g SMS, EMAIL etc.
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    channels: {
      type: [String],
      enum: CHANNELS,
      default: [CHANNEL_SMS],
      index: true,
      searchable: true,
      taggable: true,
      fake: true,
    },

    /**
     * @name criteria
     * @description Application specific conditions to query for recipients.
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    criteria: {
      type: Mixed,
      default: {},
      fake: true,
      set: data => stringify(data),
      get: data => parse(data),
    },

    /**
     * @name statistics
     * @description General campaign summary for sent, delivery, failed etc.
     * messages.
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    statistics: {
      type: Mixed,
      fake: () => {
        return {
          sms: { sent: 0, delivered: 0, failed: 0 },
          email: { sent: 0, delivered: 0, failed: 0 },
          push: { sent: 0, delivered: 0, failed: 0 }
        };
      },
    },

    /**
     * @name metadata
     * @description Application specific additional information for the campaign.
     * @type {Object}
     * @since 0.1.0
     * @version 1.0.0
     * @instance
     */
    metadata: {
      type: Mixed,
      default: {},
      fake: true,
    },
  },
  SCHEMA_OPTIONS
);

/*
 *------------------------------------------------------------------------------
 * Hooks
 *------------------------------------------------------------------------------
 */

/**
 * @name onPreValidate
 * @description campaign schema pre validate hook
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
CampaignSchema.pre('validate', function onPreValidate(next) {
  this.preValidate(next);
});

/*
 *------------------------------------------------------------------------------
 * Instances
 *------------------------------------------------------------------------------
 */

/**
 * @name preValidate
 * @function preValidate
 * @description run logics before campaign validation
 * @param {Function} done a callback to invoke on success or failure
 * @return {Campaign|Error} an instance of campaign or error
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
CampaignSchema.methods.preValidate = function preValidate(next) {
  //ensure `title`
  this.title = _.trim(this.title) || this.form;

  // ensure default sender
  this.sender = mergeObjects({
    name: getString('DEFAULT_SENDER_NAME'),
    email: getString('DEFAULT_SENDER_EMAIL'),
    mobile: getString('DEFAULT_SENDER_SMS'),
    pushToken: getString('DEFAULT_SENDER_PUSH'),
  }, copyInstance(this.sender));

  // ensure statistics
  // TODO: update statistics after each message send or read
  if (_.isEmpty(this.statistics) && !_.isEmpty(this.channels)) {
    const statistics = {};
    _.forEach(this.channels, channel => {
      statistics[_.toLower(channel)] = { sent: 0, delivered: 0, failed: 0 };
    });
    this.statistics = statistics;
  }

  next(null, this);
};

/**
 * @name send
 * @function send
 * @description send campaign to recipients
 * @param {Function} done a callback to invoke on success or failure
 * @return {Campaing|Error} an instance of campaing or error
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 * @example
 *
 * campaign.send(cb);
 *
 */
CampaignSchema.methods.send = function send(done) {
  //this refer to Campaing instance context

  // refs
  const Campaign = model(MODEL_NAME);

  /* @todo refactor */

  // save campaign
  const saveCampaign = next => this.save(next);

  // fetch contacts
  const fetchContacts = (campaign, next) => {
    // fetch source contacts
    if (_.isFunction(Campaign.fetchContacts)) {
      const criteria = _.merge({}, campaign.criteria);
      return Campaign.fetchContacts(criteria, (error, contacts) => {
        campaign.to = [].concat(contacts).concat(campaign.to);
        return next(error, campaign);
      });
    }
    // merge contacts
    campaign.to = [].concat(campaign.to);
    return next(null, campaign);
  };

  // ensure uniq contacts
  const ensureUniqContacts = (campaign, next) => {
    campaign.to = _.uniqWith(_.compact([].concat(campaign.to)), _.isEqual);
    return next(null, campaign);
  };

  // TODO: refactor to common
  // send emails
  const sendEmails = (campaign, next) => {
    if (!_.isEmpty(campaign.to)) {
      // prepare emails to send
      // TODO improve sync send strategy
      let emails = uniq(_.map(campaign.to, 'email'));
      emails = _.map(emails, to => {
        const sendEmail = then => {
          const email = new Email({
            sender: campaign.sender.email,
            to: to,
            subject: campaign.subject,
            body: campaign.message,
            campaign: campaign,
            bulk: campaign._id,
            options: campaign.metadata
          });
          return email.send((error, message) => {
            // TODO: update email statistics
            // TODO: perist message results from error
            return then(null, message);
          });
        };
        return sendEmail;
      });
      // send emails
      emails = _.compact(emails);
      return parallel(emails, (error, messages) => {
        return next(error, _.compact(messages));
      });
    }
    // continue without send emails
    return next(null, []);
  };

  // TODO: refactor to common
  // send smss
  const sendSMSs = (campaign, next) => {
    if (!_.isEmpty(campaign.to)) {
      // prepare smss to send
      // TODO improve sync send strategy
      let smss = uniq(_.map(campaign.to, 'mobile'));
      smss = _.map(smss, to => {
        const sendSMS = then => {
          const sms = new SMS({
            sender: campaign.sender.mobile,
            to: to,
            subject: campaign.subject,
            body: campaign.message,
            campaign: campaign,
            bulk: campaign._id,
            options: campaign.metadata
          });
          return sms.send((error, message) => {
            // TODO: update sms statistics
            // TODO: perist message results from error
            return then(null, message);
          });
        };
        return sendSMS;
      });
      // send smss
      smss = _.compact(smss);
      return parallel(smss, (error, messages) => {
        return next(error, _.compact(messages));
      });
    }
    // continue without send smss
    return next(null, []);
  };

  // TODO: refactor to common
  // send pushs
  const sendPushs = (campaign, next) => {
    if (!_.isEmpty(campaign.to)) {
      // prepare pushs to send
      // TODO improve sync send strategy
      let pushs = uniq(_.map(campaign.to, 'pushToken'));
      pushs = _.map(pushs, to => {
        const sendPush = then => {
          const push = new Push({
            sender: campaign.sender.pushToken,
            to: to,
            subject: campaign.subject,
            body: campaign.message,
            campaign: campaign,
            bulk: campaign._id,
            options: campaign.metadata
          });
          return push.send((error, message) => {
            // TODO: update push statistics
            // TODO: perist message results from error
            return then(null, message);
          });
        };
        return sendPush;
      });
      // send pushs
      pushs = _.compact(pushs);
      return parallel(pushs, (error, messages) => {
        return next(error, _.compact(messages));
      });
    }
    // continue without send pushs
    return next(null, []);
  };

  // TODO send push
  // send in paralles(sendEmails, sendSMS, sendPush)
  // TODO check allowed channels
  const doSend = (campaign, next) => parallel({
    email: then => sendEmails(campaign, then),
    sms: then => sendSMSs(campaign, then),
    push: then => sendPushs(campaign, then),
  }, (error, results) => {
    // TODO update statistics after send
    return next(error, campaign, results);
  });

  // do sending
  return waterfall([
    saveCampaign,
    fetchContacts, ensureUniqContacts,
    doSend
  ], done);
};

/**
 * @name queue
 * @function queue
 * @description queue campaign for later send
 * @events job error, job success
 * @fire {Message|Error} an instance of queued message or error
 * @since 0.1.0
 * @instance
 * @example
 *
 * message.queue();
 *
 */
CampaignSchema.methods.queue = function queue(done) {
  //this refer to Campaign instance context

  // normalize arguments
  const cb = _.isFunction(done) ? done : _.noop;

  //persist campaign
  this.save(function (error, campaign) {
    //notify campaign queue error
    if (error) {
      worker.queue.emit('job error', error);
      return cb(error);
    }

    //queue campaign for later send
    else {
      //prepare job details
      const jobType = getString('KUE_DEFAULT_JOB_TYPE'); // TODO campaign.type
      const title = campaign.subject || campaign.form || jobType;
      const jobDefaults = {
        method: 'send',
        title: title,
        type: jobType,
      };
      const jobDetails = _.merge({}, jobDefaults, campaign.toObject());

      //ensure campaign has been queued
      return campaign.runInBackground(jobDetails, function (error) {
        if (error) {
          worker.queue.emit('job error', error);
          return cb(error);
        } else {
          worker.queue.emit('job queued', campaign);
          return cb(null, campaign);
        }
      });
    }
  });
};

/*
 *------------------------------------------------------------------------------
 * Statics
 *------------------------------------------------------------------------------
 */

CampaignSchema.statics.MODEL_NAME = MODEL_NAME;

CampaignSchema.statics.FORM_ALERT = FORM_ALERT;
CampaignSchema.statics.FORM_INFORMATION = FORM_INFORMATION;
CampaignSchema.statics.FORM_WARNING = FORM_WARNING;
CampaignSchema.statics.FORM_ANNOUNCEMENT = FORM_ANNOUNCEMENT;
CampaignSchema.statics.FORM_REMINDER = FORM_REMINDER;
CampaignSchema.statics.FORMS = FORMS;

CampaignSchema.statics.CHANNEL_SMS = CHANNEL_SMS;
CampaignSchema.statics.CHANNEL_EMAIL = CHANNEL_EMAIL;
CampaignSchema.statics.CHANNEL_PUSH = CHANNEL_PUSH;
CampaignSchema.statics.CHANNELS = CHANNELS;

CampaignSchema.statics.AUDIENCE_REPORTERS = AUDIENCE_REPORTERS;
CampaignSchema.statics.AUDIENCE_CUSTOMERS = AUDIENCE_CUSTOMERS;
CampaignSchema.statics.AUDIENCE_SUBSCRIBERS = AUDIENCE_SUBSCRIBERS;
CampaignSchema.statics.AUDIENCE_EMPLOYEES = AUDIENCE_EMPLOYEES;
CampaignSchema.statics.AUDIENCE_ALL = AUDIENCE_ALL;
CampaignSchema.statics.AUDIENCES = AUDIENCES;

/*
 *------------------------------------------------------------------------------
 * Plugins
 *------------------------------------------------------------------------------
 */
CampaignSchema.plugin(actions);
CampaignSchema.plugin(exportable);
CampaignSchema.plugin(runInBackground, {
  types: Message.TYPES,
});

/* export campaign model */
module.exports = exports = model(MODEL_NAME, CampaignSchema);