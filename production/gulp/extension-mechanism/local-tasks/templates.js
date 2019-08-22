var gulp = require('gulp')
	,	amdOptimize = require('gulp-requirejs-optimize')
	,	async = require('async')
	,	concat = require('gulp-concat')
	,	gif = require('gulp-if')

	,	gulp_handlebars = require('gulp-handlebars')
	,	handlebars = require('handlebars')
	,	path = require('path')
	,	_ = require('underscore');

var manifest_manager = require('../manifest-manager')
	,	watch_manager = require('../watch-manager')
	,	nconf = require('nconf');

var local_folders = _.map(nconf.get('folders:source'), function(folder)
{
	return path.join(folder, '**/*.tpl');
});

function findTemplateDependencies(content)
{
	var regex = /data-\w*\-{0,1}template=\\"([^"]+)\\"/gm
		,	result
		,	deps = ['\'Handlebars\'', '\'Handlebars.CompilerNameLookup\''];
	do
	{
		result = regex.exec(content);
		if(result && result.length > 1)
		{
			deps.push('\'' + result[1] + '.tpl\'');
		}
	}
	while(result);
	return deps;
}

var nameLookup = handlebars.JavaScriptCompiler.prototype.nameLookup;

var wrapTemplates = function()
{
	var lazypipe = require('lazypipe')
		,	map = require('map-stream');

	var handleOverrides = _.bind(manifest_manager.handleOverrides, manifest_manager);

	var theme_manifest = manifest_manager.getThemeManifest()
		,	theme_path = [
		'http://localhost:' + nconf.get('dbConfig').port
		,	'tmp'
		,	'extensions'
		,	theme_manifest.vendor
		,	theme_manifest.name
		,	theme_manifest.version
		,	''].join('/');

	var compile_templates = function compile_templates()
	{
		handlebars.JavaScriptCompiler.prototype.nameLookup = function(parent, name)
		{
			return 'compilerNameLookup(' + parent + ',"' + name + '")';
		};
		return gulp_handlebars({handlebars: handlebars});
	};

	var handlebarsStream = lazypipe()
		.pipe(handleOverrides)
		.pipe(compile_templates)
		.pipe(map, function (file, cb)
		{
			var current_contents = file.contents.toString()
				,	module_name = path.basename(file.path, '.js');

			var deps = findTemplateDependencies(current_contents);

			var extension_path = [
				'http://localhost:' + nconf.get('dbConfig').port
				,	'tmp'
				,	manifest_manager.getTemplateExtensionPath(file.path)
			].join('/');

			file.contents = Buffer.from(
				'define(\'' + module_name + '.tpl\', [' + deps.join(',') + '], function (Handlebars, compilerNameLookup){ var t = ' + current_contents + '; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = \'' + extension_path + '\'; ctx._theme_path = \'' + theme_path + '\'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = \'' + module_name + '\'; return template;});'
			);

			cb(null, file);
		});

	return handlebarsStream;
};

function getThirdParties()
{
	return {
		'LoadTemplateSafe': 'gulp/extension-mechanism/client-script/LoadTemplateSafe'
		,	'Handlebars': 'node_modules/handlebars/dist/handlebars.runtime.min'
		,	'Handlebars.CompilerNameLookup': 'gulp/extension-mechanism/client-script/Handlebars.CompilerNameLookup'
	};
}

function generateLibraryFile(cb)
{
	function getAMDIndexFile(requiredFiles)
	{
		var requiredModules = _.map(requiredFiles, function(f){return path.basename(f, '.js');});
		var indexName = 'index-javascript-lib';
		var counter = 0;

		var indexContent =
			'define(\''+indexName+'\', [' +
			_.map(requiredModules, function(m)
			{
				if(m.indexOf('handlebars.runtime') === 0)
				{
					return '\'Handlebars\'';
				}

				return '\'' + m + '\'';
			}).join(', ') +
			'], function(' +
			_.map(requiredModules, function()
			{
				counter++;
				return 'a' + counter;
			}).join(', ') +
			'){});';

		return {name: indexName, content: indexContent};
	}

	var shell = require('shelljs')
		,   outputFile = `javascript-libs.js`;

	//Check if the libs file already exists
	if(shell.test('-f', path.join(nconf.get('folders:output'), outputFile)))
	{
		cb();
		return;
	}

	var	files = getThirdParties()
		,   indexFile = getAMDIndexFile(_.values(files))
		,	amdOptimizeConfig = {
		paths: files
		,	preserveLicenseComments: true
		,	optimize: 'none'
		,	rawText: {}
	};

	amdOptimizeConfig.rawText[indexFile.name] = indexFile.content;

	var gfile = require('gulp-file');

	gfile(indexFile.name + '.js', '', {src: true})
		.pipe(amdOptimize(amdOptimizeConfig)).on('error', cb)
		.pipe(concat(outputFile))
		.pipe(gulp.dest(nconf.get('folders:output'), { mode: '0777' }))
		.on('end', cb);
}

function runTemplates(gulpDone)
{
	var condition = function(file)
	{
		return path.basename(file.path) !== 'javascript-libs.js';
	};

	async.each(manifest_manager.getTemplateApplications(), (application, cb)=>
	{
		var templates = manifest_manager.getApplicationTemplates(application, true);
		var stream = wrapTemplates();

		gulp.src(_.union([path.join(nconf.get('folders:output'), 'javascript-libs.js')], templates))
			.pipe(gif(condition, stream())).on('error', gulpDone)
			.pipe(concat(application + '-templates.js'))
			.pipe(gulp.dest(nconf.get('folders:output')))
			.on('end', cb);
	}, function()
	{
		handlebars.JavaScriptCompiler.prototype.nameLookup = nameLookup;
		gulpDone.apply(this, arguments);
	});
}

function runTemplatesLocal(gulpDone)
{
	var map = require('map-stream')
		,   shell = require('shelljs')
		,   db_config = nconf.get('dbConfig');

	async.each(manifest_manager.getTemplateApplications(), (application, cb)=>
	{
		var paths = {}
			,   templates = manifest_manager.getApplicationTemplates(application, true);

		var stream = wrapTemplates();

		gulp.src(templates)
			.pipe(stream())
			.pipe(map(function(file, cb)
			{
				file.path = file.path.replace('.js', '.tpl.js');

				paths[path.basename(file.path, '.js')] = `tmp/processed-templates/${path.basename(file.path, '.js')}`;

				file.base = path.dirname(file.path);

				cb(null, file);
			}))
			.pipe(gulp.dest(path.join(nconf.get('folders:output'), 'processed-templates')))
			.on('end', ()=>
			{
				var protocol = db_config.https ? 'https' : 'http';
				var content = `require.config({
                "paths": ${JSON.stringify(paths, null, 4)}
            ,   "baseUrl": '${protocol}://localhost:${db_config.port}'
            });`;

				var dest_file = path.join(
					nconf.get('folders:output')
					,   `${application}-templates.js`
				);

				console.log(dest_file);

				shell.ShellString(content).to(dest_file);
				cb();
			});
	}, function()
	{
		gulpDone.apply(this, arguments);
	});

	// register templates file watch
	watch_manager.registerWatch(local_folders, ['templates']);
}

module.exports = {
	runTemplates: runTemplates
	,   runTemplatesLocal: runTemplatesLocal
	,	generateLibraryFile: generateLibraryFile
};
