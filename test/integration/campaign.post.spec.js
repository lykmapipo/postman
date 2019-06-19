'use strict';

const { expect } = require('@lykmapipo/mongoose-test-helpers');
const { Campaign } = require('../..');

describe('Campaign Static Post', () => {
  before(done => {
    Campaign.deleteMany(done);
  });

  it('should be able to post', done => {
    const campaign = Campaign.fake();
    Campaign.post(campaign, (error, created) => {
      expect(error).to.not.exist;
      expect(created).to.exist;
      expect(created._id).to.eql(campaign._id);
      done(error, created);
    });
  });

  after(done => {
    Campaign.deleteMany(done);
  });
});

describe('Campaign Instance Post', () => {
  before(done => {
    Campaign.deleteMany(done);
  });

  it('should be able to post', done => {
    const campaign = Campaign.fake();
    campaign.post((error, created) => {
      expect(error).to.not.exist;
      expect(created).to.exist;
      expect(created._id).to.eql(campaign._id);
      done(error, created);
    });
  });

  after(done => {
    Campaign.deleteMany(done);
  });
});
