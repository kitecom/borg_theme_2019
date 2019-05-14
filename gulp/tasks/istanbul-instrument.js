'use strict';

/* jshint node: true */
/*
@module gulp.istanbul-instrument

Collection of gulp tasks related to front end code instrumentation and coverage reports with istanbuljs

Deploy front end insturmented code that will post information to "coverage-server":

	gulp deploy --instrument-frontend --coverage-server http://localhost:8080

Perform unit test with insturmented code:

	gulp unit-test --modules Utilities --instrument-frontend --coverage-server http://localhost:8080	

Run gulp local front end instrumented code that will post information to "coverage-server":

	gulp local --instrument-frontend --coverage-server http://localhost:8080

Local server that collect the coverage information from the front end:

	gulp coverage-server --port 8080 --coverage-folder ./todaysCoverageData

Tool for building reports from local coverage files:

	gulp coverage-report --input ./todaysCoverageData --output ./todaysCoverageReport

*/


//TODO: we are only instrumenting those loaded .js files and not all of them. So the coverage will be higher than the real one because there could be some files that are not required() and so the report wont consider them. We need to automatically add ALL .js files to the reporter so all of them are considered. 

var gulp = require('gulp')
,	package_manager = require('../package-manager')
,	fs = require('fs')
,	path = require('path')
,	args   = require('yargs').argv
,	shell = require('shelljs')
,	_ 	  = require('underscore');


// coverage report : 

function coverageReport(config)
{
	shell.rm('-rf', 'html-report');

	var libCoverage = require('istanbul-lib-coverage');
	var map;

	var coverageFileCount = shell.ls(config.input).length;

    for (var i = 0; i < coverageFileCount; i++)
	{
        if(fs.existsSync(path.join(config.input, 'file' + i + '.json'))) {
            var data = fs.readFileSync(path.join(config.input, 'file' + i + '.json')).toString();
            data = JSON.parse(data);

            var map2 = libCoverage.createCoverageMap(data);
            if (!map) {
                map = map2;
            }
            else {
                map.merge(map2);
            }
        }
	}
	if(map)
	{
		var istanbulAPI = require('istanbul-api');
		//set the output path.
		var configObj = istanbulAPI.config.loadFile();
		configObj.reporting.config.dir = config.output;
		//load the new configuration and build the report
		var reporter = istanbulAPI.createReporter(configObj);
		reporter.addAll(['json', 'lcov', 'text', 'html']);
		
		reporter.write(map);
	}	
}

gulp.task('coverage-report', function(cb)
{
	var config = {
		input: args.input || '__coverage__',
		output: args.output || '__coverage__output',
		format: 'html'
	};
	coverageReport(config);
	cb();
});

// coverage server: 
var express = require('express');
var serveIndex = require('serve-index');

var covExpressServer = undefined;

function coverageServer(config, cb)
{
	var app = express();
	app.use('/incremental', express.static(config.coverageIncrementalReport), serveIndex(config.coverageIncrementalReport, {'icons': true}));
	app.use('/last-report', express.static(config.coverageLastReport), serveIndex(config.coverageLastReport, {'icons': true}));

	var coverageFileCount = shell.ls(config.coverageFolder).length
	
    app.post('/__coverage__', function(req, res, next)
	{
		var data = '';
		req.setEncoding('utf8');
		req.on('data', function(chunk) 
		{
			data += chunk;
		})
		req.on('end', function() 
		{
			console.log('writting '+data.length);
			shell.mkdir(config.coverageFolder);
			fs.writeFileSync(path.join(config.coverageFolder, 'file' + coverageFileCount + '.json'), data);
			coverageFileCount++;
		});
	});
	app.get('/', function(req, res, next)
	{
		res.send('OK');
	});
	app.get('/reset', function(req, res, next)
	{
		coverageFileCount = 0;
        shell.rm('-rf', config.coverageFolder);
		res.send('Reseted');
	});	
	app.get('/report-incremental', function(req, res, next)
	{
		
		shell.rm('-rf', config.coverageIncrementalReport);
		shell.mkdir(config.coverageIncrementalReport);
		
		var configReport = {
			input:  config.coverageFolder,
			output: config.coverageIncrementalReport,
			format: 'html'
		};
		
		coverageReport(configReport);
		res.send('DONE: go to > http://your.server/incremental')

	});
    app.get('/final-report', function(req, res, next)
    {
		shell.mkdir(config.coverageLastReport);
		
    	console.log('output-folder: ', req.query.distro);
		
        var configReport = {
            input:  config.coverageFolder,
            output: config.coverageLastReport,
            format: 'html'
        };
		
		if(req.query.distro)
		{
			configReport.output = path.join(config.coverageLastReport, req.query.distro)
			shell.mkdir(configReport.output);
		}

        coverageReport(configReport);
        res.send('DONE: go to > http://your.server/last-result')
    });
	app.get('/close-server', function(req, res, next)
	{
		res.send('DONE');
        covExpressServer.close();
	});

	console.log('+- Coverage Local http server available at: http://localhost:' + config.port + '/');
	covExpressServer = app.listen(config.port, '0.0.0.0', cb);
}

