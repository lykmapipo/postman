'use strict';

/* dependencies */
const { clear, expect } = require('@lykmapipo/mongoose-test-helpers');
const { Campaign } = require('../..');

describe.only('campaign send', () => {
  before(() => {
    process.env.DEBUG = true;
  });

  before(done => clear(done));

  it('should be able to send', done => {
    expect(Campaign.send).to.not.exist;
    done();
  });

  after(done => clear(done));

  after(() => {
    delete process.env.DEBUG;
  });
});
