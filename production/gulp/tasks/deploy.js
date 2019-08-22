'use strict';

var gulp = require('gulp')
,	log = require('fancy-log')
,	c = require('ansi-colors')
,	nconf = require('nconf')
,	deploy_task_helper = require('../extension-mechanism/deploy/deploy-task-helper');

//declare all possible command line arguments
nconf.argv(
	{
		'deploy_config:create': {
			alias: 'create'
		,	describe: '--create Automatically will upload the local extension to a new folder and create a new extension record.'
		,	demand: false
		}

	,	'deploy_config:update': {
			alias: 'update'
		,	describe: '--update Automatically will deploy the folders, and update the version of the extension record if necessary.'
		,	demand: false
		,	default: true
		}

	,	'deploy_config:advanced': {
			alias: 'advanced'
		,	describe: '--advanced The deploy will give the option to update the extension version, description and targets.'
		,	demand: false
		,	default: false
		}

	,	'deploy_config:skip_compilation': {
	      alias: 'skip-compilation',
	      describe: '--skip-compilation Skip extra compilation of the sass and templates to check for syntax errors, and upload directly the source code and manifest',
	      demand: false,
	      default: false
	    }

	,	'deploy_config:source': {
	      alias: 'source',
	      describe: '--source <source> Deploy only sass or templates files',
	      demand: false,
	      default: false
	    }

	,	'credentials:vm': {
	      alias: 'vm',
	      describe: 'Virtual Machine',
	      demand: false
	    }

	,	'credentials:molecule': {
	      alias: 'm',
	      describe: 'Molecule',
	      demand: false
	    }

	,	'credentials:nsVersion': {
	      alias: 'nsVersion',
	      describe: 'Version',
	      demand: false
	    }

	,	'deploy_config:debug_mode': {
			alias: 'debug'
		,	describe: '--debug will upload javascript without minifying.'
		,	demand: false
		,	default: false
		}
	}
);

deploy_task_helper.syncThemeFolder();
deploy_task_helper.syncExtensionsFolder();

function startDeploy(cb)
{
	var deploy_lib = require('../extension-mechanism/deploy/deploy');

	var task = nconf.get('extensionMode') ? 'extensions' : 'themes',
	sources = nconf.get('extensionMode') ? 'javascript, ssp-libraries, sass, templates, assets, etc.' : 'sass, templates, assets.'

	log('+- Starting deploy process...');

	if(!_isSkipCompilation()){
		log('+- You can use ' + c.cyan('--skip-compilation') + ' to deploy ' + task + ' faster.');
	}

	if(!nconf.get('deploy_config:source')){
		log('+- You can use ' + c.cyan('--source') + ' option to upload only ' + sources);
	}

	log('+- Type ' + c.cyan('gulp') + ' for extra help on how to use the commands.');

	deploy_lib.deploy(cb);
}

function _isSkipCompilation()
{
	return nconf.get('deploy_config:skip_compilation');
}

var compilation_tasks = [];
if(!_isSkipCompilation())
{
	var deploy_task_helper = require('../extension-mechanism/deploy/deploy-task-helper');
	compilation_tasks = deploy_task_helper.getCompilationTasks();
	compilation_tasks = [gulp.parallel(compilation_tasks)];
}
compilation_tasks.push(startDeploy);

if(nconf.get('extensionMode'))
{
	/**
	* Uploads an extension to the File Cabinet and creates or updates necessary records.
	*
	* @task {extension:deploy}
	* @order {8}

	* @arg {skip-compilation} Skips all the compilation tasks and uploads the extension directly.
	* @arg {source} Comma separated list of resources to deploy. Possible values: templates,sass,ssp-libraries,services,assets,configuration.
	* @arg {create} Creates a new extension, instead of updating the current one.
	* @arg {advanced} Updates the extension record: vendor, name, version, and description.
	* @arg {preserve-manifest} Do not automatically update the manifest.json file.
    * @arg {m <arg>} Deploys to molecule named <arg>. i.e. "gulp extension:deploy --m f" deploys to system.f.netsuite.com.
  	* @arg {to} Asks for credentials, ignoring .nsdeploy file.
	*/
	gulp.task('extension:deploy', gulp.series(compilation_tasks));
}
else
{
	/**
	* Uploads the theme to the File Cabinet and creates or updates necessary records.
	* @task {theme:deploy}
	* @order {8}

	* @arg {skip-compilation} Skips all the compilation tasks and uploads the theme directly.
	* @arg {source} Comma separated list of resources to deploy. Possible values: templates,sass,assets,skins.
	* @arg {create} Creates a new theme, instead of updating the current one.
	* @arg {advanced} Updates the theme record: vendor, name, version, and description. Available for custom themes.
	* @arg {preserve-manifest} Do not automatically update the manifest.json file.
    * @arg {m <arg>} Deploys to molecule named <arg>. i.e. "gulp theme:deploy --m f" deploys to system.f.netsuite.com.
  	* @arg {to} Asks for credentials, ignoring .nsdeploy file.
	*/
	gulp.task('theme:deploy', gulp.series(compilation_tasks));
}
