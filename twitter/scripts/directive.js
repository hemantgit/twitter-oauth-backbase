define(function (require, exports) {
    'use strict';
    // @ngInject
    exports.termsCondition = function () {
        return {
            restrict: 'AE',
            link: function (scope, elem, attrs) {
                elem.on('click', '.tnc', function () {
                    window.open(
                        '/portalserver/static/widgets/[BBHOST]/hsbc-widget-account-share/dist/media/business_banking_tandcs.pdf', 'mywin',
                        'left=30,top=30,width=900,height=600,toolbar=1,resizable=0'
                    );
                });
            }
        };
    };
});
