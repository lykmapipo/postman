'use strict';

/**
 * @apiDefine Message Message
 *
 * @apiDescription A discrete unit of communication intended by the
 * source(sender) for consumption by some recipient(receiver) or group of
 * recipients(receivers).
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since  0.1.0
 * @version 0.1.0
 * @public
 */

/**
 * @apiDefine Message
 * @apiSuccess {String} _id Unique message identifier
 * @apiSuccess {String} [type] message type i.e SMS, e-mail, push etc
 * @apiSuccess {String} [mime] message mime type i.e text/plain, text/html etc
 * @apiSuccess {String} [direction] message direction i.e received or sending
 * @apiSuccess {String} [state] message state i.e Received, Sent, Queued etc
 * @apiSuccess {String} [mode] message transport send mode i.e Pull or Push etc
 * @apiSuccess {String} [bulk] unique identifier used to track group messages
 * which have been send together.
 * @apiSuccess {String} [sender] sender of the message i.e e-mail sender,
 * message sender etc
 * @apiSuccess {String[]} [to] receiver(s) of the message i.e e-mail receiver,
 * message receiver etc
 * @apiSuccess {String[]} [cc] receiver(s) of the carbon copy of the message
 * i.e e-mail cc receiver
 * @apiSuccess {String[]} [bcc] receiver(s) of the blind carbon copy of the
 * message i.e e-mail cc receiver
 * @apiSuccess {String} [subject] subject of the message i.e email title etc
 * @apiSuccess {String} [body] ontent of the message to be conveyed to
 * receiver(s) e.g Hello
 * @apiSuccess {Date} [createdAt] Date when message was created
 * @apiSuccess {Date} [updatedAt] Date when message was last updated
 *
 */

/**
 * @apiDefine Messages
 * @apiSuccess {Object[]} data List of messages
 * @apiSuccess {String} data._id Unique message identifier
 * @apiSuccess {String} [data.type] message type i.e SMS, e-mail, push etc
 * @apiSuccess {String} [data.mime] message mime type i.e text/plain,
 * text/html etc
 * @apiSuccess {String} [data.direction] message direction i.e received or
 * sending
 * @apiSuccess {String} [data.state] message state i.e Received, Sent,
 * Queued etc
 * @apiSuccess {String} [data.mode] message transport send mode i.e Pull or
 * Push etc
 * @apiSuccess {String} [data.bulk] unique identifier used to track group
 * messages which have been send together.
 * @apiSuccess {String} [data.sender] sender of the message i.e e-mail
 * sender, message sender etc
 * @apiSuccess {String[]} [data.to] receiver(s) of the message i.e e-mail
 * receiver, message receiver etc
 * @apiSuccess {String[]} [data.cc] receiver(s) of the carbon copy of the
 * message i.e e-mail cc receiver
 * @apiSuccess {String[]} [data.bcc] receiver(s) of the blind carbon copy of
 * the message i.e e-mail cc receiver
 * @apiSuccess {String} [data.subject] subject of the message i.e email
 * title etc
 * @apiSuccess {String} [data.body] ontent of the message to be conveyed to
 * receiver(s) e.g Hello
 * @apiSuccess {Date} [data.createdAt] Date when message was created
 * @apiSuccess {Date} [data.updatedAt] Date when message was last updated
 * @apiSuccess {Number} total Total number of message
 * @apiSuccess {Number} size Number of messages returned
 * @apiSuccess {Number} limit Query limit used
 * @apiSuccess {Number} skip Query skip/offset used
 * @apiSuccess {Number} page Page number
 * @apiSuccess {Number} pages Total number of pages
 * @apiSuccess {Date} lastModified Date and time at which latest message
 * was last modified
 *
 */

/**
 * @apiDefine MessageSuccessResponse
 * @apiSuccessExample {json} Success-Response:
 * {
 *   _id: "5d05e46ea97493202b17d3ca",
 *   type: "EMAIL",
 *   mime: "text/plain",
 *   direction: "Inbound",
 *   state: "Unknown",
 *   mode: "Push",
 *   bulk: "718f7603-7dcb-4b15-8755-7e53d6236082",
 *   sender: "federico24@gmail.com",
 *   to: ["elyse_wehner34@hotmail.com"],
 *   cc: ["jonathan_labadie87@hotmail.com"],
 *   bcc: ["kelton.sipes13@yahoo.com"],
 *   subject: "Minima aut facilis atque sed et.",
 *   body: "Omnis et natus delectus eveniet ut rerum minus.",
 *  }
 *
 */

