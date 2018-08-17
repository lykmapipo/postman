'use strict';


/* dependencies */
const path = require('path');
const { expect } = require('chai');
const { constants } = require(path.join(__dirname, '..', '..'));


describe('constants', () => {

  it('should be an object', () => {
    expect(constants).to.exist;
    expect(constants).to.be.an('object');
  });

  describe('types', () => {

    it('should have sms', () => {
      expect(constants.TYPE_SMS).to.exist;
      expect(constants.TYPE_SMS).to.be.a('string');
      expect(constants.TYPE_SMS).to.be.equal('SMS');
    });

    it('should have email', () => {
      expect(constants.TYPE_EMAIL).to.exist;
      expect(constants.TYPE_EMAIL).to.be.a('string');
      expect(constants.TYPE_EMAIL).to.be.equal('EMAIL');
    });

    it('should have push', () => {
      expect(constants.TYPE_PUSH).to.exist;
      expect(constants.TYPE_PUSH).to.be.a('string');
      expect(constants.TYPE_PUSH).to.be.equal('PUSH');
    });

    it('should have types', () => {
      expect(constants.TYPES).to.exist;
      expect(constants.TYPES).to.be.an('array');
      expect(constants.TYPES).to.have.length(3);
      expect(constants.TYPES).to.include('SMS');
      expect(constants.TYPES).to.include('EMAIL');
      expect(constants.TYPES).to.include('PUSH');
    });

  });


  describe('mimes', function () {

    it('should have text/plain', () => {
      expect(constants.MIME_TEXT).to.exist;
      expect(constants.MIME_TEXT).to.be.a('string');
      expect(constants.MIME_TEXT).to.be.equal('text/plain');
    });

    it('should have text/html', () => {
      expect(constants.MIME_HTML).to.exist;
      expect(constants.MIME_HTML).to.be.a('string');
      expect(constants.MIME_HTML).to.be.equal('text/html');
    });

    it('should have text/html', () => {
      expect(constants.MIME_HTML).to.exist;
      expect(constants.MIME_HTML).to.be.a('string');
      expect(constants.MIME_HTML).to.be.equal('text/html');
    });

    it('should have mimes', () => {
      expect(constants.MIMES).to.exist;
      expect(constants.MIMES).to.be.an('array');
      expect(constants.MIMES).to.have.length(2);
      expect(constants.MIMES).to.include('text/plain');
      expect(constants.MIMES).to.include('text/html');
    });

  });


  describe('priorities', function () {

    it('should have low', () => {
      expect(constants.PRIORITY_LOW).to.exist;
      expect(constants.PRIORITY_LOW).to.be.a('string');
      expect(constants.PRIORITY_LOW).to.be.equal('low');
    });

    it('should have normal', () => {
      expect(constants.PRIORITY_NORMAL).to.exist;
      expect(constants.PRIORITY_NORMAL).to.be.a('string');
      expect(constants.PRIORITY_NORMAL).to.be.equal('normal');
    });

    it('should have medium', () => {
      expect(constants.PRIORITY_MEDIUM).to.exist;
      expect(constants.PRIORITY_MEDIUM).to.be.a('string');
      expect(constants.PRIORITY_MEDIUM).to.be.equal('medium');
    });

    it('should have high', () => {
      expect(constants.PRIORITY_HIGH).to.exist;
      expect(constants.PRIORITY_HIGH).to.be.a('string');
      expect(constants.PRIORITY_HIGH).to.be.equal('high');
    });

    it('should have critical', () => {
      expect(constants.PRIORITY_CRITICAL).to.exist;
      expect(constants.PRIORITY_CRITICAL).to.be.a('string');
      expect(constants.PRIORITY_CRITICAL).to.be.equal('critical');
    });

    it('should have priorities', () => {
      expect(constants.PRIORITIES).to.exist;
      expect(constants.PRIORITIES).to.be.an('array');
      expect(constants.PRIORITIES).to.have.length(5);
      expect(constants.PRIORITIES).to.include('low');
      expect(constants.PRIORITIES).to.include('normal');
      expect(constants.PRIORITIES).to.include('medium');
      expect(constants.PRIORITIES).to.include('high');
      expect(constants.PRIORITIES).to.include('critical');
    });

  });

});