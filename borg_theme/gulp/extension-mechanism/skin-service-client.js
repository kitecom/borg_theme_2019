
'use strict';

var RequestHelper = require('./client-script/RequestHelper');

var skin_service_client = (function(){

	var skin_service_client =  {
		
		REQUEST_TIMEOUT: 120

	,	searchSkins: function searchSkins(query)
		{
			var self = this;

            query = query || {};
            query.service_name = 'SKIN_SERVICE';
            query.operation= 'search_skin';
            
			var options = {
				query: query
			,	timeout: self.REQUEST_TIMEOUT
			,	method: 'GET'
			,	data: null
			};

			return RequestHelper.request(options);
		}
		
	,	createSkin: function createSkin(skin_data)
		{
			var self = this;
			var options = {
				timeout: self.REQUEST_TIMEOUT
			,	method: 'POST'
			,	data: {
					skin: skin_data
				,	operation: 'create_skin'
                ,   service_name: 'SKIN_SERVICE'
				}
			};

			return RequestHelper.request(options);
		}
		
	,	updateSkin: function updateSkin(skin_data)
		{
			var self = this;
			var options = {
				timeout: self.REQUEST_TIMEOUT
			,	method: 'PUT'
			,	data: {
					skin: skin_data
				,	operation: 'update_skin'
                ,   service_name: 'SKIN_SERVICE'
				}
			};

			return RequestHelper.request(options);
		}

	,	deleteSkin: function deleteSkin(skin_id)
		{
            var query = {
                service_name: 'SKIN_SERVICE'
            ,   operation: 'delete_skin'
            ,   skin_id: skin_id
            };
            
			var options = {
				query: query
			,	timeout: this.REQUEST_TIMEOUT
			,	method: 'DELETE'
			,	data: null
			};

			return RequestHelper.request(options);
		}
	};

	return skin_service_client;
})();

module.exports = skin_service_client;