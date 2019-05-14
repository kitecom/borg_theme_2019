'use strict';

var fs = require('fs')
,	nconf = require('nconf')
,	path = require('path')
,	usage = require('gulp-help-doc')
,	gulp = require('gulp');

process.gulp_init_cwd = process.env.INIT_CWD || process.cwd();

//
// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. A file located at 'path/to/config.json'
//
nconf.argv()
	.env()
	.file('config', 'gulp/config/config.json');

var argv = nconf.argv
    ,	argv_opt = {};
nconf.argv = function(options)
{
    var _ = require('underscore');
    _.extend(argv_opt, options);
    argv.apply(nconf, [argv_opt]);
};

nconf.set('config_path', 'gulp/config/config.json');

var nsdeploy_path = require('./gulp/extension-mechanism/credentials-inquirer').nsdeploy_path;

if (!nconf.get('to') || !fs.existsSync(nsdeploy_path))
{
	nconf.file('credentials', nsdeploy_path);
}
else
{
	var config = JSON.parse(fs.readFileSync(nsdeploy_path).toString());

	if(config.credentials.is_scis)
	{
		nconf.set('credentials:is_scis', config.credentials.is_scis);
	}
}

if(nconf.get('extensionMode'))
{
	if (['update-manifest', 'extension:update-manifest', 'extension:local', 'extension:deploy'].indexOf(process.argv[2]) !== -1)
	{
		require('./gulp/extension-mechanism/init')();
	}
}
else
{
	if (['update-manifest', 'theme:update-manifest', 'theme:local', 'theme:deploy'].indexOf(process.argv[2]) !== -1)
	{
		require('./gulp/extension-mechanism/init')();
	}
}

// evaluate all gulp tasks files
var baseTaskDir = path.resolve(__dirname, './gulp/tasks');
fs.readdirSync(baseTaskDir).forEach(function(task_name)
{
	if (/\.js/.test(task_name))
	{
		require(path.join(baseTaskDir, task_name.replace('.js', '')));
	}
});

/**
 * This simply defines help task which would produce usage
 * display for this gulpfile.
 */
gulp.task('help', function()
{
	return usage(gulp);
});
gulp.task('default', gulp.parallel('help'));
