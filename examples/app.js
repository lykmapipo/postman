'use strict';


/* dependencies */
const { worker, dispatcher, server } = require('@lykmapipo/postman')({
  baseDir: __dirname
});


/* start worker */
worker.start();


/* start dispatcher */
dispatcher.start();


/* start http server */
server.start();


/* dispatch work */
const job = dispatcher.send({
  from: {
    name: 'Bank Moon',
    email: 'bank.moon@fake.com',
    phone: '0715000000',
    shortcode: 'SPORTS'
  },
  subject: {
    en: 'Yatch Club Admission',
    sw: 'Kusajiliwa Yatch Club'
  },
  to: [{ name: 'Juma John', email: 'juma.john@fake.com', phone: '0715111111' }],
  to: [{ name: 'music' }, { name: 'deep house' }],
  segments: ['music', 'deep house'], //topics
  bcc: [{ name: 'Lucy Loo', email: 'lucy.loo@fake.com', phone: '0715222222' }],
  cc: [{ name: 'John Damina', email: 'john.damian@fake.com', phone: '0715333333' }],
  message: {
    en: 'Hello {name}, Welcome to our club.',
    sw: 'Mambo {name}, Karibu kwenye chama chetu.'
  },
  mime: 'text/html',
  channels: ['email', 'sms'],
  transports: [{ name: 'twilio', options: {} }, { name: 'sendgrid', options: {} }]
});


const job = dispatcher.send({
  from: {
    name: 'Bank Moon',
    email: 'bank.moon@fake.com',
    phone: '0715000000',
    shortcode: 'SPORTS'
  },
  to: { name: 'Juma John', email: 'juma.john@fake.com', phone: '0715111111' },
  title: 'Yatch Club Admission',
  message: 'Mambo {name}, Karibu kweneye chama chetu'
})


/* track job */
job.on('error', function (error) {

});


job.on('finish', function (job) {

});