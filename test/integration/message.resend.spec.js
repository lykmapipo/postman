'use strict';

/* dependencies */
const { clear } = require('@lykmapipo/mongoose-test-helpers');
const { Message } = require('../..');
let messages = [];

describe('Message#resend', () => {
  before((done) => clear(done));

  before((done) => {
    const message = Message.fakeExcept('deliveredAt');
    messages = messages.concat(message);
    message.post(done);
  });

  it.skip('should be able to resend messages');

  after((done) => clear(done));
});
