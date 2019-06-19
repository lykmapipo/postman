'use strict';

/* dependencies */
const _ = require('lodash');
const { faker, clear, expect } = require('@lykmapipo/mongoose-test-helpers');
const { Campaign } = require('../..');

const fakeContacts = (limit = 1) => {
  const contacts = _.map(_.range(limit), () => {
    const name = faker.name.findName();
    const email = faker.internet.email();
    const mobile = faker.helpers.replaceSymbolWithNumber('255714######');
    return { name, email, mobile };
  });
  return limit === 1 ? _.first(contacts) : contacts;
};

describe('campaign send', () => {
  before(() => {
    process.env.DEBUG = true;
  });

  before(done => clear(done));

  it('should be able to send without fetchContacts', done => {
    const to = fakeContacts();

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

  it('should be able to send with fetchContacts', done => {
    const to = fakeContacts(4);

    Campaign.fetchContacts = (criteria, done) => {
      return done(null, to);
    };

    const campaign = Campaign.fake();
    expect(campaign.send).to.exist;

    campaign.send((error, sent, messages) => {
      expect(error).to.not.exist;
      expect(sent).to.exist;
      expect(messages).to.exist.and.have.length(5);
      done(error, sent);
    });
  });

  after(done => clear(done));

  after(() => {
    delete process.env.DEBUG;
  });
});
