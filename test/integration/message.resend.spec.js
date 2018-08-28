'use strict';


/* dependencies */
const path = require('path');
// const { expect } = require('chai');
const { Message } = require(path.join(__dirname, '..', '..'));
let messages = [];

describe('Message#resend', () => {

  before((done) => {
    Message.deleteMany(done);
  });

  before((done) => {
    const message = Message.fakeExcept('deliveredAt');
    messages = messages.concat(message);
    message.post(done);
  });


  it.skip('should be able to resend messages');


  after((done) => {
    Message.deleteMany(done);
  });

});