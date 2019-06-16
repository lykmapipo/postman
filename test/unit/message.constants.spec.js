'use strict';


/* dependencies */
const path = require('path');
const { expect } = require('chai');
const { Message } = require(path.join(__dirname, '..', '..'));

describe('Message Constants', () => {

  describe('schema options', () => {

    it('should have model name', () => {
      expect(Message.MODEL_NAME).to.exist;
      expect(Message.MODEL_NAME).to.be.a('string');
      expect(Message.MODEL_NAME).to.be.equal('Message');
    });

    it('should have collection name', () => {
      expect(Message.COLLECTION_NAME).to.exist;
      expect(Message.COLLECTION_NAME).to.be.a('string');
      expect(Message.COLLECTION_NAME).to.be.equal('messages');
    });

  });

  describe('types', () => {

    it('should have sms', () => {
      expect(Message.TYPE_SMS).to.exist;
      expect(Message.TYPE_SMS).to.be.a('string');
      expect(Message.TYPE_SMS).to.be.equal('SMS');
    });

    it('should have email', () => {
      expect(Message.TYPE_EMAIL).to.exist;
      expect(Message.TYPE_EMAIL).to.be.a('string');
      expect(Message.TYPE_EMAIL).to.be.equal('EMAIL');
    });

    it('should have push', () => {
      expect(Message.TYPE_PUSH).to.exist;
      expect(Message.TYPE_PUSH).to.be.a('string');
      expect(Message.TYPE_PUSH).to.be.equal('PUSH');
    });

    it('should have types', () => {
      expect(Message.TYPES).to.exist;
      expect(Message.TYPES).to.be.an('array');
      expect(Message.TYPES).to.have.length(3);
      expect(Message.TYPES).to.include('SMS');
      expect(Message.TYPES).to.include('EMAIL');
      expect(Message.TYPES).to.include('PUSH');
    });

  });

  describe('mimes', function () {

    it('should have text/plain', () => {
      expect(Message.MIME_TEXT).to.exist;
      expect(Message.MIME_TEXT).to.be.a('string');
      expect(Message.MIME_TEXT).to.be.equal('text/plain');
    });

    it('should have text/html', () => {
      expect(Message.MIME_HTML).to.exist;
      expect(Message.MIME_HTML).to.be.a('string');
      expect(Message.MIME_HTML).to.be.equal('text/html');
    });

    it('should have text/html', () => {
      expect(Message.MIME_HTML).to.exist;
      expect(Message.MIME_HTML).to.be.a('string');
      expect(Message.MIME_HTML).to.be.equal('text/html');
    });

    it('should have mimes', () => {
      expect(Message.MIMES).to.exist;
      expect(Message.MIMES).to.be.an('array');
      expect(Message.MIMES).to.have.length(2);
      expect(Message.MIMES).to.include('text/plain');
      expect(Message.MIMES).to.include('text/html');
    });

  });

  describe('priorities', function () {

    it('should have low', () => {
      expect(Message.PRIORITY_LOW).to.exist;
      expect(Message.PRIORITY_LOW).to.be.a('string');
      expect(Message.PRIORITY_LOW).to.be.equal('low');
    });

    it('should have normal', () => {
      expect(Message.PRIORITY_NORMAL).to.exist;
      expect(Message.PRIORITY_NORMAL).to.be.a('string');
      expect(Message.PRIORITY_NORMAL).to.be.equal('normal');
    });

    it('should have medium', () => {
      expect(Message.PRIORITY_MEDIUM).to.exist;
      expect(Message.PRIORITY_MEDIUM).to.be.a('string');
      expect(Message.PRIORITY_MEDIUM).to.be.equal('medium');
    });

    it('should have high', () => {
      expect(Message.PRIORITY_HIGH).to.exist;
      expect(Message.PRIORITY_HIGH).to.be.a('string');
      expect(Message.PRIORITY_HIGH).to.be.equal('high');
    });

    it('should have critical', () => {
      expect(Message.PRIORITY_CRITICAL).to.exist;
      expect(Message.PRIORITY_CRITICAL).to.be.a('string');
      expect(Message.PRIORITY_CRITICAL).to.be.equal('critical');
    });

    it('should have priorities', () => {
      expect(Message.PRIORITIES).to.exist;
      expect(Message.PRIORITIES).to.be.an('array');
      expect(Message.PRIORITIES).to.have.length(5);
      expect(Message.PRIORITIES).to.include('low');
      expect(Message.PRIORITIES).to.include('normal');
      expect(Message.PRIORITIES).to.include('medium');
      expect(Message.PRIORITIES).to.include('high');
      expect(Message.PRIORITIES).to.include('critical');
    });

  });

});