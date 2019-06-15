'use strict';


/* dependencies */
const _ = require('lodash');
const phone = require('phone'); // use @lykmapipo/phone
const { getString } = require('@lykmapipo/env');


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
exports.toE164 = function (phoneNumber, countryCode) {

  //try convert give phone number to e.164
  try {
    const _countryCode = (countryCode || getString('DEFAULT_COUNTRY_CODE'));
    let _phoneNumber = phone(phoneNumber, _countryCode);
    _phoneNumber = _
      .first(_phoneNumber).replace(/\+/g, '');
    return _phoneNumber;
  }

  //fail to convert, return original format
  catch (error) {
    return phoneNumber;
  }

};