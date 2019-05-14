
var gulp = require('gulp')
,	nconf = require('nconf')
;

nconf.argv(
	{
	    'ask_credentials': {
	      alias: 'to',
	      describe: 'Retrieve credentials (email, role, account, domain and password) and application data again ignoring .nsdeploy file and application downloaded files',
	      demand: false,
	      default: false
	    }

	,	'credentials:vm': {
	      alias: 'vm',
	      describe: 'Virtual Machine',
	      demand: false
	    }

	,	'credentials:molecule': {
	      alias: 'm',
	      describe: 'Molecule',
	      demand: false
	    }

	,	'credentials:nsVersion': {
	      alias: 'nsVersion',
	      describe: 'Version',
	      demand: false
	    }

	,	'credentials:roleId': {
	      alias: 'role',
	      describe: 'Role Id',
	      demand: false
	    }

	,	'credentials:website': {
	      alias: 'website',
	      describe: 'Website',
	      demand: false
	    }

	,	'credentials:applicationId': {
	      alias: 'applicationId',
	      describe: 'Application Id',
	      demand: false
	    }

	,	'credentials:domain': {
	      alias: 'domain',
	      describe: 'Domain name (www.name.com)',
	      demand: false
	    }

	,	'script:web_service': {
			alias: 'web-script',
			describe: 'Reslet Script Id of the Extension Mechanism web service',
			demand: false
		}

	,	'script:file_service': {
			alias: 'file-script',
			describe: 'Reslet Script Id of the Extension Mechanism file service',
			demand: false
    	}

    ,	'deploy:web_service': {
			alias: 'web-deploy',
			describe: 'Reslet Script Deploy of the Extension Mechanism web service',
			demand: false
    	}

    ,	'fetchConfig:extension': {
    		alias: 'fetch'
    	,	describe: 'If you want to start working on an extension you had previously in the file cabinet. Format: '
		,	demand: false
    	}
	}
);

function executeFetch(cb)
{
	var fetch_lib = require('../extension-mechanism/fetch/fetch')
	,	validate = require('./validate');

	fetch_lib.fetch(function(error)
	{
		if(!error)
		{
			validate.validate(cb);
		}
		else
		{
			cb(error);
		}
	});
}

if(nconf.get('extensionMode'))
{
	/**
	* Downloads the active theme and active extensions code (optional).
	* It can receive the following arguments:
	* @task {extension:fetch}
	* @order {4}

	* @arg {fetch} Comma separated list of extension names to download. Use "" (double quotes) if the name contain spaces.
	* @arg {m <arg>} Idem as extension:deploy parameter.
   	* @arg {to} Idem as extension:deploy parameter.
	*/
	gulp.task('extension:fetch', executeFetch);
}
else
{
	/**
	* Downloads active theme and extensions code.
	* It can receive the following arguments:
	* @task {theme:fetch}
	* @order {4}

	* @arg {m <arg>} Idem as theme:deploy parameter.
   	* @arg {to} Idem as extension:deploy parameter.
	*/
	gulp.task('theme:fetch', executeFetch);
}
