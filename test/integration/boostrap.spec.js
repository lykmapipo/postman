'use strict';

/* dependencies */
const { connect, clear, drop } = require('@lykmapipo/mongoose-test-helpers');
const { worker } = require('mongoose-kue');

/* setup mongo test database */
before(done => connect(done));

/* clear queue test database */
before(done => worker.clear(done));

/* clear mongo test database */
before(done => clear(done));

/* clear queue test database */
after(done => worker.clear(done));

/* shutdown queue */
after(done => worker.stop(done));

/* drop mongo test database */
after(done => drop(done));