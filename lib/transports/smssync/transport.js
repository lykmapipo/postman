'use strict';

const _ = require('lodash');

const { TYPE_SMS, SEND_MODE_PULL, STATE_UNKNOWN } = require('../../common');

const { name: Name } = require('./index');

/**
 * @name findUnsetMessage
 * @description find unset Messages
 * @param  {Function} next a callback to invoke after finding unsent message
 * @return {[Object]} collection of message to be send by smssync device
 * @see  {@link http://smssync.ushahidi.com/developers/}
 * @private
 * @since  0.1.0
 * @version 0.1.0
 */

exports.findUnsetMessage = Message => next => {
  //TODO: update status=sent use update
  const criteria = {
    type: TYPE_SMS,
    mode: SEND_MODE_PULL,
    transport: Name,
    state: STATE_UNKNOWN,
  };

  Message.unsent(criteria, next);
};

/**
 * @name normalize
 * @description normalize message
 * @param  {Function} next a callback to invoke after normalizing the messages
 * @return {[Object]} collection of message to be send by smssync device
 * @see  {@link http://smssync.ushahidi.com/developers/}
 * @private
 * @since  0.1.0
 * @version 0.1.0
 */
exports.normalize = (messages, next) => {
  const smss = [];
  _.forEach(messages, message => {
    _.forEach([].concat(message.to), to => {
      smss.push({
        to: to,
        message: message.body,
        uuid: [message._id, to].join(':'),
      });
    });
  });

  next(null, smss);
};
