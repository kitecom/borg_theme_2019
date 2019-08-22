var	RequestHelper = require('./client-script/RequestHelper')
,	_ = require('underscore');

'use strict';

var website_service = {

	getWebsites: function getWebsites(fetch_data, cb)
	{
        var options = {
            method: 'GET'
        ,   query: {service_name: 'WEBSITE_SERVICE'}
        };
        
        RequestHelper.request(options)
        .then(
            function succcess(resultBody)
            {
                if(resultBody.error)
                {
                    cb(resultBody.error);
                    return;
                }
                else
                {
                    var websites = resultBody.result;
                    fetch_data.websites = websites;
                    cb(null, fetch_data);
                    return;
                }
            }
        )
        .catch(
            function fail(error)
            {
                cb(error);
            }
        );
	}

,	getWebsiteDomains: function getWebsiteDomains(fetch_data, cb)
	{
		var promises = _.map(fetch_data.websites || [], function(website)
		{
            var options = {
                method: 'GET'
            ,   query: {
                    service_name: 'WEBSITE_SERVICE'
                ,   website_id: website.website_id
                }
            };
            
            var promise = RequestHelper.request(options)
            .then(
                function succcess(resultBody)
                {
                    var website = resultBody.result;
                    fetch_data.websites[website.website_id] = website;
                    return fetch_data;
                }
            );
			
			return promise;
		});

		Promise.all(promises)
		.then(function()
		{
			cb(null, fetch_data);
		})
		.catch(function(error) {
			cb(error);
		});
	}

,	getSubsidiaryLocations: function getSubsidiaryLocations(fetch_data, cb)
	{
        var options = {
            method: 'GET'
        ,   query: {
                service_name: 'WEBSITE_SERVICE'
            ,   subsidiary_id: fetch_data.credentials.subsidiary
            }
        };
        
        var promise = RequestHelper.request(options)
        .then(
            function success(resultBody)
            {
                var locations = resultBody.result;
                fetch_data.locations = locations;
                return fetch_data;
            }
        );

		if(!cb) {
			return promise;
		}
		else {
			promise
			.then(() => cb(null, fetch_data))
			.catch((error)=> cb(error));
		}
		
	}
};

module.exports = website_service;