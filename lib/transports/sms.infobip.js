'use strict';

/**
 * @module open311-infobip
 * @version 0.1.0
 * @description infobip sms transport for open311-messages
 * @see {@link https://github.com/CodeTanzania/open311-messages}
 * @see {@link https://github.com/lykmapipo/bipsms}
 * @see {@link https://dev.infobip.com/}
 * @see {@link https://www.infobip.com/}
 * @author lally elias <lallyelias87@gmail.com>
 * @public
 */


//dependencies
const _ = require('lodash');
const kue = require('kue');
const mongoose = require('mongoose');
const Infobip = require('bipsms');
const noop = function () {};


/**
 * @name defaults
 * @description default configuration options
 * @type {Object}
 * @since 0.1.0
 * @private
 */
exports.defaults = {
  timeout: 5000,
  concurrency: 10,
  fake: false,
  sync: false,
  from: 'open311' //TODO hwy not use 311
};


/**
 * @name queueName
 * @description name of the queue that will be used by infobip sms transport
 *              to enqueue message for sending
 * @type {String}
 * @since 0.1.0
 * @public
 */
exports.queueName = 'infobip';


/**
 * @name transport
 * @description name of the transport provided by infobip.
 *              This must be name of node module or file path pointing to
 *              a node module implement `send()`.
 * @type {String}
 * @since 0.1.0
 * @public
 */
exports.transport = 'open311-infobip';


/**
 * @name init
 * @description initialize infobip internals
 * @since 0.1.0
 * @private
 * @example
 *
 * const infobip = require('open311-infobip');
 * infobip.options = {
 *  from:<your_infobip_account_sender_id>,
 *  username:<your_infobip_account_username>,
 *  password:<your_infobip_account_password>
 * };
 * 
 */
exports.init = function () {

  //merge options
  exports.options = _.merge({}, exports.defaults, exports.options);

  //obtain username and password
  const { username, password } = exports.options;

  //ensure username
  if (_.isEmpty(username)) {
    throw new Error('Missing Infobip Account Username');
  }

  //ensure password
  if (_.isEmpty(password)) {
    throw new Error('Missing Infobip Account Password');
  }

  //check for fake transport
  const useFakeTransport = exports.options.fake;

  //check for sync transport
  const useSyncTransport = exports.options.sync;

  //initiate node Infobip sender
  //@see {@link https://github.com/lykmapipo/bipsms#usage}
  if (!exports.infobip) {

    //use fake transport
    if (useFakeTransport) {
      exports.infobip = new Infobip({ fake: true });
    }

    //use actual transport
    else {
      exports.infobip = new Infobip({ username, password });
    }

  }

  //initialize worker processing queue
  //for internal usage
  if (!useFakeTransport && !useSyncTransport && !exports._queue) {
    exports._queue = kue.createQueue(exports.options);
  }

};


/**
 * @name queue
 * @description queue message instance for sending
 * @param  {Message} message valid instance of open311-message
 * @since 0.1.0
 * @public
 * @example
 *
 * const Message = require('open311-messages')(<your_options>);
 * const infobip = require('open311-infobip');
 * const message = new Message(options);
 * infobip.queue(message);
 * 
 */
exports.queue = function (message) {
  //ensure transport is initialize
  exports.init();

  //update message with transport details
  message.transport = exports.transport;
  message.queueName = exports.queueName;

  //ensure from is set-ed
  if (!message.from) {
    message.from = exports.options.from;
  }

  message.queue();

};


/**
 * @name _send
 * @description send sms message using infobip transport
 * @see {@link https://github.com/lykmapipo/bipsms#send-single-sms-to-multiple-destination}
 * @param  {Message}   message valid open311-message instance
 * @param  {Function} done    a callback to invoke on success or failure
 * @type {Function}
 * @since 0.1.0
 * @private
 */
exports._send = function (message, done) {

  //prepare infobip compliant sms payload
  const senderId = message.from ? message.from : exports.options.from;

  let payload = _.merge({}, {
    from: senderId,
    to: message.to,
    text: message.body
  });

  //ensure infobip is initializes
  exports.init();

  //TODO add support to retries times

  exports.infobip.sendSingleSMS(payload, function (error, response) {

    //TODO normalize infobip error message 

    //respond with error
    if (error) {
      done(error);
    }

    //respond with success result
    else {
      //merge default response details
      response = _.merge({}, { message: 'success' }, response);

      //TODO normalize infobip response
      done(null, response);
    }

  });

};


/**
 * @name send
 * @description implementation of open311 message send to allow send message
 *              as am sms using infobip 
 * @param  {Message}   message valid open311 message instance
 * @param  {Function} done    a callback to invoke on success or failure
 * @return {Object|Error}     infobip result or error during sending sms
 * @type {Function}
 * @since 0.1.0
 * @public
 * @example
 *
 * const Message = require('open311-messages')(<your_options>);
 * const infobip = require('open311-infobip');
 * const message = new Message(options);
 * infobip.send(message, function(error, response){
 *  ...
 * });
 */
exports.send = function (message, done) {

  //obtain message additional send options
  const options = message.options;

  //simulate send
  if (options && options.fake) {
    done(null, {
      message: 'success'
    });
  }

  //send actual sms using infobip
  else {
    exports._send(message, done);
  }

};


/**
 * @name stop
 * @description gracefull shutdown kue
 * @see {@link https://github.com/Automattic/kue#graceful-shutdown}
 * @param {Function} [done] a callback to invoke on succes or failure
 * @type {Function}
 * @since 0.1.0
 * @public
 * @example
 *
 * const infopib = require('open311-infobip');
 * infopib.stop();
 *  
 */
exports.stop = function stop(done) {

  //ensure callback
  if (!done && !_.isFunction(done)) {
    done = noop;
  }

  //ensure queue safe shutdown
  if (exports._queue) {
    if (exports._queue.shuttingDown) {
      done();
    } else {
      const { timeout } = exports.options;
      exports._queue.shutdown(timeout, done);
    }
  } else {
    done();
  }

};


/**
 * @name start
 * @description setup infobip message(s) worker and start to process `infobip` jobs
 * @type {Function}
 * @since 0.1.0
 * @public
 * @example
 *
 * const infobip = require('open311-infobip');
 * infobip.start();
 * 
 */
exports.start = function () {

  //ensure infobip is initialized
  exports.init();

  //start worker for processing jobs
  if (exports._queue) {
    //reference open311-message model
    const Message = mongoose.model('Message');

    //register worker for processing message 
    //and send it as sms
    const { concurrency } = exports.options;
    exports._queue.process(exports.queueName, concurrency, Message.process);

    //listen for process termination
    //and gracefull shutdown infobip worker queue
    process.once('SIGTERM', function ( /*signal*/ ) {
      exports._queue.shutdown(function ( /*error*/ ) {
        process.exit(0);
      });
    });
  }

};