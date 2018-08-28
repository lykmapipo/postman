'use strict';


/* dependencies */
const path = require('path');
const { expect } = require('chai');
const { Message } = require(path.join(__dirname, '..', '..'));
let messages = [];

describe('Message#unsent', () => {

  before((done) => {
    Message.deleteMany(done);
  });

  before((done) => {
    const message =
      Message.fakeExcept('sentAt', 'failedAt', 'deliveredAt');
    messages = messages.concat(message);
    message.post(done);
  });


  it('should be able to find unsent messages', (done) => {

    Message
      .unsent((error, unsents) => {

        //assert results
        expect(error).to.not.exist;
        expect(unsents).to.exist;
        expect(unsents).to.have.length.at.least(1);

        //assert single
        const unsent = unsents[0];
        expect(unsent._id).to.exist;
        expect(unsent.sentAt).to.not.exist;
        done(error, unsents);

      });

  });

  it('should be able to find unsent messages', (done) => {

    Message
      .unsent()
      .exec((error, unsents) => {

        //assert results
        expect(error).to.not.exist;
        expect(unsents).to.exist;
        expect(unsents).to.have.length.at.least(1);

        //assert single
        const unsent = unsents[0];
        expect(unsent._id).to.exist;
        expect(unsent.sentAt).to.not.exist;
        done(error, unsents);

      });

  });


  after((done) => {
    Message.deleteMany(done);
  });

});