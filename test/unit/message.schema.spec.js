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

});