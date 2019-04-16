'use strict';


/* dependencies */
const path = require('path');
const { expect } = require('chai');
const { clear } = require('@lykmapipo/mongoose-test-helpers');
const { Message } = require(path.join(__dirname, '..', '..'));


describe('tz ega transport', () => {

  before(done => clear(done));

  describe('debug', function () {

    before(() => {
      process.env.DEBUG = true;
    });

    it('should be able to send message', (done) => {

      const message =
        Message.fakeExcept('sentAt', 'failedAt', 'deliveredAt');
      message.transport = 'tz-ega-sms';

      message.send((error, sent) => {

        //assert results
        expect(error).to.not.exist;
        expect(sent).to.exist;
        expect(sent._id).to.exist;
        expect(sent.transport).to.be.equal('tz-ega-sms');
        expect(sent.sentAt).to.exist;
        expect(sent.deliveredAt).to.exist;
        expect(sent.failedAt).to.not.exist;
        expect(sent.result).to.exist;
        expect(sent.result.success).to.exist;
        expect(sent.result.success).to.be.true;
        done(error, sent);

      });

    });

    after(() => {
      delete process.env.DEBUG;
    });

  });

  if (process.env.SMS_EGA_TZ_TEST_RECEIVER) {
    describe('live', function () {

      before(() => {
        process.env.DEBUG = false;
      });

      it('should be able to send message', (done) => {

        const message = new Message({
          to: process.env.SMS_EGA_TZ_TEST_RECEIVER,
          body: 'Test SMS'
        });
        message.transport = 'tz-ega-sms';

        message.send((error, sent) => {

          //assert results
          expect(error).to.not.exist;
          expect(sent).to.exist;
          expect(sent._id).to.exist;
          expect(sent.transport).to.be.equal('tz-ega-sms');
          expect(sent.sentAt).to.exist;
          expect(sent.deliveredAt).to.exist;
          expect(sent.failedAt).to.not.exist;
          expect(sent.result).to.exist;
          expect(sent.result.success).to.exist;
          expect(sent.result.success).to.be.true;
          done(error, sent);

        });

      });

      after(() => {
        delete process.env.DEBUG;
      });

    });
  }

  after(done => clear(done));

});