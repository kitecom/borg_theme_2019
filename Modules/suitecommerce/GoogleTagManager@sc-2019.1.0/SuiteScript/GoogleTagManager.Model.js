/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// GoogleTagManager.Model.js
// jshint laxcomma:true
// ----------------
// Handles creating, fetching and updating Product Lists
define(
	'GoogleTagManager.Model'
,	[
		'SC.Model'
	,	'Application'
	,	'underscore'
	]
,	function(
		SCModel
	,	Application
	,	_
	)
{
	'use strict';

	return SCModel.extend({
		name: 'GoogleTagManager'

		// Returns a product list based on a given userId and id
	,	save: function (id, events)
		{
			if(!id) return;

			var filters = [new nlobjSearchFilter('custrecord_ns_gtm_gid', null, 'is', id)]
			,	columns = {
					internalid: new nlobjSearchColumn('internalid')
				,	gid: new nlobjSearchColumn('custrecord_ns_gtm_gid')
				,	events: new nlobjSearchColumn('custrecord_ns_gtm_events')
			}
			,	gtm_datalayer = this.search(filters, columns);

			if (!gtm_datalayer) return this.create(id, events);

			var current_events = gtm_datalayer.getFieldValue('custrecord_ns_gtm_events');

            try{
            	current_events = current_events.length ? JSON.parse( current_events ) : [];
            }
            catch(e)
            {
               console.error('ERROR GTM parsing '+id);
            }

            var extended_events = current_events.concat(events || []);

			gtm_datalayer.setFieldValue('custrecord_ns_gtm_events',  JSON.stringify(extended_events));

			return {
					internalid: nlapiSubmitRecord(gtm_datalayer)
				,	gtm_gid: gtm_datalayer.getFieldValue('custrecord_ns_gtm_gid')
				,	events: extended_events
			};

		}

	,	search: function(filters, columns)
		{
			// Makes the request and format the response
			var gtm_datalayer = Application.getAllSearchResults('customrecord_ns_gtm_datalayer', filters, _.values(columns));

			if(gtm_datalayer && gtm_datalayer[0])
			{
				return nlapiLoadRecord('customrecord_ns_gtm_datalayer',gtm_datalayer[0].getId());
			}


		}

		// Creates a new GTM dataLayer record
	,	create: function (id, events)
		{
			var gtm_datalayer = nlapiCreateRecord('customrecord_ns_gtm_datalayer');

			gtm_datalayer.setFieldValue('custrecord_ns_gtm_gid', id);

			gtm_datalayer.setFieldValue('custrecord_ns_gtm_events', JSON.stringify(events || []));

			return {
					internalid: nlapiSubmitRecord(gtm_datalayer)
				,	gtm_gid: gtm_datalayer.getFieldValue('custrecord_ns_gtm_gid')
				,	events: events || []
			};
		}
	});
});
