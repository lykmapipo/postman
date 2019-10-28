'use strict';

/* dependencies */
const _ = require('lodash');
const { faker, clear, expect } = require('@lykmapipo/mongoose-test-helpers');
const { CHANNEL_EMAIL, CHANNEL_PUSH } = require('../..');
const { Campaign } = require('../..');

const fakeContacts = (limit = 1) => {
  const contacts = _.map(_.range(limit), () => {
    const name = faker.name.findName();
    const email = faker.internet.email();
    const mobile = faker.helpers.replaceSymbolWithNumber('255714######');
    const pushToken = faker.random.uuid();
    return { name, email, mobile, pushToken };
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
    const channels = [CHANNEL_EMAIL, CHANNEL_PUSH];

    Campaign.fetchContacts = undefined;

    const campaign = Campaign.fake();
    campaign.set({ to, channels });
    expect(campaign.send).to.exist;

    campaign.send((error, sent, messages) => {
      expect(error).to.not.exist;
      expect(sent).to.exist;
      expect(messages.email).to.exist.and.have.length(1);
      // expect(messages.sms).to.exist.and.have.length(1);
      expect(messages.push).to.exist.and.have.length(1);
      done(error, sent);
    });
  });

  it('should be able to send with fetchContacts', done => {
    const to = fakeContacts(4);
    const channels = [CHANNEL_EMAIL, CHANNEL_PUSH];

    Campaign.fetchContacts = (criteria, done) => {
      return done(null, to);
    };

    const campaign = Campaign.fake();
    campaign.set({ channels });
    expect(campaign.send).to.exist;

    campaign.send((error, sent, messages) => {
      expect(error).to.not.exist;
      expect(sent).to.exist;
      expect(messages.email).to.exist.and.have.length(5);
      // expect(messages.sms).to.exist.and.have.length(5);
      expect(messages.push).to.exist.and.have.length(5);
      done(error, sent);
    });
  });

  if (process.env.PUSH_FCM_TEST_REGISTRATION_TOKEN &&
    process.env.SMTP_TEST_RECEIVER &&
    process.env.SMS_EGA_TZ_TEST_RECEIVER) {
    describe('campaign live send', () => {

      before(() => {
        process.env.DEBUG = false;
      });

      it('should be able to send multi channel message', done => {
        Campaign.fetchContacts = undefined;
        const to = {
          mobile: process.env.SMS_EGA_TZ_TEST_RECEIVER,
          email: process.env.SMTP_TEST_RECEIVER,
          pushToken: process.env.PUSH_FCM_TEST_REGISTRATION_TOKEN
        };
        const campaign = new Campaign({
          subject: 'Test Multi Channel Notification',
          message: 'Test Multi Channel Notification',
          to: [to],
          channels: [Campaign.CHANNEL_EMAIL, Campaign.CHANNEL_PUSH],
          metadata: {
            data: { level: 1 },
          },
        });
        campaign.send((error, sent, messages) => {
          expect(error).to.not.exist;
          expect(sent).to.exist;
          expect(messages.email).to.exist;
          // expect(messages.sms).to.exist;
          expect(messages.push).to.exist;
          done(error, sent);
          done(error, sent, messages);
        });
      });

      after(() => {
        delete process.env.DEBUG;
      });

    });
  }

  after(done => clear(done));

  after(() => {
    delete process.env.DEBUG;
  });
});