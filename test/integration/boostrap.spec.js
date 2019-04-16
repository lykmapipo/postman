'use strict';


/* dependencies */
const async = require('async');
const kue = require('kue');
const { connect, clear, drop } = require('@lykmapipo/mongoose-test-helpers');

/* clear redis database */
const clean = done => {
  const redis = kue.redis.createClientFactory({
    redis: {}
  });
  redis.keys('q*', (error, rows) => {
    if (error) {
      done(error);
    } else {
      async.each(rows, (row, next) => {
        redis.del(row, next);
      }, done);
    }
  });
};

/* clear redis */
before(clean);

/* setup database */
before((done) => connect(done));

/* clear database */
before((done) => clear(done));

/* drop database */
after((done) => drop(done));

/* clear redis */
after(clean);