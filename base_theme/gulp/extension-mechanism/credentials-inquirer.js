log/* jshint node: true */
/*
	@module credentials_inquirer

	Deals with all the details of getting the credentials from the user to deploy,
	also all the details to get the activation data: domain, subsidiary location and the app_manifest.json file.
*/

var async = require('async')
,	fs = require('fs')
,	log = require('fancy-log')
,	c = require('ansi-colors')
,	PluginError = require('plugin-error')
,	inquirer = require('inquirer')
,	path = require('path')
,	_ = require('underscore')
,	shell = require('shelljs')
;

var deploy_task = require('../ns-deploy/index')
,	ui = require('../ns-deploy/ui')
,	net = require('../ns-deploy/net')
,	WebsiteService = require('./website-service')
;

var nconf = require('nconf');

var application_manifest_path = path.join(nconf.get('folders:application_manifest'), 'application_manifest.json')
, 	nsdeploy_path = path.join('gulp', 'config', '.nsdeploy')
;

//the only way to identify if we need to ask for subsidiary and location
const SCIS_NAME = 'SCIS';

function alphabeticSort(a, b)
{
	return a.name.localeCompare(b.name);
}

var credentials_inquirer = {

	nsdeploy_path: nsdeploy_path

	/*
		@method writeCredentials writes the usual deploy credentials in the file .nsdeploy
		and the application manifest and other configuration data relevant to the extension mechanism
		inside the extension_mechanism folder.
	*/
,	writeCredentials: function writeCredentials(fetch_data, cb)
	{
		fetch_data.credentials.roleId = fetch_data.credentials.role;

		var credentials_to_save = _.extend({}, fetch_data.credentials);

		if(shell.test('-f', nsdeploy_path) && shell.cat(nsdeploy_path).toString().trim() !== '{}')
		{
			var saved_credentials = JSON.parse(shell.cat(nsdeploy_path).toString());
			if(!saved_credentials.credentials.password)
			{
				delete credentials_to_save.password;
			}
		}
		else
		{
			delete credentials_to_save.password;
		}

		if(credentials_to_save.email_default)
		{
			delete credentials_to_save.email_default;
		}


		fs.writeFileSync(nsdeploy_path, JSON.stringify({credentials: credentials_to_save }, null, 4));

		nconf.set('credentials', fetch_data.credentials);

		if(fetch_data.application_manifest)
		{
			nconf.set('application:application_manifest', fetch_data.application_manifest);
		}

		cb(null, fetch_data);
	}

,	writeApplicationManifest: function writeApplicationManifest()
	{
		fs.writeFileSync(application_manifest_path, JSON.stringify(nconf.get('application:application_manifest'), null, 4));
	}
	/*
		@method getCredentials gets all the credentials of the account, password, ssp application folder
		website, and domain and also the application manifest
	*/

,	getCredentials: function getCredentials(fetch_data, done)
	{
		if(fs.existsSync(application_manifest_path))
		{
			try
			{
				nconf.set('application:application_manifest', JSON.parse(fs.readFileSync(application_manifest_path).toString()));
			}
			catch(error)
			{
				nconf.set('application:application_manifest', null);
			}
		}

		var credentials = nconf.get('credentials')
		,	application_manifest = nconf.get('application').application_manifest;

        if(!credentials || !credentials.user_agent)
        {
            var package_json = JSON.parse(fs.readFileSync('./package.json'))
            ,   extensionMode = nconf.get('extensionMode');

            if(!extensionMode){
                package_json.name = package_json.name.replace('extension', 'theme');
            }

            var user_agent = package_json.name + '/' + package_json.version;

            credentials = credentials || {};
            credentials.user_agent = user_agent;
        }

		function handleResult(err, result)
		{
			if (err)
			{
				var error = (err.error && err.error.message) || err;

				if(error === 'ETIMEDOUT')
				{
					error = 'Network Error. Please check your Internet Connection.';
				}

				var task_name = nconf.get('extensionMode') ? 'extension:fetch' : 'theme:fetch';
				done(new PluginError('gulp ' + task_name + ' getCredentials', error));
				return;
			}

			done(null, result);
		}

		if (!nconf.get('ask_credentials') &&
			credentials && credentials.email && credentials.domain &&
			application_manifest)
		{
			if(!credentials.password)
	        {
	        	async.waterfall([
	        			function passInitialData(first_cb)
						{
							var initial_data = {
                                options: {
                                    molecule: credentials.molecule
                                }
                            ,   info: {
                                    email: credentials.email
                                ,   user_agent: credentials.user_agent
                                }
                            ,   credentials: credentials
                            };

							if(fetch_data)
							{
								initial_data = _.extend(initial_data, fetch_data);
							}

							first_cb(null, initial_data);
						}
					,	credentials_inquirer.askPassword
					,	credentials_inquirer.validateCredentials
					,	credentials_inquirer.transformCredentials
					,	credentials_inquirer.writeCredentials
	        		]

	        	,	handleResult
				);
	        }
	        else
	        {
	        	async.waterfall([
						function passInitialData(first_cb)
						{
							var initial_data = {
                                options: {
                                    molecule: credentials.molecule
                                }
                            ,   info: {
                                    email: credentials.email
                                ,   password: credentials.password
                                ,   user_agent: credentials.user_agent
                                }
                            ,   credentials: credentials
                            };

							if(fetch_data)
							{
								initial_data = _.extend(initial_data, fetch_data);
							}

							first_cb(null, initial_data);
						}
					,	credentials_inquirer.validateCredentials
					,	credentials_inquirer.transformCredentials
					,	credentials_inquirer.writeCredentials
					]

	        	,	handleResult
				);
	        }
		}
		else
		{
			var waterfall = [
				function passInitialData(first_cb)
				{
					var initial_data =  {
						credentials: credentials || {}
					,	application_manifest: application_manifest || {}
					,	info: {user_agent: credentials.user_agent}
					,	options: {molecule: credentials && credentials.molecule}
					};

					if(fetch_data)
					{
						initial_data = _.extend(initial_data, fetch_data);
					}

					first_cb(null, initial_data);
				}
			,	deploy_task.doUntilGetRoles
			,	credentials_inquirer.doUntilGetWebsiteAndDomain
			,	credentials_inquirer.writeCredentials
			];

			//result contains the credentials and application_manifest
			async.waterfall(
				waterfall
			,	handleResult
			);
		}
	}

,	askPassword: function askPassword(fetch_data, cb)
	{
		inquirer.prompt([{
			type: 'password'
		,   name: 'password'
		,   message: 'Password'
		,   validate: (input) =>
			{
				return input.length > 0 || 'Please enter a password';
			}
		}])
		.then((answers) =>
		{
			fetch_data.info.password = answers.password;
			cb(null, fetch_data);
		});
	}

,	validateCredentials: function validateCredentials(fetch_data, cb)
	{
		net.roles(fetch_data, (err) =>
		{
			if(err)
			{
				cb(err);
			}
			else
			{
				nconf.set('credentials:password', fetch_data.info.password);
				cb(null, fetch_data);
			}
		});
	}

,	transformCredentials: function transformCredentials(fetch_data, cb)
	{
		if(fetch_data.credentials)
		{
			_.extend(fetch_data.credentials, fetch_data.info);
            nconf.set('credentials', fetch_data.credentials);
		}

		if(fetch_data.roles)
		{
			delete fetch_data.roles;
		}

		delete fetch_data.info;
		delete fetch_data.options;

		cb(null, fetch_data);
	}

,	doUntilGetWebsiteAndDomain: function doUntilGetWebsiteAndDomain(fetch_data, cb)
	{
		var credentials_tasks = [
			async.apply(ui.roles, fetch_data)
			,	credentials_inquirer.transformCredentials
			,	WebsiteService.getWebsites
			,	WebsiteService.getWebsiteDomains
			,	credentials_inquirer.selectWebsite
		];

		//do not ask all the activation data if just deploying
		if (['extension:deploy', 'theme:deploy'].indexOf(process.argv[2]) < 0)
		{
			credentials_tasks = credentials_tasks.concat(
				[
					credentials_inquirer.selectDomain
				,	credentials_inquirer.selectSubsidiary
				,	credentials_inquirer.selectLocation
				]
			);
		}

		async.waterfall(
			credentials_tasks
		,	function(err)
			{
				if (err)
				{
					cb(err);
					return;
				}

				cb(null, fetch_data);
			}
		);

	}

,	selectWebsite: function selectWebsite(fetch_data, cb)
	{
		if(!fetch_data.websites)
		{
			cb(new Error('You must have installed in your account the Extension Mechanism Bundle.\nError trying to request available websites and domains.'));
		}
		else
		{
			inquirer.prompt([{
				type: 'list'
			,	name: 'website'
			,	message: 'Choose your website'
			,	choices: _.map(fetch_data.websites, (ws) =>
				{
					return {
						name: ws.name
					,	value: ws.website_id
					};

				}).sort(alphabeticSort)
			}])
			.then((answers) =>
			{
				fetch_data.credentials.website = answers.website;
				cb(null, fetch_data);
			});
		}
	}

,	selectDomain: function selectDomain(fetch_data, cb)
	{
		var domains = fetch_data.websites[fetch_data.credentials.website].domains;

		log(c.yellow('Select the correct options to identify the corresponding activation...'));

		inquirer.prompt([{
				type: 'list'
			,	name: 'domain'
			,	message: 'Choose your domain'
			,	choices: domains.map(function(domain)
				{
					return {
						name: domain.domain
					,	value: domain.domain
					};
				}).sort(alphabeticSort)
			}])
		.then((answers) =>
		{
			fetch_data.credentials.domain = answers.domain;
			var domain_data = _.find(domains, function(data)
				{
					return data.domain === fetch_data.credentials.domain;
				});

			fetch_data.credentials.webapp_id = domain_data.app_id;
			fetch_data.credentials.target_folder = domain_data.folder_id;
			fetch_data.application_manifest = domain_data.manifest;

			fetch_data.credentials.is_scis = fetch_data.application_manifest.type === SCIS_NAME;
			cb(null, fetch_data);
		});
	}

,	selectSubsidiary: function selectSubsidiary(fetch_data, cb)
	{
		var subsidiaries = fetch_data.websites[fetch_data.credentials.website].subsidiaries,
			all_sub_choice = {
				name: 'All the subsidiaries',
				value: null
			};

		if(fetch_data.credentials.is_scis)
		{
			inquirer.prompt([{
				type: 'list',
				name: 'subsidiary',
				message: 'Choose the subsidiary',
				choices: [all_sub_choice]
						 .concat(
							_.map(subsidiaries, (sub) =>
							{
								return {
									name: sub.subsidiary_name,
									value: sub.subsidiary_id
								};

							})
						)
			}])
			.then((answers) =>
			{
				fetch_data.credentials.subsidiary = answers.subsidiary;
				fetch_data.credentials.location = null;
				cb(null, fetch_data);
			});
		}
		else
		{
			cb(null, fetch_data);
		}
	}

,	selectLocation: function selectLocation(fetch_data, cb)
	{
		var all_locations_choice = {
			name: 'All the locations of the subsidiary',
			value: null
		};

		if(fetch_data.credentials.is_scis && fetch_data.credentials.subsidiary)
		{
			WebsiteService.getSubsidiaryLocations(fetch_data)
			.then(() =>
			{
				return inquirer.prompt([{
						type: 'list',
						name: 'location',
						message: 'Choose the location',
						choices: [all_locations_choice]
								.concat(
									_.map(fetch_data.locations, (loc) =>
									{
										return {
											name: loc.location_name,
											value: loc.location_id
										};

									})
								)
					}]);
			})
			.then((answers)=>{

				fetch_data.credentials.location = answers.location;
				cb(null, fetch_data);
			})
			.catch((error) => cb(error));
		}
		else
		{
			cb(null, fetch_data);
		}
	}
};

module.exports  = credentials_inquirer;
