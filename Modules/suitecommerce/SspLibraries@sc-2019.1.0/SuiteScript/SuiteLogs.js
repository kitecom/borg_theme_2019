/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

define('SuiteLogs',
	[
	
		'underscore'
	]
,	function (
		_
	)
{
	'use strict';

	function pad (number)
	{
		if (number < 10)
		{
			return '0' + number;
		}
		return number;
	}

	function getParameters(parameters)
	{
		return _.map(parameters, function (parameter)
		{
			var type = typeof parameter
			
			
				return type === 'string' || type === 'number' ? parameter : type;
			

			
		});
	}
	function getTime (time)
	{
		var date = new Date(time);
		
		return pad(date.getUTCHours()) +
		':' + pad(date.getUTCMinutes()) +
		':' + pad(date.getUTCSeconds()) +
		'.' + (date.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5);
	}
	function processError (e)
		{
			var status = 500
			,	code = 'ERR_UNEXPECTED'
			,	message = 'error';

			if (e instanceof nlobjError)
			{
				code = e.getCode();
				message = e.getDetails();
				status = badRequestError.status;
			}
			else if (_.isObject(e) && !_.isUndefined(e.status))
			{
				status = e.status;
				code = e.code;
				message = e.message;
			}
			else
			{
				var error = nlapiCreateError(e);
				code = error.getCode();
				message = (error.getDetails() !== '') ? error.getDetails() : error.getCode();
			}

			if (code === 'INSUFFICIENT_PERMISSION')
			{
				status = forbiddenError.status;
				code = forbiddenError.code;
				message = forbiddenError.message;
			}

			var content = {
				errorStatusCode: parseInt(status,10).toString()
			,	errorCode: code
			,	errorMessage: message
			};

			if (e.errorDetails)
			{
				content.errorDetails = e.errorDetails;
			}

			return content;
		}

	var LOG = function (name, parameters, level, parent)
	{

		this.start = new Date().getTime();
		this.name = name;
		this.parameters = getParameters(parameters);
		this.level = level;
		this.ts = this.start - __sc_ssplibraries_t0;
		this.parent = parent

		return this;
	}

	LOG.prototype.finish = function (error)
	{
		if (this.end)
		{
			return;
		}
		if (error)
		{
			this.error = processError(error);
		}
		this.end = new Date().getTime();
		this.duration = this.end - this.start;
	};

	LOG.prototype.toJSON = function ()
	{
		this.finish();

		return {
				pid: 1
			,	tid: 1
			,	ts: this.ts
			,	dur: this.duration
			,	name: this.name
			,	ph: 'X'
			,	args: {
					ms: this.duration 
				,	_nestLevel: this.level
				,	_startTime: getTime(this.start)
				,	_endTime: getTime(this.end)
				,	_durationMS: this.duration
				,	_mainMessage: this.name
				,	error: this.error
				,	parameters : this.parameters
			}
		}
	};

	var LOGS = []
	,	LEVEL = 0
	,	CURRENT_NODE = new LOG('ROOT', null, LEVEL);

	return {
		start: function (name, parameters)
		{
			CURRENT_NODE = new LOG(name, parameters, LEVEL, CURRENT_NODE);
			LOGS.push(CURRENT_NODE);
			LEVEL = LEVEL + 1;
		}
	,	end: function (error)
		{
			LEVEL = LEVEL === 0 ? 0 : LEVEL - 1;
			CURRENT_NODE.finish(error);
			CURRENT_NODE = CURRENT_NODE.parent ? CURRENT_NODE.parent : CURRENT_NODE;
		}
	,	toJSON: function ()
		{
			return {
				TOTALTIME: new Date().getTime() - __sc_ssplibraries_t0
			,	traceEvents: _.map(LOGS, function (log){ return log.toJSON()})
			}
		}
	}
});