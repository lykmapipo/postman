'use strict';

/* dependencies */
const { clear, expect } = require('@lykmapipo/mongoose-test-helpers');
const { Message, Push } = require('../..');

describe('fcm transport', () => {
  before(done => clear(done));

  describe('debug', function() {
    before(() => {
      process.env.DEBUG = true;
    });

    it('should be able to send message', done => {
      const message = Message.fakeExcept('sentAt', 'failedAt', 'deliveredAt');
      message.transport = 'fcm-push';

      message.send((error, sent) => {
        //assert results
        expect(error).to.not.exist;
        expect(sent).to.exist;
        expect(sent._id).to.exist;
        expect(sent.transport).to.be.equal('fcm-push');
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

  if (process.env.PUSH_FCM_TEST_REGISTRATION_TOKEN) {
    describe('live', function() {
      before(() => {
        process.env.DEBUG = false;
      });

      it('should be able to send message', done => {
        const message = new Push({
          to: process.env.PUSH_FCM_TEST_REGISTRATION_TOKEN,
          subject: 'Test',
          body: 'Receive Push Notification',
          options: {
            data: { level: 1 },
          },
        });
        message.transport = 'fcm-push';

        message.send((error, sent) => {
          //assert results
          expect(error).to.not.exist;
          expect(sent).to.exist;
          expect(sent._id).to.exist;
          expect(sent.transport).to.be.equal('fcm-push');
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
