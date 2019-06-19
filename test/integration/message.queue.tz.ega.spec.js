'use strict';

/* dependencies */
const { expect, clear } = require('@lykmapipo/mongoose-test-helpers');
const { Message, worker } = require('../..');

describe('tz ega transport queue', () => {
  before(() => {
    process.env.DEBUG = true;
  });

  before(done => clear(done));
  before(done => worker.clear(done));
  before(done => worker.reset(done));
  before(() => worker.start({ types: Message.TYPES }));

  it('should be able to queue message', done => {
    const message = Message.fakeExcept(
      'sentAt',
      'failedAt',
      'deliveredAt',
      'mode'
    );
    message.transport = 'tz-ega-sms';

    // listen to queue events
    worker.queue
      .on('job complete', (id, result) => {
        expect(id).to.exist;
        expect(result).to.exist;
        expect(result.to).to.exist;
        expect(result.to).to.be.eql(message.to);
        expect(result._id).to.exist;
        expect(result.transport).to.be.equal('tz-ega-sms');
        expect(result.sentAt).to.exist;
        expect(result.deliveredAt).to.exist;
        expect(result.failedAt).to.not.exist;
        expect(result.result).to.exist;
        expect(result.result.success).to.exist;
        expect(result.result.success).to.be.true;
      })
      .on('job remove', (jobId, jobType) => {
        expect(jobId).to.exist;
        expect(jobType).to.exist;
        done();
      })
      .on('job queued', queued => {
        expect(queued._id).to.be.eql(message._id);
      })
      .on('error', error => {
        done(error);
      });

    message.queue();
  });

  after(done => worker.clear(done));
  after(done => worker.stop(done));
  after(done => clear(done));

  after(() => {
    delete process.env.DEBUG;
  });
});