gulp.task('coverage-server', function(cb)
{
	var config = {
		port: args.port || 8080,
		coverageFolder: args.coverageFolder || '__coverage__',
		coverageIncrementalReport: args.coverageIncrementalReport || 'incremental-report',
		coverageLastReport: args.coverageLastReport || 'last-report'
	};
	
	coverageServer(config, cb);
});




//for gulp local 
function installInstrumentFrontendMiddleware(app, config)
{
	config = config || {};
	// var jsFileExcludes = ['third_parties'];

	var coverageFolder = config.coverageFolder || '__coverage__'; // for storing coverage.json files
	var coverageFileCount = 0;

	shell.rm('-rf', coverageFolder);
	shell.mkdir(coverageFolder);

	// serve static .js files instrumented - this will override original express.static middleware installed after
	app.use('/', function(req, res, next) 
	{
		if(req.url.endsWith('.js')/* && !jsFileExcludes.find((exclude)=>req.url.indexOf(exclude) != -1)*/)
		{
			var file;
			if(req.url.startsWith('/Modules'))
			{
				file = path.join(package_manager.env.srcDir, req.url.substring('/Modules'.length, req.url.length));
			}
			else
			{
				file = path.join(process.gulp_dest, req.url);
				
			}
			if(shell.test('-f', file))
			{
				var content = fs.readFileSync(file).toString();
				var coverageServer = config.coverageServer || 'http://localhost:8080';
				var instrumentConfig = {
					content 
				,	coverageServer
				,	fileName: path.resolve(file)
				};
				var instrumentedCode = instrumentCode(instrumentConfig);
				res.send(instrumentedCode);
			}
			else
			{
				console.log('WARNING file not found', file);
				next();
			}
		}
		else
		{
			next();
		}
	})
}

var instrumenter = require('istanbul-lib-instrument').createInstrumenter({});


var jsFileExcludes = ['third_parties'];

function instrumentCode(config)
{

	if(jsFileExcludes.find((exclude)=>config.fileName.indexOf(exclude) != -1))
	{
		return config.content; 
	}

	var coverageServer = config.coverageServer || 'http://localhost:8080';
	var code = config.content;

	// Heads up ! ugly hack so application post the coverage data before exiting exiting - which could be triggered by 
	// navigating to other app or closing the window. We add the prefix to a file we know all applications load !

	var addPrefix = config.fileName.indexOf('ApplicationSkeleton.Layout.js') != -1;
	code = addPrefix ? getJsPrefix(coverageServer) + code : code;

    var fileInfo = package_manager.getModuleForPath(config.fileName, false);
    var path_out = config.fileName;

    if(fileInfo)
	{
        path_out = path.join(fileInfo.baseDir, fileInfo.moduleName, _.last(config.fileName.split(path.sep)));
	}

    return instrumenter.instrumentSync(code, path_out);
}

function getJsPrefix(coverageServer)
{
	return  `
		window.addEventListener("beforeunload", function(e)
		{
			SC.dontSetRequestHeaderTouchpoint = true;
			jQuery.post('${coverageServer}/__coverage__', JSON.stringify(window.__coverage__));
		}, false);
	`;
}

var through = require('through');

function instrumentVinylFile(config)
{
	config.coverageServer = config.coverageServer || 'http://localhost:8080';
	var onFile = function(file)
	{
		//heads up - gulp unit test depends on javascript but we dont want that task to intrument the code in this particular case. 
		var instrument = file.contents && args._.indexOf('unit-test') == -1;
		if(!instrument)
		{
			this.emit('data', file); 
		}
		else
		{
			var instrumentConfig = {
				content: file.contents.toString()
			,	coverageServer: config.coverageServer
			,	fileName: file.path
			};
			var instrumentedCode = instrumentCode(instrumentConfig);
			file.contents = Buffer.from(instrumentedCode);
			this.emit('data', file);
		}
	};

	var onEnd = function()
	{
		this.emit('end');
	};

	return through(onFile, onEnd);
}


module.exports = {
	installInstrumentFrontendMiddleware,
	instrumentVinylFile,
	instrumentCode,
	getJsPrefix
};

