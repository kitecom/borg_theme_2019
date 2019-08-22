var gulp = require('gulp')
	,	nconf = require('nconf');

require('./update-manifest');

nconf.argv(
	{
		'preserveManifest': {
			alias: 'preserve-manifest'
			,	describe: '--prserve-manifest Do not automatically update the manifest.json file.'
			,	demand: false
		}
	}
);

function do_validate(cb)
{
	var validate_helper = require('../extension-mechanism/local-tasks/validate-manifest');

	return validate_helper.validateManifests(cb);
}

var validate_dep = nconf.get('preserveManifest') ? [] : [gulp.parallel('update-manifest')];
validate_dep.push(do_validate);
/**
 * Validates the manifest file.
 * @task {validate}
 * @group {Utility tasks}
 */
gulp.task('validate', do_validate);
gulp.task('update-validate', gulp.series(validate_dep));

module.exports = {
	validate: do_validate
};
