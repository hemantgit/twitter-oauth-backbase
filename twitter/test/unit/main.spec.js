/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : main.spec.js
 *  Description:
 *  ----------------------------------------------------------------
 */

var main = require('../../scripts/main');
var filter = require('../../scripts/filter');

require('angular-mocks');

window.$ = require('jquery');
var bibHostCookie = 'https://localhost/testcookie';
document.cookie = 'bibHost=' + bibHostCookie;
console.debug('cookie: ', document.cookie);

var ngModule = window.module;
var ngInject = window.inject;
var angular = window.angular;

var Widget = require('./widget.mock');
var ModelMock = require('./model.mock');
var providerList = require('../../data/provider.json');
var accounts = require('../../data/account-list.json');

/*----------------------------------------------------------------*/
/* Widget unit tests
 /*----------------------------------------------------------------*/
describe('Widget account-overview', function () {

    /*----------------------------------------------------------------*/
    /* Mock modules/Providers
     /*----------------------------------------------------------------*/
    beforeEach(ngModule(main.name, function ($provide) {
        $provide.value('lpWidget', new Widget());
    }));

    /*----------------------------------------------------------------*/
    /* Main Module
     /*----------------------------------------------------------------*/
    describe('Module', function () {
        it('should be an object', function () {
            expect(main).toBeObject();
        });
    });

    /*----------------------------------------------------------------*/
    /* Tests for Filter
     /*----------------------------------------------------------------*/
    describe('Filter', function () {
        var http;
        var overview;
        var utils;
        var lpWidget;
        var lpCoreUtils;
        beforeEach(inject(function (lpWidget, _lpCoreUtils_) {
            lpWidget = lpWidget;
            lpCoreUtils = _lpCoreUtils_;
        }));

        it('should be an object', function () {
            expect(filter).toBeObject();
        });
        it('should be an function', function () {
            expect(filter.providerListFilter()).toBeFunction();
        });

    });

    describe('WidgetModel', function () {
        var lpCoreUtils, WidgetModel;
        beforeEach(inject(function (_lpCoreUtils_, _WidgetModel_) {
            lpCoreUtils = _lpCoreUtils_;
            WidgetModel = _WidgetModel_;
        }));


    });

    /*----------------------------------------------------------------*/
    /* Tests for Controllers
     /*----------------------------------------------------------------*/
    describe('Controllers', function () {

        var createController,
            scope,
            rootElement,
            assetsModel;

        beforeEach(function () {
            /*----------------------------------------------------------------*/
            /* Mock dependencies
             /*----------------------------------------------------------------*/
            ngModule(function ($provide) {
                $provide.value('AssetsModel', new ModelMock());
            });
        });

        beforeEach(inject(function ($controller, $rootScope, _AssetsModel_, lpWidget) {
            scope = $rootScope.$new();
            rootElement = angular.element('<div></div>');
            assetsModel = _AssetsModel_;
            lpWidget.dev = true;

            createController = function (ctrlName) {
                return $controller(ctrlName, {
                    $scope: scope,
                    $rootElement: rootElement
                });
            };
        }));

        // MainCtrl
        describe('MainCtrl', function () {
            var ctrl;
            beforeEach(function () {
                ctrl = createController('MainCtrl');
            });

            it('should exists', function () {
                expect(ctrl).toBeObject();
            });

        });

    });

});
