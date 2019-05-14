/*
@module gulp.copy
#gulp copy

This gulp task will copy the files declared in the 'copy' property of ns.package.json. For example, if a module need to copy some static files to be available then in the filecabinet, it can declare something like this:

	{
		"gulp": {
			"copy": [
				"someFolder/** /*"
			]
		}
	}

and the content of 'someFolder' will be copied to the output respecting its internal folder structure
*/

/* jshint node: true */
'use strict';

var gulp = require('gulp')
,	package_manager = require('../package-manager');


gulp.task('copy', function(cb)
{
    var to_copy = package_manager.getGlobsFor('copy');
    if(!to_copy || !to_copy.length)
    {
        return cb();
    }
    
	return gulp.src(to_copy)
		.pipe(gulp.dest(process.gulp_dest), { mode: '0777' });
});
