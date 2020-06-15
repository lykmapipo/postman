'use strict';

/* dependencies */
const _ = require('lodash');
const kue = require('kue');
const { listen } = require('@lykmapipo/kue-common');
const { worker } = require('mongoose-kue');
const common = require('./lib/common');
const { Message, Email, SMS, Push } = require('./lib/message.model');
const messageRouter = require('./lib/message.http.router');
const Campaign = require('./lib/campaign.model');
const campaignRouter = require('./lib/campaign.http.router');
const smssyncRouterFactory = require('./lib/smssync.http.router.factory');
const shortcuts = require('./lib/shortcuts');

/**
 * @module postman
 * @name postman
 * @description collective notifications for nodejs
 * @param {Object} integration valid integration options
 * @param {Function} [integration.fetchContacts] valid fetch account
 * implementation
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 1.0.0
 * @public
 */
function postman(integration) {
	//ensure integration integration
	if (integration && _.isFunction(integration.fetchContacts)) {
		const { fetchContacts } = integration;
		Campaign.fetchContacts = (criteria, done) => fetchContacts(criteria, done);
	}

	// initialize smssync http router
	postman.smssyncRouter = smssyncRouterFactory(integration);

	// return initialized postman
	return postman;
}

/* export postman campaign model */
postman.Campaign = Campaign;

/* export postman message http router */
postman.campaignRouter = campaignRouter;

/* export postman message model */
postman.Message = Message;

/* export postman message http router */
postman.messageRouter = messageRouter;

/* export postman email message factory */
postman.Email = Email;

/* export postman sms message factory */
postman.SMS = SMS;

/* export postman push message factory */
postman.Push = Push;

/* export postman utils */
postman.utils = common;

/* export postman worker */
postman.worker = worker;

/* export postman http server */
postman.httpServer = kue.app;

/* export http server listen */
postman.listen = listen;

/* export postman worker start */
postman.start = worker.start;

/* export common constants */
_.forEach(common, (value, key) => {
	postman[key] = value;
});

/* export common shortcut */
_.forEach(shortcuts, (value, key) => {
	postman[key] = value;
});

/* export postman */
module.exports = exports = postman;
