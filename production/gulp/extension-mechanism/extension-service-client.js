
'use strict';

var RequestHelper = require('./client-script/RequestHelper');

var extension_service_client = (function(){

	var extension_service_client =  {
		
		REQUEST_TIMEOUT: 120

	,	searchExtensions: function searchExtensions(query)
		{
			var self = this;

            query = query || {};
            query.service_name = 'EXTENSION_SERVICE';
            
			var options = {
				query: query
			,	timeout: self.REQUEST_TIMEOUT
			,	method: 'GET'
			,	data: null
			};

			return RequestHelper.request(options);
		}

	,	getTargets: function getTargets(query)
		{
			var self = this;
            
            query = query || {};
            query.operation = 'get_targets';
            query.service_name = 'EXTENSION_SERVICE';

			var options = {
				query: query
			,	timeout: self.REQUEST_TIMEOUT
			,	method: 'GET'
			,	data: null
			};

			return RequestHelper.request(options);
		}
		
	,	createExtension: function createExtension(extension_data)
		{
			var self = this;
			var options = {
				timeout: self.REQUEST_TIMEOUT
			,	method: 'POST'
			,	data: {
					extension: extension_data
				,	operation: 'create_extension'
                ,   service_name: 'EXTENSION_SERVICE'
				}
			};

			return RequestHelper.request(options);
		}
		
	,	updateExtension: function updateExtension(extension_data)
		{
			var self = this;
			var options = {
				timeout: self.REQUEST_TIMEOUT
			,	method: 'PUT'
			,	data: {
					extension: extension_data
				,	operation: 'update_extension'
                ,   service_name: 'EXTENSION_SERVICE'
				}
			};

			return RequestHelper.request(options);
		}	
	};

	return extension_service_client;
})();

module.exports = extension_service_client;