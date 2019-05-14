/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// CheckoutEnvironment.ServiceController.js
// ----------------
define(
	'CheckoutEnvironment.ServiceController'
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
		ServiceController,
		Configuration,
		Application,
		SiteSettingsModel,
		ExternalPaymentModel,
		ProfileModel,
		Utils,
		SCModelsInit,
		LiveOrderModel
	) {
		'use strict';


		return ServiceController.extend({

			name: 'CheckoutEnvironment.ServiceController'

			, get: function () {

				var Environment;
				var SiteSettings;
				var cart_bootstrap;
				var external_parameters;
				var Profile;
				var siteId;
				var session;
				var productlist_bundle_present;
				var Cart;
				var Content;
				var DefaultPage;
				var Merchandising;
				var ReleaseMetadata;
				var Address;
				var PaymentMethod;
				var Error;
				var googletagmanager_datalayer;


				try {
					Environment = Application.getEnvironment(this.request);
					SiteSettings = SiteSettingsModel.get();
					cart_bootstrap = this.request.getParameter('cart-bootstrap');

					external_parameters = ExternalPaymentModel.getParametersFromRequest(this.request) || {};
					Profile = ProfileModel.get();

					siteId = SiteSettings.siteid;
					session = SCModelsInit.session;

					productlist_bundle_present = Utils.recordTypeExists('customrecord_ns_pl_productlist')

					// GTM START
	                googletagmanager_datalayer = require('GoogleTagManager.ServiceController').getDataLayer(this.request,this.response);
	                // GTM END


					// Check if cart bootstrapping is required
					Cart = cart_bootstrap ? LiveOrderModel.get() : {};

					// Check if confirmation bootstrapping is required
					Cart.confirmation = external_parameters.externalPayment === 'DONE' ? LiveOrderModel.getConfirmation(external_parameters.nltranid) : {};

					// The use of CDS and CMS are mutually exclusive, if you use CMS you can't use CDS, or if you use CDS you can't use CMS
					if (!Configuration.get().cms.useCMS) {
						// Content depends on the instalation and inclusion of the
						// ContentDeliverService provided as a separated boundle
						// If you need to add more tags to the listURL function please consider
						// moving this to the sc.user.environment.ssp (the current file is cached)
						try {
							var locale = Environment && Environment.currentLanguage && Environment.currentLanguage.locale
								, content_tag = 'app:checkout';

							if (locale) {
								content_tag += ',locale:' + locale.toLowerCase();
							}

							var content_model = require('Content.Model');

							Content = content_model.listURL(siteId, content_tag);
							DefaultPage = content_model.getDefault();
						}
						catch (e) {
							console.warn('Content Module not present in Checkout SSP');
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

					if (session.isLoggedIn2() && Utils.isCheckoutDomain()) {
						Address = require('Address.Model').list();
                        PaymentMethod = require('PaymentMethod.Model').list();
					}
				}
				catch (e) {
					Error = Application.processError(e);
				}

				if (!productlist_bundle_present) {
					console.warn('Product Lists Data not present in Shopping SSP');
				}

				var checkoutEnvironment = {};

				var env = {};

				if (Environment) {
					env = Environment;
				}

				env.jsEnvironment = 'browser';
				env.CART_BOOTSTRAPED = cart_bootstrap ? 'true' : 'false';
				env.CART = Cart;

				if (SiteSettings) {
					var site_settings_json = SiteSettings;//.replace(/<body *[^/]*?>/ig, '').replace(/<\/body*?>/ig, '');
					env.siteSettings = site_settings_json;
					env.siteType = SiteSettings.sitetype;
					env.SCTouchpoint = 'checkout';
				}

				checkoutEnvironment.CONFIGURATION = Configuration.get();

				if (Configuration.get().cases) {
					env.CASES_CONFIG = Configuration.get().cases;
				}

				env.BuildTimeInf = BuildTimeInf || {};
				env.isExtended = isExtended;

				env.embEndpointUrl = (typeof embEndpointUrl !== "undefined") && embEndpointUrl;
				env.themeAssetsPath = themeAssetsPath;

				if (Content) {
					// The Content
					env.CONTENT = Content;

					if (DefaultPage) {
						// The Default Page
						env.DEFAULT_PAGE = DefaultPage;
					}
				}

				if (Profile) {
					// The Profile
					env.PROFILE = _.extend(Profile, {
						isLoggedIn: session.isLoggedIn2() ? 'T' : 'F'
						, isRecognized: session.isRecognized() ? 'T' : 'F'
						, isGuest: session.getCustomer().isGuest() ? 'T' : 'F'
					});
					env.permissions = Application.getPermissions();
				}

				checkoutEnvironment.SESSION = {
					currency: Environment.currentCurrency
					, language: Environment.currentLanguage
					, priceLevel: Environment.currentPriceLevel
					, touchpoints: SiteSettings.touchpoints
				};

				if (Address) {
					// The Address
					env.ADDRESS = Address;
				}

				if (PaymentMethod) {
					// The Credit Card
                    env.PAYMENTMETHOD = PaymentMethod;
				}


				if (Merchandising) {
					// Merchandising
					env.MERCHANDISING = Merchandising;
				}

				env.GTM_DATALAYER = googletagmanager_datalayer || {};

				env.CHECKOUT = {
					skipLogin: Configuration.get().checkoutApp.skipLogin ? 'true' : 'false'
				};

				//External Payment
				if (external_parameters) {
					env.EXTERNALPAYMENT = {
						parameters: external_parameters
					}
				}

				env.RELEASE_METADATA = ReleaseMetadata || {};

				//ProductList
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

					env.published[i.key] = res;
				});

				checkoutEnvironment.ENVIRONMENT = env;


				return checkoutEnvironment;
			}
		});
	}
);
