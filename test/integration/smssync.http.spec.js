'use strict';

/* jshint camelcase:false */

const _ = require('lodash');
const {
	clear: clearHttp,
	mount,
	testPost,
	testGet,
} = require('@lykmapipo/express-test-helpers');
const {
	clear: clearDatabase,
	expect,
} = require('@lykmapipo/mongoose-test-helpers');

const {
	sms,
	provideUnsent,
	fetchContacts,
	onMessageReceived,
} = require('../fixtures/integration');

const { smssyncRouter } = require('../..')({
	fetchContacts,
	onMessageReceived,
});

describe('SMSSync Http API', () => {
	before(() => clearHttp());
	before(done => clearDatabase(done));

	let unsent;
	before(done => {
		provideUnsent({ transport: 'smssync' }, (error, message) => {
			unsent = message;
			done(error, message);
		});
	});

	before(() => {
		mount(smssyncRouter);
	});

	it('should receive sync sms from a device', done => {
		testPost('/smssync?secret=smssync', sms)
			.expect('Content-Type', /json/)
			.expect(200)
			.end((error, { body }) => {
				expect(error).to.not.exist;
				expect(body).to.exist;
				expect(body.payload).to.exist;
				expect(body.payload.success).to.be.true;
				expect(body.payload.task).to.be.equal('send');
				expect(body.payload.messages).to.have.length.at.least(1);
				done(error, body);
			});
	});

	it('should return sms to be sent by device', done => {
		testGet('/smssync?secret=smssync', sms)
			.expect('Content-Type', /json/)
			.expect(200)
			.end((error, { body }) => {
				expect(body).to.exist;
				expect(body.payload).to.exist;
				expect(body.payload.task).to.exist;
				expect(body.payload.task).to.be.equal('send');
				expect(body.payload.secret).to.exist;
				expect(body.payload.secret).to.be.equal('smssync');
				expect(body.payload.messages[0].to).to.exist.and.be.equal(
					_.first(unsent.to)
				);
				expect(body.payload.messages[0].message).to.exist.and.be.equal(
					unsent.body
				);
				expect(body.payload.messages[0].uuid).to.be.exist.and.be.equal(
					[unsent._id, _.first(unsent.to)].join(':')
				);
				done(error, body);
			});
	});

	it('should receive queued sms to be sent by a device', done => {
		const queued = {
			queued_messages: [[unsent._id, _.first(unsent.to)].join(':')],
		};

		testPost('/smssync?task=sent&secret=smssync', queued)
			.expect('Content-Type', /json/)
			.expect(200)
			.end((error, { body }) => {
				expect(error).to.not.exist;
				expect(body).to.exist;
				expect(_.get(body, 'queued_messages')).to.exist;
				expect(_.get(body, 'queued_messages')).to.have.same.members(
					_.get(queued, 'queued_messages')
				);

				done(error, body);
			});
	});

	it('should return sms waiting delivery report to a device', done => {
		testGet('/smssync?task=result&secret=smssync')
			.set('Accept', 'application/json')
			.expect(200)
			.expect('Content-Type', /json/)
			.end((error, { body }) => {
				expect(error).to.not.exist;

				expect(body).to.exist;
				expect(_.get(body, 'message_uuids')).to.exist;
				expect(_.get(body, 'message_uuids')[0]).to.be.exist.and.be.equal(
					[unsent._id, _.first(unsent.to)].join(':')
				);

				done(error, body);
			});
	});

	it('should receive delivery reports sent by a device', done => {
		const delivered = {
			message_result: [
				{
					uuid: [unsent._id, _.first(unsent.to)].join(':'),
					sent_result_code: 0,
					sent_result_message: 'SMSSync Message Sent',
					delivered_result_code: -1,
					delivered_result_message: '',
				},
			],
		};

		testPost('/smssync?task=result&secret=smssync', delivered)
			.expect(200)
			.expect('Content-Type', /json/)
			.end((error, { body }) => {
				expect(error).to.not.exist;
				expect(body).to.exist;

				expect(body).to.exist;
				expect(body.payload).to.exist;
				expect(body.payload.success).to.be.true;

				done(error, body);
			});
	});

	it('should reject request with no secret key sent by device', done => {
		testGet('/smssync')
			.expect('Content-Type', /json/)
			.expect(200)
			.end((error, { body }) => {
				expect(error).to.not.exist;
				expect(body).to.exist;

				expect(body).to.exist;
				expect(body.payload).to.exist;
				expect(body.payload.success).to.exist;
				expect(body.payload.error).to.exist;
				expect(body.payload.success).to.be.false;
				expect(body.payload.error).to.be.equal('Secret Key Mismatch');

				done();
			});
	});

	after(() => clearHttp());
	after(done => clearDatabase(done));
});
