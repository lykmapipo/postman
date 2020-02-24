'use strict';

/* dependencies */
const { sortedUniq } = require('@lykmapipo/common');
const { getStrings } = require('@lykmapipo/env');
const { createSubSchema } = require('@lykmapipo/mongoose-common');
const { toE164 } = require('@lykmapipo/phone');

/**
 * @name toE164
 * @description format provided mobile phone number to E.164 format
 * @param {String} phoneNumber a mobile phone number to be formatted
 * @param {String} [country] 2 or 3 letter ISO country code
 * @return {String} E.164 formated phone number without leading plus sign
 * @see {@link https://en.wikipedia.org/wiki/E.164|e.164}
 * @author lally elias <lallyelias87@mail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */
exports.toE164 = toE164;

/**
 * @description contact sub schema
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
exports.Contact = createSubSchema({
  name: {
    type: String,
    trim: true,
    index: true,
    searchable: true,
    taggable: true,
    fake: { generator: 'name', type: 'findName' },
  },
  mobile: {
    type: String,
    trim: true,
    index: true,
    searchable: true,
    taggable: true,
    fake: faker => faker.helpers.replaceSymbolWithNumber('255714######'),
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    index: true,
    searchable: true,
    taggable: true,
    fake: { generator: 'internet', type: 'email' },
  },
  pushToken: {
    //TODO use array
    type: String,
    trim: true,
    index: true,
    searchable: true,
    taggable: true,
    fake: { generator: 'random', type: 'uuid' },
  },
});

/**
 * @description campaign and message form
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
exports.FORM_ALERT = 'Alert';
exports.FORM_INFORMATION = 'Information';
exports.FORM_WARNING = 'Warning';
exports.FORM_ANNOUNCEMENT = 'Announcement';
exports.FORM_REMINDER = 'Reminder';
exports.FORMS = sortedUniq([
  exports.FORM_ALERT,
  exports.FORM_INFORMATION,
  exports.FORM_WARNING,
  exports.FORM_ANNOUNCEMENT,
  exports.FORM_REMINDER,
  ...getStrings('MESSAGE_FORMS', []),
]);

/**
 * @description campaign and message types
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
exports.TYPE_SMS = 'SMS';
exports.TYPE_EMAIL = 'EMAIL';
exports.TYPE_PUSH = 'PUSH';
exports.TYPES = [exports.TYPE_SMS, exports.TYPE_EMAIL, exports.TYPE_PUSH];

/**
 * @description campaign and message send channel(i.e transports or methods)
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
exports.CHANNEL_SMS = 'SMS';
exports.CHANNEL_EMAIL = 'EMAIL';
exports.CHANNEL_PUSH = 'PUSH';
exports.CHANNELS = [
  exports.CHANNEL_SMS,
  exports.CHANNEL_EMAIL,
  exports.CHANNEL_PUSH,
];

/**
 * @description campaign and message send channel(i.e transports or methods)
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
exports.STATE_RECEIVED = 'Received';
exports.STATE_UNKNOWN = 'Unknown';
exports.STATE_SENT = 'Sent';
exports.STATE_QUEUED = 'Queued';
exports.STATE_DELIVERED = 'Delivered';
exports.STATE_FAILED = 'Failed';
exports.STATES = [
  exports.STATE_RECEIVED,
  exports.STATE_UNKNOWN,
  exports.STATE_SENT,
  exports.STATE_QUEUED,
  exports.STATE_DELIVERED,
  exports.STATE_FAILED,
];

/**
 * @description campaign and message audiences
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
exports.AUDIENCE_REPORTERS = 'Reporters';
exports.AUDIENCE_CUSTOMERS = 'Customers';
exports.AUDIENCE_SUBSCRIBERS = 'Subscribers';
exports.AUDIENCE_EMPLOYEES = 'Employees';
exports.AUDIENCE_ALL = 'All';
exports.AUDIENCES = sortedUniq([
  exports.AUDIENCE_REPORTERS,
  exports.AUDIENCE_CUSTOMERS,
  exports.AUDIENCE_SUBSCRIBERS,
  exports.AUDIENCE_EMPLOYEES,
  exports.AUDIENCE_ALL,
  ...getStrings('MESSAGE_AUDIENCES', []),
]);

/**
 * @description messages priorities
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
exports.PRIORITY_LOW = 'low';
exports.PRIORITY_NORMAL = 'normal';
exports.PRIORITY_MEDIUM = 'medium';
exports.PRIORITY_HIGH = 'high';
exports.PRIORITY_CRITICAL = 'critical';
exports.PRIORITIES = [
  exports.PRIORITY_LOW,
  exports.PRIORITY_NORMAL,
  exports.PRIORITY_MEDIUM,
  exports.PRIORITY_HIGH,
  exports.PRIORITY_CRITICAL,
];

/**
 * @description message directions
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
exports.DIRECTION_OUTBOUND = 'Outbound';
exports.DIRECTION_INBOUND = 'Inbound';
exports.DIRECTIONS = [exports.DIRECTION_INBOUND, exports.DIRECTION_OUTBOUND];

/**
 * @description transport send modes
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
exports.SEND_MODE_PULL = 'Pull';
exports.SEND_MODE_PUSH = 'Push';
exports.SEND_MODES = [exports.SEND_MODE_PULL, exports.SEND_MODE_PUSH];

/**
 * @description message mime types. Used to tell what is mime of the
 * message body.
 * It used mostly in smtp transports to decide which content to
 * send i.e email or text.
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
exports.MIME_TEXT = 'text/plain';
exports.MIME_HTML = 'text/html';
exports.MIMES = [exports.MIME_TEXT, exports.MIME_HTML];

/* messages state */

//state assigned to a message received from a transport
exports.STATE_RECEIVED = 'Received';

//state assigned to message to be sent by a transport mainly poll transport
exports.STATE_UNKNOWN = 'Unknown';

//state assigned to a message once a poll transport receive a message to send
exports.STATE_SENT = 'Sent';

//state assigned to a message after receiving acknowledge from poll transport
//that message have been queued for sending
exports.STATE_QUEUED = 'Queued';

//state assigned to a message once successfully delivered to a receiver(s)
exports.STATE_DELIVERED = 'Delivered';

//state assigned to a message once transport failed to deliver
exports.STATE_FAILED = 'Failed';

//states
exports.STATES = [
  exports.STATE_RECEIVED,
  exports.STATE_UNKNOWN,
  exports.STATE_SENT,
  exports.STATE_QUEUED,
  exports.STATE_DELIVERED,
  exports.STATE_FAILED,
];
