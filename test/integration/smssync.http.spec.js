'use strict';

const { clear: clearHttp, mount } = require('@lykmapipo/express-test-helpers');
const {
	clear: clearDatabase,
	expect,
} = require('@lykmapipo/mongoose-test-helpers');
const postman = require('../..');

describe('SMSSync Http API', () => {
	before(() => clearHttp());
	before(done => clearDatabase(done));

	before(() => {
		const fetchContacts = (criteria, done) => done(null, []);
		const onMessageReceived = (message, done) => done(null, message);
		const { smssyncRouter } = postman({
			fetchContacts,
			onMessageReceived,
		});
		expect(smssyncRouter).to.exist;
		mount(smssyncRouter);
	});

	it('should receive sync sms from a device', done => {
		done();
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
