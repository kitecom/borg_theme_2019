/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*
@module CMSadapter

@class CMSadapter.Impl.Merchandising.v3
*/

define('CMSadapter.Impl.Merchandising.v3'
,	[
		'CMSadapter.Impl.Merchandising'

	,	'underscore'
	]
,	function (
		CMSadapterImplMerchandising

	,	_
	)
{
	'use strict';

	var CMSadapterImplMerchandising3 = function (application, CMS)
	{
		CMSadapterImplMerchandising.call(this, application, CMS);
	};

	CMSadapterImplMerchandising3.prototype = Object.create(CMSadapterImplMerchandising.prototype);

	CMSadapterImplMerchandising3.prototype.listenForCMS = function listenForCMS()
	{
		// CMS listeners - CMS tells us to do something, could fire anytime.
		var self = this;

		self.CMS.on('cart:items:get', function (promise)
		{
			var cart = self.application.getComponent('Cart')
			,	linesId = [];

			if (cart)
			{
				cart.getLines().then(function(lines)
				{
					_.each(lines, function(line)
					{
						if (line.item && line.item.internalid)
						{
							linesId.push(line.item.internalid);
						}
					});

					promise.resolve(linesId);

				});
			}
			else
			{
				promise.resolve();
			}
		});

		self.CMS.on('page:items:get', function (promise)
		{
			var pdp = self.application.getComponent('PDP')
			,	linesId = [];

			if (pdp)
			{
				var product = pdp.getItemInfo();

				if (product && product.item && product.item.internalid)
				{
					linesId.push(product.item.internalid);
				}
			}

			promise.resolve(linesId);
		});
	};

	return CMSadapterImplMerchandising3;
});
