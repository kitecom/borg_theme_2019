/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

define('GoogleTagManager.Model'
,	[
		'AjaxRequestsKiller'
	,	'Backbone'
	,	'jQuery'
	,	'underscore'
	]
, 	function
	(
		AjaxRequestsKiller
	,	Backbone
	,	jQuery
	,	_
	)
{
	'use strict';

	return Backbone.Model.extend({
		urlRoot: _.getAbsoluteUrl('services/GoogleTagManager.Service.ss')

	,	getDataLayer: function (data)
		{
			var deferred = jQuery.Deferred();

			var self = this;

			self.set('id',data.id);
			self.set('events',data.events);
		 	this.save().done(function(result) {
	 			self.set('events', result.events);
	 			self.set('internalid', result.internalid);
	 			deferred.resolve();
 			});

	 		return deferred.promise();
		}
	,	saveEvent: function (data)
		{
			var deferred = jQuery.Deferred()
			,	self = this;

			this.set('events', data);
			self.save().done(function(result){
				deferred.resolve();
			});

	 		return deferred.promise();



		}

	});

});