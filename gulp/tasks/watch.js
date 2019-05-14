var gulp = require('gulp')
,	package_manager = require('../package-manager');

var watch_deps = [
	'watch-javascript'
,	'watch-languages'
];

!process.is_SCA_devTools && watch_deps.push(['watch-templates']);

watch_deps = !process.is_SCA_devTools ? watch_deps.concat(['watch-sass', 'watch-fonts', 'watch-images']) : watch_deps;

gulp.task('watch', gulp.parallel(watch_deps));