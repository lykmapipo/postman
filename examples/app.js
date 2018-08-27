'use strict';


/* dependencies */
const { worker, SMS, Email } = require('@lykmapipo/postman');


/* queue: track job error */
/* see: https://github.com/Automattic/kue#job-events*/
worker.on('job failed', function (job, error) {
  console.log(error);
});


/* queue: track job finish */
/* see: https://github.com/Automattic/kue#job-events */
worker.on('job complete', function (id, result) {
  console.log(result);
});


/* start worker */
/* NOTE!: highly adviced to use worker process */
worker.start();


/* requeue unsent */
// SMS.requeue();
// Email.requeue();


/* send sms via default transport */
const sms = new SMS({ to: '255716898989', body: 'Hello' });
const smsJob = sms.queue(); //sms.send(done);


/* send email via default transport */
const email = new Email({ to: 'l@go.com', subject: 'Hello', body: 'Hello' });
const emailJob = email.queue(); //email.send(done);