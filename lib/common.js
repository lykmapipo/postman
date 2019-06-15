'use strict';

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
exports.FORMS = [
  exports.FORM_ALERT, exports.FORM_INFORMATION,
  exports.FORM_WARNING, exports.FORM_ANNOUNCEMENT,
  exports.FORM_REMINDER
];

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
exports.TYPES = [
  exports.TYPE_SMS, exports.TYPE_EMAIL, exports.TYPE_PUSH
];

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
  exports.CHANNEL_SMS, exports.CHANNEL_EMAIL, exports.CHANNEL_PUSH
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
  exports.STATE_RECEIVED, exports.STATE_UNKNOWN,
  exports.STATE_SENT, exports.STATE_QUEUED,
  exports.STATE_DELIVERED, exports.STATE_FAILED
];