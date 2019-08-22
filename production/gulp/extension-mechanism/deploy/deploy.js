var async = require('async')
,	fs = require('fs')
,	log = require('fancy-log')
,	c = require('ansi-colors')
,	PluginError = require('plugin-error')
,	path = require('path')
,	shell = require('shelljs')
,	nconf = require('nconf')
,	_ = require('underscore');

var credentials_inquirer = require('../credentials-inquirer')
,	extension_record_helper = require('../extension-record-helper.js')
,	skins_record_helper = require('../skin-record-helper.js')
,	extension_deploy_inquirer = require('./deploy-inquirer.js')
,	prepare_deploy_folder = require('./prepare-deploy-folder.js')
,	ConversionTool = require('../conversion-tool')
,	FileCabinet = require('../../library/file-cabinet')
,	FileServiceClient = require('../client-script/FileServiceClient')
,	Progress = require('progress')
,	Uploader = require('ns-uploader');

var extension_deployer = {

	deploy: function deploy(done)
	{
		var manifest_path,
			manifest;

		passInitialData = function passInitialData(first_cb)
		{
			if(!nconf.get('extensionMode'))
			{
				if(manifest.type !== "theme")
				{
					first_cb(new Error('Manifest type for theme ' + manifest.name + '-' + manifest.version +
						 ' is not valid. Type must be "extension".'));
				}
			}
			if(!extension_deploy_inquirer.validateExtensionName(manifest.name))
			{
				return first_cb(new Error('Manifest name "' + manifest.name + '" must include only alphanumeric characters, underscores and must start with an alphabetic character.'));
			}

			first_cb(null, {manifest: manifest, manifest_path: manifest_path});
		};

		

		var waterfall = [
				passInitialData
			,	credentials_inquirer.getCredentials
			,	extension_record_helper.checkExtensionBundle
			,	extension_deploy_inquirer.inquireNewExtensionData
			,	prepare_deploy_folder.prepareDeployFolder
			,	extension_record_helper.checkExistingExtension
			,	extension_deployer.createExtensionDeployFolder
			,	extension_deployer.uploadExtension
			,	extension_deployer.getManifestFileId
			,	extension_record_helper.updateExtensionRecord
			,	extension_deployer.openActivationWizard
			,	extension_deployer.updateLocalEnvironment
		];

		//in extension mode the manifest is the manifest of the extension selected
		if(nconf.get('extensionMode'))
		{
			waterfall.splice( 0, 1, extension_deploy_inquirer.inquireDeployExtension);
		}
		else {
			//after update theme record update skins records
			manifest_path = path.join(nconf.get('folders:theme_path'), 'manifest.json');
			manifest = JSON.parse(fs.readFileSync(manifest_path).toString());
			waterfall.splice( waterfall.length - 2, 0, skins_record_helper.syncSkinsRecords);
		}

		//result contains the credentials and application_manifest
		async.waterfall(waterfall, function (err)
		{
			if (err)
			{
				var error = (err.error && err.error.message) || err;

				if(error === 'ETIMEDOUT')
				{
					error = 'Network Error. Please check your Internet Connection.';
				}

				var task_name = nconf.get('extensionMode') ? 'extension:deploy' : 'theme:deploy';

				done(new PluginError('gulp ' + task_name, error));
				return;
			}

			done(null, {});
			return;
		});
	}

,	createExtensionDeployFolder: function createExtensionDeployFolder(data, cb)
	{
		var config_path = nconf.get('config_path');

		var createRemoteDeployFolder = function createRemoteDeployFolder()
		{
            FileServiceClient.getInstance()
			.createFolder(nconf.get('folders:extensions_dest_name'), nconf.get('folders:extmech_parent'))
			.then(function(response)
			{
				log(c.green('Extensions Deploy folder: SuiteScripts/' +
					nconf.get('folders:extensions_dest_name') +
					'. ID ' + response.result.folder_id));

				nconf.set('folders:extensions_dest', response.result.folder_id);
				var config_content = JSON.parse(fs.readFileSync(config_path).toString());
				config_content.folders = nconf.get('folders');
				fs.writeFileSync(config_path, JSON.stringify(config_content, null, 4));

				cb(null, data);
			})
			.catch(function(err)
			{
				cb(err);
			});
		};

		if(nconf.get('folders:extensions_dest'))
		{
			FileServiceClient.getInstance()
			.getFolder(nconf.get('folders:extensions_dest'))
            .then(function(response)
            {
                if(!response.result.folder || response.result.folder.name !== nconf.get('folders:extensions_dest_name'))
                {
                    createRemoteDeployFolder();
                }
                else
                {
                    cb(null, data);
                }
            })
            .catch(function(err)
            {
                if(err !== 'That record does not exist.')
                {
                    return cb(err);
                }
                createRemoteDeployFolder();
            });
		}
		else
		{
			createRemoteDeployFolder();
		}

	}

,	uploadExtension: function uploadExtension(data, cb)
	{
		var credentials = nconf.get('credentials');

		var config = {
			targetFolderId: nconf.get('folders:extensions_dest')
		,	sourceFolderPath: nconf.get('folders:deploy')
		};

		var t0 = new Date().getTime();
		var uploader = new Uploader(credentials);

		var bar;
		uploader.addProgressListener(function(actual, total)
		{
			if(!bar)
			{
				bar = new Progress('Uploading Files [:bar] :percent', {
					complete: '='
				,	incomplete: ' '
				,	width: 50
				,	total: total
				});
			}
			bar.tick(1);
		});

		uploader
		.main(config)
		.then(function (ns_upload_manifest)
		{
			var extension_folder = _.find(ns_upload_manifest, function(folder)
			{
				var aux = [
					data.new_manifest.vendor
				,	data.new_manifest.name + '@' + data.new_manifest.version
				].join('\/');

				aux = aux.replace(/\./g, '\.');

				return (new RegExp(aux + '$')).test(folder.path);
			});

			data.extension_folder_id = extension_folder && extension_folder.internalId;

			var took = ((new Date().getTime() - t0)/1000/60) + '';
			took = took.substring(0, Math.min(4, took.length)) + ' minutes';
			log(c.green('\n\tDeploy ' + data.new_manifest.name + ' files finished, took ' + took));
			cb(null, data);
		})
		.catch(function(err)
		{
			log('Error uploading files.\nDeploy aborted.');
			cb(err);
		});
	}

,	getManifestFileId: function getManifestFileId(data, cb)
	{
		log(c.green('Getting manifest file id for ' + data.manifest.type + '...'));

		if(data.extension_folder_id)
		{
			FileCabinet.setCredentials(nconf.get('credentials'));

			FileCabinet.searchFile(
				{
					name: 'manifest.json'
				,	folder: data.extension_folder_id
				}
			,	function searchExtensionManifestDone(err, response)
				{
					if(err)
					{
						return cb(err);
					}

					if(response.records.length > 0)
					{
						response = response.records[0];
						data.manifest_file_id = response.internalId + '';

						cb(null, data);
					}
					else
					{
						cb(new Error('Could not find new manifest.json uploaded in folder ' + data.extension_folder_id + '.'));
					}

				}
			);
		}
		else
		{
			data.manifest_file_id = data.extension_record.manifest_id;
			cb(null, data);
		}
	}

,	updateLocalEnvironment: function updateLocalEnvironment(data, cb)
	{
		log(c.green('Updating your local environment to continue working with ' + data.new_manifest.name + '/' + data.new_manifest.version));

		fs.writeFileSync(data.manifest_path, JSON.stringify(data.new_manifest, null, 4));

		if(data.new_manifest.name !== data.manifest.name)
		{
			var ext_folder = nconf.get('extensionMode') ? data.ext_folder : nconf.get('folders:theme_path');

			shell.cp('-rf', ext_folder, path.join(nconf.get('folders:source:source_path'), data.new_manifest.name));
			shell.rm('-rf', ext_folder);

			if(nconf.get('extensionMode'))
			{
				ConversionTool.updateConfigPaths(data.new_manifest,
					{
						replace: true
					,	replace_path: nconf.get('folders:source:source_path') + '/' + data.manifest.name
				});
			}
			else
			{
				ConversionTool.updateConfigPaths(data.new_manifest);
			}
		}

		cb(null, data);
	}

,	openActivationWizard: function openActivationWizard(data, cb)
	{
		// recommends the user to open a browser to finish activation
		var credentials = nconf.get('credentials');
		var deploy_path = 'SuiteScripts/Deploy_Extensions/' + data.new_manifest.vendor + '/' + data.new_manifest.name + '@' + data.new_manifest.version;

		if(data.new_manifest.cct && nconf.get('deploy_config:create')) {

			var cct = data.new_manifest.cct[data.new_manifest.cct.length -1];

			log(c.green('Finished deploying your Custom Content Type.'));
			log(c.green('To see your CCT in the SMT Panel, you will need to:'));

			log(
				c.green('\n\t1- ') + 'Go to Customization -> List,Records & Fields -> Record Types -> New.\n' +
				c.green('\t2- ') + 'Create a custom record with id ' + c.green(cct.settings_record) + ' with ACCESS TYPE field set to "No permission required".\n' +
				c.green('\t3- ') + 'Add all the fields your CCT will need.\n' +
				c.green('\t4- ') + 'Go to Lists -> Website -> CMS Content Type -> New.\n' +
				c.green('\t5- ') + 'Create a new CMS Content Type with name ' + c.green(cct.registercct_id) + '\n\tand linked it to the custom record you created in the previous steps.\n' +
				c.green('\t6- ') + 'Set the ICON IMAGE PATH field to the absolute url of the icon deployed in: \n\t"' + deploy_path + '/assets/' + cct.icon + '".\n' +
				c.green('\t7- ') + 'Activate the extension for your domain as explained below.\n' +
				c.green('\t8- ') + 'Go to the site, press ESC to go to the SMT Panel, and check that your CCT was added correctly.\n'
			);
		}

		log(c.yellow('\n\n                             IMPORTANT NOTE:                             ' +
									'\n\nThe deploy process is not done until you finished the activation process in the Netsuite ERP.' +
									'\nGo to system.netsuite.com and open the Extension Management Panel in Setup > SuiteCommerce Advanced > Extension Management.' +
									'\n\nPlase follow the next steps:' +
									'\n1- Select Website and domain ' + credentials.domain +
									'\n2- Activate the ' + data.new_manifest.type + ': ' + data.new_manifest.name + ' - ' + data.new_manifest.version + '. Vendor ' + data.new_manifest.vendor + '.'+
									'\nThank you.'));
		cb(null, data);
	}
};

module.exports = {
	deploy: extension_deployer.deploy
};
