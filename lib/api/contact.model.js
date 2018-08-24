'use strict';


/* dependencies */
const mongoose = require('mongoose');
const actions = require('mongoose-rest-actions');
const Schema = mongoose.Schema;


/* define contact schema */
const ContactSchema = new Schema({
  name: { type: String, default: undefined },
  email: { type: String, default: undefined },
  phone: { type: String, default: undefined },
  country: {
    name: { type: String, default: undefined },
    code: { type: String, default: undefined }
  },
  shortcode: { type: String, default: undefined },
  service: { type: String, default: undefined },
  topics: { type: [String], default: undefined },
  registrationToken: { type: String, default: undefined },
}, { timestamps: true });
ContactSchema.plugin(actions);


/* compile & register contact model */
const Contact = mongoose.model('Contact', ContactSchema);


/* exports contact schema & model*/
exports.ContactSchema = ContactSchema;
exports.Contact = Contact;