'use strict';

/* jshint camelcase:false */

const { mergeObjects } = require('@lykmapipo/common');
const { expect, faker } = require('@lykmapipo/mongoose-test-helpers');
const { TYPE_SMS, STATE_UNKNOWN, SEND_MODE_PULL, Message } = require('../..');

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

exports.provideUnsent = (optns, done) => {
	const sample = mergeObjects(
		{
			from: faker.phone.phoneNumber(),
			sender: faker.phone.phoneNumber(),
			subject: faker.lorem.sentence(),
			body: faker.lorem.sentence(),
			to: faker.phone.phoneNumber(),
			mode: SEND_MODE_PULL,
			state: STATE_UNKNOWN,
			hash: faker.random.uuid(),
			type: TYPE_SMS,
		},
		optns
	);
	return Message.create(sample, done);
};

exports.reply = {
	body: faker.lorem.sentence(),
};

exports.fetchContacts = (criteria, done) => done(null, exports.contacts);
exports.onMessageReceived = (message, done) => {
	expect(message.from).to.be.equal(exports.sms.from);
	done(null, exports.reply);
};
