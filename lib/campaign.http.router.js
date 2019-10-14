'use strict';

/**
 * @apiDefine Campaign Campaign
 *
 * @apiDescription A representation of communication intended by the
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
 * @apiDefine Campaign
 * @apiSuccess {String} _id Unique campaign identifier
 * @apiSuccess {String} [form] campaign form i.e Alert, Announcement etc
 * @apiSuccess {String} title title of the campaign i.e email title etc
 * @apiSuccess {Object} sender sender of the campaign messages i.e e-mail
 * sender, sms sender etc.
 * @apiSuccess {String} [sender.name] sender name
 * @apiSuccess {String} [sender.email] sender email address
 * @apiSuccess {String} [sender.mobile] sender mobile phone number or sender id
 * @apiSuccess {String} subject subject of the campaign i.e email title etc
 * @apiSuccess {String} message content of the campaign to be conveyed to
 * receiver(s) or recepient(s) as message body.
 * @apiSuccess {String[]} [audiences] Target audiences for a campaign
 * e.g SMS, EMAIL etc.
 * @apiSuccess {String[]} [channels] Allowed channels to be used to send a
 * campaign e.g SMS, EMAIL etc.
 * @apiSuccess {Object} [criteria] Application specific conditions to query
 * for recipients.
 * @apiSuccess {Object} [statistics] General campaign summary for sent,
 * delivery, failed etc. messages.
 * @apiSuccess {Date} [createdAt] Date when campaign was created
 * @apiSuccess {Date} [updatedAt] Date when campaign was last updated
 *
 */

/**
 * @apiDefine Campaigns
 * @apiSuccess {Object[]} data List of campaigns
 * @apiSuccess {String} [data.form] campaign form i.e Alert, Announcement etc
 * @apiSuccess {String} data.title title of the campaign i.e email title etc
 * @apiSuccess {Object} data.sender sender of the campaign messages i.e e-mail
 * sender, sms sender etc.
 * @apiSuccess {String} [data.sender.name] sender name
 * @apiSuccess {String} [data.sender.email] sender email address
 * @apiSuccess {String} [data.sender.mobile] sender mobile phone number or
 * sender id
 * @apiSuccess {String} data.subject subject of the campaign i.e email title etc
 * @apiSuccess {String} data.message content of the campaign to be conveyed to
 * receiver(s) or recepient(s) as message body.
 * @apiSuccess {String[]} [data.audiences] Target audiences for a campaign
 * e.g SMS, EMAIL etc.
 * @apiSuccess {String[]} [data.channels] Allowed channels to be used to send a
 * campaign e.g SMS, EMAIL etc.
 * @apiSuccess {Object} [data.criteria] Application specific conditions to query
 * for recipients.
 * @apiSuccess {Object} [data.statistics] General campaign summary for sent,
 * delivery, failed etc. messages.
 * @apiSuccess {Date} [data.createdAt] Date when campaign was created
 * @apiSuccess {Date} [data.updatedAt] Date when campaign was last updated
 * @apiSuccess {Number} total Total number of campaign
 * @apiSuccess {Number} size Number of campaigns returned
 * @apiSuccess {Number} limit Query limit used
 * @apiSuccess {Number} skip Query skip/offset used
 * @apiSuccess {Number} page Page number
 * @apiSuccess {Number} pages Total number of pages
 * @apiSuccess {Date} lastModified Date and time at which latest campaign
 * was last modified
 *
 */

/**
 * @apiDefine CampaignSuccessResponse
 * @apiSuccessExample {json} Success-Response:
 * {
 *   _id: "5d05e46ea97493202b17d3ca",
 *   form: "Alert",
 *   sender:{ "email": "federico24@gmail.com" },
 *   title: "Minima aut facilis atque sed et.",
 *   subject: "Minima aut facilis atque sed et.",
 *   message: "Omnis et natus delectus eveniet ut rerum minus.",
 * }
 *
 */

/**
 * @apiDefine CampaignsSuccessResponse
 * @apiSuccessExample {json} Success-Response:
 * {
 *   "data": [{
 *     _id: "5d05e46ea97493202b17d3ca",
 *     form: "Alert",
 *     sender:{ "email": "federico24@gmail.com" },
 *     title: "Minima aut facilis atque sed et.",
 *     subject: "Minima aut facilis atque sed et.",
 *     message: "Omnis et natus delectus eveniet ut rerum minus.",
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
const Campaign = require('./campaign.model');

/* constants */
const API_VERSION = getString('API_VERSION', '1.0.0');
const PATH_SINGLE = '/campaigns/:id';
const PATH_LIST = '/campaigns';
const PATH_EXPORT = '/campaigns/export';
const PATH_SCHEMA = '/campaigns/schema/';

