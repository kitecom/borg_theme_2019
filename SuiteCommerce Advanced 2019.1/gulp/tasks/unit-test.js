/*
Example command: 
	
	#execute some modules
	time gulp unit-test --modules=Address,AjaxRequestsKiller,ApplicationSkeleton,Backbone.CollectionView,Backbone.CompositeView,Backbone.FormView,BackboneExtras,BrontoIntegration,Cart,Case,CMSadapter,Content,CreditCard,CreditMemo,Main,Deposit,DepositApplication,Facets,Utilities,Wizard,UrlHelper,TrackingServices,SocialSharing,PromocodeSupport,ProductReviews,ProductList,PrintStatement,PluginContainer,PaymentWizard,OrderWizard,HandlebarsExtras,ImageLoader,GoogleAdWords,GoogleUniversalAnalytics,GoogleTagManager,ErrorManagement,Invoice,ItemRelations,ListHeader,Merchandising,MyAccountApplication,NavigationHelper

	#execute all : 
	gulp unit-test

	# DEBUG your tests in your browser erver opened so you can debug the page in your browser at http://localhost:7777/test1.html
	gulp unit-test --dont-exit

	# only run some modules
	gulp unit-test --modules=Address,AjaxRequestsKiller,ApplicationSkeleton,Backbone.CollectionView,Backbone.CompositeView,Backbone.FormView,BackboneExtras,BrontoIntegration,Cart,Case,CMSadapter,Content,CreditCard,CreditMemo,Main,Deposit,DepositApplication

	#Run all tests but using a single instance for each module
	gulp unit-test-each

	#exclude some modules
	gulp unit-test --exclude-modules=CreditMemo

For running unit tests we will run selenium based tests just as we run automation. For this the selenium server must be running. 

#Installing and running th selenium server:

## install java

## download selenium server: 

curl -O http://selenium-release.storage.googleapis.com/2.53/selenium-server-standalone-2.53.0.jar

## download googlechrome selenium drivers: 

curl -O http://chromedriver.storage.googleapis.com/2.22/chromedriver_mac32.zip
unzip chromedriver_mac32.zip

## Execute selenium server: 

java -Dwebdriver.chrome.driver=./chromedriver -jar selenium-server-standalone-2.53.0.jar

*/
'use strict';

var gulp = require('gulp');

var writeHtml = function(config, cb)
{
	var _ = require('underscore')
		,   package_manager = require('../package-manager')
		,   shell = require('shelljs')
		,   path = require('path')
		,	args = require('yargs').argv;

	var starterPath = 'javascript/unittest-local-starter.js';

	var modules;
	var msg = '';

	var target = config && config.modules || args.modules;
	if(target)
	{
		modules = [];
		_.each(target.split(','), function(module)
		{
			modules = _.union(modules, package_manager.getGlobsForModule(module, 'unit-test-entry-point'));
		})
		msg = 'Rendering Unit test of modules ' + target.split(',').join(', ');
	}
	else
	{
		var modules = package_manager.getGlobsFor('unit-test-entry-point');
		msg = 'Rendering Unit test of all modules';
	}

	modules = _.map(modules, function(glob)
	{
		return path.basename(glob, '.js');
	});

	var excludeModules = args.excludeModules ? args.excludeModules.split(',') : [];
	excludeModules = _.map(excludeModules, function(m){return 'UnitTest.'+m});
	modules = _.difference(modules, excludeModules);

	if(!modules || !modules.length)
	{
		return cb(EXCLUDEMODULE);
	}
	modules.sort();

	var aJsApplication = package_manager.distro.tasksConfig.javascript[0];
	var applicationName = aJsApplication.exportFile;
	var exportFile = 'LocalDistribution/javascript/'+applicationName;

	var s = shell.cat(exportFile);
	var replacement = '\n'+
		executeSpecs.toString()+';\n'+
		'promise.then(function(){\nexecuteSpecs('+JSON.stringify(modules)+');\n});\n'+
		'';

	var starter = aJsApplication.entryPoint.replace(/\./g, '\\.');

	//var regexStr = 'var SCShoppingStarter= require\\(\\["'+starter+'"\\]\\)';
	var regexStr = 'var SCShoppingStarter= true';

	var regex = new RegExp(regexStr, 'g');
	s = s.replace(regex, replacement);
	shell.ShellString(s).to('LocalDistribution/'+starterPath);

	var html =
		'<html><head><title>SC unit test</title><head>'+
		'<link rel="shortcut icon" type="image/png" href="/jasmine/lib/jasmine-2.3.2/jasmine_favicon.png">'+
		'<link rel="stylesheet" href="/jasmine/lib/jasmine-2.3.2/jasmine.css">'+
		'<script src="/jasmine/lib/jasmine-2.3.2/jasmine.js"></script>'+
		'<script src="/jasmine/lib/jasmine-2.3.2/jasmine-html.js"></script>'+
		'<script src="/jasmine/lib/jasmine-2.3.2/boot.js"></script>'+
		'<script>window.SC={ENVIRONMENT:{}}</script>'+
		'</head>'+

		'<body>'+
		'<script>\nvar promise = new Promise(function(resolve, reject){\n'+addJasmineReporter.toString()+'\naddJasmineReporter();\n});\n</script>'+
		'<script data-main="'+starterPath+'" src="javascript/require.js"></script>'+
		//'<script src="/'+applicationName.replace('.js', '-templates.js')+'"></script>'+
		//'<script src="'+starterPath+'"></script>'+
		'<div id="main" style="display:none"></div>'+
		// intrumentPrefix+
		'</body></html>'+
		'';

	shell.ShellString(html).to('LocalDistribution/test1.html');
	cb();
};

