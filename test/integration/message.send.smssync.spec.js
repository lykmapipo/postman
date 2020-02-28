'use strict';

/* dependencies */
const { clear, expect } = require('@lykmapipo/mongoose-test-helpers');
const { Message } = require('../..');

describe('smssync transport', () => {
  before(() => {
    delete process.env.DEBUG;
  });

  before(done => clear(done));

  it('should be able to send message', done => {
    const message = Message.fakeExcept(
      'sentAt',
      'failedAt',
      'queuedAt',
      'deliveredAt',
      'result'
    );
    message.transport = 'smssync';

    message.send((error, sent) => {
      //assert results
      expect(error).to.not.exist;
      expect(sent).to.exist;
      expect(sent._id).to.exist;
      expect(sent.transport).to.exist.and.be.equal('smssync');
      expect(sent.sentAt).to.exist;
      expect(sent.queuedAt).to.exist;
      expect(sent.deliveredAt).to.not.exist;
      expect(sent.failedAt).to.not.exist;
      expect(sent.result).to.exist;
      expect(sent.result.success).to.exist;
      expect(sent.result.success).to.be.true;
      done(error, sent);
    });
  });

  after(done => clear(done));

  after(() => {
    delete process.env.DEBUG;
  });
});
