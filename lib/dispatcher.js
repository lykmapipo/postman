'use strict';


/**
 * @name worker
 * @description worker implementation for running actual sending logics on 
 * separate process & distribute
 * @param  {Object} valid kue configurations
 * @return {Object} mongoose kue worker definition
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 * @see {@link https://github.com/Automattic/kue}
 * @see {@link https://github.com/Automattic/kue#redis-connection-settings}
 * @example
 *
 * //obtain worker
 * const worker = require('mongoose-kue').worker;
 * 
 * worker.init({
 *    prefix: 'q',
 *    redis: {
 *      port: 1234,
 *      host: '10.0.50.20',
 *      auth: 'password',
 *      db: 3, // if provided select a non-default redis db
 *      options: {
 *        // see https://github.com/mranney/node_redis#rediscreateclient
 *      }
 *    }
 * });
 *
 *
 * //start worker to process background queued mongoose functions
 * worker.start();
 *  
 */


//global dependencies(or imports)
const _ = require('lodash');
const kue = require('kue');


//local constants
const noop = function () {};


//default options
exports.defaults = {

  //default queue name
  //see https://github.com/Automattic/kue#creating-jobs
  name: 'mongoose',

  //default queue shutdown delay
  //see https://github.com/Automattic/kue#graceful-shutdown
  timeout: 5000,

  //default worker concurrency
  //see https://github.com/Automattic/kue#processing-concurrency
  concurrency: 10,

  //valid mongoose instance
  mongoose: undefined,

  //redis connection
  //see https://github.com/Automattic/kue#redis-connection-settings
  redis: (process.env.REDIS_URL || { port: 6379, host: '127.0.0.1' })

};


//initialize options
exports.options = exports.defaults;


/**
 * @name init
 * @description initialize worker internals. If not initialize, worker queue will
 *              will be initialize with default options
 * @param  {Object} valid kue queue options
 * @author lally elias <lallyelias87@mail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @example
 *
 * const worker = require('mongoose-kue').worker;
 * worker.init();
 * 
 */
exports.init = function init(options) {

  //merge and ensure options
  exports.options = _.merge({}, exports.defaults, exports.options, options);

  //ensure worker queue
  if (!exports.queue) {
    exports.queue = kue.createQueue(exports.options);
  }

};


/**
 * @name stop
 * @description stop worker queue from processing jobs
 * @param  {Function} [done] callback to invoke on success or faailure
 * @author lally elias <lallyelias87@mail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @see {@link https://github.com/Automattic/kue#graceful-shutdown}
 * @example
 *
 * const worker = require('mongoose-kue').worker;
 * worker.stop();
 * 
 */
exports.stop = exports.reset = function (done) {

  //ensure callback
  if (!done && !_.isFunction(done)) {
    done = noop;
  }

  //ensure queue safe shutdown
  if (exports.queue) {

    //cross check if shutdown signal was already sent
    //and queue is on process of shutting down 
    if (exports.queue.shuttingDown) {

      //queue is on process of shutting down
      //continue
      done();

    }

    //continue with shutting down queue
    else {

      //obtain shutdown delay
      const { timeout } = exports.options;

      //issue shutdown command
      exports.queue.shutdown(timeout, function (error) {

        //reset queue when shutdown succeed
        if (!error) {
          exports.options = exports.defaults;
          exports.queue = undefined;
        }

        //continue
        done(error);

      });

    }

  }

  //there was no any queue in place
  //continue
  else {
    done();
  }

};


/**
 * @name process
 * @description implementation of job runner(worker fn) to process queue jobs
 * @author lally elias <lallyelias87@mail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @see {@link https://github.com/Automattic/kue#processing-jobs}
 * @private
 */
exports.process = function (job, done) {

  //obtain job data(or mongoose methods options)
  let data = _.merge({ context: {} }, job.data);

  //obtain model, method and instance id
  const { model, method, _id } = data.context;

  //fail job if no model found
  if (_.isEmpty(model)) {
    const error = new Error('Missing Model Name');
    return done(error);
  }

  //fail job if no method found
  if (_.isEmpty(method)) {
    const error = new Error('Missing Method Name');
    return done(error);
  }

  //hide out context from schema method options
  delete data.context;

  //obtain mongoose instance
  const { mongoose } = exports.options;

  //fail job if no mongoose instance found
  if (!mongoose) {
    const error = new Error('Missing mongoose Instance');
    return done(error);
  }

  //obtain mongoose model
  try {

    //fetch mongoose model
    const Model = mongoose.model(model);

    //ensure model
    if (!Model) {
      const error = new Error('Missing Model ' + model);
      return done(error);
    }

    //run static method
    if (_.isEmpty(_id)) {

      //obtain static schema method to run
      const fn = Model[method];

      //ensure there is static method to run
      if (!fn || !_.isFunction(fn)) {
        const error = new Error('Missing Schema Static Method ' + method);
        return done(error);
      }

      //obtain method length
      const length = fn.length;

      //invoke method
      if (length > 1) {
        //invoke with args
        fn.call(Model, data, done);
      } else {
        //invoke wih no args
        fn.call(Model, done);
      }

    }

    //run instance method
    else {

      //load mongoose instance
      Model
        .findById(_id)
        .exec(function (error, instance) {

          //fail on error
          if (error) {
            return done(error);
          }

          //fail if no instance found
          if (!instance) {
            const error = new Error('Missing ' + model + ' Instance ' + _id);
            return done(error);
          }

          //obtain schema instance method to run
          const fn = instance[method];

          //ensure there is instance method to run
          if (!fn || !_.isFunction(fn)) {
            const error = new Error('Missing ' + model +
              ' Instance Method ' + method);
            return done(error);
          }

          //obtain method length
          const length = fn.length;

          //invoke method
          if (length > 1) {
            //invoke with args
            fn.call(instance, data, done);
          } else {
            //invoke wih no args
            fn.call(instance, done);
          }

        });

    }

  }

  //handle mongoose schema error
  //fail fail if no schema registered for the model name
  catch (error) {

    //normalize missing schema error
    if (error.name === 'MissingSchemaError') {
      let error = new Error('Missing Model ' + model);
      return done(error);
    }

    return done(error);

  }

};


/**
 * @name start
 * @description start processing queued mongoose schema methods
 * @param {Object} [options] valid mongoose kue options
 * @author lally elias <lallyelias87@mail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @see {@link https://github.com/Automattic/kue#processing-jobs}
 * @see {@link https://github.com/Automattic/kue#processing-concurrency}
 * @example
 *
 * const worker = require('mongoose-kue').worker;
 * worker.init();
 * worker.start();
 * 
 */
exports.start = function (options) {

  //ensure worker queue is initialized
  exports.init(options);

  //start worker for processing jobs
  if (exports.queue) {

    //TODO process static and instance methods
    //TODO wrap method with outer done

    //obtain worker configuration options
    const { concurrency, name } = exports.options;

    //register worker process for handling queue jobs
    exports.queue.process(name, concurrency, exports.process);

    //listen for process termination
    //and gracefull shutdown worker queue
    process.once('SIGTERM', function ( /*signal*/ ) {

      //signal worker queue to shutdown
      exports.stop(function (error) {

        //exit worker process
        if (!error) {
          process.exit(0);
        }

        //throw shutdown failure
        else {
          throw error;
        }

      });

    });

  }

};