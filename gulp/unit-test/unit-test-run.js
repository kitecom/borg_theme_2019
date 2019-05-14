// webdriverio script that opens a jasmine spec page and will output results to stdout. the client js code will notify when the test 
// finish running - and this is done in the jasmine generator defined at gulp/tasks/unit-test.js

var webdriverio = require('webdriverio')
,	Q = require('q')
,	args   = require('yargs').argv
; 

var options = {
	desiredCapabilities: {
		browserName: 'chrome'
	}
}
,	url = 'http://localhost:7777/test1.html'

,	fail = false;

// for supporting gulp unit-test --instrument-frontend - the spawner is passing us args.coverageServer - we are responsible of posting after the test finish
var coverageServer = args.coverageServer;
var coverageServerPostJs = !coverageServer ? '' : `
	SC.dontSetRequestHeaderTouchpoint = true;
	jQuery.post('${coverageServer}/__coverage__', JSON.stringify(window.__coverage__));
`;

webdriverio
	.remote(options)
	.init()
	.url(url)

    .timeoutsAsyncScript(15000)
	.executeAsync(function(coverageServerPostJs, done)
	{
		var timer = setInterval(function()
		{
			if(window.jasmineDone)
			{
				clearInterval(timer);
				if(coverageServerPostJs)
				{
					eval(coverageServerPostJs)
					setTimeout(function(){done(true)}, 2000)
				}
				else
				{
					done(true)
				}
			}
		}, 100)
	}, coverageServerPostJs)
	.execute(function()
	{
		var msg = document.querySelectorAll('.alert .passed').length ? document.querySelectorAll('.alert .passed')[0].innerHTML : 'fail'; 
		return JSON.stringify({
			failed: document.querySelectorAll('.symbol-summary .failed').length
		,	msg: msg
		});
	})
	.then(function(result)
	{
		var value = JSON.parse(result.value)
		console.log(value.msg);
		fail = value.failed;
	})
	.end()
	.then(function()
	{
		process.exit(fail ? 1 : 0);
	});
