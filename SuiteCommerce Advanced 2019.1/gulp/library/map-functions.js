'use strict';

var	_ = require('underscore')
,	mapStream = require('map-stream')
,	fsExtensions = require('./fs-extensions');

var	licenseTypes = {
	'.tpl': {
		beginComment: '{{!',
		endComment: '}}\n\n'
	},
	'.js': {
		beginComment: '/*',
		endComment: '*/\n\n'
	},
	'.ss': {
		beginComment: '/*',
		endComment: '*/\n\n'
	},
	'.ssp': {
		beginComment: '<%/*',
		endComment: '*/%>'
	},
	'.css': {
		beginComment: '/* ',
		endComment: ' */\n\n'
	},
	'.scss': {
		beginComment: '/*',
		endComment: '*/\n\n'
	},
	'.sass': {
		beginComment: '/*',
		endComment: '*/\n\n'
	},
	'.less': {
		beginComment: '/*',
		endComment: '*/\n\n'
	}
};

var licenseIgnores = [
	'html5shiv.min',
	'require',
	'respond.min'
];

function mapAddLicense(license_text)
{
	license_text = license_text || '';

	return mapStream(function(file, cb)
	{
		var path = fsExtensions.parsePath(file.path)
		,	license_type = licenseTypes[path.extension]
		,	is_ignore = licenseIgnores.indexOf(path.baseName) >= 0;

		if (!!license_type && !is_ignore)
		{
			var license = license_type.beginComment + license_text + license_type.endComment;
			var file_content = file.contents.toString('utf8');

			//see if the file already got license
			var licence_prefix = file_content.substring(0, license.length);
			if (license !== licence_prefix)
			{
				file.contents = Buffer.from(license + file_content);	
			}
		}

		cb(null, file);
	});
}

function matchAny(string, reg_exps)
{
	return _.some(reg_exps, function(reg_exp)
	{
		return reg_exp.test(string);
	});
}

function expandSearch(jsonObject)
{
	if (!_.isObject(jsonObject) || _.isArray(jsonObject))
	{
		return [];
	}

	var result =  _.map(Object.keys(jsonObject), function(key)
	{
		return { parent: jsonObject, key: key };
	});
	return result;
}

function dfsDelete(jsonObject, reg_exps)
{
	var fringe = expandSearch(jsonObject);

	while(fringe.length > 0)
	{
		var entry = fringe.pop();

		if (matchAny(entry.key, reg_exps))
		{
			delete entry.parent[entry.key];
		}
		else
		{
			var expanded = expandSearch(entry.parent[entry.key]);
			fringe = fringe.concat(expanded);
		}
	}
}

function mapJsonKeys(keys_to_delete)
{
	keys_to_delete = keys_to_delete || [];
	var regexps_to_delete = _.map(keys_to_delete, function(key)
	{
		return new RegExp(key);
	});

	return mapStream(function(file, cb)
	{
		var json = JSON.parse(file.contents.toString('utf8'));
		dfsDelete(json, regexps_to_delete);

		file.contents = Buffer.from(JSON.stringify(json, '\t', 4));
		cb(null, file);
	});
}

module.exports = {
		mapAddLicense: mapAddLicense
	,	mapJsonKeys: mapJsonKeys
};
