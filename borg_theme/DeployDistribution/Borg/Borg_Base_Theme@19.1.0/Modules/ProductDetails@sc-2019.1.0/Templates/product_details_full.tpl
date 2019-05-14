<div class="product-details-full">
	<div data-cms-area="item_details_banner" data-cms-area-filters="page_type"></div>

	<header class="product-details-full-header">
		<div id="banner-content-top" class="product-details-full-banner-top"></div>
	</header>
	<div class="product-details-full-divider-desktop"></div>
	<article class="product-details-full-content" itemscope itemtype="https://schema.org/Product">
		<meta itemprop="url" content="{{itemUrl}}">
		<div id="banner-details-top" class="product-details-full-banner-top-details"></div>

		<section class="product-details-full-main-content">

			<div class="product-details-full-main-content-left">
				<div class="product-details-full-image-gallery-container">
					<div id="banner-image-top" class="content-banner banner-image-top"></div>
					<div data-view="Product.ImageGallery"></div>
					<div id="banner-image-bottom" class="content-banner banner-image-bottom"></div>

					<div data-cms-area="product_details_full_cms_area_2" data-cms-area-filters="path"></div>
					<div data-cms-area="product_details_full_cms_area_3" data-cms-area-filters="page_type"></div>
				</div>
			</div>

			<div class="product-details-full-main-content-right">
				<div class="product-details-full-content-header">

					<div data-cms-area="product_details_full_cms_area_1" data-cms-area-filters="page_type"></div>

					<h1 class="product-details-full-content-header-title {{#if model.item.custitem_sca_is_matrix}}matrix{{/if}}" itemprop="name">{{pageHeader}}
						<div class="product-views-option-radio-value custcol_io_config_header"></div>
						<div class="product-views-option-radio-value custcol_io_water_sys_header"></div>
						<div class="product-views-option-radio-value custcol_io_disp_opts_header"></div>
						<div class="product-views-option-radio-value custcol_io_colour_header"></div>
							<span class="sku-holder" data-view="Product.Sku"></span>
					</h1>
					<!--div class="product-details-full-rating" data-view="Global.StarRating"></div-->
					<p class="product-details-full-content-header-title" itemprop="name">1{{model.item.matrixitemnametemplate}}</p>
					<p class="product-details-full-content-header-title" itemprop="name">1{{model.item.displayname}}</p>
					<p class="product-details-full-content-header-title" itemprop="name">2{{model.item.storedescription}}</p>

					{{#if model.item.custitem_sca_is_matrix}}
					&nbsp;
					{{else}}
						<div class="attributes">
						{{#if model.item.custitem_facet_acc_type}}
							<div class="product-details-full-content-store-facet-acc-type">
								<span>Accessory Type: </span>{{model.item.custitem_facet_acc_type}}
							</div>
						{{/if}}
						{{#if model.item.custitem_facet_part_type}}
							<div class="product-details-full-content-store-facet-part-type">
								Part Type: <span class="product-details-full-content-store-facet-part-type-value">{{model.item.custitem_facet_part_type}}</span>
							</div>
						{{/if}}
						{{#if model.item.custitem_facet_compatibility}}
							<div class="product-details-full-content-store-facet-compat">
								<span>Compatibilty: </span>{{model.item.custitem_facet_compatibility}}
							</div>
						{{/if}}
						{{#if model.item.custitem_facet_colour}}
								<div class="product-details-full-content-store-facet-colour">
									<span>Colour: </span>{{model.item.custitem_facet_colour}}
								</div>
						{{/if}}
						{{#if model.item.custitem_facet_brand}}
							<div class="product-details-full-content-store-facet-brand">
								<span>Brand: </span>{{model.item.custitem_facet_brand}}
							</div>
						{{/if}}
						</div>
					{{/if}}
					<div data-cms-area="item_info" data-cms-area-filters="path"></div>
				</div>
			<div class="product-details-full-divider"></div>

			<div class="product-details-full-main">
				{{#if isItemProperlyConfigured}}
					<form id="product-details-full-form" data-action="submit-form" method="POST">

						<section class="product-details-full-info">
							<div id="banner-summary-bottom" class="product-details-full-banner-summary-bottom"></div>
						</section>

						<section data-view="Product.Options"></section>

						<div data-cms-area="product_details_full_cms_area_4" data-cms-area-filters="path"></div>

						<div data-view="Product.Sku"></div>

						<div data-view="Product.Price"></div>
						<div data-view="Quantity.Pricing"></div>

						<div data-view="Product.Stock.Info"></div>

						{{#if isPriceEnabled}}
							<div data-view="Quantity"></div>

							<section class="product-details-full-actions">

								<div class="product-details-full-actions-container">
									<div data-view="MainActionView"></div>

								</div>
								<!--div class="product-details-full-actions-container">
									<div data-view="AddToProductList" class="product-details-full-actions-addtowishlist"></div>

									<div data-view="ProductDetails.AddToQuote" class="product-details-full-actions-addtoquote"></div>
								</div-->

							</section>
						{{/if}}

						<div data-view="StockDescription"></div>

						<!--div data-view="SocialSharing.Flyout" class="product-details-full-social-sharing"></div-->

						<div class="product-details-full-main-bottom-banner">
							<div id="banner-summary-bottom" class="product-details-full-banner-summary-bottom"></div>
						</div>
					</form>
				{{else}}
					<div data-view="GlobalViewsMessageView.WronglyConfigureItem"></div>
				{{/if}}

				<div id="banner-details-bottom" class="product-details-full-banner-details-bottom" data-cms-area="item_info_bottom" data-cms-area-filters="page_type"></div>
			</div>
			</div>

		</section>

		<div data-cms-area="product_details_full_cms_area_5" data-cms-area-filters="page_type"></div>
		<div data-cms-area="product_details_full_cms_area_6" data-cms-area-filters="path"></div>

		<section data-view="Product.Information"></section>

		<div class="product-details-full-divider-desktop"></div>

		<div data-cms-area="product_details_full_cms_area_7" data-cms-area-filters="path"></div>

		<!--div data-view="ProductReviews.Center"></div-->

		<div data-cms-area="product_details_full_cms_area_8" data-cms-area-filters="path"></div>

		<div class="product-details-full-content-related-items">
			<div data-view="Related.Items"></div>
		</div>

		<div class="product-details-full-content-correlated-items">
			<div data-view="Correlated.Items"></div>
		</div>
		<div id="banner-details-bottom" class="content-banner banner-details-bottom" data-cms-area="item_details_banner_bottom" data-cms-area-filters="page_type"></div>
	</article>
</div>


<script type="text/javascript">
		$( ".custitem_bo_mx_config" ).appendTo( ".custitem_bo_mx_config" );
		$( ".custcol_io_water_sys" ).appendTo( ".custcol_io_water_sys_header" );
		$( ".custitembo_mx_disp_opts" ).appendTo( ".custitembo_mx_disp_opts" );
		$( ".custitem_bo_mx_colour" ).appendTo( ".custitem_bo_mx_colour_header" );

		$('.product-details-full-content-store-facet-part-type-value:contains("&nbsp;")').parent('div').hide()
</script>
{{!----
Use the following context variables when customizing this template:

	model (Object)
	model.item (Object)
	model.item.internalid (Number)
	model.item.type (String)
	model.quantity (Number)
	model.options (Array)
	model.options.0 (Object)
	model.options.0.cartOptionId (String)
	model.options.0.itemOptionId (String)
	model.options.0.label (String)
	model.options.0.type (String)
	model.location (String)
	model.fulfillmentChoice (String)
	pageHeader (String)
	itemUrl (String)
	isItemProperlyConfigured (Boolean)
	isPriceEnabled (Boolean)

----}}
