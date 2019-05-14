﻿/* jshint node: true */
/*
@module gulp.local

This gulp task will start a local development environment server. The idea is to have a agile development environment
where the user just modify the project JavaScript, Sass, Less and templates and they are automatically compiled and
even the browser is reloaded to show the changes.

##JavaScript

For compiling JavaScript internally it uses the task 'gulp javascript' so it support two main modalities

#Usage: compiilng JavaScript like in production

	gulp local

#Usage: loading JavaScript with require js

This is more agile for working because JavaScript don't need to be compiled:

	gulp local --js require

##Implementation

Files are watched using nodejs watch and when changes are detected specific gulp task are called to compiling files,
like gulp javascript, gulp sass, gulp templates etc.

*/

'use strict';
 
var gulp = require('gulp');

function initServer(cb)
{
    var	log = require('fancy-log')
    ,	args   = require('yargs').argv
    ,	package_manager = require('../package-manager')
    ,   http_config = package_manager.getTaskConfig('local.http', false)
	,	https_config = package_manager.getTaskConfig('local.https', false);

	if (!http_config && !https_config)
	{
		log('No server configuration specified in the files');
		cb();
	}

	(args.nginx ? initServerNginx : initServerExpress)(http_config, https_config, cb);
}

function installExpressMiddleware(app)
{
    var express = require('express')
    ,	args   = require('yargs').argv
    ,	package_manager = require('../package-manager')
    ,	serveIndex = require('serve-index');
    
	// Allow CORS requests in server
	app.use(function (req, res, next)
	{
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', '*');
		next();
	});

	if(args.instrumentFrontend)
	{
		var instrumentConfig = {
			coverageServer: args.coverageServer || 'http://localhost:8080'
		};
		require('./istanbul-instrument').installInstrumentFrontendMiddleware(app, instrumentConfig)
	}

	app.use('/', express.static(process.gulp_dest));
	app.use('/Modules', express.static(package_manager.env.srcDir));
	app.use('/', serveIndex(process.gulp_dest));
	app.use('/Modules', serveIndex(package_manager.env.srcDir));
    
    //Service used by the index-local.ssp files to know what files load
    app.use('/who/:app', whoService);
    //Serves the script patch to run almond and requirejs together
    app.use('/require_patch.js', requirePatchService);

	// we also serve jasmine library for the unit tests
	var jasmine = package_manager.getModuleFolder('jasmine');

	if(jasmine)
	{
		app.use('/jasmine', express.static(jasmine));
		app.use('/jasmine', serveIndex(jasmine));
	}
}

function requirePatchService(req, res)
{
    var response = function require_patch()
    {
        Object.defineProperty(window, 'define', {
          set: function(val) {
            if(!window.__my_define){
                   window.__my_define = val;
            }
          },
          get: function() {
                   return window.__my_define;
          }
        });

        Object.defineProperty(window, 'require', {
          set: function(val) {
            if(!window.__my_require){
                   window.__my_require = val;
            }
          },
          get: function() {
                   return window.__my_require;
          }
        });

        Object.defineProperty(window, 'requirejs', {
          set: function(val) {
            if(!window.__my_require){
                   window.__my_require = val;
            }
          },
          get: function() {
                   return window.__my_require;
          }
        });
    };
    
    res.setHeader('Content-Type', 'application/javascript');
    res.send(`${response}; require_patch();`);
}

