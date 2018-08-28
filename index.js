'use strict';


/* dependencies */
const path = require('path');
const libPath = path.join(__dirname, 'lib');


/**
 * @module postman
 * @name postman
 * @description collective notifications for nodejs
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 1.0.0
 * @public
 */
function postman() {

}


/* export postman message model */
postman.Message = require(path.join(libPath, 'message.model'));


/* export postman utils */
postman.utils = require(path.join(libPath, 'utils'));


/* export postman */
exports = module.exports = postman;