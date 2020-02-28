'use strict';

const _ = require('lodash');
const { waterfall } = require('async');
const { mergeObjects } = require('@lykmapipo/common');
const { smssync } = require('smssync');

const { Message } = require('./message.model');
const transport = require('./transports/smssync');
const {
	TYPE_SMS,
	DIRECTION_INBOUND,
	PRIORITY_LOW,
	STATE_UNKNOWN,
	STATE_RECEIVED,
	SEND_MODE_PULL,
} = require('./common');

/**
 * @name onReceived
 * @description handle received sms from smssync device
 * @param {Object} sms valid smssync message
 * @param {Function} done a callback to invoke after receiving sms
 * @return {Object} a message to return to a sender
 * @see {@link http://smssync.ushahidi.com/developers/}
 * @private
 * @since  0.1.0
 * @version 0.1.0
 */
const onReceive = integration => (sms, done) => {
	// see http://smssync.ushahidi.com/developers/
	// for the structure of the sms send by smssync to be saved

	// hand over message for processing
	const receiveMessage = next => {
		// prepare sms processing
		const message = {
			type: TYPE_SMS,
			direction: DIRECTION_INBOUND,
			from: _.get(sms, 'from'),
			sender: _.get(sms, 'from'),
			to: _.get(sms, 'sent_to'),
			subject: _.get(sms, 'message'),
			body: _.get(sms, 'message'),
			hash: _.get(sms, 'hash'),
			transport: transport.name,
			priority: PRIORITY_LOW,
			state: STATE_RECEIVED,
			mode: SEND_MODE_PULL,
			metadata: { raw: sms },
		};
		if (integration && _.isFunction(integration.onMessageReceived)) {
			return integration.onMessageReceived(message, next);
		} else {
			return next(null, message);
		}
	};

	// TODO: save(or queue) message reply for later?

	const prepareReply = (message, next) => {
		// prepare auto reply
		const to = _.get(sms, 'from');
		const body = _.get(message, 'body');
		const shouldReply = !_.isEmpty(body) && body !== _.get(sms, 'message');
		const reply = {
			to: shouldReply ? to : undefined,
			message: shouldReply ? body : undefined,
			uuid: [to].join(':'),
		};
		// TODO: save reply for later status checks

		// continue with reply & message
		return next(null, reply);
	};

	// receive and process sms
	const tasks = [receiveMessage, prepareReply];
	return waterfall(tasks, done);
};

/**
 * @name onSend
 * @description obtain list of sms(message) to be send by smssync device
 * @param {Function} done a callback to invoke after receiving sms
 * @return {[Object]} collection of message to be send by smssync device
 * @see  {@link http://smssync.ushahidi.com/developers/}
 * @private
 * @since  0.1.0
 * @version 0.1.0
 */
const onSend = (/*integration*/) => done => {
	//TODO generate individual message to send
	//TODO update status=sent use update from smssync

	// find unsent message
	const findUnsent = next => {
		const criteria = {
			type: TYPE_SMS,
			mode: SEND_MODE_PULL,
			transport: transport.name,
			state: STATE_UNKNOWN,
		};
		Message.unsent(criteria, next);
	};

	// normalize unset message to sms
	const normalizeUnsent = (messages, next) => {
		const smss = [];

		_.forEach(messages, message => {
			const recipients = [].concat(message.to);
			_.forEach(recipients, to => {
				smss.push({
					to: to,
					message: message.body,
					uuid: [message._id, to].join(':'),
				});
			});
		});

		next(null, smss);
	};

	// return sms to send
	const tasks = [findUnsent, normalizeUnsent];
	return waterfall(tasks, done);
};

/* expose smssync integration router */
module.exports = exports = integration => {
	// initialize transport to get options
	transport.init();

	// compile smssync router
	// TODO: refactor to wireHandlers
	const handlers = {
		onReceive: onReceive(integration),
		onSend: onSend(integration),
	};

	const options = mergeObjects(transport.options, handlers, integration);
	const router = smssync(options);
	return router;
};
