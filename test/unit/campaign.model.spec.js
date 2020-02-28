'use strict';

/* dependencies */
const { expect } = require('@lykmapipo/mongoose-test-helpers');
const { Campaign } = require('../..');

describe('Campaign Validation', () => {
  it('should validate all fields', done => {
    const campaign = Campaign.fake();
    campaign.validate(error => {
      expect(error).to.not.exist;
      done();
    });
  });

  it('should work with well known criteria format', done => {
    const campaign = Campaign.fake();
    campaign.criteria = { agencies: { $in: ['5d0a3ac36aeb7f1cff91c00f'] } };
    campaign.validate(error => {
      expect(error).to.not.exist;
      done();
    });
  });

  it('should work with well known criteria format', done => {
    const campaign = Campaign.fake();
    campaign.criteria = { agencies: { $in: undefined } };
    campaign.validate(error => {
      expect(error).to.not.exist;
      done();
    });
  });

  it('should work with well known criteria format', done => {
    const campaign = Campaign.fake();
    campaign.criteria = {
      _id: { $in: ['5cffb7692e65f7001a2d5b02', '5cffb7692e65f7001a2d5b1d'] },
      group: { $in: [] },
      role: { $in: [] },
      location: { $in: [] },
    };
    campaign.validate(error => {
      expect(error).to.not.exist;
      done();
    });
  });
});