function whoService(req, res)
{
    var protocol = req.protocol
    ,   host = req.get('host')
    ,   app = req.params.app;
    
    //A null url make the local ssp file grab the resource from backend (production)
    
    var css = {
            tag: 'link'
        ,   resource: 'css'
        ,   url: `${protocol}://${host}/css/${app}.css`
        }
    
    ,   require_patch = {
            tag: 'script'
        ,   resource: 'require_patch'
        ,   url: `${protocol}://${host}/require_patch.js`
        }
    
    ,   requirejs = {
            tag: 'script'
        ,   resource: 'requirejs'
        ,   url: `${protocol}://${host}/javascript/require.js`
        }
    
    ,   templates = {
            tag: 'script'
        ,   resource: 'templates'
        ,   url: null
        }
    
    ,   js_core = {
            tag: 'script'
        ,   resource: 'js_core'
        ,   url: `${protocol}://${host}/javascript/${app}.js`
        }
    
    ,   js_extensions = {
            tag: 'script'
        ,   resource: 'js_extensions'
        ,   url: null
        };
    
    var response;
    if(process.is_SCA_devTools)
    {
        //Released core devtools doesn't provide tpl nor sass, so we grab them from backend
        css.url = null;
        
        response = [
            css
        ,   require_patch
        ,   requirejs
        ,   templates
        ,   js_core
        ,   js_extensions
        ];
    }
    else
    {
        response = [
            css
        ,   requirejs
        ,   js_core
        ,   js_extensions
        ];
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
}

function initServerExpress(http_config, https_config, cb)
{
    var express = require('express')
    ,   c = require('ansi-colors')
    ,	path = require('path')
    ,	fs = require('fs')
    ,   app = express();
    
	installExpressMiddleware(app);
    
    var	batch_logger = require('../library/batch-logger');
	var logger = batch_logger();

	// Starts the http server
	if (http_config)
	{
		app.listen(http_config.port, '0.0.0.0', cb);
		logger.push('+- Local http server available at: ', c.cyan(
			'http://localhost:' + http_config.port + '/'
		));
	}

	// Starts the https server
	if (https_config)
	{
		var https = require('https')
		,	keyfile
		,	certfile;

		try
		{
			keyfile = process.env[https_config.key] || https_config.key;
			certfile = process.env[https_config.cert] || https_config.cert;

			var https_options = {
				key: fs.readFileSync(keyfile, 'utf8')
			,	cert: fs.readFileSync(certfile, 'utf8')
			};

			var server = https.createServer(https_options, app);

			server.listen(https_config.port, '0.0.0.0');
			logger.push('+- Local https server available at: ', c.cyan(
				'https://localhost:' + https_config.port + '/'
			));
		}
		catch(ex)
		{
			logger.push(c.red('+- Could not start secure local server. Reason: ' + ex.toString()));
		}
	}

	logger.push('+- Watching current folder: ', c.cyan(path.join(process.cwd(), 'Modules')));
	logger.push('+- To cancel Gulp Watch enter: ', c.cyan('control + c'));
	logger.flush();
}

function initServerNginx(http_config, https_config, cb)
{
    var _ = require('underscore')
    ,   path = require('path')
    ,	fs = require('fs')
    ,	package_manager = require('../package-manager')
    
    ,   nginxBasePath = path.resolve(path.join('gulp', 'nginx'))
    ,   configTemplate = fs.readFileSync(path.join(nginxBasePath, 'configuration.tpl'), 'utf8')
    ,   httpTemplate  = fs.readFileSync(path.join(nginxBasePath, 'http.conf.tpl'), 'utf8')
    ,   httpsTemplate  = fs.readFileSync(path.join(nginxBasePath, 'https.conf.tpl'), 'utf8');

	var templateOptions = {
		http_config: !!http_config
	,	https_config: !!https_config
	,	rootDir: path.resolve('.')
	,	localDistributionPath: JSON.stringify(process.gulp_dest)
	,	srcDir: package_manager.env.srcDir
	};

	var configResult = _.template(configTemplate)(templateOptions);
	fs.writeFileSync(path.join(nginxBasePath, 'configuration'), configResult, 'utf8');

	if(http_config)
	{
		var httpResult = _.template(httpTemplate)(templateOptions);
		fs.writeFileSync(path.join(nginxBasePath, 'http.conf'), httpResult, 'utf8');
	}

	if(https_config)
	{
		templateOptions.keyfile = process.env[https_config.key] || https_config.key;
		templateOptions.certFile = process.env[https_config.cert] || https_config.cert;
		var httpsResult = _.template(httpsTemplate)(templateOptions);
		fs.writeFileSync(path.join(nginxBasePath, 'https.conf'), httpsResult, 'utf8');
	}

	var nginxArguments = [
		'-c', 'configuration'
	,	'-p', nginxBasePath
	];

	try
	{
		fs.mkdirSync(path.join(nginxBasePath, 'temp'));
	}
	catch(err)
	{}

	try
	{
		fs.mkdirSync(path.join(nginxBasePath, 'logs'));
	}
	catch(err)
	{}

    var child_process = require('child_process');
	var nginx_process = child_process.spawn('nginx', nginxArguments
	, {
		stdio: [0, 1, 2]
	});
	cb = _.once(cb);
	nginx_process.on('error', cb);
	setTimeout(function ()
	{
		cb(null, nginx_process);
	}, 2000);
}

gulp.task('local-install', function(cb)
{
    var package_manager = require('../package-manager');
	// just define a flag so other tasks know if they must exit on error or not. i.e. when 'gulp local' we don't want to kill the local server on sass, handlebars, javascript errors.
	package_manager.isGulpLocal = true;
	cb();
});

gulp.task('init-server', initServer);

gulp.task('local', gulp.series('local-install', 'frontend', gulp.parallel('watch', 'init-server')));

// TODO remove in the future
gulp.task('local-nginx', function(cb)
{
	cb('Use gulp local --nginx');
});

module.exports = {
	initServerNginx
	, initServerExpress
	, initServer
	, installExpressMiddleware
};
