'use strict';

/* dependencies */
const _ = require('lodash');
const { faker, expect, clear } = require('@lykmapipo/mongoose-test-helpers');
const { Campaign, Message, worker } = require('../..');

const fakeContacts = (limit = 1) => {
  const contacts = _.map(_.range(limit), () => {
    const name = faker.name.findName();
    const email = faker.internet.email();
    const mobile = faker.helpers.replaceSymbolWithNumber('255714######');
    return { name, email, mobile };
  });
  return limit === 1 ? _.first(contacts) : contacts;
};

describe('campaign queue', () => {
  before(() => {
    process.env.DEBUG = true;
  });

  before(done => clear(done));
  before(done => worker.clear(done));
  before(done => worker.reset(done));
  before(() => worker.start({ types: Message.TYPES }));

  it('should be able to queue campaign send', done => {
    const to = fakeContacts();

    Campaign.fetchContacts = undefined;

    const campaign = Campaign.fake();
    campaign.to = [to];
    expect(campaign.queue).to.exist;

    // listen to queue events
    worker.queue
      .on('job complete', (id, result) => {
        expect(id).to.exist;
        expect(result).to.exist;
        expect(result._id).to.exist;
        expect(result.to).to.exist;
      })
      .on('job remove', (jobId, jobType) => {
        expect(jobId).to.exist;
        expect(jobType).to.exist;
        done();
      })
      .on('job queued', queued => {
        expect(queued._id).to.be.eql(campaign._id);
      })
      .on('error', error => {
        done(error);
      });

    campaign.queue();
  });

  after(done => worker.clear(done));
  after(done => worker.stop(done));
  after(done => clear(done));

  after(() => {
    delete process.env.DEBUG;
  });
});
