'use strict';


/* types */
exports.TYPE_SMS = 'SMS';
exports.TYPE_EMAIL = 'EMAIL';
exports.TYPE_PUSH = 'PUSH';
exports.TYPES = [exports.TYPE_SMS, exports.TYPE_EMAIL, exports.TYPE_PUSH];


/* mimes */
exports.MIME_TEXT = 'text/plain';
exports.MIME_HTML = 'text/html';
exports.MIMES = [exports.MIME_TEXT, exports.MIME_HTML];


/* priorities */
exports.PRIORITY_LOW = 'low';
exports.PRIORITY_NORMAL = 'normal';
exports.PRIORITY_MEDIUM = 'medium';
exports.PRIORITY_HIGH = 'high';
exports.PRIORITY_CRITICAL = 'critical';
exports.PRIORITIES = [
  exports.PRIORITY_LOW, exports.PRIORITY_NORMAL,
  exports.PRIORITY_MEDIUM, exports.PRIORITY_HIGH,
  exports.PRIORITY_CRITICAL
];


/* freeze exports */
Object.freeze(exports);