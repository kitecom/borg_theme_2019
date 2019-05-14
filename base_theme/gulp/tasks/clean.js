var gulp = require('gulp')
,	nconf = require('nconf')
,	shell = require('shelljs');

/**
 * Removes temporary files and folders
 *
 * @task {clean}
 * @order {4}
 * @group {Utility tasks}
 */
gulp.task(
	'clean'
,	(cb) =>
	{
		try
		{
			shell.rm('-rf', '.nsdeploy tmp ' + nconf.get('folders:local') + ' ' + nconf.get('folders:deploy') + ' '
				+ require('../extension-mechanism/credentials-inquirer').nsdeploy_path);
			cb();
		}
		catch (error)
		{
			cb(error);
		}
	}
);
