/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//Backend Configuration file
// @module ssp.libraries
// @class Configuration Backend Configuration file
define('Configuration'
,	[
		'Utils'
	,	'underscore'
	,	'SC.Models.Init'
	,	'Console'
	]
,	function(
		Utils
	,	_
	,	ModelsInit
	)
{
	'use strict';
	function deepExtend(target, source)
	{
		if(_.isArray(target) || !_.isObject(target))
		{
			return source;
		}
		_.each(source, function(value, key)
		{
			if(key in target)
			{
				target[key] = deepExtend(target[key], value);
			}
			else
			{
				target[key] = value;
			}
		});
		return target;
	}
	function adaptValuestoOldFormat(configurationObj){
		//Adapt the values of multiDomain.hosts.languages and multiDomain.hosts.currencies to the structure requiered by hosts
		configurationObj.hosts = [];
		if (configurationObj.multiDomain && configurationObj.multiDomain.hosts && configurationObj.multiDomain.hosts.languages)
		{
			_.each(configurationObj.multiDomain.hosts.languages, function(language)
			{
				var storedHost = _.find(configurationObj.hosts, function(host)
				{
					return host.title === language.host;
				});

				function getLanguageObj()
				{
					return {
						title: language.title
						,	host: language.domain
						,	locale: language.locale
					};
				}

				if (!storedHost)
				{
					configurationObj.hosts.push(
						{
							title: language.host
							,	languages: [
							getLanguageObj()
						]
							,	currencies: _.filter(configurationObj.multiDomain.hosts.currencies, function(currency)
						{
							return currency.host === language.host;
						})
						});
				}
				else
				{
					storedHost.languages.push(
						getLanguageObj()
					);
				}
			});
		}

		configurationObj.categories = ModelsInit.context.getSetting('FEATURE', 'COMMERCECATEGORIES') === 'T' ? configurationObj.categories : false;

		/* globals __sc_ssplibraries_t0 */
		if (typeof(__sc_ssplibraries_t0) !== 'undefined')
		{
			configurationObj.__sc_ssplibraries_time = new Date().getTime() - __sc_ssplibraries_t0;
		}
	}

	function Configuration(config)
	{
		var effectiveDomain = config.domain || ModelsInit.session.getEffectiveShoppingDomain();
		var effectiveSiteId = config.siteId || ModelsInit.session.getSiteSettings(['siteid']).siteid;
		/* globals ConfigurationManifestDefaults */
		this.configurationProperties = typeof (ConfigurationManifestDefaults) === 'undefined' ? {} : ConfigurationManifestDefaults;
		// then we read from the record, if any, and mix the values with the default values in the manifest.
		if (Utils.recordTypeExists('customrecord_ns_sc_configuration'))
		{
			var config_key = effectiveDomain ? effectiveSiteId + '|' + effectiveDomain : effectiveSiteId + '|all'
			,	search = nlapiCreateSearch('customrecord_ns_sc_configuration', [new nlobjSearchFilter('custrecord_ns_scc_key', null, 'is', config_key)], [new nlobjSearchColumn('custrecord_ns_scc_value')])
			,	result = search.runSearch().getResults(0, 1000);
			var configuration = result.length && JSON.parse((result[result.length - 1]).getValue('custrecord_ns_scc_value')) || {};
			//add default values defined by extesions
			if (configurationExtensions[effectiveDomain])
			{
				this.configurationProperties = deepExtend(this.configurationProperties, configurationExtensions[effectiveDomain]);
			}
			//override with default values with the ones in the configuration record
			this.configurationProperties = deepExtend(this.configurationProperties, configuration);
			adaptValuestoOldFormat(this.configurationProperties);
		}
	}
	Configuration.prototype = {
		get: function(path, defaultValue){
			if (!path){
				return this.configurationProperties;
			}else{
				return Utils.getPathFromObject(this.configurationProperties, path, defaultValue);
			}
		},
		set: function(path, newValue){
			Utils.setPathFromObject(this.configurationProperties, path, newValue);
		}
	};
	/*
	* Default singleton configuration object
	* */
	var configuration = null;
	var configurationExtensions = {};
	var config = {};
	function initializeSingleton(){
		if (!configuration) {
			configuration = new Configuration(config);
		}
	}
	Configuration.get = function(path, defaultValue){
		initializeSingleton();
		return configuration.get(path, defaultValue);
	};
	Configuration.set = function(path, newValue){
		initializeSingleton();
		configuration.set(path, newValue);
	};
	/**
	 * Overwrite configuration values, by domain
	 * @param extensions is an object with domain as attributes and configuration values as value of each domaing. e.g. {'mydomain.com': {}}
	 */
	Configuration.overwriteByDomain = function(extensions){
		configuration = null;
		configurationExtensions = extensions;
	}
	/**
	 * @param configParam Object with configurations to be used when the singleton configuration object is created. e.g. {domain: '', siteId: 1}
	 */
	Configuration.setConfig = function(configParam){
		configuration = null;
		config = configParam;
	}
	return Configuration;
});
