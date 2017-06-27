/**
 * Controllers
 * @module controllers
 */
define(function (require, exports) {

        'use strict';

        /**
         * Main controller
         * @ngInject
         * @constructor
         */
        function MainCtrl(WidgetModel, lpWidget, lpCoreUtils, lpCoreError, $scope, $q, $http) {
            var me = this;
            me.model = WidgetModel;
            me.b2gLocale = this.localeFormat(localStorage.getItem('currentLocale'));
            me.myCountry = me.model.PROPERTIES.IS_ENABLED_FOR_HK ? 'HK' : 'UK';
        };
        MainCtrl.prototype.$onInit = function () {
            this.listOfSoftwares = [];
            this.isPrimaryUser = true;
            this.selectedSoftware = '';
            this.selectedProviderName = '';
            this.ifUniqueRefRequired = false;
            this.isDataLoaded = false;
            this.accountDetailsExistingFeed = [];
            this.accountDetailsNewFeed = [];
            this.userSelectedAccountsArr = []; // List of accounts selected by users to be shared.
            this.companyDetails = [];
            this.isBtnDisabled = true;
            this.uniqueRef = '';
            this.limit = 5;
            this.isExistingUser = '';
            this.checkUserType();
            this.loadChooseProviderData();
            this.loadBankFeedData();
            this.checkTermsCondition();
            this.date = this.getCurrentDate();
        };

        // Based on HK WS1 code. used for language change.
        MainCtrl.prototype.localeFormat = function (locale) {
            var localeTemp = 'en_US';
            if (locale) {
                localeTemp = locale.split('-')[0] + '_' + locale.split('-')[1].toUpperCase();
            }
            return localeTemp;
        };
        MainCtrl.prototype.checkUserType = function () {
            var me = this;
            this.model.getUserType().then(function (response) {
                    if (response.data.primaryUser != 'Y' && response.data.primaryUser != 'y') {
                        me.isPrimaryUser = false;
                    }
                }
            );
        };
        MainCtrl.prototype.loadChooseProviderData = function () {
            var me = this;
            me.model.getListOfProvider().then(function (res) {
                if (res === 404) {
                    me.isDataLoaded = false;
                } else {
                    me.isDataLoaded = true;
                    res.forEach(function (softwareDetailsData) {
                        if (softwareDetailsData.countries.indexOf(me.myCountry) !== -1) {
                            me.listOfSoftwares.push({
                                id: softwareDetailsData.id,
                                name: softwareDetailsData.name,
                                UniqueRefFormat: (softwareDetailsData.rule) != null ? softwareDetailsData.rule : '',
                                realtime: softwareDetailsData.realtime
                            });
                        }
                    });
                }
            });
        };
        MainCtrl.prototype.loadBankFeedData = function () {
            var me = this;
            me.model.getListOfAccounts().then(function (res) {
                if (res === 404) {
                    me.isDataLoaded = false;
                }
                else {
                    me.isDataLoaded === false ? false : true; // False even if account list loaded but not providerList
                    me.isExistingUser = false;
                    var isSelected = false;
                    res.forEach(function (companyList) {
                        var accountDetailsExistingFeed = [];
                        var accountDetailsNewFeed = [];

                        if (companyList.accountListConnected != '') {
                            me.isExistingUser = true
                        }
                        companyList.accountListConnected.forEach(function (list) {
                            if (list.subAccounts != '' && list.subAccounts != null) {
                                var arrTier2 = [];
                                var isTier2Selected = false;
                                list.subAccounts.forEach(function (tier2) {
                                    if (tier2.subAccounts != '') {
                                        var arrTier3 = [];
                                        tier2.subAccounts.forEach(function (tier3) {
                                            var currency = (tier3.balance == null) ? '' : tier3.balance.currency;
                                            var providersListTier3 = [];
                                            if (!(tier3.providers == null)) {
                                                tier3.providers.forEach(function (provider) {
                                                    providersListTier3.push(provider.providerID);
                                                });
                                            }
                                            arrTier3.push({
                                                accountType: tier3.accountInfo.type,
                                                accountName: tier3.accountInfo.nickname,
                                                accountNumber: tier3.accountInfo.number,
                                                currency: currency,
                                                tier: 'teir3',
                                                subAccounts: '',
                                                provider: providersListTier3,
                                                isSelected: isSelected
                                            });
                                        });
                                    }
                                    var currency = (tier2.balance == null) ? '' : tier2.balance.currency;
                                    var providersListTier2 = [];
                                    if (!(tier2.providers == null)) {
                                        tier2.providers.forEach(function (provider) {
                                            providersListTier2.push(provider.providerID);
                                        });
                                    }
                                    arrTier2.push({
                                        accountType: tier2.accountInfo.type,
                                        accountName: tier2.accountInfo.nickname,
                                        accountNumber: tier2.accountInfo.number,
                                        currency: currency,
                                        tier: 'teir2',
                                        subAccounts: arrTier3,
                                        provider: providersListTier2,
                                        isSelected: isSelected
                                    });
                                });
                            }
                            var providersList = [];
                            if (!(list.providers == null)) {
                                list.providers.forEach(function (provider) {
                                    providersList.push(provider.providerID);
                                });
                            }
                            accountDetailsExistingFeed.push({
                                accountType: list.accountInfo.type,
                                accountName: list.accountInfo.nickname,
                                accountNumber: list.accountInfo.number,
                                currency: list.balance.currency,
                                tier: 'teir1',
                                subAccounts: arrTier2,
                                provider: providersList,
                                isSelected: isSelected
                            });
                        });
                        companyList.accountListPending.forEach(function (list) {
                            if (list.subAccounts != '' && list.subAccounts != null) {
                                var arrTier2 = [];
                                var isTier2Selected = false;
                                list.subAccounts.forEach(function (tier2) {
                                    if (tier2.subAccounts != '') {
                                        var arrTier3 = [];
                                        tier2.subAccounts.forEach(function (tier3) {
                                            var currency = (tier3.balance == null) ? '' : tier3.balance.currency;
                                            arrTier3.push({
                                                accountType: tier3.accountInfo.type,
                                                accountName: tier3.accountInfo.nickname,
                                                accountNumber: tier3.accountInfo.number,
                                                currency: currency,
                                                tier: 'teir3',
                                                subAccounts: '',
                                                isSelected: isSelected
                                            });
                                        });
                                    }
                                    var currency = (tier2.balance == null) ? '' : tier2.balance.currency;
                                    arrTier2.push({
                                        accountType: tier2.accountInfo.type,
                                        accountName: tier2.accountInfo.nickname,
                                        accountNumber: tier2.accountInfo.number,
                                        currency: currency,
                                        tier: 'teir2',
                                        subAccounts: arrTier3,
                                        isSelected: isSelected
                                    });
                                });
                            }

                            accountDetailsNewFeed.push({
                                accountType: list.accountInfo.type,
                                accountName: list.accountInfo.nickname,
                                accountNumber: list.accountInfo.number,
                                currency: list.balance.currency,
                                tier: 'teir1',
                                subAccounts: arrTier2,
                                isSelected: isSelected
                            });
                        });
                        me.companyDetails.push({
                            companyName: companyList.company.name,
                            accountListConnected: accountDetailsExistingFeed,
                            accountListPending: accountDetailsNewFeed,
                            isSelected: isSelected
                        });
                    });
                    me.associatedProviders();
                }
            });

        };
        MainCtrl.prototype.checkTermsCondition = function () {
            var me = this;
            me.model.getTermsConditions().then(function (response) {
                me.condition = response.data[0].ACCEPTED == '1' ? true : false;
            });

        };

        //Create list of providers in Use
        MainCtrl.prototype.associatedProviders = function () {
            var me = this;
            var tempExistingProviderList = [];
            me.existingProviderList = [];
            me.companyDetails.forEach(function (companyList) {
                companyList.accountListConnected.forEach(function (listT1) {
                    console.log('listT1' + listT1);
                    tempExistingProviderList = tempExistingProviderList.concat(listT1.provider);
                    if (listT1.subAccounts != '' && listT1.subAccounts != null) {
                        listT1.subAccounts.forEach(function (listT2) {
                            tempExistingProviderList = tempExistingProviderList.concat(listT2.provider);
                            if (listT2.subAccounts != '' && listT2.subAccounts != null) {
                                listT2.subAccounts.forEach(function (listT3) {
                                    tempExistingProviderList = tempExistingProviderList.concat(listT3.provider);
                                });
                            }
                        });
                    }
                });
            });
            tempExistingProviderList.forEach(function (list) {
                me.listOfSoftwares.forEach(function (swList) {
                    if (list == swList.id) {
                        me.existingProviderList.push({
                            id: swList.id,
                            name: swList.name
                        })
                    }
                });
            });
            me.existingProviderList = me.model.removeDuplicates(me.existingProviderList, "id");
        };

        // Unique ref and validation
        MainCtrl.prototype.updateUniqueRef = function (format) {
            var me = this;
            if (format != '') {
                me.uniqueRefPlaceHolder = format;
                me.ifUniqueRefRequired = true;
            } else {
                me.ifUniqueRefRequired = false;
            }
        };

        MainCtrl.prototype.chooseProviderContinue = function () {
            var me = this;
            me.listOfSoftwares.forEach(function (providerName) {
                if (providerName.id == me.selectedSoftware) {
                    me.ifoAuthRequired = providerName.realtime == 1 ? true : false;
                }
            });
            if (!me.ifoAuthRequired) {
                me.newBankFeedFlow = 'selectAccounts';
            }
            me.providerName();
        };
        //  Name of selected provider
        MainCtrl.prototype.providerName = function () {
            var me = this;
            me.listOfSoftwares.forEach(function (providerName) {
                if (providerName.id == me.selectedSoftware) {
                    me.selectedProviderName = providerName.name;
                }
            });
        };
// List of selected accounts
        MainCtrl.prototype.saveSelectedAccounts = function (journey) {
            var me = this;
            var arr;
            me.companyDetails.forEach(function (companyList) {
                if (journey == 'existing') {
                    arr = companyList.accountListConnected;
                } else {
                    arr = companyList.accountListPending;
                }
                arr.forEach(function (listT1) {
                    if (listT1.isSelected) {
                        me.userSelectedAccountsArr.push({
                            accountNumber: listT1.accountNumber,
                            accountType: listT1.accountType,
                            accountName: listT1.accountName,
                            accountCurrency: listT1.currency,
                            ui: 'ui-tier1'
                        });
                    }
                    if (listT1.subAccounts != '' && listT1.subAccounts != null) {
                        listT1.subAccounts.forEach(function (listT2) {
                            if (listT2.isSelected) {
                                me.userSelectedAccountsArr.push({
                                    accountNumber: listT2.accountNumber,
                                    accountType: listT2.accountType,
                                    accountName: listT2.accountName,
                                    accountCurrency: listT2.currency,
                                    ui: 'ui-tier2'
                                });
                                // Select all T3 accounts if T2 is selected
                                if (listT2.subAccounts != '' && listT2.subAccounts != null) {
                                    listT2.subAccounts.forEach(function (listT3) {
                                        me.userSelectedAccountsArr.push({
                                            accountNumber: listT3.accountNumber,
                                            accountType: listT3.accountType,
                                            accountName: listT3.accountName,
                                            accountCurrency: listT3.currency,
                                            ui: 'ui-tier3'
                                        });
                                    });
                                }
                            }
                        });
                    }

                });
            });
        };

        MainCtrl.prototype.storeData = function (postType) {
            var me = this;
            var postData =
            {
                'description': '',
                'data': []
            }
            me.userSelectedAccountsArr.forEach(function (accountListItem) {
                var objects = {};
                objects.uniqueRef = me.uniqueRef;
                objects.accountNumber = accountListItem.accountNumber;
                objects.accountType = accountListItem.accountType;
                objects.accountName = accountListItem.accountName;
                objects.accountCurrency = accountListItem.accountCurrency;
                objects.providers = [{'providerID': me.selectedSoftware}];
                postData.data.push(objects);
            });
            me.model.sendingCustomerDetails(postData, postType)
                .success(function (data, status) {
                    console.log('success' + data);
                    me.bankFeedState = postType + '-success';
                })
                .error(function (data) {
                    console.log('Error' + data);
                    me.bankFeedState = postType + '-error';
                });
            me.model.saveTnC()
                .success(function (data, status) {
                })
                .error(function (data) {
                });
            ;

        };

        MainCtrl.prototype.selectThisAccount = function (journey) {
            var me = this;
            var arr;
            var ifAnyAccountSelected;
            me.companyDetails.forEach(function (companyList) {
                if (journey == 'existing') {
                    arr = companyList.accountListConnected;
                } else {
                    arr = companyList.accountListPending;
                }
                arr.forEach(function (accounts) {
                    if (accounts.isSelected) {
                        ifAnyAccountSelected = true;
                    }
                });
            });
            if (ifAnyAccountSelected) {
                me.isBtnDisabled = false;
            } else {
                me.isBtnDisabled = true;
            }
        };
        MainCtrl.prototype.checkAll = function ($event, journey) {
            var me = this;
            var arr;
            if (journey == 'existing') {
                arr = me.accountDetailsExistingFeed;
            } else {
                arr = me.accountDetailsNewFeed;
            }
            me.companyDetails.forEach(function (companyList) {
                if (journey == 'existing') {
                    arr = companyList.accountListConnected;
                } else {
                    arr = companyList.accountListPending;
                }

                if ($event.target.checked) {
                    me.companyDetails.forEach(function (companyList) {
                        arr.forEach(function (listT1) {
                            listT1.isSelected = true;
                            if (listT1.subAccounts != '' && listT1.subAccounts != null) {
                                listT1.subAccounts.forEach(function (listT2) {
                                    listT2.isSelected = true;
                                    if (listT2.subAccounts != '' && listT2.subAccounts != null) {
                                        listT2.subAccounts.forEach(function (listT3) {
                                            listT3.isSelected = true;
                                        });
                                    }
                                });
                            }
                            me.isBtnDisabled = false;
                        });
                    });

                }
                else { // if unchecked
                    arr.forEach(function (listT1) {
                        listT1.isSelected = false;
                        if (listT1.subAccounts != '' && listT1.subAccounts != null) {
                            listT1.subAccounts.forEach(function (listT2) {
                                listT2.isSelected = false;
                                if (listT2.subAccounts != '' && listT2.subAccounts != null) {
                                    listT2.subAccounts.forEach(function (listT3) {
                                        listT3.isSelected = false;
                                    });
                                }
                            });
                        }
                        me.isBtnDisabled = true;
                    });
                }
            });

        };
        MainCtrl.prototype.loadMore = function () {
            var me = this;
            me.limit += 5;
        };
        MainCtrl.prototype.getCurrentDate = function () {
            var d = new Date();
            return d;
        };
        MainCtrl.prototype.printThis = function (section) {
            var mywindow = window.open('', 'PRINT', 'height=900,width=900');
            mywindow.document.write(document.getElementById(section).innerHTML);
            mywindow.document.write('</body></html>');
            mywindow.document.print();
            mywindow.close();


            //window.print();
        };
        MainCtrl.prototype.resetAll = function (postType) {
            var me = this;
            me.userSelectedAccountsArr = [];
            me.isBtnDisabled = true;
            me.uniqueRef = '';
            me.ifUniqueRefRequired = false;
            me.accountDetailsNewFeed.forEach(function (list) {
                list.isSelected = false;
            });
            me.accountDetailsExistingFeed.forEach(function (list) {
                list.isSelected = false;
            });
            me.selectedSoftware = '';
            me.view = 'landingPage'; // move to landing page.
        };

        /**
         * Export Controllers
         */
        exports.MainCtrl = MainCtrl;
    }
)
;