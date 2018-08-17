'use strict';

/* dependencies */
const path = require('path');
const { TYPE_EMAIL } = require(path.join(__dirname, '..', 'constants'));
const NAME = 'sendgrid';


exports.name = NAME;
exports.type = TYPE_EMAIL;
exports.fake = function (campaign, done) { done(); };
exports.send = function (campaign, done) { done(); };