/**
 * @apiDefine MessagesSuccessResponse
 * @apiSuccessExample {json} Success-Response:
 * {
 *   "data": [{
 *    _id: "5d05e46ea97493202b17d3ca",
 *    type: "EMAIL",
 *    mime: "text/plain",
 *    direction: "Inbound",
 *    state: "Unknown",
 *    mode: "Push",
 *    bulk: "718f7603-7dcb-4b15-8755-7e53d6236082",
 *    sender: "federico24@gmail.com",
 *    to: ["elyse_wehner34@hotmail.com"],
 *    cc: ["jonathan_labadie87@hotmail.com"],
 *    bcc: ["kelton.sipes13@yahoo.com"],
 *    subject: "Minima aut facilis atque sed et.",
 *    body: "Omnis et natus delectus eveniet ut rerum minus.",
 *   }],
 *   "total": 20,
 *   "size": 10,
 *   "limit": 10,
 *   "skip": 0,
 *   "page": 1,
 *   "pages": 2,
 *   "lastModified": "2018-07-29T10:11:38.111Z"
 * }
 *
 */

/* dependencies */
const { getString } = require('@lykmapipo/env');
const {
  getFor,
  schemaFor,
  downloadFor,
  getByIdFor,
  postFor,
  patchFor,
  putFor,
  deleteFor,
  Router,
} = require('@lykmapipo/express-rest-actions');
const Message = require('./message.model');

/* constants */
const API_VERSION = getString('API_VERSION', '1.0.0');
const PATH_SINGLE = '/messages/:id';
const PATH_LIST = '/messages';
const PATH_EXPORT = '/messages/export';
const PATH_SCHEMA = '/messages/schema/';

/* declarations */
const router = new Router({
  version: API_VERSION,
});

/**
 * @api {get} /messages List Messages
 * @apiVersion 1.0.0
 * @apiName GetMessages
 * @apiGroup Message
 * @apiDescription Returns a list of messages
 * @apiUse RequestHeaders
 * @apiUse Messages
 *
 * @apiUse RequestHeadersExample
 * @apiUse MessagesSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.get(
  PATH_LIST,
  getFor({
    get: (options, done) => Message.get(options, done),
  })
);

/**
 * @api {get} /messages/schema Get Message Schema
 * @apiVersion 1.0.0
 * @apiName GetMessageSchema
 * @apiGroup Message
 * @apiDescription Returns message json schema definition
 * @apiUse RequestHeaders
 */
router.get(
  PATH_SCHEMA,
  schemaFor({
    getSchema: (query, done) => {
      const jsonSchema = Message.jsonSchema();
      return done(null, jsonSchema);
    },
  })
);

/**
 * @api {get} /messages/export Export Messages
 * @apiVersion 1.0.0
 * @apiName ExportMessages
 * @apiGroup Message
 * @apiDescription Export messages as csv
 * @apiUse RequestHeaders
 */
router.get(
  PATH_EXPORT,
  downloadFor({
    download: (options, done) => {
      const fileName = `message_exports_${Date.now()}.csv`;
      const readStream = Message.exportCsv(options);
      return done(null, { fileName, readStream });
    },
  })
);

/**
 * @api {post} /messages Create New Message
 * @apiVersion 1.0.0
 * @apiName PostMessage
 * @apiGroup Message
 * @apiDescription Create new message
 * @apiUse RequestHeaders
 * @apiUse Message
 *
 * @apiUse RequestHeadersExample
 * @apiUse MessageSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.post(
  PATH_LIST,
  postFor({
    post: (body, done) => Message.post(body, done), // TODO create & send
  })
);

/**
 * @api {get} /messages/:id Get Existing Message
 * @apiVersion 1.0.0
 * @apiName GetMessage
 * @apiGroup Message
 * @apiDescription Get existing message
 * @apiUse RequestHeaders
 * @apiUse Message
 *
 * @apiUse RequestHeadersExample
 * @apiUse MessageSuccessResponse
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.get(
  PATH_SINGLE,
  getByIdFor({
    getById: (options, done) => Message.getById(options, done),
  })
);

/**
 * @api {patch} /messages/:id Patch Existing Message
 * @apiVersion 1.0.0
 * @apiName PatchMessage
 * @apiGroup Message
 * @apiDescription Patch existing message
 * @apiUse RequestHeaders
 * @apiUse Message
 *
 * @apiUse RequestHeadersExample
 * @apiUse MessageSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.patch(PATH_SINGLE, patchFor());

/**
 * @api {put} /messages/:id Put Existing Message
 * @apiVersion 1.0.0
 * @apiName PutMessage
 * @apiGroup Message
 * @apiDescription Put existing message
 * @apiUse RequestHeaders
 * @apiUse Message
 *
 * @apiUse RequestHeadersExample
 * @apiUse MessageSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.put(PATH_SINGLE, putFor());

/**
 * @api {delete} /messages/:id Delete Existing Message
 * @apiVersion 1.0.0
 * @apiName DeleteMessage
 * @apiGroup Message
 * @apiDescription Delete existing message
 * @apiUse RequestHeaders
 * @apiUse Message
 *
 * @apiUse RequestHeadersExample
 * @apiUse MessageSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.delete(
  PATH_SINGLE,
  deleteFor({
    del: (options, done) => Message.del(options, done),
    soft: true,
  })
);

/* expose message router */
module.exports = exports = router;
