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


const { getString } = require('@lykmapipo/env');
const {
  model,
  Schema,
  Mixed,
  SCHEMA_OPTIONS
} = require('@lykmapipo/mongoose-common');
const actions = require('mongoose-rest-actions');


/* constants */
const MODEL_NAME = getString('CAMPAIGN_MODEL_NAME', 'Campaign');
const {
  FORM_ALERT,
  FORM_INFORMATION,
  FORM_WARNING,
  FORM_ANNOUNCEMENT,
  FORM_REMINDER,
  FORMS,
  CHANNEL_SMS,
  CHANNEL_EMAIL,
  CHANNEL_PUSH,
  CHANNELS
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
    fake: true
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
    fake: { generator: 'lorem', type: 'sentence' }
  },

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
    fake: { generator: 'lorem', type: 'sentence' }
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
    fake: { generator: 'lorem', type: 'sentence' }
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
    fake: true
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
    fake: true
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
    default: { sent: 0, queued: 0, delivered: 0, failed: 0 },
    fake: true
  }
}, SCHEMA_OPTIONS);


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


/*
 *------------------------------------------------------------------------------
 * Plugins
 *------------------------------------------------------------------------------
 */
CampaignSchema.plugin(actions);


/* export campaign model */
module.exports = exports = model(MODEL_NAME, CampaignSchema);