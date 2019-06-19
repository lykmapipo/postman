'use strict';

/* dependencies */
const { expect } = require('chai');
const { toE164 } = require('../..');

describe('utils', () => {
  it('should expose toE164 formatter', () => {
    expect(toE164).to.exist;
    expect(toE164).to.be.a('function');
  });

  it('should use default country code', () => {
    const phoneNumber = toE164('0714969698', 'TZ');
    expect(phoneNumber).to.exist;
    expect(phoneNumber).to.be.eql('255714969698');
  });

  it('should use country code param', () => {
    const phoneNumber = toE164('0714969698', 'KE');
    expect(phoneNumber).to.exist;
    expect(phoneNumber).to.be.eql('254714969698');
  });
});
