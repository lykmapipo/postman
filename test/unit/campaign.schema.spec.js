'use strict';


/* dependencies */
const path = require('path');
const { expect } = require('@lykmapipo/mongoose-test-helpers');
const { Campaign } = require(path.join(__dirname, '..', '..'));

describe('Campaign Schema', () => {
  expect(Campaign).to.exist;
});