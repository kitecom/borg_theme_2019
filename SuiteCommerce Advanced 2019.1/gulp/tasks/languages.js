/* jshint node: true */
'use strict';

var gulp = require('gulp')
,	path = require('path')

,	log = require('fancy-log')
,	c = require('ansi-colors')
,	uglify = require('gulp-uglify')
,	package_manager = require('../package-manager')
,	helpers = require('./helpers')

,	map = require('map-stream')
,	_ = require('underscore')

,	prefix_map = {
		'ShoppingApplication':'shopping_'
	,	'MyAccountApplication':'myaccount_'
	,	'CheckoutApplication':'checkout_'
	,	'PosApplication':'scis_'
};

function parsePath(file_path) {
	var extname = path.extname(file_path);
	return {
		dirname: path.dirname(file_path),
		basename: path.basename(file_path, extname),
		extname: extname
	};
}

gulp.task('languages', function(cb)
{
	var transform_keys = _.keys(prefix_map);

	var languages = package_manager.getGlobsFor('languages');
	if(!languages || !languages.length)
	{
		return cb();
	}

	return gulp.src(languages)
		.pipe(package_manager.handleOverrides())
		.pipe(helpers.notDev(uglify()))
		.pipe(map(function(file, cb)
		{
			var parsed_path = parsePath(file.relative)
			,	prefix_key = _.find(transform_keys, function(key) { return file.base.indexOf(key) >= 0; })
			,	prefix = prefix_map[prefix_key];

			if(!prefix)
			{
				log(c.magenta('Warning: No prefix found for '), file.path);
				cb();
			}
			else
			{
				file.path = path.join(file.base, parsed_path.dirname, prefix + parsed_path.basename + parsed_path.extname);
				cb(null, file);
			}
		}))
		.pipe(gulp.dest(path.join(process.gulp_dest, 'languages'), { mode: '0777' }));
});

gulp.task('watch-languages', function()
{
	gulp.watch(package_manager.getGlobsFor('languages'), {interval: 500}, gulp.series('languages'));
});
