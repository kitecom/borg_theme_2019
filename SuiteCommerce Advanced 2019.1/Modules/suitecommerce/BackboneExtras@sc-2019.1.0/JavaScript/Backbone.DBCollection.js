/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

define('Backbone.DBCollection'
,	[	'Backbone.DBSync'
	,	'Backbone'
	]
,	function (
		BackboneDBSync
	,	Backbone
	)
{
	'use strict';

	Backbone.DBCollection = Backbone.Collection.extend({
		sync: BackboneDBSync.DBSync
	});

	return Backbone.DBCollection;
});
