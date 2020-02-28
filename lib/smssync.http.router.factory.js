'use strict';

const _ = require('lodash');
const { waterfall, parallel } = require('async');
const { mergeObjects } = require('@lykmapipo/common');
const { smssync } = require('smssync');

const { Message } = require('./message.model');
const transport = require('./transports/smssync');
const {
	TYPE_SMS,
	DIRECTION_INBOUND,
	PRIORITY_LOW,
	STATE_UNKNOWN,
	STATE_QUEUED,
	STATE_RECEIVED,
	STATE_DELIVERED,
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
 * @see {@link http://smssync.ushahidi.com/developers/}
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
		return Message.unsent(criteria, next);
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
		return next(null, smss);
	};

	// return sms to send
	const tasks = [findUnsent, normalizeUnsent];
	return waterfall(tasks, done);
};

/**
 * @name onSent
 * @description received queued sms from smssync device
 * @param {[String]} queued collection of message(sms) uuids from smssync
 * device
 * @param {Function} done a callback to invoke after receiving sms
 * @return {[Object]} collection of message to be send by smssync device
 * @see {@link http://smssync.ushahidi.com/developers/}
 * @private
 * @since  0.1.0
 * @version 0.1.0
 */
const onSent = (/*integration*/) => (queued, done) => {
	// obtained queued sms ids
	// TODO: mapUniqBy
	let ids = _.map(queued, sms => {
		return _.first(sms.split(':')); // obtain sms id
	});
	ids = _.uniq(ids);

	// find existing messages by ids
	const findMessages = next => {
		const criteria = {
			type: TYPE_SMS,
			mode: SEND_MODE_PULL,
			transport: transport.name,
			// state: STATE_UNKNOWN || STATE_SENT,
			_id: { $in: ids },
		};
		return Message.find(criteria, next);
	};

	// update messages state to queued
	const updateStatesToQueued = (messages, next) => {
		const updates = _.map(messages, message => {
			// update message state to queued
			return then => {
				const time = new Date();
				message.state = STATE_QUEUED; // TODO: state = STATE_SENT?
				message.sentAt = time; // TODO: update onSend
				message.queuedAt = time;
				message.save((error, saved) => {
					// TODO: handle error & ignore
					return then(error, saved);
				});
			};
		});

		// run updates in parallel
		return parallel(updates, next);
	};

	// prepare queued messages uuids
	const returnProcessedUUIDs = (messages, next) => {
		const uuids = [];
		_.forEach(messages, message => {
			_.forEach([].concat(message.to), to => {
				uuids.push([message._id, to].join(':'));
			});
		});
		return next(null, uuids);
	};

	// update message status to queued(and sent?)
	const tasks = [findMessages, updateStatesToQueued, returnProcessedUUIDs];
	return waterfall(tasks, done);
};

/**
 * @name onQueued
 * @description obtain message(sms) waiting delivery report and send them to
 * smssync device
 * @param {Function} done a callback to invoke on success or failure
 * @return {[Object]} collection of message uuids waiting delivery status
 * from smssync device
 * @see {@link http://smssync.ushahidi.com/developers/}
 * @private
 * @since  0.1.0
 * @version 0.1.0
 */
const onQueued = (/*integration*/) => done => {
	// obtain queued messages
	const findUndelivered = next => {
		const criteria = {
			type: TYPE_SMS,
			mode: SEND_MODE_PULL,
			transport: transport.name,
			state: STATE_QUEUED,
		};
		return Message.find(criteria, next);
	};

	// prepare undelivered sms uuids
	const returnUndeliveredUuids = (messages, next) => {
		const uuids = [];
		_.forEach(messages, message => {
			_.forEach([].concat(message.to), to => {
				uuids.push([message._id, to].join(':'));
			});
		});
		return next(null, uuids);
	};

	// return message wait delivery
	const tasks = [findUndelivered, returnUndeliveredUuids];
	return waterfall(tasks, done);
};

/**
 * @name onDelivered
 * @description receive delivery status from smssync device
 * @param {Function} done a callback to invoke on success or failure
 * @return {[Object]} collection of message
 * @see {@link http://smssync.ushahidi.com/developers/}
 * @private
 * @since  0.1.0
 * @version 0.1.0
 */
const onDelivered = (/*integration*/) => (delivered, done) => {
	// obtained delivered sms ids
	let ids = _.map(delivered, report => {
		let uuid = report.uuid || '';
		return _.first(uuid.split(':')); // obtain sms id
	});
	ids = _.uniq(_.compact(ids));

	const findMessages = next => {
		const criteria = {
			type: TYPE_SMS,
			mode: SEND_MODE_PULL,
			transport: transport.name,
			_id: { $in: ids }, //TODO use status=queued
		};
		return Message.find(criteria, next);
	};

	// update messages state to delivered
	const updateStatesToDelivered = (messages, next) => {
		const updates = _.map(messages, message => {
			// update message state to delivered
			return then => {
				message.state = STATE_DELIVERED;
				message.deliveredAt = new Date();
				message.save((error, saved) => {
					return then(error, saved);
				});
			};
		});

		// run updates in parallel
		return parallel(updates, next);
	};

	// update message status to delivered
	const tasks = [findMessages, updateStatesToDelivered];
	waterfall(tasks, done);
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
		onSent: onSent(integration),
		onQueued: onQueued(integration),
		onDelivered: onDelivered(integration),
	};

	const options = mergeObjects(transport.options, handlers, integration);
	const router = smssync(options);
	return router;
};
