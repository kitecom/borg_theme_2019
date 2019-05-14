'use strict';

var gulp = require('gulp');

function clean_js_tmp(cb)
{
	var javascript_task = require('../extension-mechanism/local-tasks/javascript')
	,   shell = require('shelljs')
	,   path = require('path')
    ,   nconf = require('nconf')
	,	del = require('del');

	if(shell.test('-d', javascript_task.js_destination))
	{
		del.sync(path.join(nconf.get('folders:output'), 'extensions', '*_ext.js'), {force: true});
		cb();
	}
	else
	{
		shell.mkdir('-p', javascript_task.js_destination);
		cb();
	}
};

gulp.task('javascript', gulp.series(clean_js_tmp, function process_javascript(cb)
{
	var javascript_task = require('../extension-mechanism/local-tasks/javascript');
	javascript_task.compileJavascript(cb);
}));

gulp.task('watch-javascript', gulp.series('javascript'));
