var log = require('fancy-log')
,	c = require('ansi-colors')
,	fs = require('fs')
,	shell = require('shelljs')
,	nconf = require('nconf')
,	path = require('path')
,	_ = require('underscore')
;

var ConversionTool = require('../conversion-tool');

function getCompilationTasks()
{
    require('../../tasks/validate');
    require('../../tasks/templates');
    require('../../tasks/sass');

	var deploy_config = nconf.get('deploy_config');
	nconf.set('deploy_config', deploy_config);

	var compilation_tasks = nconf.get('credentials:is_scis') ? ['update-validate'] : ['update-validate', 'templates', 'sass'],
	application_manifest = nconf.get('application:application_manifest');

	if(nconf.get('extensionMode'))
	{
        require('../../tasks/javascript');
		compilation_tasks.push('javascript');
	}

	//select tasks to execute if --source argument is passed
	if(application_manifest && deploy_config.source)
	{
		var sources = deploy_config.source.split(',')
		,	valid_sources = nconf.get('application:application_manifest').extensible_resources
		;

		sources = _.filter(sources, function(source)
		{
			if(!nconf.get('extensionMode'))
			{
				return _.contains(['templates', 'sass', 'assets', 'skins'], source);
			}

			return _.contains(valid_sources, source);
		});

		//the sources that I need to execute compilation task
		var sources_tasks = _.filter(sources, function(source)
		{
			return _.contains(compilation_tasks, source);
		});

		nconf.set('deploy_config:source', sources);
		compilation_tasks = ['update-validate'].concat(sources_tasks);
		compilation_tasks = deploy_config.skip_compilation ? ['update-validate'] : compilation_tasks;

		log(c.green('Deploying only ' + sources.join(',') + '...'));
	}

	return compilation_tasks;
}

// In case the developer has updated the theme name in the manifest,
// rename the folder and update config paths accordingly
function syncThemeFolder() {

	if(_.indexOf(['theme:deploy', 'theme:local'], process.argv[2]) !== -1)
	{
		if(nconf.get('folders:theme_path') && fs.existsSync(nconf.get('folders:theme_path')) &&
			fs.existsSync(path.join(nconf.get('folders:theme_path'), 'manifest.json')))
		{
			var manifest_path = path.join(nconf.get('folders:theme_path'), 'manifest.json')
			,	manifest = JSON.parse(fs.readFileSync(manifest_path).toString());

			var config_theme_path = nconf.get('folders:theme_path')
			,	manifest_theme_path = path.join(nconf.get('folders:source:source_path'), manifest.name);

			if(path.sep !== '/')
			{
				config_theme_path = config_theme_path.replace('/', '\\');
			}

			if(config_theme_path !== manifest_theme_path)
			{
				shell.cp('-rf', config_theme_path, manifest_theme_path);
				shell.rm('-rf', config_theme_path);
				ConversionTool.updateConfigPaths(manifest);
			}
		}
	}
}

function syncExtensionsFolder() {
	if(_.indexOf(['extension:deploy', 'extension:local'], process.argv[2]) !== -1)
	{
		if(nconf.get('folders:extensions_path'))
		{
			var extensions = nconf.get('folders:extensions_path');
			_.each(extensions, function(ext_folder)
			{
				var manifest_path = path.join(ext_folder, 'manifest.json')
				,	manifest = JSON.parse(fs.readFileSync(manifest_path).toString());

				var configured_ext_path = ext_folder
				,	manifest_ext_path = path.join(nconf.get('folders:source:source_path'), manifest.name);

				if(path.sep !== '/')
				{
					configured_ext_path = configured_ext_path.replace('/', '\\');
				}

				if(configured_ext_path !== manifest_ext_path)
				{
					shell.cp('-rf', configured_ext_path, manifest_ext_path);
					shell.rm('-rf', configured_ext_path);
					ConversionTool.updateConfigPaths(manifest, {replace: true, replace_path: ext_folder});
				}
			});
		}
	}
}

module.exports = {
	getCompilationTasks: getCompilationTasks,
	syncThemeFolder: syncThemeFolder,
	syncExtensionsFolder: syncExtensionsFolder
};
