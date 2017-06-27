/**
 * Models
 * @module models
 */
define(function (require, exports) {
    'use strict';
    /**
     * @constructor
     * @ngInject
     */
    function WidgetModel(lpWidget, lpCoreBus, lpCoreUtils, $http, $q) {
        var PROPERTIES = {
            IS_ENABLED_FOR_HK:lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('enabledForHK')),
            ACCOUNTING_SOFTWARE_LIST_URL: lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('getAccountingSoftwareUrl')),
            ACCOUNTS_LIST_URL: lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('getAccountInformationUrl')),
            SAVE_NEW_FEED_URL: lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('saveCustomerDetailsUrl')),
            DELETE_EXISTING_FEED_URL: lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('RevokeAccessUrl')),
            TERMS_AND_CONDITIONS_URL: lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('termsAndConditionsUrl')),
            SAVE_TERMS_AND_CONDITIONS_URL: lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('termsAndConditionsSaveUrl')),
            USER_TYPE_URL: lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('userIndicatorUrl'))
        };
        this.http = $http;
        this.q = $q;
        this.PROPERTIES = PROPERTIES;
    }

    //Get Provider List and Details
    WidgetModel.prototype.getListOfProvider = function () {
        var deferred = this.q.defer();
        this.http.get(this.PROPERTIES.ACCOUNTING_SOFTWARE_LIST_URL)
            .then(function (result) {
                deferred.resolve(result.data);
            }, function (error) {
                deferred.resolve(error.status);
            });
        return deferred.promise;
    };

    //Get List of Accounts
    /* WidgetModel.prototype.getListOfAccounts = function () {
     var posts;
     var deferred = this.q.defer();
     this.http.get(this.PROPERTIES.ACCOUNTS_LIST_URL)
     .then(function (result) {
     posts = result.data.accountOverview;
     deferred.resolve(posts);
     }, function (error) {
     posts = error.status;
     deferred.resolve(error.status);
     });
     posts = deferred.promise;
     return this.q.when(posts);
     };*/

    WidgetModel.prototype.getListOfAccounts = function () {
        var deferred = this.q.defer();
        this.http.get(this.PROPERTIES.ACCOUNTS_LIST_URL)
            .then(function (result) {
                deferred.resolve(result.data.accountOverview);
            }, function (error) {
                deferred.resolve(error.status);
            });
        return deferred.promise;
    };

    //Get Provider List and Details
    WidgetModel.prototype.getUserType = function () {
        var deferred = this.q.defer();
        this.http.get(this.PROPERTIES.USER_TYPE_URL).then(function (user) {
            deferred.resolve(user);
        });
        return deferred.promise;
    };

    //Get if User is primary user
    WidgetModel.prototype.getTermsConditions = function () {
        var deferred = this.q.defer();
        this.http.get(this.PROPERTIES.TERMS_AND_CONDITIONS_URL).then(function (tnc) {
            deferred.resolve(tnc);
        });
        return deferred.promise;
    };

    // Posting data for revoke and create bBnkfeed
    WidgetModel.prototype.sendingCustomerDetails = function (postData, postType) {
        console.log('modal' + JSON.stringify(postData));
        var postUrl, postMethod;
        if (postType === 'revoke') {
            console.log('revoke');
            postUrl = this.PROPERTIES.DELETE_EXISTING_FEED_URL;
            postMethod = 'POST';
        } else {
            postUrl = this.PROPERTIES.SAVE_NEW_FEED_URL;
            postMethod = 'put';
        }
        return this.http({
            method: postMethod,
            url: postUrl,
            data: postData,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    // Save Terms and conditions check flag
    WidgetModel.prototype.saveTnC = function (postData, postType) {
        return this.http({
            method: 'put',
            url: this.PROPERTIES.SAVE_TERMS_AND_CONDITIONS_URL,
            data: '',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    // Remove duplicate from Array
    WidgetModel.prototype.removeDuplicates = function (arr, prop) {
        var new_arr = [];
        var lookup = {};

        for (var i in arr) {
            lookup[arr[i][prop]] = arr[i];
        }

        for (i in lookup) {
            new_arr.push(lookup[i]);
        }

        return new_arr;
    }
    exports.WidgetModel = WidgetModel;

});
