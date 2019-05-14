'use strict';

var log = require('fancy-log')
,	c = require('ansi-colors')
,	nconf = require('nconf')
,	_ = require('underscore')
;

var ConversionTool = require('../conversion-tool')
,	RecordHelper = require('../extension-record-helper')
,	ResourcePromisesHelper = require('./resource-promises-helper');

var DownloadResourcesHelper = {

	getManifestFilePromises: function getManifestFilePromises(manifest, cb)
	{
		var isFetchExtension = manifest.type === 'extension' && nconf.get('fetchConfig:extension') && _.contains(nconf.get('fetchConfig:extension').split(','), manifest.name)
		,	self = this
		,	promise_result
		;

		if(manifest.type === 'theme' || isFetchExtension)
		{
			if(isFetchExtension)
			{
				promise_result = RecordHelper.searchExtensions({manifest: manifest})
                .then(function handleBundleCheckResult(result)
                {
                    if(result.extension_record && result.has_bundle)
                    {
                        log(c.yellow('Cannot fetch packaged extension ' + manifest.name +'.\n'  +
                            '\tYou can only fetch custom extensions located in your file cabinet.\n'));

                        return [];
                    }
                    else
                    {
                        ConversionTool.updateConfigPaths(manifest);
                        return self.downloadFiles(manifest);
                    }

                })
                .catch(function(error)
                {
                    cb(error);
                });
			}
			else
			{
				var file_promises = this.downloadFiles(manifest);
				promise_result = Promise.resolve(file_promises);
			}

		}
		else
		{
			promise_result = Promise.resolve([]);
		}

		return promise_result;
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
					case 'javascript':

						resource_promises = ResourcePromisesHelper.getFilesPromisesForAppResource({
                            manifest: manifest
                        ,	resource: resource
                        ,	message_finished: message_finished
                        });

						file_promises = file_promises.concat(resource_promises);
						break;

					case 'sass':
					case 'ssp-libraries':
					case 'configuration':

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
				}
			}
		});

		return file_promises;
	}
};

module.exports = DownloadResourcesHelper;
