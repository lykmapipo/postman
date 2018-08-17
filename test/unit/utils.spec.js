'use strict';


/* dependencies */
const path = require('path');
const { expect } = require('chai');
const { utils } = require(path.join(__dirname, '..', '..'));


describe('utils', () => {

  before(function () {
    process.env.DEFAULT_COUNTRY_CODE = 'TZ';
  });

  it('should be an object', () => {
    expect(utils).to.exist;
    expect(utils).to.be.an('object');
  });

  it('should expose toE164 formatter', function () {
    expect(utils.toE164).to.exist;
    expect(utils.toE164).to.be.a('function');
  });

  it('should use default country code', function () {
    const phoneNumber = utils.toE164('0714969698');
    expect(phoneNumber).to.exist;
    expect(phoneNumber).to.be.eql('255714969698');
  });

  it('should use country code param', function () {
    const phoneNumber = utils.toE164('0714969698', 'KE');
    expect(phoneNumber).to.exist;
    expect(phoneNumber).to.be.eql('254714969698');
  });

});