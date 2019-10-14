# postman(WIP)

[![Build Status](https://travis-ci.org/lykmapipo/postman.svg?branch=master)](https://travis-ci.org/lykmapipo/postman)
[![Dependencies Status](https://david-dm.org/lykmapipo/postman/status.svg?style=flat-square)](https://david-dm.org/lykmapipo/postman)

collective notifications for nodejs.

## Requirements

- [nodejs v8.11.1+](https://nodejs.org)
- [npm v5.6.0+](https://www.npmjs.com/)
- [Redis 4.0+](https://redis.io/)
- [MongoDB v3.4.10+](https://www.mongodb.com/)
- [mongoose v5.2.5+](https://github.com/Automattic/mongoose)

## Install
```sh
$ npm install --save redis kue mongoose @lykmapipo/postman
```

## Usage
```js
const { Email, SMS, Push } = require('@lykmapipo/postman');

//send email
const email = new Email({ to: 'hello@example.com', subject: 'Hello', body: 'Hello' });
email.send(cb);

//queue email
const email = new Email({ to: 'hello@example.com', subject: 'Hello', body: 'Hello' });
const sendEmailJob = email.queue();

...

//send sms
const sms = new SMS({ to: '255714182838', body: 'Hello' });
sms.send(cb);

...

//queue sms
const sms = new SMS({ to: '255714182838', body: 'Hello' });
const sendSMSJob = sms.queue();

...

//send push
const push = new Push({ to: 'f_T6rJL43xp:zBDA9obFwy24YR...', body: 'Hello' });
push.send(cb);

...

//queue push
const push = new Push({ to: 'f_T6rJL43xp:zBDA9obFwy24YR...', body: 'Hello' });
const sendPushJob = push.queue();

```

## Environment
In project root add `.env` file below.

```sh
# APP
DEBUG=true

# DATABASES
REDIS_URL=
MONGODB_URI=


# TRANSPORTS
DEFAULT_TRANSPORT_NAME=echo
DEFAULT_SMTP_TRANSPORT_NAME=smtp
DEFAULT_SMS_TRANSPORT_NAME=infobip-sms
DEFAULT_PUSH_TRANSPORT_NAME=fcm-push

# SENDER DEFAULTS
DEFAULT_SENDER_NAME=Notification
DEFAULT_SENDER_EMAIL=no-reply@example..com
DEFAULT_SENDER_SMS=15552
DEFAULT_SENDER_PUSH=588573631552

# TZ EGA SMS TRANSPORT
SMS_EGA_TZ_API_KEY=
SMS_EGA_TZ_API_USER=
SMS_EGA_TZ_API_URL=
SMS_EGA_TZ_DEFAULT_SENDER_ID=
SMS_EGA_TZ_DEFAULT_SERVICE_ID=
SMS_EGA_TZ_TEST_RECEIVER=


# INFOBIP SMS TRANSPORT
SMS_INFOBIP_DEFAULT_SENDER_ID=
SMS_INFOBIP_USERNAME=
SMS_INFOBIP_PASSWORD=
SMS_INFOBIP_TEST_RECEIVER=


# SMTP MAIL TRANSPORT
SMTP_HOST=
SMTP_PORT=
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_SECURE=
SMTP_FROM=
SMTP_TEST_RECEIVER=

# GOOGLE FCM(GCM) TRANSPORT
PUSH_FCM_API_KEY=
PUSH_FCM_TEST_REGISTRATION_TOKEN=
```

## Testing
* Clone this repository

* Install all development dependencies
```sh
$ npm install
```
* Then run test
```sh
$ npm test
```

## Contribute
It will be nice, if you open an issue first so that we can know what is going on, then, fork this repo and push in your ideas. Do not forget to add a bit of test(s) of what value you adding.

## License
The MIT License (MIT)

Copyright (c) lykmapipo & Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.