/* declarations */
const router = new Router({
  version: API_VERSION,
});

/**
 * @api {get} /campaigns List Campaigns
 * @apiVersion 1.0.0
 * @apiName GetCampaigns
 * @apiGroup Campaign
 * @apiDescription Returns a list of campaigns
 * @apiUse RequestHeaders
 * @apiUse Campaigns
 *
 * @apiUse RequestHeadersExample
 * @apiUse CampaignsSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.get(
  PATH_LIST,
  getFor({
    get: (options, done) => Campaign.get(options, done),
  })
);

/**
 * @api {get} /campaigns/schema Get Campaign Schema
 * @apiVersion 1.0.0
 * @apiName GetCampaignSchema
 * @apiGroup Campaign
 * @apiDescription Returns campaign json schema definition
 * @apiUse RequestHeaders
 */
router.get(
  PATH_SCHEMA,
  schemaFor({
    getSchema: (query, done) => {
      const jsonSchema = Campaign.jsonSchema();
      return done(null, jsonSchema);
    },
  })
);

/**
 * @api {get} /campaigns/export Export Campaigns
 * @apiVersion 1.0.0
 * @apiName ExportCampaigns
 * @apiGroup Campaign
 * @apiDescription Export campaigns as csv
 * @apiUse RequestHeaders
 */
router.get(
  PATH_EXPORT,
  downloadFor({
    download: (options, done) => {
      const fileName = `campaign_exports_${Date.now()}.csv`;
      const readStream = Campaign.exportCsv(options);
      return done(null, { fileName, readStream });
    },
  })
);

/**
 * @api {post} /campaigns Create New Campaign
 * @apiVersion 1.0.0
 * @apiName PostCampaign
 * @apiGroup Campaign
 * @apiDescription Create new campaign
 * @apiUse RequestHeaders
 * @apiUse Campaign
 *
 * @apiUse RequestHeadersExample
 * @apiUse CampaignSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.post(
  PATH_LIST,
  postFor({
    post: (body, done) => new Campaign(body).queue(done),
  })
);

/**
 * @api {get} /campaigns/:id Get Existing Campaign
 * @apiVersion 1.0.0
 * @apiName GetCampaign
 * @apiGroup Campaign
 * @apiDescription Get existing campaign
 * @apiUse RequestHeaders
 * @apiUse Campaign
 *
 * @apiUse RequestHeadersExample
 * @apiUse CampaignSuccessResponse
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.get(
  PATH_SINGLE,
  getByIdFor({
    getById: (options, done) => Campaign.getById(options, done),
  })
);

/**
 * @api {patch} /campaigns/:id Patch Existing Campaign
 * @apiVersion 1.0.0
 * @apiName PatchCampaign
 * @apiGroup Campaign
 * @apiDescription Patch existing campaign
 * @apiUse RequestHeaders
 * @apiUse Campaign
 *
 * @apiUse RequestHeadersExample
 * @apiUse CampaignSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.patch(
  PATH_SINGLE,
  patchFor({
    patch: (options, done) => Campaign.patch(options, done), // TODO resend
  })
);

/**
 * @api {put} /campaigns/:id Put Existing Campaign
 * @apiVersion 1.0.0
 * @apiName PutCampaign
 * @apiGroup Campaign
 * @apiDescription Put existing campaign
 * @apiUse RequestHeaders
 * @apiUse Campaign
 *
 * @apiUse RequestHeadersExample
 * @apiUse CampaignSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.put(
  PATH_SINGLE,
  putFor({
    put: (options, done) => Campaign.put(options, done), // TODO resend
  })
);

/**
 * @api {delete} /campaigns/:id Delete Existing Campaign
 * @apiVersion 1.0.0
 * @apiName DeleteCampaign
 * @apiGroup Campaign
 * @apiDescription Delete existing campaign
 * @apiUse RequestHeaders
 * @apiUse Campaign
 *
 * @apiUse RequestHeadersExample
 * @apiUse CampaignSuccessResponse
 * @apiUse JWTError
 * @apiUse JWTErrorExample
 * @apiUse AuthorizationHeaderError
 * @apiUse AuthorizationHeaderErrorExample
 */
router.delete(
  PATH_SINGLE,
  deleteFor({
    del: (options, done) => Campaign.del(options, done), // TODO stop sending
    soft: true,
  })
);

/* expose campaign router */
module.exports = exports = router;