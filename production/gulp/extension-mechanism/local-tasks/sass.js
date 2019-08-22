var gulp = require('gulp')
	,	async = require('async')
	,	args = require('yargs').argv
	,	map = require('map-stream')
	,	path = require('path')
	,	nconf = require('nconf')
	,	_ = require('underscore');

// It's needed add an extra Sass file as a dependency of MyAccount when 'styleguide' task is called.
// This action is required only to build the Styleguide site.
var styleguide = args._.indexOf('styleguide') !== -1;
var local_folders = _.map(nconf.get('folders:source'), function(folder)
{
	return path.join(folder, '**/*.scss');
});

function generateEntryPoints(cb)
{
	try {
		var manifest_manager = require('../manifest-manager');
		var entryPoints = manifest_manager.getSassBasicEntryPoints();

		function isEntryPoint(file_path) {
			var entry_point = _.find(entryPoints, function (entry_point) {
				return file_path.indexOf(entry_point.replace(/\\/g, path.sep)) !== -1;
			});

			return entry_point;
		}

		var theme_manifest = manifest_manager.getThemeManifest()
			, theme_path = [
			'..'
			, 'extensions'
			, theme_manifest.vendor
			, theme_manifest.name
			, theme_manifest.version
			, ''].join('/');

		gulp.src(local_folders, {follow: true, base: process.cwd()})
			.pipe(manifest_manager.handleOverrides())
			.pipe(map(function (file, cb) {
				var entry_point = isEntryPoint(file.path);
				if (entry_point) {
					var ext_name = entry_point.split(path.sep)[0]
						, manifest = manifest_manager.getManifestByName(ext_name)
						, assets_paths = [
						'..'
						, 'extensions'
						, manifest.vendor
						, manifest.name
						, manifest.version
						, ''].join('/');

					var content = '@function getExtensionAssetsPath($asset){\n';
					content += '@return \'' + assets_paths + '\' + $asset;\n';
					content += '}\n\n';

					content += '@function getThemeAssetsPath($asset){\n';
					content += '@return \'' + theme_path + '\' + $asset;\n';
					content += '}\n\n';

					var file_content = content + file.contents.toString();

					if (styleguide && path.basename(file.path) === 'myaccount.scss') {
						file_content += '@import "../../../../gulp/library/sc5-styleguide/lib/app/css-suitecommerce/_styleguide.scss"'
					}

					file.contents = Buffer.from(file_content);
				}

				if (nconf.get('extensionMode')) {
					file.path = file.path.replace(path.normalize(nconf.get('folders:theme')), '');
				} else {
					file.path = file.path.replace(path.normalize(nconf.get('folders:extensions')), '');
				}

				file.base = path.join(file.base, _.find(nconf.get('folders:source'), (folder) => {
					return file.path.indexOf(folder) !== -1;
				}));

				cb(null, file);
			}))
			.pipe(gulp.dest('tmp', {mode: '0777'}))
			.on('end', cb)
			.on('error', cb);
	}
	catch (error)
	{
		cb(error);
	}
}

function compileEntryPoints(gulpDone)
{
	var manifest_manager = require('../manifest-manager')
		, 	sourcemaps = require('gulp-sourcemaps')
		,	sass = require('gulp-sass');

	var gfile = require('gulp-file');

	var entryPoints = manifest_manager.getSassEntryPoints();

	async.each(_.keys(entryPoints), (entryPoint, cb)=>
	{
		var entrypoint_value = entryPoints[entryPoint];
		gfile(entryPoint + '.scss', entrypoint_value, {src: true})
			.pipe(sourcemaps.init())
			.pipe(sass.sync()).on('error', gulpDone)
			.pipe(map(function(file, cb)
			{
				var file_content = file.contents.toString();
				file_content = file_content.replace(/:\s*\"\\(\\f.*?)\"/ig, ':\"$1\"');

				file.contents = Buffer.from(file_content);
				cb(null, file);
			}))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(path.join(nconf.get('folders:output'), 'css')))
			.on('end', cb);
	}, function()
	{
		gulpDone.apply(this, arguments);
	});
}

module.exports = {
	generateEntryPoints: generateEntryPoints,
	compileEntryPoints: compileEntryPoints,
	local_folders: local_folders
};
