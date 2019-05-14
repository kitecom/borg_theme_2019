/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// MyAccountEnvironment.ServiceController.js
// ----------------
define(
    'MyAccountEnvironment.ServiceController'
    , [
        'ServiceController'
        , 'Configuration'
        , 'Application'
        , 'SiteSettings.Model'
        , 'ExternalPayment.Model'
        , 'Profile.Model'
        , 'Utils'
        , 'SC.Models.Init'
        , 'LiveOrder.Model'
    ]
    , function (
        ServiceController
        , Configuration
        , Application,
        SiteSettingsModel,
        ExternalPaymentModel,
        ProfileModel,
        Utils,
        SCModelsInit,
        LiveOrderModel
    ) {
        'use strict';


        return ServiceController.extend({

            name: 'MyAccountEnvironment.ServiceController',

            get: function () {
                var SiteSettings
                    , LivePayment
                    , Profile
                    , Address
                    , PaymentMethod
                    , Environment
                    , Content
                    , DefaultPage
                    , Merchandising
                    , siteId
                    , Error
                    , productlist_bundle_present
                    , customerId
                    , ReleaseMetadata
                    , external_parameters
                    , session
                    , googletagmanager_datalayer
                    ;

                try {

                    SiteSettings = SiteSettingsModel.get();
                    Profile = ProfileModel.get();
                    Environment = Application.getEnvironment(this.request);
                    siteId = SiteSettings.siteid;
                    productlist_bundle_present = Utils.recordTypeExists('customrecord_ns_pl_productlist');
                    session = SCModelsInit.session;

                    // GTM START
                    googletagmanager_datalayer = require('GoogleTagManager.ServiceController').getDataLayer(this.request,this.response);
                    // GTM END

                    // The use of CDS and CMS are mutually exclusive, if you use CMS you can't use CDS, or if you use CDS you can't use CMS
                    if (!Configuration.get().cms.useCMS) {
                        // Content depends on the instalation and inclusion of the
                        // ContentDeliverService provided as a separated boundle
                        // If you need to add more tags to the listURL function please consider
                        // moving this to the sc.user.environment.ssp (the current file is cached)
                        try {
                            var locale = Environment && Environment.currentLanguage && Environment.currentLanguage.locale
                                , content_tag = 'app:myaccount';

                            if (locale) {
                                content_tag += ',locale:' + locale.toLowerCase();
                            }

                            var content_model = require('Content.Model');

                            Content = content_model.listURL(siteId, content_tag);
                            DefaultPage = content_model.getDefault();
                        }
                        catch (e) {
                            console.warn('Content Module not present in MyAccount SSP');
                        }

                        if (typeof psg_dm !== 'undefined') {
                            Merchandising = psg_dm.getMerchRule();
                        }
                        else {
                            console.warn('Merchandising Module not present in ShopFlow SSP');
                        }
                    }

                    try {
                        ReleaseMetadata = require('ReleaseMetadata').get();
                    }
                    catch (e) {
                        console.warn('Failed to load release metadata.');
                    }


                    if (session.isLoggedIn2()) {
                        Address = require('Address.Model').list();
                        PaymentMethod = require('PaymentMethod.Model').list();
                        try {
                            external_parameters = ExternalPaymentModel.getParametersFromRequest(this.request) || {};

                            if (external_parameters) {
                                if (external_parameters.externalPayment === 'DONE') {
                                    LivePayment = require('LivePayment.Model').get();
                                    LivePayment.confirmation = require('CustomerPayment.Model').get(external_parameters.recordType, external_parameters.nltranid);
                                }
                                else {
                                    LivePayment = require('LivePayment.Model').get(external_parameters.nltranid);
                                }
                            }
                            else {
                                LivePayment = require('LivePayment.Model').get();
                            }
                        }
                        catch (e) {
                            LivePayment = null;
                        }
                    }
                }
                catch (e) {
                    Error = Application.processError(e);
                }

                if (!productlist_bundle_present) {
                    console.warn('Product Lists Data not present in Shopping SSP');
                }

                this.response.setContentType('JSON');

                var env = {};
                var myAccountEnv = {};

                if (Environment) {
                    env = Environment;
                }

                if (SiteSettings) {
                    // Site Settings Info
                    env.siteSettings = SiteSettings;

                    // SCTouchpoint indicates the touchpoint the user is effectively in. We can only know with certain this in the proper ssp
                    // because there is still code that depends on the touchpoint
                    // myaccount value is added just in case someone needs it
                    // when in single ssp check if this it's necessary
                    env.SCTouchpoint = 'myaccount';

                    // Site site (ADVANCED or STANDARD)
                    env.siteType = SiteSettings.sitetype;
                }

                myAccountEnv.CONFIGURATION = Configuration.get();

                if (Content) {
                    // The Content
                    env.CONTENT = Content;

                    if (DefaultPage) {
                        // The Default Page
                        env.DEFAULT_PAGE = DefaultPage;
                    }
                }

                // Local Environment info
                env.jsEnvironment = 'browser';

                if (Profile) {
                    // The Profile
                    env.PROFILE = _.extend(Profile, { isLoggedIn: 'T' });
                    env.permissions = Application.getPermissions();
                }

                myAccountEnv.SESSION = {
                    currency: Environment.currentCurrency
                    , language: Environment.currentLanguage
                    , priceLevel: Environment.currentPriceLevel
                    , touchpoints: SiteSettings.touchpoints
                };

                myAccountEnv.getSessionInfo = function (key) {
                    var session = myAccountEnv.SESSION || myAccountEnv.DEFAULT_SESSION || {};
                    return (key) ? session[key] : session;
                }

                if (Address) {
                    // The Address
                    env.ADDRESS = Address;
                }

                if (PaymentMethod) {
                    // The Credit Card
                    env.PAYMENTMETHOD = PaymentMethod;
                }

                if (LivePayment) {
                    env.LIVEPAYMENT = LivePayment;
                }

                if (Merchandising) {
                    // Merchandising
                    env.MERCHANDISING = Merchandising;
                }

                env.GTM_DATALAYER = googletagmanager_datalayer || {};

                //Cases configuration
                if (Configuration.get().cases) {
                    env.CASES_CONFIG = Configuration.get().cases;
                }

                //Information generated at compilation time
                env.BuildTimeInf = BuildTimeInf || {};
                env.isExtended = isExtended;
                // the only way it works to test for undefined.
                // This was added for backward compatiblity with customers that already had activated in 17.2
                env.embEndpointUrl = (typeof embEndpointUrl !== "undefined") && JSON.stringify(embEndpointUrl);
                env.themeAssetsPath = themeAssetsPath;

                //External Payment
                if (external_parameters) {
                    env.EXTERNALPAYMENT = {
                        parameters: external_parameters
                    }
                }

                // Release Metadata
                env.RELEASE_METADATA = ReleaseMetadata || {};

                // ProductList
                env.PRODUCTLIST_ENABLED = productlist_bundle_present;

                // Sensors
                env.SENSORS_ENABLED = Utils.isFeatureEnabled('rum');

                if (Error) {

                    env.contextError = Error;

                    if (!env.baseUrl) {
                        env.baseUrl = session.getAbsoluteUrl2('/{{file}}');
                    }

                }
				env.published = {};
                _.each(Configuration.get().publish, function (i) {
                    var res = require(i.model)[i.call]();

                    env.published[i.key] = res
                });

                myAccountEnv.ENVIRONMENT = env;


                return myAccountEnv;
            }

        });
    }
);
