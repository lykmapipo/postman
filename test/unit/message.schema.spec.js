'use strict';


/* dependencies */
const path = require('path');
const { expect } = require('chai');
const mongoose = require('mongoose');
const Types = mongoose.Schema.Types;
const { Message } = require(path.join(__dirname, '..', '..'));


describe('Message Schema', () => {

  it('should have type field', function () {

    const type = Message.schema.path('type');

    expect(type).to.exist;
    expect(type).to.be.an.instanceof(Types.String);
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

  it('should have mime field', function () {

    const mime = Message.schema.path('mime');

    expect(mime).to.exist;
    expect(mime).to.be.an.instanceof(Types.String);
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

  it('should have direction field', function () {

    const direction = Message.schema.path('direction');

    expect(direction).to.exist;
    expect(direction).to.be.an.instanceof(Types.String);
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

  it('should have state field', function () {

    const state = Message.schema.path('state');

    expect(state).to.exist;
    expect(state).to.be.an.instanceof(Types.String);
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

  it('should have mode field', function () {

    const mode = Message.schema.path('mode');

    expect(mode).to.exist;
    expect(mode).to.be.an.instanceof(Types.String);
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

  it('should have sender field', function () {

    const sender = Message.schema.path('sender');

    expect(sender).to.exist;
    expect(sender).to.be.an.instanceof(Types.String);
    expect(sender.instance).to.be.equal('String');
    expect(sender).to.be.an('object');
    expect(sender.options.type).to.be.a('function');
    expect(sender.options.type.name).to.be.equal('String');
    expect(sender.options.trim).to.be.true;
    expect(sender.options.lowercase).to.be.true;
    expect(sender.options.index).to.be.true;
    expect(sender.options.searchable).to.be.true;
    expect(sender.options.fake).to.exist;

  });

});