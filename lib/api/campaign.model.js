'use strict';


/* dependencies */
const path = require('path');
const mongoose = require('mongoose');
const actions = require('mongoose-rest-actions');
const Schema = mongoose.Schema;
const { ContactSchema } = require(path.join(__dirname, 'contact'));


/* define campaign schema */
const CampaignSchema = new Schema({
  name: { type: String, default: undefined }, //TODO subject/shortcode
  from: { type: ContactSchema, default: undefined },
  to: { type: [ContactSchema], default: undefined },
  bcc: { type: [ContactSchema], default: undefined },
  cc: { type: [ContactSchema], default: undefined },
  subject: { type: String, default: undefined },
  message: { type: String, default: undefined },
  mime: { type: String, default: undefined },
  channels: { type: [String], default: undefined },
}, { timestamps: true });
CampaignSchema.plugin(actions);


/* compile & register campaign model */
const Campaign = mongoose.model('Campaign', CampaignSchema);


/* exports campaign schema & model*/
exports.CampaignSchema = CampaignSchema;
exports.Campaign = Campaign;