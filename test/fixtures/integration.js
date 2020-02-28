'use strict';

/* jshint camelcase:false */

const { expect, faker } = require('@lykmapipo/mongoose-test-helpers');

exports.contacts = [
	{
		mobile: faker.phone.phoneNumber(),
	},
];

exports.sms = {
	from: faker.phone.phoneNumber(),
	message: faker.lorem.sentence(),
	message_id: faker.random.uuid(),
	sent_to: faker.phone.phoneNumber(),
	secret: 'smssync',
	device_id: faker.phone.phoneNumber(),
	sent_timestamp: faker.date.past(),
};

exports.reply = {
	body: faker.lorem.sentence(),
};

exports.fetchContacts = (criteria, done) => done(null, exports.contacts);
exports.onMessageReceived = (message, done) => {
	expect(message.from).to.be.equal(exports.sms.from);
	done(null, exports.reply);
};
