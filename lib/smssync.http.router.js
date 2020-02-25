'use strict';

const { mergeObjects } = require('@lykmapipo/common');
const { smssync } = require('smssync');

const transport = require('./transports/smssync');

/* expose smssync integration router */
module.exports = exports = integration => {
	// initialize transport to get options
	transport.init();

	// compile smssync router
	const options = mergeObjects(transport.options, integration);
	const router = smssync(options);
	return router;
};
