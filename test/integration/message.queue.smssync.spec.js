'use strict';

/* dependencies */
const { expect, clear } = require('@lykmapipo/mongoose-test-helpers');
const { Message, worker } = require('../..');

describe('smssync transport queue', () => {
  before(() => {
    delete process.env.DEBUG;
  });

  before((done) => clear(done));
  before((done) => worker.clear(done));
  before((done) => worker.reset(done));
  before(() => worker.start({ types: Message.TYPES }));

  it('should be able to queue message', (done) => {
    const message = Message.fakeExcept(
      'sentAt',
      'failedAt',
      'queuedAt',
      'deliveredAt',
      'result'
    );
    message.transport = 'smssync';

    // listen to queue events
    worker.queue
      .on('job queued', (queued) => {
        expect(queued).to.exist;
        expect(queued._id).to.be.eql(message._id);
        expect(queued.to).to.exist;
        expect(queued.to).to.be.eql(message.to);
        expect(queued._id).to.exist;
        // expect(queued.sentAt).to.exist;
        expect(queued.deliveredAt).to.not.exist;
        expect(queued.failedAt).to.not.exist;
        // expect(queued.result).to.exist;
        // expect(queued.result.success).to.exist;
        // expect(queued.result.success).to.be.true;
        done(null, queued);
      })
      .on('error', (error) => {
        done(error);
      });

    message.queue();
  });

  after((done) => worker.clear(done));
  after((done) => worker.stop(done));
  after((done) => clear(done));

  after(() => {
    delete process.env.DEBUG;
  });
});
