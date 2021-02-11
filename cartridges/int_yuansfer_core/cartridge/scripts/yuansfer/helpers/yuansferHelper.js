/* eslint-env es6 */
/* global dw, empty */

'use strict';

/**
 * Checks if the payment is a Yuansfer APM method
 *
 * @param {dw.order.PaymentMethod} paymentMethod - SFCC PaymentMethod
 * @return {boolean} - True if Yuansfer is used as processor for the payment
 */
function isYuansferAPMPayment(paymentMethod) {
    if (!empty(paymentMethod)) {
        var paymentProcessor = paymentMethod.getPaymentProcessor();
        if (!empty(paymentProcessor) && paymentProcessor.ID.equals('Yuansfer_APM')) {
            return true;
        }
    }

    return false;
}

/**
 * Checks if Yuansfer integration is enabled.
 *
 * @return {boolean} - True if sitepreference is set to true.
 */
exports.isYuansferEnabled = function () {
    var Site = require('dw/system/Site');
    return Site.getCurrent().getCustomPreferenceValue('yuansferEnabled');
};


/**
* Gets the Yuansfer MerchantNo from Site Preferences.
*
* @returns {string} Yuansfer MerchantNo.
*/
exports.getYuansferMerchantNo = function () {
    return require('dw/system/Site').current.getCustomPreferenceValue('yuansferMerchantNo');
};

/**
* Gets the Yuansfer Token from Site Preferences.
*
* @returns {string} Yuansfer Token.
*/
exports.getYuansferToken = function () {
    return require('dw/system/Site').current.getCustomPreferenceValue('yuansferToken');
};

/**
* Gets the Yuansfer StoreNo from Site Preferences.
*
* @returns {string} Yuansfer StoreNo.
*/
exports.getYuansferStoreNo = function () {
    return require('dw/system/Site').current.getCustomPreferenceValue('yuansferStoreNo');
};

/**
* Gets the Yuansfer Env from Site Preferences.
*
* @returns {string} Yuansfer Env.
*/
exports.getYuansferEnv = function () {
    return require('dw/system/Site').current.getCustomPreferenceValue('yuansferEnv');
};

/**
* Gets the URL from where Yuansfer.js can be loaded.
*
* @returns {string} Yuansfer.js URL
*/
exports.getYuansferScriptUrl = function () {
    return require('dw/system/Site').current.getCustomPreferenceValue('yuansferScriptUrl');
};

/**
 * Returns Yuansfer allowed payment methods
 *
 * @param {dw.util.Collection} applicablePaymentMethods - SFCC payment methods
 * @param {string} locale - the APM locale
 * @return {dw.util.Collection} - filtered payment methods
 */
exports.getYuansferPaymentMethods = function (applicablePaymentMethods, locale) {
    const localeConfig = JSON.parse(require('dw/system/Site').current.getCustomPreferenceValue('yuansferAllowedAPMMethods')) || {};
    const list = localeConfig[locale] != null ? localeConfig[locale] : localeConfig.default;
    const applicablePaymentMethodsIterator = applicablePaymentMethods.iterator();

    if (!empty(list)) {
        let filteredPaymentMethods = new dw.util.ArrayList();

        while (applicablePaymentMethodsIterator.hasNext()) {
            let method = applicablePaymentMethodsIterator.next();
            let isAPM = isYuansferAPMPayment(method);
            if ((isAPM && list.indexOf(method.ID.substr(7).toLowerCase()) > -1) || !isAPM) {
                filteredPaymentMethods.push(method);
            }
        }

        return filteredPaymentMethods;
    }

    return applicablePaymentMethods;
};

exports.isYuansferAPMPayment = isYuansferAPMPayment;
