/* jshint node: true */

/*
@module gulp.ssp-libraries

This gulp task will compile the project's backend's JavaScript output file. In the distro.json the ssp-libraries section contains
a reference a list of all back-end models used to generate the back-end entry point

#Usage

	gulp ssp-libraries

##Declaring ssp-libraries in ns.package.json

The javascript files that are able to be compiled are those referenced by the property gulp.ssp-libraries
in module's ns.package.json file. Example:

	{
		"gulp": {
			...
		,	"ssp-libraries": [
				"SuiteScript/*.js"
			]
		}
	}
*/

'use strict';

var fs = require('fs')
    , gulp = require('gulp')
    , _ = require('underscore')
    , map = require('map-stream')
    , async = require('async')
    , concat = require('gulp-concat')
    , amdOptimize = require('gulp-requirejs-optimize')
    , shell = require('shelljs')
    , path = require('path')
    , File = require('vinyl')
    , through = require('through')

    , package_manager = require('../package-manager');

require('./configuration');

var isSCIS = !package_manager.distro.isSCA && !package_manager.distro.isSCLite;

//@function addRequireToFile Adds require.js (almond) configuration and release metadata into the final file
//@param {File} file
//@param {Object} config
//@param {Function<Error, File>} cb
//@return {Void}
function addRequireToFile(file, config, cb)
{
    package_manager.getReleaseMetadata(function (err, metadata)
    {
        if (err)
        {
            return cb(err);
        }

        var require_file_path = package_manager.getGlobsForModule('almond', 'ssp-libraries')[0]
            , result = '';

        result += '__sc_ssplibraries_t0 = new Date().getTime(); \n';
		result += 'window.suiteLogs = window.suiteLogs || ' + !!~process.argv.indexOf('--suitelogs') + '; \n';

        // output metadata as a global variable
        if (metadata)
        {
            result += 'release_metadata = ' + JSON.stringify(metadata) + '\n';
        }

        result += fs.readFileSync(require_file_path
            , {
                encoding: 'utf8'
            }).toString() + '\n';
        result += file.contents.toString() + '\n';
        result += 'require.config(' + JSON.stringify(config.amdConfig) + ');\n';

        file.contents = Buffer.from(result);
        cb(null, file);
    });
}

// generates a bootstrapper script that requires the starter script using require.js
function generateEntryPointContent(config)
{
    var inv_path = _.invert(config.amdConfig.paths);

    var onFile = function (file)
    {
        var normalized_path = path.resolve(file.path)
        ,   moduleName = path.basename(normalized_path, '.js')
        ,   relativePath = normalized_path.replace(/\\/g, '/').replace(/\.js$/, '');

        // patch, configuration in scis is coming from both modules SspLibraries and
        // PosApplication, we need that it comes from PosApplication
        if (isSCIS && moduleName === 'Configuration')
        {
            if (relativePath.includes('PosApplication'))
            {
                config.amdConfig.paths[inv_path[moduleName] || moduleName] = relativePath;
            }
        }
        else
        {
            config.amdConfig.paths[inv_path[moduleName] || moduleName] = relativePath;
        }

        config.amdConfig.rawText[relativePath] = file.contents.toString();
    };

    var onEnd = function ()
    {
        var start_point = 'define(\'' + config.entryPoint + '\', [\'' + config.dependencies.join('\', \'') + '\'], function (){});';

        config.amdConfig.rawText[config.entryPoint] = start_point;

        var file = new File(
        {
            path: config.entryPoint
        ,   contents: Buffer.from('')
        });

        this.emit('data', file);
        this.emit('end');
    };

    return through(onFile, onEnd);
}

