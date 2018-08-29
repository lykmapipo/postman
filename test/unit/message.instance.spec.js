'use strict';


/* dependencies */
// const path = require('path');
// const { expect } = require('chai');
// const { Message } = require(path.join(__dirname, '..', '..'));


describe('Message Instance', () => {

  before(() => {
    process.env.DEBUG = true;
  });

  it.skip('should be able to debug message send');

  after(() => {
    delete process.env.DEBUG;
  });

});