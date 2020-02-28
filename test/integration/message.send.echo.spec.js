'use strict';

/* dependencies */
const { clear, expect } = require('@lykmapipo/mongoose-test-helpers');
const { Message } = require('../..');

describe('echo transport', () => {
  before(() => {
    delete process.env.DEBUG;
  });

  before(done => clear(done));

  it('should be able to send message', done => {
    const message = Message.fakeExcept(
      'sentAt',
      'failedAt',
      'deliveredAt',
      'result'
    );
    message.transport = 'echo';

    message.send((error, sent) => {
      //assert results
      expect(error).to.not.exist;
      expect(sent).to.exist;
      expect(sent._id).to.exist;
      expect(sent.transport).to.exist.and.be.equal('echo');
      expect(sent.sentAt).to.exist;
      expect(sent.deliveredAt).to.exist;
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
