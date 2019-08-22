<div class="product-details-full {{#if model.item.custitem_sca_is_matrix}}matrix{{/if}}">
	<header class="product-details-full-header">
		<div id="banner-content-top" class="product-details-full-banner-top"></div>
	</header>
	<div class="product-details-full-divider-desktop"></div>
	<article class="product-details-full-content" itemscope itemtype="https://schema.org/Product">
		<meta itemprop="url" content="{{itemUrl}}">
		<div id="banner-details-top" class="product-details-full-banner-top-details"></div>

		<section class="product-details-full-main-content">

			<div class="product-details-full-main-content-left">
				<div class="product-details-full-image-gallery-container wrap" {{#if model.item.custitem_sca_is_matrix}}id="wrap"{{else}}id="notwrap"{{/if}}>
					<div id="banner-image-top" class="content-banner banner-image-top"></div>
					<div data-view="Product.ImageGallery"></div>
					<div id="banner-image-bottom" class="content-banner banner-image-bottom"></div>
				</div>
			</div>

			<div class="product-details-full-main-content-right">
				<div class="product-details-full-content-header">

					<div class="product-details-full-content-header-title {{#if model.item.custitem_sca_is_matrix}}matrix{{/if}}">
					<h1 class="product-details-full-content-header-title" itemprop="name">	
						{{pageHeader}}
					</h1>
						<div class="product-views-option-radio-value custcol_io_config_header"></div>
						<div class="product-views-option-radio-value custcol_io_water_sys_header"></div>
						<div class="product-views-option-radio-value custcol_io_disp_opts_header"></div>
						<div class="product-views-option-radio-value custcol_io_colour_header"></div>
						<!--span class="sku-holder" data-view="Product.Sku"></span-->
					</div>
					<div class="item-stock-info" data-view="Product.Stock.Info"></div>
					<!--div class="product-details-full-rating" data-view="Global.StarRating"></div-->
					<p class="product-details-full-content-header-desc" itemprop="description">
					{{{model.item.storedescription}}}
					</p>

					{{#if model.item.custitem_sca_is_matrix}} 
					&nbsp;
					{{else}}
						<div class="attributes">
						{{#if model.item.custitemcustitem_facet_model}}
							<div class="product-details-full-content-store-facet-model">
								<span class="attr-name">Model: </span>
								<span class="attr-value">{{model.item.custitemcustitem_facet_model}}</span>
							</div>
						{{/if}}
						{{#if model.item.custitemcustitem_facet_config}}
								<div class="product-details-full-content-store-facet-config">
									<span class="attr-name">Configuration: </span>
									<span class="attr-value">{{model.item.custitemcustitem_facet_config}}</span>
								</div>
						{{/if}}
						{{#if model.item.custitemcustitem_facet_disp_opts}}
								<div class="product-details-full-content-store-facet-disp-opts">
									<span class="attr-name">Dispense Options: </span>
									<span class="attr-value">{{model.item.custitemcustitem_facet_disp_opts}}</span>
								</div>
						{{/if}}
						{{#if model.item.custitem_facet_colour}}
								<div class="product-details-full-content-store-facet-colour">
									<span class="attr-name">Colour: </span>
									<span class="attr-value">{{model.item.custitem_facet_colour}}</span>
								</div>
						{{/if}}
						{{#if model.item.custitem_facet_voltage}}
								<div class="product-details-full-content-store-facet-voltage">
									<span class="attr-name">Voltage: </span>
									<span class="attr-value">{{model.item.custitem_facet_voltage}}</span>
								</div>
						{{/if}}
						{{#if model.item.custitem_facet_acc_type}}
							<div class="product-details-full-content-store-facet-acc-type">
								<span class="attr-name">Accessory Type: </span>
								<span class="attr-value">{{model.item.custitem_facet_acc_type}}</span>
							</div>
						{{/if}}
						{{#if model.item.custitem_facet_part_type}}
							<div class="product-details-full-content-store-facet-part-type">
								<span class="attr-name">Part Type: </span>
								<span class="attr-value">{{model.item.custitem_facet_part_type}}</span>
							</div>
						{{/if}}
						{{#if model.item.custitem_facet_compatibility}}
							<div class="product-details-full-content-store-facet-compat">
								<span class="attr-name">Compatibilty: </span>
								<span class="attr-value">{{model.item.custitem_facet_compatibility}}</span>
							</div>
						{{/if}}
						
						{{#if model.item.custitem_facet_brand}}
							<div class="product-details-full-content-store-facet-brand">
								<span class="attr-name">Brand: </span>
								<span class="attr-value">{{model.item.custitem_facet_brand}}</span>
							</div>
						{{/if}}
						
						</div>
					{{/if}}
				</div>
			<div class="product-details-full-divider"></div>

			<div class="product-details-full-main">
				{{#if isItemProperlyConfigured}}
					<form id="product-details-full-form" data-action="submit-form" method="POST">

						<section class="product-details-full-info">
							<div id="banner-summary-bottom" class="product-details-full-banner-summary-bottom"></div>
						</section>

						<section data-view="Product.Options"></section>

						<div data-view="Product.Sku"></div>

						<div data-view="Product.Price"></div>
						<div data-view="Quantity.Pricing"></div>

						

						{{#if isPriceEnabled}}
						<div class="actions">
							<div data-view="Quantity" class="qty"></div>
							<section class="product-details-full-actions">
							<div class="product-details-full-actions-container">
									<div data-view="MainActionView"></div>

								</div>
								<div class="product-details-full-actions-container">
									<div data-view="AddToProductList" class="product-details-full-actions-addtowishlist"></div>

									<!--div data-view="ProductDetails.AddToQuote" class="product-details-full-actions-addtoquote"></div-->
								</div>

							</section>
						</div>
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


			</div>
		</section>

		

		<section data-view="Product.Information"></section>

		<div class="product-details-full-divider-desktop"></div>


		<!--div data-view="ProductReviews.Center"></div-->

		<div class="product-details-full-content-related-items">
			<div data-view="Related.Items"></div>
		</div>
		
		<div class="product-details-full-content-correlated-items">
			<div data-view="Correlated.Items"></div>
		</div>
	</article>
</div>


<script type="text/javascript">
	$( ".custcol_io_config" ).appendTo( ".custcol_io_config_header" );
	$( ".custcol_io_water_sys" ).appendTo( ".custcol_io_water_sys_header" );
	$( ".custcol_io_disp_opts" ).appendTo( ".custcol_io_disp_opts_header" );
	$( ".custcol_io_colour" ).appendTo( ".custcol_io_colour_header" );

	$('.attr-value:contains("&nbsp;")').parent('div').hide()

	$(window).scroll(function() {    
	    var scroll = $(window).scrollTop();

	    if (scroll >= 300) {
	        $(".wrap").addClass("unfixed");
	    } else {
	        $(".wrap").removeClass("unfixed");
	    }
	});
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
