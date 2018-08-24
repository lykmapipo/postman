'use strict';


/* dependencies */
const path = require('path');
const mongoose = require('mongoose');
const actions = require('mongoose-rest-actions');
const Schema = mongoose.Schema;
const { Mixed } = Schema.Types;
const { ContactSchema } = require(path.join(__dirname, 'contact'));


/**
 * @name MessageSchema
 * @type {Schema}
 * @since 0.1.0
 * @version 1.0.0
 * @private
 */
const MessageSchema = new Schema({
  type: { type: String, default: undefined },
  envelope: { type: String, default: undefined },
  mime: { type: String, default: undefined },
  from: { type: ContactSchema, default: undefined },
  to: { type: ContactSchema, default: undefined },
  subject: { type: String, default: undefined },
  body: { type: String, default: undefined },
  tags: { type: [String], default: undefined },
  sendAt: { type: Date, default: undefined },
  failedAt: { type: Date, default: undefined },
  deliveredAt: { type: Date, default: undefined },
  result: { type: Mixed, default: undefined },
}, { timestamps: true });
MessageSchema.plugin(actions);


/* compile & register message model */
const Message = mongoose.model('Message', MessageSchema);


/* exports message schema */
exports.MessageSchema = MessageSchema;


/* exports message model*/
exports.Message = Message;