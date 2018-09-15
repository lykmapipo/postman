'use strict';


/* dependencies */
const path = require('path');
const { expect } = require('chai');
const faker = require('@benmaruchu/faker');
const postman = require(path.join(__dirname, '..', '..'));
const { Email, SMS } = postman;


describe('postman', () => {

  it('should be a factory', () => {
    expect(postman).to.exist;
    expect(postman).to.be.a('function');
    expect(postman.name).to.be.equal('postman');
    expect(postman.length).to.be.equal(0);
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
    expect(email.transport).to.be.equal('smtp');
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

});