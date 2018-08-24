# postman

[![Build Status](https://travis-ci.org/lykmapipo/postman.svg?branch=master)](https://travis-ci.org/lykmapipo/postman)
[![Dependency Status](https://img.shields.io/david/lykmapipo/postman.svg?style=flat)](https://david-dm.org/lykmapipo/postman)
[![npm version](https://badge.fury.io/js/%40lykmapipo%2Fpostman.svg)](https://badge.fury.io/js/@lykmapipo/postman)

collective notifications for nodejs

## Requirements

- NodeJS v10.1.0+
- MongoDB v4.0.1+
- Redis 4.0.11+
- mongoose v5.2.8+
- kue v0.11.6+

## Install
```sh
$ npm install --save mongoose kue @lykmapipo/postman
```

## Usage

### Main Process
```js
const { worker, SMS, Email } = require('@lykmapipo/postman');

/* send sms via default transport */
const sms = new SMS({ to: '255716898989', body: 'Hello' });
const smsJob = sms.queue(); //sms.send(done);


/* send email via default transport */
const email = new Email({ to: 'l@go.com', subject: 'Hello', body: 'Hello' });
const emailJob = email.queue(); //email.send(done);

```

### Worker Process(s)
```js
const { worker, SMS, Email } = require('@lykmapipo/postman');

/* start worker */
/* NOTE!: highly adviced to use worker process */
worker.start();

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

## Licence
The MIT License (MIT)

Copyright (c) 2018 lykmapipo & Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.