'use strict';

const {
  clear: clearHttp,
  testRouter,
} = require('@lykmapipo/express-test-helpers');
const {
  clear: clearDatabase,
  expect,
} = require('@lykmapipo/mongoose-test-helpers');
const { Campaign, campaignRouter } = require('../..');

describe('Campaign Rest API', () => {
  const campaign = Campaign.fake();

  const options = {
    pathSingle: '/campaigns/:id',
    pathList: '/campaigns',
    pathSchema: '/campaigns/schema/',
    pathExport: '/campaigns/export/',
  };

  before(() => clearHttp());

  before((done) => clearDatabase(done));

  it('should handle HTTP POST on /campaigns', (done) => {
    const { testPost } = testRouter(options, campaignRouter);
    testPost({ ...campaign.toObject() })
      .expect(201)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const created = new Campaign(body);
        expect(created._id).to.exist.and.be.eql(campaign._id);
        expect(created.form).to.exist.and.be.eql(campaign.form);
        done(error, body);
      });
  });

  it('should handle HTTP GET on /campaigns', (done) => {
    const { testGet } = testRouter(options, campaignRouter);
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

  it('should handle GET /campaigns/schema', (done) => {
    const { testGetSchema } = testRouter(options, campaignRouter);
    testGetSchema().expect(200, done);
  });

  it('should handle GET /campaigns/export', (done) => {
    const { testGetExport } = testRouter(options, campaignRouter);
    testGetExport()
      .expect('Content-Type', 'text/csv; charset=utf-8')
      .expect(({ headers }) => {
        expect(headers['content-disposition']).to.exist;
      })
      .expect(200, done);
  });

  it('should handle HTTP GET on /campaigns/:id', (done) => {
    const { testGet } = testRouter(options, campaignRouter);
    const params = { id: campaign._id.toString() };
    testGet(params)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const found = new Campaign(body);
        expect(found._id).to.exist.and.be.eql(campaign._id);
        expect(found.form).to.exist.and.be.eql(campaign.form);
        done(error, body);
      });
  });

  it('should handle HTTP PATCH on /campaigns/:id', (done) => {
    const { testPatch } = testRouter(options, campaignRouter);
    const { subject } = campaign.fakeOnly('subject');
    const params = { id: campaign._id.toString() };
    testPatch(params, { subject })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('should handle HTTP PUT on /campaigns/:id', (done) => {
    const { testPut } = testRouter(options, campaignRouter);
    const { subject } = campaign.fakeOnly('subject');
    const params = { id: campaign._id.toString() };
    testPut(params, { subject })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('should handle HTTP DELETE on /campaigns/:id', (done) => {
    const { testDelete } = testRouter(options, campaignRouter);
    const params = { id: campaign._id.toString() };
    testDelete(params)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const patched = new Campaign(body);
        expect(patched._id).to.exist.and.be.eql(campaign._id);
        expect(patched.form).to.exist.and.be.eql(campaign.form);
        done(error, body);
      });
  });

  after(() => clearHttp());

  after((done) => clearDatabase(done));
});
