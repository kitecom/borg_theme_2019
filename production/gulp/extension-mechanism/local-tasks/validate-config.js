
/**
* Validate if Configurations Properties Ids are properly named
*/
function validateConfigs(manifest, manifest_path, cb)
{
	var fs = require('fs')
	,	log = require('fancy-log')
	,	PluginError = require('plugin-error')
	,	path = require('path')
	,	c = require('ansi-colors')
	,	_ = require('underscore');

	if(manifest.configuration && !_.isEmpty(manifest.configuration.files))
	{
		_.each(manifest.configuration.files, function(configPath)
		{
			try
            {
				configPath = path.join(manifest_path, configPath);
				var config_json = JSON.parse(fs.readFileSync(configPath).toString())
				if(config_json.properties) {
					var properties_id =  _.keys(config_json.properties);
					var regex = /^[a-z0-9\.]*$/i;
					_.each(properties_id, function(prop){
						if(prop && !regex.exec(prop)) {
							var msg = 'Invalid configuration property key: ' + prop + ' declared in the file '+ configPath +'. Use only alphanumeric characters.';
							if(process.argv && process.argv.indexOf('extension:deploy') > -1) {
								cb(new PluginError('gulp validate', msg));
								process.exit(1);
							} else {
								log(c.yellow('Warning: ' + msg));
							}
						}
					});
				}
			}
			catch(error)
			{
				console.log(error);
			}
		});
	}
}

module.exports = {
	validateConfigs: validateConfigs
}
