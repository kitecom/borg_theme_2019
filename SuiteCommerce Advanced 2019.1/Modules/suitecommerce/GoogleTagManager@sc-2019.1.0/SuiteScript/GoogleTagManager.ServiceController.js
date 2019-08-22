/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// GoogleTagManager.ServiceController.js
// jshint laxcomma: true
// ----------------
// Service to manage credit cards requests
define(
	'GoogleTagManager.ServiceController'
,	[
		'ServiceController'
	,	'GoogleTagManager.Model'
	,	'Utils'
	,	'Configuration'
	,	'SC.Models.Init'
	]
,	function(
		ServiceController
	,	GoogleTagManagerModel
	,	Utils
	,	Configuration
	,	ModelsInit
	)
	{
		'use strict';

		function save()
		{

			var id = this.data.id;
			var events = this.data.events || [];

			if(Configuration.get().tracking.googleTagManager.isMultiDomain) {

				if(Utils.recordTypeExists('customrecord_ns_gtm_datalayer') && Utils.recordTypeHasField('customrecord_ns_gtm_datalayer', 'custrecord_ns_gtm_gid') && Utils.recordTypeHasField('customrecord_ns_gtm_datalayer', 'custrecord_ns_gtm_events')) {
					return GoogleTagManagerModel.save(id, events);
				} else {
					nlapiLogExecution('DEBUG', '[Only for multi-domain sites] Please check if the customrecord_ns_gtm_datalayer\'s custom record and its required fields has been created.-');
					return {
							internalid: 1
						,	gtm_gid: 1
						,	events:  []
				};
				}

			} else {

				var ctx = ModelsInit.context;
				var session_obj = ctx.getSessionObject('gtmDataLayer');
				var dataLayerSession;

				if(!session_obj)
				{
					dataLayerSession = {internalid:1, gtm_id:id, events:events};
				}
				else{
					dataLayerSession = JSON.parse(session_obj);
					dataLayerSession.events = (dataLayerSession.events || []).concat(events);
				}

				ctx.setSessionObject('gtmDataLayer', JSON.stringify(dataLayerSession));

				return dataLayerSession;
			}
		}

		// @class GoogleTagManager.ServiceController  Manage product list request
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'GoogleTagManager.ServiceController'

			// @method get The call to GoogleTagManager.Service.ss with http method 'get' is managed by this function
			// @return {GoogleTagManager.Model.Get.Result}
		,	post: save
		,	put: save

		,	getDataLayer: function(request,response)
			{
				var googletagmanager_cookie = request.getParameter('_ga') || '';
                if(googletagmanager_cookie)
                {
                    googletagmanager_cookie = (googletagmanager_cookie.split('.').slice(2,4).join('.')).split('-')[0];
                }
                else
                {
                    googletagmanager_cookie = request.getHeader('cookie');
                    if(googletagmanager_cookie && googletagmanager_cookie.match(/.*?_gid=.*?\.(\d+\.\d+);.*/))
                    {
                        googletagmanager_cookie = googletagmanager_cookie.replace(/.*?_gid=.*?\.(\d+\.\d+);.*/,'$1');
                    }
                    else
                    {
                        googletagmanager_cookie = '';
                    }
                }

                if(googletagmanager_cookie)
                {
                    this.response = response;
                    this.request = request;
                    this.data = {id: googletagmanager_cookie};
                    return this.post();
                }
			}
		});
	}
);