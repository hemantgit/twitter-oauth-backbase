/**
 * Models
 * @module models
 */
define( function (require, exports, module) {

    'use strict';

    /**
     * @constructor
     * @ngInject
     */
    function WidgetModel(lpWidget, lpCoreUtils,$q, $http) {
        var utils = lpCoreUtils;
        var state = {
            title: lpWidget.getPreference('title'),
            icon: utils.resolvePortalPlaceholders(lpWidget.getPreference('thumbnailUrl'))
        };

        var model = {};
        /**
         * @public
         * @return {Object} current model state
         */
        model.getState = function getState() {
            return state;
        };

        //  Consumer Key (API Key)  HENg6Ue5wDJHlgOnSi5QUCRW1
        //Consumer Secret (API Secret)    ZCEZmO1m2IZODFAzNztLnPbAObBhyb18m3tCJSuylpQ9b3RlNB



        var consumerKey= 'HENg6Ue5wDJHlgOnSi5QUCRW1';
        var oauthToken= 'ZCEZmO1m2IZODFAzNztLnPbAObBhyb18m3tCJSuylpQ9b3RlNB';

        var baseUrl = 'https://api.twitter.com/oauth/request_token';
        var reqParams ='';
        var accessToken='';
        var consumerSecret ='';
        var accessTokenSecret ='';
        //var timestamp  = Math.round(Date.now() / 1000);
        var timestamp  =1494331137;
       // var nonce      = btoa(consumerKey + ':' + timestamp);
       var nonce      = 'SEVOZzZVZTV3REpIbGdPblNpNVFVQ1JXMToxNDk0MzMwNTk5';
        var signatureMethod="HMAC-SHA1";
         // generate signature from base string & signing key
        //var baseString = oAuthBaseString('POST', baseUrl, reqParams, consumerKey, accessToken, timestamp, nonce);
        //var signingKey = oAuthSigningKey(consumerSecret, accessTokenSecret);
        //var signature  = oAuthSignature(baseString, signingKey);

        var signature  = 'YjFkOWM2YjI1MzlkNGYwMGUyYTJjYWI3OTkzMjc2NDJkZjc0NGJmYQ==';
        console.log(consumerKey);
        console.log(timestamp);
        console.log(nonce);

        require('./chrome_ex_oauthsimple');
        
        var hash = hmacsha1(consumerKey, oauthToken);

        model.getTest = function () {
            return $http({
                method: 'post',
                url: 'https://api.twitter.com/oauth/request_token', 
                headers: {
                    //'Authorization': 'OAuth oauth_callback="http%3A%2F%2Flocalhost%3A7777%2Fportalserver%2Fgarimatest%2Findex", oauth_consumer_key="HENg6Ue5wDJHlgOnSi5QUCRW1", oauth_nonce="SEVOZzZVZTV3REpIbGdPblNpNVFVQ1JXMToxNDk0MzMxMTM3",  oauth_signature="14d798fed239d2b570f1472b26d7c7042d077cc9", oauth_signature_method="HMAC-SHA1",oauth_timestamp="1494331137",oauth_version="1.0"'}
                    'Authorization': 'OAuth oauth_nonce="RUV4aG1WN3RTZVR3RU1ya1hwTERuZjljVjoxNDk0MzMxMTM3", oauth_callback="http%3A%2F%2Flocalhost%3A7777%2Fportalserver%2Fgarimatest%2Findex", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1494331137", oauth_consumer_key="EExhmV7tSeTwEMrkXpLDnf9cV", oauth_signature="4%2FkILMZzqiI7HRJAEYM%20q4Bd6jo%3D", oauth_version="1.0"'
                }
            });
        }


        return model;
    }

    module.exports = WidgetModel;
});
