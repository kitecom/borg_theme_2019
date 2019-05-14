// it install watchers registered in watch-manager

// Note: In linux, if NOENT error, please run:
// echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

'use strict';

var gulp = require('gulp');

function getWatchTaskList()
{
    process.running_local = true;

    var nconf = require('nconf');
	require('./templates');
	require('./sass');
	
	var task_list = ['templates', 'sass', 'assets', 'connect'];

	if (nconf.get('extensionMode'))
	{
		task_list = ['templates', 'sass', 'javascript', 'assets', 'connect'];
	}

	if(nconf.get('credentials:is_scis'))
	{
		task_list = ['javascript', 'assets', 'connect'];
	}

	return task_list;

}

gulp.task('watch', gulp.series(gulp.parallel(getWatchTaskList()), function do_watch(cb)
{
    var watch_manager = require('../extension-mechanism/watch-manager');

	watch_manager.getWatch().map((w)=>
	{
		w.files = w.files.map((file)=> file.replace(/\\/g, '/'));

		gulp.watch(w.files, {interval: 1000}, gulp.parallel(w.tasks));
	});
	cb();
}));
