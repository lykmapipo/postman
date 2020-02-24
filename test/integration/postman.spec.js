'use strict';

/* dependencies */
const { expect } = require('chai');
const faker = require('@benmaruchu/faker');
const postman = require('../..')({
  fetchContacts: (criteria, done) => done(null, []),
});
const { Email, SMS, Campaign } = postman;

describe('postman', () => {
  it('should be a factory', () => {
    expect(postman).to.exist;
    expect(postman).to.be.a('function');
    expect(postman.name).to.be.equal('postman');
    expect(postman.length).to.be.equal(1);
    expect(postman.Message).to.exist;
    expect(postman.Email).to.exist;
    expect(postman.SMS).to.exist;
    expect(postman.worker).to.exist;
    expect(postman.httpServer).to.exist;
    expect(postman.utils).to.exist;
  });

  it('should expose Email factory', () => {
    //assert
    expect(Email).to.exist;
    expect(Email).to.be.a('function');
    expect(Email.name).to.be.equal('Email');
    expect(Email.length).to.be.equal(1);

    //instantiate
    const payload = { to: faker.internet.email() };
    const email = new Email(payload);

    //assert
    expect(email).to.exist;
    expect(email.type).to.be.equal('EMAIL');
    // expect(email.transport).to.be.equal('smtp');
    expect(email.to).to.be.eql([payload.to]);
  });

  it('should expose SMS factory', () => {
    //assert
    expect(SMS).to.exist;
    expect(SMS).to.be.a('function');
    expect(SMS.name).to.be.equal('SMS');
    expect(SMS.length).to.be.equal(1);

    //instantiate
    const payload = { to: faker.phone.phoneNumber() };
    const sms = new SMS(payload);

    //assert
    expect(sms).to.exist;
    expect(sms.type).to.be.equal('SMS');
    expect(sms.to).to.be.eql([payload.to]);
  });

  it('should set fetchContacts to campaign', () => {
    Campaign.fetchContacts = (criteria, done) => done(null, []);
    expect(Campaign).to.exist;
    expect(Campaign.fetchContacts).to.exist;
  });

  it('should expose smssync http router', () => {
    expect(postman.smssyncRouter).to.exist;
  });
});