gulp.task(
	'utest'
	,	gulp.series(
		function unit_test_local(cb)
		{
			var package_manager = require('../package-manager');
			package_manager.isGulpUnitTest = true;
			package_manager.isGulpLocal = true;
			cb();
		}
		,	'javascript'
		,	function write_html(cb)
		{
			writeHtml(null, cb);
		}
	)
);

// @function executeSpecs 
// HEADS UP ! executed in the browser!
function executeSpecs(modules)
{
	var params = window.location.href.indexOf('?')===-1 ? '' : window.location.href.split('?')[1];
	params = params.split('&');
	var p = {};
	for (var i = 0; i < params.length; i++)
	{
		var o = params[i].split('=');
		p[o[0]] = o[1];
	}
	if(!p.modules && modules)
	{
	}
	else if(p.modules)
	{
		modules = p.modules.split(',');
	}

	//add a message
	var msgEl = document.createElement('p');
	var msg = 'Specs: ' + (modules ? modules.join(', ') : 'NONE !');
	msgEl.innerHTML = msg;
	document.body.insertBefore(msgEl, document.body.firstChild);
	try
	{	//because jasmine.getEnv().execute() was already executed with empty specs - we will execute again.
		document.querySelector('.duration').remove();
		document.querySelector('.alert .bar').remove();
		document.querySelector('.alert .exceptions').remove();
	}
	catch(ex){}

	require(modules, function() {
		jasmine.getEnv().execute();
	});
}

//@function addJasmineReporter runs in the browser!
function addJasmineReporter()
{
	window.jasmineDone=false;
	var myReporter = {
		jasmineDoneCount: 0
		,	jasmineStarted: function(suite){
			console.log("suite " + suite + ' started');
			resolve();
		}
		,	jasmineDone: function()
		{
			this.jasmineDoneCount++;
			if(this.jasmineDoneCount === 2) // it is '2' because the way we installed the specs - we have one empty and ours secondly
			{
				window.jasmineDone = true;

			}
		}
	};
	jasmine.getEnv().addReporter(myReporter);
}

gulp.task('unit-test', gulp.series('utest', function start_server(cb)
{
	var shell = require('shelljs')
		,   initServer = require('./local').initServer
		,	args = require('yargs').argv;
	//intrument prefix string - we need to put it here. because core files may not be loaded in unit-test

	var coverageServer = args.instrumentFrontend ? args.coverageServer || 'http://localhost:8080' : '';
	coverageServer = coverageServer ? '--coverage-server ' + coverageServer : '';

	initServer(function()
	{
		shell.exec('node gulp/unit-test/unit-test-run.js '+coverageServer, function(code, stdout)
		{
			if(code !== 0)
			{
				console.log('Error in gulp/unit-test/unit-test-run.js: \n');
			}
			console.log(stdout);
			cb();
			if (!args.dontExit)
			{
				process.exit(code);
			}
		});
	});
}));

var EXCLUDEMODULE='excludeModule'
gulp.task('unit-test-each', gulp.series('utest', function(cb)
{
	var _ = require('underscore')
		,   package_manager = require('../package-manager')
		,   shell = require('shelljs')
		,   path = require('path')
		,   initServer = require('./local').initServer
		,	async = require('async');

	var modules = package_manager.getGlobsFor('unit-test-entry-point')

	modules = _.map(modules, function(glob)
	{
		var prefix = 'UnitTest.'
		var s = path.basename(glob, '.js')
		s = s.substring(prefix.length, s.length)
		return s
	})

	var moduleNameMap = {
		'MyAccount': 'MyAccountApplication',
		'Utils': 'Utilities'
	}
	initServer(function()
	{
		async.eachSeries(modules, function(module, cb)
			{
				try
				{
					var t0 = new Date().getTime()
					writeHtml({modules:moduleNameMap[module]||module}, function(err)
					{
						if(err!=EXCLUDEMODULE)
						{
							shell.exec('node gulp/unit-test/unit-test-run.js', function(code, stdout, stderr)
							{
								console.log('\n', module, stdout?('\n'+stdout):'', stderr?('\n'+stderr):'', 'Took: '+(new Date().getTime()-t0)/1000+' seconds')
								if(code !== 0)
								{
									cb({code: code, stdout: stdout,stderr: stderr})//breaks on first error
								}
								else
								{
									cb()
								}
							})
						}
						else
						{
							cb()
						}
					})
				}
				catch(ex)
				{
					console.log('ERROR IN ', module, ex)
					cb(err)
				}
			},
			function(err)
			{
				console.log('END', err)
				process.exit(err?1:0)
			})
	})

}));


// //just internal tool testing : 
// gulp.task('unit-test-determinism', [], function(cb)
// {
// 	var shell = require('shelljs')
// 	,	args   = require('yargs').argv;

// 	var repeat = args.repeat || 15;
// 	for (var i = 0; i < repeat; i++) 
// 	{
// 		var code = shell.exec('gulp unit-test').code;
// 		if(code !== 0)
// 		{
// 			console.log('UNIT TEST DETERMINISM FAILS')
// 		}
// 	}	
// 	console.log('UNIT TEST DETERMINISM SUCCEEDED');
// });