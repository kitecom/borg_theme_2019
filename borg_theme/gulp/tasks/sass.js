'use strict';
var gulp = require('gulp')
,	shell = require('shelljs');

gulp.task('sass-prepare', (cb) =>
{
	var sass_helper = require('../extension-mechanism/local-tasks/sass');
	sass_helper.generateEntryPoints(cb);
});

gulp.task('clean-sass-tmp',(cb) =>
{
	shell.rm('-rf', 'tmp');
	cb();
});

gulp.task('compile-sass', (gulpDone) =>
{
	var watch_manager = require('../extension-mechanism/watch-manager')
	,	sass_helper = require('../extension-mechanism/local-tasks/sass');

	sass_helper.compileEntryPoints(() => {
		// register sass file watch
		var to_execute = ['sass'];

		watch_manager.registerWatch(sass_helper.local_folders, to_execute);

		gulpDone();
	});
});

gulp.task('sass', gulp.series('sass-prepare', 'compile-sass', 'clean-sass-tmp'));
