'use strict';

/* dependencies */
const { clear, expect } = require('@lykmapipo/mongoose-test-helpers');
const { Message, sendEmail } = require('../..');

describe('smtp transport', () => {
  before((done) => clear(done));

  describe('debug', function () {
    before(() => {
      process.env.DEBUG = true;
    });

    it('should be able to send message', (done) => {
      const message = Message.fakeExcept('sentAt', 'failedAt', 'deliveredAt');
      message.transport = 'smtp';

      message.send((error, sent) => {
        //assert results
        expect(error).to.not.exist;
        expect(sent).to.exist;
        expect(sent._id).to.exist;
        expect(sent.transport).to.be.equal('smtp');
        expect(sent.sentAt).to.exist;
        expect(sent.deliveredAt).to.exist;
        expect(sent.failedAt).to.not.exist;
        expect(sent.result).to.exist;
        expect(sent.result.success).to.exist;
        expect(sent.result.success).to.be.true;
        done(error, sent);
      });
    });

    it('should be able to send using shortcut', (done) => {
      const message = Message.fakeExcept('sentAt', 'failedAt', 'deliveredAt');
      message.transport = 'smtp';

      sendEmail(message, (error, sent) => {
        //assert results
        expect(error).to.not.exist;
        expect(sent).to.exist;
        expect(sent._id).to.exist;
        expect(sent.transport).to.be.equal('smtp');
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

  if (process.env.SMTP_TEST_RECEIVER) {
    describe('live', function () {
      before(() => {
        process.env.DEBUG = false;
      });

      it('should be able to send text message', (done) => {
        const message = new Message({
          to: process.env.SMTP_TEST_RECEIVER,
          body: 'Test Email',
        });
        message.transport = 'smtp';

        message.send((error, sent) => {
          //assert results
          expect(error).to.not.exist;
          expect(sent).to.exist;
          expect(sent._id).to.exist;
          expect(sent.transport).to.be.equal('smtp');
          expect(sent.mime).to.be.equal('text/plain');
          expect(sent.isHtml()).to.be.false;
          expect(sent.sentAt).to.exist;
          expect(sent.deliveredAt).to.exist;
          expect(sent.failedAt).to.not.exist;
          expect(sent.result).to.exist;
          expect(sent.result.success).to.exist;
          expect(sent.result.success).to.be.true;
          done(error, sent);
        });
      });

      it('should be able to send html message', (done) => {
        const message = new Message({
          to: process.env.SMTP_TEST_RECEIVER,
          body: '<b>Test Email<b>',
        });
        message.transport = 'smtp';

        message.send((error, sent) => {
          //assert results
          expect(error).to.not.exist;
          expect(sent).to.exist;
          expect(sent._id).to.exist;
          expect(sent.transport).to.be.equal('smtp');
          expect(sent.mime).to.be.equal('text/html');
          expect(sent.isHtml()).to.be.true;
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

  after((done) => clear(done));
});
