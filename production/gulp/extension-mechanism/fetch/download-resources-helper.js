'use strict';

var nconf = require('nconf')
,	_ = require('underscore');

var ResourcePromisesHelper = require('./resource-promises-helper');

var DownloadResourcesHelper = {

	getManifestFilePromises: function getManifestFilePromises(manifest)
	{
		var file_promises = this.downloadFiles(manifest);
		return Promise.resolve(file_promises);
	}

,	downloadFiles: function downloadFiles(manifest)
	{
		var allowed_resources = nconf.get('application:application_manifest').extensible_resources
		,	file_promises = [];

		_.each(manifest, function(resource_data, resource)
		{
			if(_.contains(allowed_resources, resource))
			{
				var message_finished = 'Finished downloading ' + resource + ' of ' + manifest.type + ': ' +  manifest.name + '...'
				,	resource_promises;
				
				switch(resource)
				{
					case 'templates':

						resource_promises = ResourcePromisesHelper.getFilesPromisesForAppResource({
                            manifest: manifest
                        ,	resource: resource
                        ,	message_finished: message_finished
                        });

						file_promises = file_promises.concat(resource_promises);
						break;

					case 'sass':

						resource_promises = ResourcePromisesHelper.getFilesPromisesForResource({
                            manifest: manifest
                        ,	resource: resource
                        ,	message_finished: message_finished
                        });

						file_promises.push(resource_promises);
						break;

					case 'assets':

						resource_promises = ResourcePromisesHelper.getAssetFilesPromises({
                            manifest: manifest
                        ,	resource: resource
                        ,	message_finished: message_finished
                        });

						file_promises.push(resource_promises);
						break;

					case 'skins':
					
						resource_promises = ResourcePromisesHelper.getSkinFilesPromises({
                            manifest: manifest
                        ,	resource: resource
                        ,	message_finished: message_finished
                        });

						file_promises.push(resource_promises);
						break;
				}
			}
		});

		return file_promises;
	}
};

module.exports = DownloadResourcesHelper;