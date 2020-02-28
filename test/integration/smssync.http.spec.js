'use strict';

/* jshint camelcase:false */

const {
	clear: clearHttp,
	mount,
	testPost,
} = require('@lykmapipo/express-test-helpers');
const {
	clear: clearDatabase,
	expect,
} = require('@lykmapipo/mongoose-test-helpers');

const {
	sms,
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

	before(() => {
		mount(smssyncRouter);
	});

	it('should receive sync sms from a device', done => {
		testPost('/smssync?secret=smssync', sms)
			.expect('Content-Type', /json/)
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

	it('should receive queued sms to be sent by a device', done => {
		done();
	});

	it('should receive delivery reports sent by a device', done => {
		done();
	});

	it('should return sms to be sent by device', done => {
		done();
	});

	it('should return sms waiting delivery report to a device', done => {
		done();
	});

	it('should reject request with no secret key sent by device', done => {
		done();
	});

	after(() => clearHttp());
	after(done => clearDatabase(done));
});
