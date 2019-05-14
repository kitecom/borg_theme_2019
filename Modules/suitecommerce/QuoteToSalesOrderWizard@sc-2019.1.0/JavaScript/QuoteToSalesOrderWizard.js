/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module QuoteToSalesOrderWizard
define('QuoteToSalesOrderWizard'
,	[
		'QuoteToSalesOrderWizard.Router'
	,	'QuoteToSalesOrder.Model'
	,	'QuoteToSalesOrderWizard.View'

	,	'Profile.Model'
	]
,	function (
		QuoteToSalesOrderWizardRouter
	,	QuoteToSalesOrderModel
	,	QuoteToSalesOrderView

	,	ProfileModel
	)
{
	'use strict';

	//@class QuoteToSalesOrderWizard @extend ApplicationModule
	return	{
		//@method mountToApp
		//@param {ApplicationSkeleton} application
		//@return {QuoteToSalesOrderWizard.Router} A new instance of the router class
		mountToApp: function (application)
		{
			var quoteRouter = new QuoteToSalesOrderWizardRouter(application, {
				steps: application.getConfig('quotesToSalesOrderWizard.steps')
			,	model: new QuoteToSalesOrderModel()
			,	profile: ProfileModel.getInstance()
			});

			QuoteToSalesOrderView.wizard = quoteRouter;

			return quoteRouter;
		}
	};
});
