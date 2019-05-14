/* jshint node: true */

/*
@module gulp.ssp-files

The task 'gulp ssp-files' will copy the .ssp files declared in property "ssp-files" of module's ns.package.json.

It supports handlebars templates which context contains the timestamp property - a timestamp generated at build time
that can be used to timstamp references to .js and .css files. It also supports a {{js}} Handlebars template to minify
embedded JavaScript Code.
*/

'use strict';

var gulp = require('gulp')
	, fs = require('fs')
	, map = require('map-stream')
	, glob = require('glob')
	, path = require('path')
	, Handlebars = require('handlebars')
	, package_manager = require('../package-manager')
	, helpers = require('./helpers')
	, esprima = require('esprima')
	, escodegen = require('escodegen')
	, args = require('yargs').argv;

gulp.task('ssp-files', function (cb)
{
	var files_map = package_manager.getFilesMapFor('ssp-files');

	installHandlebarsHelpers();

	var ssp_files = Object.keys(files_map);
	if(!ssp_files || !ssp_files.length)
	{
		return cb();
	}

	return gulp.src(ssp_files)
		.pipe(package_manager.handleOverrides())
		.pipe(helpers.map_renamer(files_map))
		.pipe(ssp_template())
		.pipe(gulp.dest(process.gulp_dest
			, {
				mode: '0777'
			}));
});

var lastFile;

function ssp_template(files_map)
{
	return map(function (file, cb)
	{
		lastFile = file;
		var template = Handlebars.compile(file.contents.toString())
			, template_context = buildTemplateContextFor(file)
			, result = template(template_context);

		file.contents = Buffer.from(result);

		cb(null, file);
	});
}

function buildTemplateContextFor(file)
{
	var starterFile = fs.readFileSync('./gulp/templates/ssp-files-applicationStarter.tpl', {encoding: 'utf8'}).toString();

	var starterTemplate = Handlebars.compile(starterFile);

	var dependencies = fs.readFileSync('./gulp/templates/ssp-files-dependencies.tpl', {encoding: 'utf8'}).toString();
	var template = Handlebars.compile(dependencies);

	var context = {
		timestamp: require('./helpers').getTimestamp()
		, distro: package_manager.distro
		, arguments: args
	};

	context.dependencies = template();

	var shoppingStarter = context.distro.tasksConfig.javascript.filter(e => e.exportFile == 'shopping.js')[0];
	shoppingStarter = shoppingStarter ? shoppingStarter.entryPoint : shoppingStarter;

	var myAccountStarter = context.distro.tasksConfig.javascript.filter(e => e.exportFile == 'myaccount.js')[0];
	myAccountStarter = myAccountStarter ? myAccountStarter.entryPoint : myAccountStarter;

	var checkoutStarter = context.distro.tasksConfig.javascript.filter(e => e.exportFile == 'checkout.js')[0];
	checkoutStarter = checkoutStarter ? checkoutStarter.entryPoint : checkoutStarter;

	var appStarterMap = {
		'shopping.ssp': shoppingStarter,
		'shopping-local.ssp': shoppingStarter,
		'my_account.ssp': myAccountStarter,
		'my_account-local.ssp': myAccountStarter,
		'checkout.ssp': checkoutStarter,
		'checkout-local.ssp': checkoutStarter
	}

	if(file.relative.replace('-local', '') == 'checkout.ssp'){
		var afterApplicationStarts = fs.readFileSync('./gulp/templates/ssp-files-checkoutAfterApplicationStartsParameters.tpl', {encoding: 'utf8'}).toString();
		var afterApplicationStartsTemplate = Handlebars.compile(afterApplicationStarts);
		context.applicationStarter = starterTemplate({starterName: appStarterMap[file.relative], afterApplicationStarts: afterApplicationStartsTemplate()});
	}else{
		context.applicationStarter = starterTemplate({starterName: appStarterMap[file.relative]});
	}

	return context;
}

function installHandlebarsHelpers()
{
	Handlebars.registerHelper('js', function (options)
	{
		var s = options.fn(this);
		return doUglify(s);
	});
}

function doUglify(s)
{
	try
	{
		var ast = esprima.parse(s);
		s = escodegen.generate(ast
			, {
				format: escodegen.FORMAT_MINIFY
			}) || s;
	}
	catch (ex)
	{
		console.log('WARNING: Error trying to uglify JavaScript code in ssp-file ' + lastFile.path + '. Not uglified. ');
		console.log('Reason:', ex)
	}
	return s;
}
