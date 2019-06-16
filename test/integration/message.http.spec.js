'use strict';

const {
  clear: clearHttp,
  testRouter,
} = require('@lykmapipo/express-test-helpers');
const {
  clear: clearDatabase,
  expect
} = require('@lykmapipo/mongoose-test-helpers');
const { Message, messageRouter } = require('../..');

describe('Message Rest API', () => {
  const message = Message.fake();

  const options = {
    pathSingle: '/messages/:id',
    pathList: '/messages',
    pathSchema: '/messages/schema/',
    pathExport: '/messages/export/',
  };

  before(() => clearHttp());

  before(done => clearDatabase(done));

  it('should handle HTTP POST on /messages', done => {
    const { testPost } = testRouter(options, messageRouter);
    testPost({ ...message.toObject() })
      .expect(201)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const created = new Message(body);
        expect(created._id).to.exist.and.be.eql(message._id);
        expect(created.type).to.exist.and.be.eql(message.type);
        done(error, body);
      });
  });

  it('should handle HTTP GET on /messages', done => {
    const { testGet } = testRouter(options, messageRouter);
    testGet()
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        expect(body.data).to.exist;
        expect(body.total).to.exist;
        expect(body.limit).to.exist;
        expect(body.skip).to.exist;
        expect(body.page).to.exist;
        expect(body.pages).to.exist;
        expect(body.lastModified).to.exist;
        done(error, body);
      });
  });

  it('should handle GET /messages/schema', done => {
    const { testGetSchema } = testRouter(options, messageRouter);
    testGetSchema().expect(200, done);
  });

  it('should handle GET /messages/export', done => {
    const { testGetExport } = testRouter(options, messageRouter);
    testGetExport()
      .expect('Content-Type', 'text/csv; charset=utf-8')
      .expect(({ headers }) => {
        expect(headers['content-disposition']).to.exist;
      })
      .expect(200, done);
  });

  it('should handle HTTP GET on /messages/:id', done => {
    const { testGet } = testRouter(options, messageRouter);
    const params = { id: message._id.toString() };
    testGet(params)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const found = new Message(body);
        expect(found._id).to.exist.and.be.eql(message._id);
        expect(found.type).to.exist.and.be.eql(message.type);
        done(error, body);
      });
  });

  it('should handle HTTP PATCH on /messages/:id', done => {
    const { testPatch } = testRouter(options, messageRouter);
    const { subject } = message.fakeOnly('subject');
    const params = { id: message._id.toString() };
    testPatch(params, { subject })
      .expect('Content-Type', /json/)
      .expect(405, done);
  });

  it('should handle HTTP PUT on /messages/:id', done => {
    const { testPut } = testRouter(options, messageRouter);
    const { subject } = message.fakeOnly('subject');
    const params = { id: message._id.toString() };
    testPut(params, { subject })
      .expect('Content-Type', /json/)
      .expect(405, done);
  });

  it('should handle HTTP DELETE on /messages/:id', done => {
    const { testDelete } = testRouter(options, messageRouter);
    const params = { id: message._id.toString() };
    testDelete(params)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const patched = new Message(body);
        expect(patched._id).to.exist.and.be.eql(message._id);
        expect(patched.type).to.exist.and.be.eql(message.type);
        done(error, body);
      });
  });

  after(() => clearHttp());

  after(done => clearDatabase(done));
});