'use strict';

/* dependencies */
const { faker, clear, expect } = require('@lykmapipo/mongoose-test-helpers');
const { Campaign } = require('../..');

describe.only('campaign send', () => {
  before(() => {
    process.env.DEBUG = true;
  });

  before(done => clear(done));

  it('should be able to send without fetchContacts', done => {
    const name = faker.name.findName();
    const email = faker.internet.email();
    const mobile = faker.helpers.replaceSymbolWithNumber('255714######');
    const to = { name, email, mobile };

    const campaign = Campaign.fake();
    campaign.to = [to];
    expect(campaign.send).to.exist;

    campaign.send((error, sent, messages) => {
      expect(error).to.not.exist;
      expect(sent).to.exist;
      expect(messages).to.exist.and.have.length(1);
      done(error, sent);
    });
  });

  after(done => clear(done));

  after(() => {
    delete process.env.DEBUG;
  });
});