//@function generateLibrariesForConfig Generate a combined output with all require backend files for a particular configuration
//@param {Object} config
//@param {Function<Error, File>} cb
//@return {Void}
function generateLibrariesForConfig(config, cb)
{
    var configRequire = JSON.parse(JSON.stringify(config));

    config = JSON.parse(JSON.stringify(config));
    config.amdConfig.paths = config.amdConfig.paths || {};
    config.amdConfig.rawText = config.amdConfig.rawText || {};
    config.amdConfig.optimize = 'none';

    var configurationManifestDefaultsPath = path.join(process.gulp_dest, 'configurationManifestDefaults.json');

    gulp.src(package_manager.getGlobsFor('ssp-libraries'))
        .pipe(package_manager.handleOverrides())
        .pipe(generateEntryPointContent(config))
        .pipe(amdOptimize(config.amdConfig))
        .pipe(map(function (file, cb)
        {
            var product;
            if (package_manager.distro.isSCA)
            {
                product = '"SCA"';
            }
            else if (package_manager.distro.isSCLite)
            {
                product = '"SCS"';
            }
            else
            {
                product = '"SCIS"';
            }

            var text = 'BuildTimeInf={isSCLite: ' + package_manager.distro.isSCLite + ', product: ' + product + '}\n';

            if (!package_manager.getTaskConfig('configuration.ignore', false))
            {
                text += 'ConfigurationManifestDefaults = ' + shell.cat(configurationManifestDefaultsPath) + ';\n';
            }
            file.contents = Buffer.from(file.contents.toString() + '\n' + text);

            file.path = config.exportFile;
            cb(null, file);
        }))
        .pipe(map(function (file, cb)
        {
            addRequireToFile(file, configRequire, cb);
        }))
        .on('error', function (err)
        {
            cb(err);
        })
        .pipe(gulp.dest(process.gulp_dest, {mode: '0777'}))
        .on('end', function (err)
        {
            shell.rm('-f', configurationManifestDefaultsPath);
            cb(err);
        });
}

// Calculates how many css files did bless generate for each of the relevant ssps
// And then injects that amount in the ssp template using cssnumbers parameter
function cssNumbersForFile(file)
{
    var glob = require('glob')
        , files = [];

    if (file === 'shopping')
    {
        files = glob.sync(path.join(package_manager.getNonManageResourcesPath(), 'css_ie/shopping*.css'));
    }
    else if (file === 'my_account')
    {
        files = glob.sync(path.join(package_manager.getNonManageResourcesPath(), 'css_ie/myaccount*.css'));
    }
    else if (file === 'checkout')
    {
        files = glob.sync(path.join(package_manager.getNonManageResourcesPath(), 'css_ie/checkout*.css'));
    }

    return files.length;
}

function addIeCssFiles()
{
    if (process.is_SCA_devTools || isSCIS)
    {
        return '';
    }

    var app_includes = '\n'
        , ie_css = {
        'shopping': cssNumbersForFile('shopping')
        , 'myaccount': cssNumbersForFile('my_account')
        , 'checkout': cssNumbersForFile('checkout')
    };

    _.each(ie_css, function (css_count, app)
    {
        app_includes += 'app_includes.' + app + '.ie = ';

        var ie_files = [];
        for (var i = 0; i < css_count; i++)
        {
            var ie_file = 'css_ie/' + app + (i ? '_' + i : '') + '.css';

            ie_files.push(ie_file);
        }

        app_includes += JSON.stringify(ie_files) + ';\n';
    });

    app_includes += '\n_.each(app_includes, function(app){\n';

    app_includes += '\tapp.ie = _.map(app.ie, function(file){\n';
    app_includes += '\t\treturn Application.getNonManageResourcesPathPrefix() + file;\n';
    app_includes += '\t});\n';

    app_includes += '});\n';

    return app_includes;
};

gulp.task('ssp-libraries-no-dep', function(cb)
{
    var configs = package_manager.getTaskConfig('ssp-libraries', []);

    configs = _.isArray(configs) ? configs : [configs];

    async.each(
        configs
    ,   generateLibrariesForConfig
    ,   cb
    );
});

gulp.task('ssp-libraries-ext', function(cb)
{
    var config = package_manager.getTaskConfig('ssp-libraries', []);

    gulp.src(package_manager.getGlobsFor('ssp-libraries-ext'))
        .pipe(map(function (file, cb)
        {
            var app_manifest_string = 'var app_manifest = ' + JSON.stringify(package_manager.distro.app_manifest ||
                {}, null, '\t') + ';\n\n';
            //for backward compatibility SCS will always require as SCA
            var scs_patch = 'if(app_manifest.type === "SCS") {\n' +
                '\trequire(\'SCA\');\n } else {\n';

            var require_string = app_manifest_string + scs_patch + '\trequire(app_manifest.type);\n}\n';
            file.contents = Buffer.from(require_string + file.contents.toString() + addIeCssFiles());
            cb(null, file);
        }))
        .pipe(gulp.dest(process.gulp_dest
            , {
                mode: '0777'
            }))
        .on('end', function (err)
        {
            cb(err);
        });
});

var deps = !process.is_SCA_devTools ? ['sass'] : [];

gulp.task('ssp-libraries', gulp.parallel(gulp.series(deps, 'ssp-libraries-ext'), gulp.series('configuration', 'ssp-libraries-no-dep')));
