'use strict';

/* dependencies */
const path = require('path');
const { expect } = require('chai');
const { clear } = require('@lykmapipo/mongoose-test-helpers');
const { Message } = require(path.join(__dirname, '..', '..'));

describe('echo transport', () => {
  before(() => {
    process.env.DEBUG = true;
  });

  before(done => clear(done));

  it('should be able to send message', done => {
    const message = Message.fakeExcept('sentAt', 'failedAt', 'deliveredAt');
    message.send((error, sent) => {
      //assert results
      expect(error).to.not.exist;
      expect(sent).to.exist;
      expect(sent._id).to.exist;
      expect(sent.sentAt).to.exist;
      expect(sent.deliveredAt).to.exist;
      expect(sent.failedAt).to.not.exist;
      expect(sent.result).to.exist;
      expect(sent.result.success).to.exist;
      expect(sent.result.success).to.be.true;
      done(error, sent);
    });
  });

  it('should be able to send message', done => {
    const message = Message.fakeExcept('sentAt', 'failedAt', 'deliveredAt');
    message.transport = undefined;

    message.send((error, sent) => {
      //assert results
      expect(error).to.not.exist;
      expect(sent).to.exist;
      expect(sent._id).to.exist;
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
