/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// PaymentInstrument.Model.js
// ----------------
// This file define the functions to be used on Payment Method service
define('PaymentInstrument.Model'
,	[
		'SC.Model'
	,	'SC.Models.Init'
	, 	'underscore'
	]
,	function (
		SCModel
	,	ModelsInit
	, 	_
)
{
	'use strict';
	return SCModel.extend({
		name: 'PaymentInstrument'

	,	paymentInstruments: []

	,	get: function (id)
		{
			//Return a specific payment instrument
			return this.getRecordFields(this.getRecord(id));
		}

	,	getRecordFields: function (record)
		{
			var result = {};
			//@property {String} internalid
			result.internalid = record.getFieldValue('id');
			//@property {Boolean} isinactive
			result.isinactive = record.getFieldValue('isinactive');
			//@property {Boolean} preserveonfile
			result.preserveonfile = record.getFieldValue('preserveonfile');
			//@property {String} expirationdate
			result.expirationdate = record.getFieldValue('expirationdate');
			//@property {String} recordtype
			result.recordtype = record.getFieldValue('recordtype');
			//@property {String} id
			result.id = record.getFieldValue('id');
			//@property {String} cardnumber
			result.cardnumber = record.getFieldValue('cardnumber');
			//@property {Boolean} isdefault
			result.isdefault = record.getFieldValue('isdefault');
			//@property {Boolean} isdefault
			result.mask = record.getFieldValue('mask');
			//@property {Cardbrand} cardbrand
			result.cardbrand = {
				internalid: record.getFieldValue('cardbrand')
			,	name: record.getFieldText('cardbrand')
			};
			//@property {Instrumenttype} instrumenttype
			result.instrumenttype = {
				internalid: record.getFieldValue('instrumenttype')
			,	name: record.getFieldText('instrumenttype')
			};
			//@property {State} state
			result.state = {
				internalid: record.getFieldValue('state')
			,	name: record.getFieldText('state')
			};
			//@property {Entity} entity
			result.entity = {
				internalid: record.getFieldValue('entity')
			,	name: record.getFieldText('entity')
			};
			//@property {Paymentmethod} paymentmethod
			result.paymentmethod = this.getPaymentMethod(record.getFieldValue('paymentmethod'));

			return result;
		}

	,	getDefault: function ()
		{
			//Return the  payment instrument that the customer setted to default
			return _.find(this.paymentInstruments, function (payment_instrument)
			{
				return payment_instrument.ccdefault === 'T';
			});
		}

	,	list: function ()
		{
			//Return all the payment instruments that are not inactive
			var filters = [new nlobjSearchFilter('customer', null, 'is', nlapiGetUser()), new nlobjSearchFilter('isInactive', null, 'is', 'F')]
			,    columns = {
					internalid: new nlobjSearchColumn('internalid')
				,    paymentmethod: new nlobjSearchColumn('paymentmethod')
				,    mask: new nlobjSearchColumn('mask')
				,    default: new nlobjSearchColumn('default')
				,    lastfourdigits: new nlobjSearchColumn('lastfourdigits')
				,    cardLastFourDigits: new nlobjSearchColumn('cardLastFourDigits')
				,    paymentinstrumenttype: new nlobjSearchColumn('paymentinstrumenttype')
				,    cardExpDate: new nlobjSearchColumn('cardExpDate')
				,    cardTokenExpDate: new nlobjSearchColumn('cardTokenExpDate')
				,    nameOnCard: new nlobjSearchColumn('nameOnCard')
				,    generalTokenExpirationDate: new nlobjSearchColumn('generalTokenExpirationDate')
				,    cardTokenCardExpDate: new nlobjSearchColumn('cardTokenCardExpDate')
			}
			,	search_results = Application.getAllSearchResults('paymentinstrument', filters, _.values(columns))
			,	self = this;

			_.each(search_results, function (search_result)
			{
				var payment_method_id = search_result.getValue('paymentmethod');

				self.paymentInstruments.push({
					internalid: search_result.getValue('internalid')
					,	paymentmethod: self.getPaymentMethod(payment_method_id)
					,	instrumenttypeValue: search_result.getValue('paymentinstrumenttype')
					,	recordType: self.parseToRecordType(search_result.getText('paymentinstrumenttype'))
					,	mask: search_result.getValue('mask')
					,	ccdefault: search_result.getValue('default')
					,	cardexpirationdate: search_result.getValue('cardExpDate') || search_result.getValue('cardTokenCardExpDate') || search_result.getValue('generalTokenExpirationDate')
					,	ccname: search_result.getValue('nameOnCard')
					,	cardlastfourdigits: search_result.getValue('lastfourdigits') || search_result.getValue('cardLastFourDigits')
				});
			});

			return this.paymentInstruments;
		}

	,	update: function (id, data)
		{
			//Update the payment instrument

			var record = this.getRecord(id);
			record.setFieldValue('isdefault', data.ccdefault);

			return nlapiSubmitRecord(record);
		}

	,	create: function (data)
		{
			//Create a new credit card

			var payment_method = data.paymentmethod.split(',')[0];

			var pi = nlapiCreateRecord('paymentCard');
			pi.setFieldValue('entity', nlapiGetUser());
			pi.setFieldValue('cardnumber', data.ccnumber);
			pi.setFieldValue('nameoncard', data.ccname);
			pi.setFieldValue('expirationdate', data.expmonth + '/' + data.expyear);
			pi.setFieldValue('paymentmethod', payment_method);

			return nlapiSubmitRecord(pi);
		}

	,	remove: function (id)
		{
			var record = this.getRecord(id);
			record.setFieldValue('isinactive','T');

			return nlapiSubmitRecord(record);
		}

	,	getPaymentMethod: function (paymentmethodid)
		{
			var payment_methods = ModelsInit.session.getPaymentMethods();

			return _.findWhere(payment_methods, {internalid: paymentmethodid})
		}

	,	getRecord: function (id)
		{
			this.list();

			var record = _.find(this.paymentInstruments, function (payment_instrument)
			{
				return payment_instrument.internalid === id;
			});

			return nlapiLoadRecord(record.recordType, id);
		}

	,	parseToRecordType: function (name)
		{
			var recordType =  name.replace(/\s/g, "");

			return recordType;
		}
	});
});