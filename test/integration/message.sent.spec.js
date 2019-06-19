'use strict';

/* dependencies */
const path = require('path');
const { expect } = require('chai');
const { clear } = require('@lykmapipo/mongoose-test-helpers');
const { Message } = require(path.join(__dirname, '..', '..'));
let messages = [];

describe('Message#sent', () => {
  before(done => clear(done));

  before(done => {
    const message = Message.fakeExcept('failedAt', 'deliveredAt');
    messages = messages.concat(message);
    message.post(done);
  });

  it('should be able to find sent messages', done => {
    Message.sent((error, sents) => {
      //assert results
      expect(error).to.not.exist;
      expect(sents).to.exist;
      expect(sents).to.have.length.at.least(1);

      //assert single
      const sent = sents[0];
      expect(sent._id).to.exist;
      expect(sent.sentAt).to.exist;
      done(error, sents);
    });
  });

  it('should be able to find sent messages', done => {
    Message.sent().exec((error, sents) => {
      //assert results
      expect(error).to.not.exist;
      expect(sents).to.exist;
      expect(sents).to.have.length.at.least(1);

      //assert single
      const sent = sents[0];
      expect(sent._id).to.exist;
      expect(sent.sentAt).to.exist;
      done(error, sents);
    });
  });

  after(done => clear(done));
});
