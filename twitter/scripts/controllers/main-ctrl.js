/**
 * Controllers
 * @module controllers
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * Main controller
     * @ngInject
     * @constructor
     */
    function MainCtrl(model, lpWidget, lpCoreUtils,$q, $http) {
        this.state = model.getState();
        this.utils = lpCoreUtils;
        this.widget = lpWidget;

        var _this = this;

        //Post
        _this.getTest1 = function () {
                    model.getTest()
                        .success(function (data, status) {
                            console.log("sucess" + data + status);
                        })
                        .error(function (data) {
                            console.log("Error " + data + "  "  + status);
                        });

        };
    }




    MainCtrl.prototype.$onInit = function() {
        // Do initialization here
    };

    module.exports = MainCtrl;
});
