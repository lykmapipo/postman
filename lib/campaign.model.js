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
const { model, Schema, SCHEMA_OPTIONS } = require('@lykmapipo/mongoose-common');
const actions = require('mongoose-rest-actions');


/* constants */
const MODEL_NAME = getString('CAMPAIGN_MODEL_NAME', 'Campaign');


const FORM_ALERT = 'Alert';
const FORM_INFORMATION = 'Information';
const FORM_WARNING = 'Warning';
const FORM_ANNOUNCEMENT = 'Announcement';
const FORM_REMINDER = 'Reminder';
const FORMS = [
  FORM_ALERT, FORM_INFORMATION, FORM_WARNING,
  FORM_ANNOUNCEMENT, FORM_REMINDER
];


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
   * recepient(s).
   * @type {Object}
   * @since 0.1.0
   * @version 1.0.0
   * @instance
   */
  message: {
    type: String,
    trim: true,
    index: true,
    searchable: true,
    fake: { generator: 'lorem', type: 'sentence' }
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


/*
 *------------------------------------------------------------------------------
 * Plugins
 *------------------------------------------------------------------------------
 */
CampaignSchema.plugin(actions);


/* export campaign model */
module.exports = exports = model(MODEL_NAME, CampaignSchema);