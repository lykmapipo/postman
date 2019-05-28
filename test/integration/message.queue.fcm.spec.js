'use strict';


/* dependencies */
const path = require('path');
const { expect } = require('chai');
const { clear } = require('@lykmapipo/mongoose-test-helpers');
const { worker } = require('mongoose-kue');
const { Message } = require(path.join(__dirname, '..', '..'));


describe.skip('fcm transport queue', () => {

  before(() => {
    process.env.DEBUG = true;
  });

  before(done => clear(done));

  before(done => worker.reset(done));

  before(() => worker.start({ types: Message.TYPES }));

  it('should be able to queue message', (done) => {

    const message =
      Message.fakeExcept('sentAt', 'failedAt', 'deliveredAt');
    message.transport = 'fcm-push';

    //listen to queue events
    worker.queue.on('job complete', function (id, result) {
        expect(id).to.exist;
        expect(result).to.exist;
        expect(result.to).to.exist;
        expect(result.to).to.be.eql(message.to);
        expect(result._id).to.exist;
        expect(result.transport).to.be.equal('fcm-push');
        expect(result.sentAt).to.exist;
        expect(result.deliveredAt).to.exist;
        expect(result.failedAt).to.not.exist;
        expect(result.result).to.exist;
        expect(result.result.success).to.exist;
        expect(result.result.success).to.be.true;
        done();
      })
      .on('job queued', function (queued) {
        expect(queued._id).to.be.eql(message._id);
      });

    message.queue();

  });

  after(done => worker.stop(done));

  after(done => clear(done));

  after(() => {
    delete process.env.DEBUG;
  });

});