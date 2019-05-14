/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

define('Backbone.DBSync'
,	[	'Backbone'
	,	'Backbone.CachedSync'
	,	'Fallback.DBInitialSettings'
		, 'StorageHandler'
	,	'underscore'
	,	'jQuery'
	]
,	function (
		Backbone
	,	BackboneCachedSync
	,	DBInitialSettings
		, Storage
	,	_
	,	jQuery
	)
{
	'use strict';

	function _goFetch(self, action, model, options, res)
	{
		BackboneCachedSync.cachedSync.apply(self, [action, model, options]).done(function(result)
		{
			res.resolve(result);
		}).fail(function(e)
		{
			res.reject(e);
		});
	}

	Backbone.DBSync = function (action, model, options)
	{
			if (Storage.get('fallbackMode') && action === 'read')
		{
			if(this.dbRoute)
			{
				var res = jQuery.Deferred();

				DBInitialSettings.get().then(function (settings)
				{
					var settingsObject = _.getPathFromObject(settings, this.dbRoute);

					if(settingsObject)
					{
								this.reset(this.parse(settingsObject));
						res.resolve(settingsObject);
					}
					else
					{
						_goFetch(this, action, model, options, res);
					}
				}.bind(this))
				.catch(function()
				{
					_goFetch(this, action, model, options, res);
				}.bind(this));

				res.done(function()
				{
					this.fetched = true;
					this.trigger('sync', this);
					this.trigger('fetch', this);
				}.bind(this));

				return res;
			}
		}
		return BackboneCachedSync.cachedSync.apply(this, [action, model, options]);
	};

	return {
		DBSync: Backbone.DBSync
	};
});
