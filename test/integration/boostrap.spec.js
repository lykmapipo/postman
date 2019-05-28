'use strict';

/* dependencies */
const { connect, clear, drop } = require('@lykmapipo/mongoose-test-helpers');
const { worker } = require('mongoose-kue');

/* clear queue test database */
before(done => worker.clear(done));

/* setup mongo test database */
before(done => connect(done));

/* clear mongo test database */
before(done => clear(done));

/* drop mongo test database */
after(done => drop(done));

/* clear queue test database */
after(done => worker.clear(done));