'use strict';

/* dependencies */
const { expect } = require('@lykmapipo/mongoose-test-helpers');
const { SchemaTypes } = require('@lykmapipo/mongoose-common');
const { Message, Campaign } = require('../..');

describe('Message Schema', () => {
  it('should have campaign field', () => {
    const campaign = Message.path('campaign');

    expect(campaign).to.exist;
    expect(campaign).to.be.instanceof(SchemaTypes.ObjectId);
    expect(campaign.options).to.exist;
    expect(campaign.options).to.be.an('object');
    expect(campaign.options.type).to.exist;
    expect(campaign.options.ref).to.exist;
    expect(campaign.options.ref).to.be.equal(Campaign.MODEL_NAME);
    expect(campaign.options.default).to.be.undefined;
    expect(campaign.options.index).to.be.true;
  });

  it('should have type field', function() {
    const type = Message.path('type');

    expect(type).to.exist;
    expect(type).to.be.an.instanceof(SchemaTypes.String);
    expect(type.instance).to.be.equal('String');
    expect(type).to.be.an('object');
    expect(type.options.type).to.be.a('function');
    expect(type.options.type.name).to.be.equal('String');
    expect(type.options.enum).to.exist;
    expect(type.options.enum).to.be.eql(Message.TYPES);
    expect(type.options.trim).to.be.true;
    expect(type.options.default).to.exist;
    expect(type.options.index).to.be.true;
    expect(type.options.searchable).to.be.true;
    expect(type.options.fake).to.exist;
  });

  it('should have mime field', function() {
    const mime = Message.path('mime');

    expect(mime).to.exist;
    expect(mime).to.be.an.instanceof(SchemaTypes.String);
    expect(mime.instance).to.be.equal('String');
    expect(mime).to.be.an('object');
    expect(mime.options.type).to.be.a('function');
    expect(mime.options.type.name).to.be.equal('String');
    expect(mime.options.enum).to.exist;
    expect(mime.options.enum).to.be.eql(Message.MIMES);
    expect(mime.options.trim).to.be.true;
    expect(mime.options.default).to.exist;
    expect(mime.options.index).to.be.true;
    expect(mime.options.searchable).to.be.true;
    expect(mime.options.fake).to.exist;
  });

  it('should have direction field', function() {
    const direction = Message.path('direction');

    expect(direction).to.exist;
    expect(direction).to.be.an.instanceof(SchemaTypes.String);
    expect(direction.instance).to.be.equal('String');
    expect(direction).to.be.an('object');
    expect(direction.options.type).to.be.a('function');
    expect(direction.options.type.name).to.be.equal('String');
    expect(direction.options.enum).to.exist;
    expect(direction.options.enum).to.be.eql(Message.DIRECTIONS);
    expect(direction.options.trim).to.be.true;
    expect(direction.options.default).to.exist;
    expect(direction.options.index).to.be.true;
    expect(direction.options.searchable).to.be.true;
    expect(direction.options.fake).to.exist;
  });

  it('should have state field', function() {
    const state = Message.path('state');

    expect(state).to.exist;
    expect(state).to.be.an.instanceof(SchemaTypes.String);
    expect(state.instance).to.be.equal('String');
    expect(state).to.be.an('object');
    expect(state.options.type).to.be.a('function');
    expect(state.options.type.name).to.be.equal('String');
    expect(state.options.enum).to.exist;
    expect(state.options.enum).to.be.eql(Message.STATES);
    expect(state.options.trim).to.be.true;
    expect(state.options.default).to.exist;
    expect(state.options.index).to.be.true;
    expect(state.options.searchable).to.be.true;
    expect(state.options.fake).to.exist;
  });

  it('should have mode field', function() {
    const mode = Message.path('mode');

    expect(mode).to.exist;
    expect(mode).to.be.an.instanceof(SchemaTypes.String);
    expect(mode.instance).to.be.equal('String');
    expect(mode).to.be.an('object');
    expect(mode.options.type).to.be.a('function');
    expect(mode.options.type.name).to.be.equal('String');
    expect(mode.options.enum).to.exist;
    expect(mode.options.enum).to.be.eql(Message.SEND_MODES);
    expect(mode.options.trim).to.be.true;
    expect(mode.options.default).to.exist;
    expect(mode.options.index).to.be.true;
    expect(mode.options.searchable).to.be.true;
    expect(mode.options.fake).to.exist;
  });

  it('should have bulk field', function() {
    const bulk = Message.path('bulk');

    expect(bulk).to.exist;
    expect(bulk).to.be.an.instanceof(SchemaTypes.String);
    expect(bulk.instance).to.be.equal('String');
    expect(bulk).to.be.an('object');
    expect(bulk.options.type).to.be.a('function');
    expect(bulk.options.type.name).to.be.equal('String');
    expect(bulk.options.trim).to.be.true;
    expect(bulk.options.index).to.be.true;
    expect(bulk.options.searchable).to.be.true;
    expect(bulk.options.fake).to.exist;
  });

  it('should have sender field', function() {
    const sender = Message.path('sender');

    expect(sender).to.exist;
    expect(sender).to.be.an.instanceof(SchemaTypes.String);
    expect(sender.instance).to.be.equal('String');
    expect(sender).to.be.an('object');
    expect(sender.options.type).to.be.a('function');
    expect(sender.options.type.name).to.be.equal('String');
    expect(sender.options.trim).to.be.true;
    expect(sender.options.index).to.be.true;
    expect(sender.options.searchable).to.be.true;
    expect(sender.options.fake).to.exist;
  });

  it('should have to field', function() {
    const to = Message.path('to');

    expect(to).to.exist;
    expect(to).to.be.an.instanceof(SchemaTypes.Array);
    expect(to.instance).to.be.equal('Array');
    expect(to).to.be.an('object');
    expect(to.options.type[0]).to.be.a('function');
    expect(to.options.type[0].name).to.be.equal('String');
    expect(to.options.required).to.be.true;
    expect(to.options.index).to.be.true;
    expect(to.options.searchable).to.be.true;
    expect(to.options.fake).to.exist;
  });

  it('should have cc field', function() {
    const cc = Message.path('cc');

    expect(cc).to.exist;
    expect(cc).to.be.an.instanceof(SchemaTypes.Array);
    expect(cc.instance).to.be.equal('Array');
    expect(cc).to.be.an('object');
    expect(cc.options.type[0]).to.be.a('function');
    expect(cc.options.type[0].name).to.be.equal('String');
    expect(cc.options.index).to.be.true;
    expect(cc.options.searchable).to.be.true;
    expect(cc.options.fake).to.exist;
  });

  it('should have bcc field', function() {
    const bcc = Message.path('bcc');

    expect(bcc).to.exist;
    expect(bcc).to.be.an.instanceof(SchemaTypes.Array);
    expect(bcc.instance).to.be.equal('Array');
    expect(bcc).to.be.an('object');
    expect(bcc.options.type[0]).to.be.a('function');
    expect(bcc.options.type[0].name).to.be.equal('String');
    expect(bcc.options.index).to.be.true;
    expect(bcc.options.searchable).to.be.true;
    expect(bcc.options.fake).to.exist;
  });

  it('should have subject field', function() {
    const subject = Message.path('subject');

    expect(subject).to.exist;
    expect(subject).to.be.an.instanceof(SchemaTypes.String);
    expect(subject.instance).to.be.equal('String');
    expect(subject).to.be.an('object');
    expect(subject.options.type).to.be.a('function');
    expect(subject.options.type.name).to.be.equal('String');
    expect(subject.options.trim).to.be.true;
    expect(subject.options.index).to.be.true;
    expect(subject.options.searchable).to.be.true;
    expect(subject.options.fake).to.exist;
  });

  it('should have body field', function() {
    const body = Message.path('body');

    expect(body).to.exist;
    expect(body).to.be.an.instanceof(SchemaTypes.String);
    expect(body.instance).to.be.equal('String');
    expect(body).to.be.an('object');
    expect(body.options.type).to.be.a('function');
    expect(body.options.type.name).to.be.equal('String');
    expect(body.options.trim).to.be.true;
    expect(body.options.index).to.be.true;
    expect(body.options.searchable).to.be.true;
    expect(body.options.fake).to.exist;
  });

  it('should have queuedAt field', function() {
    const queuedAt = Message.path('queuedAt');

    expect(queuedAt).to.exist;
    expect(queuedAt).to.be.an.instanceof(SchemaTypes.Date);
    expect(queuedAt.instance).to.be.equal('Date');
    expect(queuedAt).to.be.an('object');
    expect(queuedAt.options.type).to.be.a('function');
    expect(queuedAt.options.type.name).to.be.equal('Date');
    expect(queuedAt.options.index).to.be.true;
    expect(queuedAt.options.fake).to.exist;
  });

  it('should have sentAt field', function() {
    const sentAt = Message.path('sentAt');

    expect(sentAt).to.exist;
    expect(sentAt).to.be.an.instanceof(SchemaTypes.Date);
    expect(sentAt.instance).to.be.equal('Date');
    expect(sentAt).to.be.an('object');
    expect(sentAt.options.type).to.be.a('function');
    expect(sentAt.options.type.name).to.be.equal('Date');
    expect(sentAt.options.index).to.be.true;
    expect(sentAt.options.fake).to.exist;
  });

  it('should have failedAt field', function() {
    const failedAt = Message.path('failedAt');

    expect(failedAt).to.exist;
    expect(failedAt).to.be.an.instanceof(SchemaTypes.Date);
    expect(failedAt.instance).to.be.equal('Date');
    expect(failedAt).to.be.an('object');
    expect(failedAt.options.type).to.be.a('function');
    expect(failedAt.options.type.name).to.be.equal('Date');
    expect(failedAt.options.index).to.be.true;
    expect(failedAt.options.fake).to.exist;
  });

  it('should have deliveredAt field', function() {
    const deliveredAt = Message.path('deliveredAt');

    expect(deliveredAt).to.exist;
    expect(deliveredAt).to.be.an.instanceof(SchemaTypes.Date);
    expect(deliveredAt.instance).to.be.equal('Date');
    expect(deliveredAt).to.be.an('object');
    expect(deliveredAt.options.type).to.be.a('function');
    expect(deliveredAt.options.type.name).to.be.equal('Date');
    expect(deliveredAt.options.index).to.be.true;
    expect(deliveredAt.options.fake).to.exist;
  });

  it('should have readAt field', function() {
    const readAt = Message.path('readAt');

    expect(readAt).to.exist;
    expect(readAt).to.be.an.instanceof(SchemaTypes.Date);
    expect(readAt.instance).to.be.equal('Date');
    expect(readAt).to.be.an('object');
    expect(readAt.options.type).to.be.a('function');
    expect(readAt.options.type.name).to.be.equal('Date');
    expect(readAt.options.index).to.be.true;
    expect(readAt.options.fake).to.exist;
  });

  it('should have result field', function() {
    const result = Message.path('result');

    expect(result).to.exist;
    expect(result).to.be.an.instanceof(SchemaTypes.Mixed);
    expect(result.instance).to.be.equal('Mixed');
    expect(result).to.be.an('object');
    expect(result.options.type).to.be.a('function');
    expect(result.options.type.name).to.be.equal('Mixed');
    expect(result.options.fake).to.exist;
  });

  it('should have transport field', function() {
    const transport = Message.path('transport');

    expect(transport).to.exist;
    expect(transport).to.be.an.instanceof(SchemaTypes.String);
    expect(transport.instance).to.be.equal('String');
    expect(transport).to.be.an('object');
    expect(transport.options.type).to.be.a('function');
    expect(transport.options.type.name).to.be.equal('String');
    expect(transport.options.trim).to.be.true;
    expect(transport.options).to.have.property('default');
    expect(transport.options.searchable).to.be.true;
    expect(transport.options.fake).to.exist;
  });

  it('should have priority field', function() {
    const priority = Message.path('priority');

    expect(priority).to.exist;
    expect(priority).to.be.an.instanceof(SchemaTypes.String);
    expect(priority.instance).to.be.equal('String');
    expect(priority).to.be.an('object');
    expect(priority.options.type).to.be.a('function');
    expect(priority.options.type.name).to.be.equal('String');
    expect(priority.options.enum).to.exist;
    expect(priority.options.enum).to.be.eql(Message.PRIORITIES);
    expect(priority.options.trim).to.be.true;
    expect(priority.options.default).to.exist;
    expect(priority.options.index).to.be.true;
    expect(priority.options.searchable).to.be.true;
    expect(priority.options.fake).to.exist;
  });

  it('should have hash field', function() {
    const hash = Message.path('hash');

    expect(hash).to.exist;
    expect(hash).to.be.an.instanceof(SchemaTypes.String);
    expect(hash.instance).to.be.equal('String');
    expect(hash).to.be.an('object');
    expect(hash.options.type).to.be.a('function');
    expect(hash.options.type.name).to.be.equal('String');
    expect(hash.options.trim).to.be.true;
    expect(hash.options.required).to.be.true;
    expect(hash.options.unique).to.be.true;
    expect(hash.options.searchable).to.be.true;
    expect(hash.options.fake).to.exist;
  });

  it('should have tags field', function() {
    const tags = Message.path('tags');

    expect(tags).to.exist;
    expect(tags).to.be.an.instanceof(SchemaTypes.Array);
    expect(tags.instance).to.be.equal('Array');
    expect(tags).to.be.an('object');
    expect(tags.options.type[0]).to.be.a('function');
    expect(tags.options.type[0].name).to.be.equal('String');
    expect(tags.options.index).to.be.true;
    expect(tags.options.searchable).to.be.true;
  });

  it('should have options field', function() {
    const options = Message.path('options');

    expect(options).to.exist;
    expect(options).to.be.an.instanceof(SchemaTypes.Mixed);
    expect(options.instance).to.be.equal('Mixed');
    expect(options).to.be.an('object');
    expect(options.options.type).to.be.a('function');
    expect(options.options.type.name).to.be.equal('Mixed');
    expect(options.options.fake).to.exist;
  });
});
