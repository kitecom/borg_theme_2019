var gulp = require('gulp')
,	c = require('ansi-colors')
,	PluginError = require('plugin-error')
,	nconf = require('nconf')
,	yeoman = require('yeoman-environment')
,	_ = require('underscore');

'use strict';

var env = yeoman.createEnv();
env.register(require.resolve('generator-extension'), 'extension');
env.register(require.resolve('generator-extension/generators/module/index.js'), 'extension:module');
env.register(require.resolve('generator-extension/generators/cct/index.js'), 'extension:cct');

var extensions_path = nconf.get('folders:source:source_path');

//add all the extension manfiests
function registerExtensions()
{
	var fs = require('fs')
	,	path = require('path');

	var new_extensions_path = []
	,	workspace_ext_path;

	if(!fs.existsSync(extensions_path))
	{
		fs.mkdirSync(extensions_path);
	}

	_.each(fs.readdirSync(extensions_path), function(folder)
	{
		var manifest_path = path.join(extensions_path, folder);

		if(fs.statSync(manifest_path).isDirectory())
		{
			var isExtraFolder = nconf.get('folders:source:extras_path') && nconf.get('folders:source:extras_path').includes(folder);

			if(!isExtraFolder)
			{

				workspace_ext_path = manifest_path;
				new_extensions_path.push(workspace_ext_path);
			}
		}
	});

	//update extension paths
	new_extensions_path = new_extensions_path.map((path) => path.replace('\\', '/'));
	var config_content = JSON.parse(fs.readFileSync(nconf.get('config_path')).toString());
	nconf.set('folders:extensions_path', new_extensions_path);
	config_content.folders = nconf.get('folders');
	fs.writeFileSync(nconf.get('config_path'), JSON.stringify(config_content, null, 4));
}

function create(cb)
{
	registerExtensions();

	var options = {
		gulp_context: 'gulp/generator-extension'
	,	work_folder: nconf.get('folders:source:source_path')
	,	config_path: nconf.get('config_path')
	,	deploy_folder: nconf.get('folders:extensions_dest_name')
	,	force: true
	};

	env.run('extension', options, cb)
	.on('error', function(error)
	{
		//do not show stack on predetermined errors
		if(error.message.includes('operation was cancelled') || error.message.includes('Canceling'))
		{
			cb(new PluginError('gulp extension:create', c.yellow(error)));
			process.exit(2);
		}
 		else
 		{
			cb(new PluginError('gulp extension:create', c.yellow(error)));
 		}
  	});
}

function createModule(cb)
{
	registerExtensions();

	if(nconf.get('folders:extensions_path').length === 0)
	{
		cb(new PluginError('gulp extension:create-module', 'Sorry. No valid extensions were found for you to add a new module'));
	}
	else
	{
		var options = {
			gulp_context: 'gulp/generator-extension'
		,	work_folder: nconf.get('folders:source:source_path')
		,	config_path: nconf.get('config_path')
		,	deploy_folder: nconf.get('folders:extensions_dest_name')
		,	force: true
		};

		env.run('extension:module', options, cb);
	}
}

function createCCT(cb)
{
	registerExtensions();

	if(nconf.get('folders:extensions_path').length === 0)
	{
		cb(new PluginError('gulp extension:create-cct', 'Sorry. No valid extensions were found for you to add a new CCT'));
	}
	else
	{
		var options = {
			gulp_context: 'gulp/generator-extension'
		,	work_folder: nconf.get('folders:source:source_path')
		,	config_path: nconf.get('config_path')
		,	deploy_folder: nconf.get('folders:extensions_dest_name')
		,	force: true
		};

		env.run('extension:cct', options, cb)
		.on('error', function(error)
		{
			if(error.message.includes('operation was cancelled') || error.message.includes('Canceling'))
			{
				cb(new PluginError('gulp extension:create-cct', c.yellow(error)));
				process.exit(2);
			}
			else
			{
				cb(new PluginError('gulp extension:create-cct', c.yellow(error)));
 			}
  		});
	}
}

/**
 * Scaffolds an extension for you.
 * @task {extension:create}
 * @order {1}
 */
gulp.task('extension:create', create);

/**
 * Adds an example module into an extension.
 * @task {extension:create-module}
 * @order {3}
 */
gulp.task('extension:create-module', createModule);

/**
 * Adds an example CCT into an extension.
 * @task {extension:create-cct}
 * @order {2}
 */
gulp.task('extension:create-cct', createCCT);
