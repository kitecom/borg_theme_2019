define('product_details_full.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    return "matrix";
},"3":function(container,depth0,helpers,partials,data) {
    return "					&nbsp;\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "						<div class=\"attributes\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_facet_acc_type") : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_facet_part_type") : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_facet_compatibility") : stack1),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_facet_colour") : stack1),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_facet_brand") : stack1),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "						</div>\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "							<div class=\"product-details-full-content-store-facet-acc-type\">\n								<span>Accessory Type: </span>"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_facet_acc_type") : stack1), depth0))
    + "\n							</div>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "							<div class=\"product-details-full-content-store-facet-part-type\">\n								Part Type: <span class=\"product-details-full-content-store-facet-part-type-value\">"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_facet_part_type") : stack1), depth0))
    + "</span>\n							</div>\n";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "							<div class=\"product-details-full-content-store-facet-compat\">\n								<span>Compatibilty: </span>"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_facet_compatibility") : stack1), depth0))
    + "\n							</div>\n";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "								<div class=\"product-details-full-content-store-facet-colour\">\n									<span>Colour: </span>"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_facet_colour") : stack1), depth0))
    + "\n								</div>\n";
},"14":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "							<div class=\"product-details-full-content-store-facet-brand\">\n								<span>Brand: </span>"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_facet_brand") : stack1), depth0))
    + "\n							</div>\n";
},"16":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "					<form id=\"product-details-full-form\" data-action=\"submit-form\" method=\"POST\">\n\n						<section class=\"product-details-full-info\">\n							<div id=\"banner-summary-bottom\" class=\"product-details-full-banner-summary-bottom\"></div>\n						</section>\n\n						<section data-view=\"Product.Options\"></section>\n\n						<div data-cms-area=\"product_details_full_cms_area_4\" data-cms-area-filters=\"path\"></div>\n\n						<div data-view=\"Product.Sku\"></div>\n\n						<div data-view=\"Product.Price\"></div>\n						<div data-view=\"Quantity.Pricing\"></div>\n\n						<div data-view=\"Product.Stock.Info\"></div>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"isPriceEnabled") : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n						<div data-view=\"StockDescription\"></div>\n\n						<!--div data-view=\"SocialSharing.Flyout\" class=\"product-details-full-social-sharing\"></div-->\n\n						<div class=\"product-details-full-main-bottom-banner\">\n							<div id=\"banner-summary-bottom\" class=\"product-details-full-banner-summary-bottom\"></div>\n						</div>\n					</form>\n";
},"17":function(container,depth0,helpers,partials,data) {
    return "							<div data-view=\"Quantity\"></div>\n\n							<section class=\"product-details-full-actions\">\n\n								<div class=\"product-details-full-actions-container\">\n									<div data-view=\"MainActionView\"></div>\n\n								</div>\n								<!--div class=\"product-details-full-actions-container\">\n									<div data-view=\"AddToProductList\" class=\"product-details-full-actions-addtowishlist\"></div>\n\n									<div data-view=\"ProductDetails.AddToQuote\" class=\"product-details-full-actions-addtoquote\"></div>\n								</div-->\n\n							</section>\n";
},"19":function(container,depth0,helpers,partials,data) {
    return "					<div data-view=\"GlobalViewsMessageView.WronglyConfigureItem\"></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda;

  return "<div class=\"product-details-full\">\n	<div data-cms-area=\"item_details_banner\" data-cms-area-filters=\"page_type\"></div>\n\n	<header class=\"product-details-full-header\">\n		<div id=\"banner-content-top\" class=\"product-details-full-banner-top\"></div>\n	</header>\n	<div class=\"product-details-full-divider-desktop\"></div>\n	<article class=\"product-details-full-content\" itemscope itemtype=\"https://schema.org/Product\">\n		<meta itemprop=\"url\" content=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"itemUrl") || (depth0 != null ? compilerNameLookup(depth0,"itemUrl") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"itemUrl","hash":{},"data":data}) : helper)))
    + "\">\n		<div id=\"banner-details-top\" class=\"product-details-full-banner-top-details\"></div>\n\n		<section class=\"product-details-full-main-content\">\n\n			<div class=\"product-details-full-main-content-left\">\n				<div class=\"product-details-full-image-gallery-container\">\n					<div id=\"banner-image-top\" class=\"content-banner banner-image-top\"></div>\n					<div data-view=\"Product.ImageGallery\"></div>\n					<div id=\"banner-image-bottom\" class=\"content-banner banner-image-bottom\"></div>\n\n					<div data-cms-area=\"product_details_full_cms_area_2\" data-cms-area-filters=\"path\"></div>\n					<div data-cms-area=\"product_details_full_cms_area_3\" data-cms-area-filters=\"page_type\"></div>\n				</div>\n			</div>\n\n			<div class=\"product-details-full-main-content-right\">\n				<div class=\"product-details-full-content-header\">\n\n					<div data-cms-area=\"product_details_full_cms_area_1\" data-cms-area-filters=\"page_type\"></div>\n\n					<h1 class=\"product-details-full-content-header-title "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_sca_is_matrix") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" itemprop=\"name\">"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"pageHeader") || (depth0 != null ? compilerNameLookup(depth0,"pageHeader") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pageHeader","hash":{},"data":data}) : helper)))
    + "\n						<div class=\"product-views-option-radio-value custcol_io_config_header\"></div>\n						<div class=\"product-views-option-radio-value custcol_io_water_sys_header\"></div>\n						<div class=\"product-views-option-radio-value custcol_io_disp_opts_header\"></div>\n						<div class=\"product-views-option-radio-value custcol_io_colour_header\"></div>\n							<span class=\"sku-holder\" data-view=\"Product.Sku\"></span>\n					</h1>\n					<!--div class=\"product-details-full-rating\" data-view=\"Global.StarRating\"></div-->\n					<p class=\"product-details-full-content-header-title\" itemprop=\"name\">1"
    + alias4(alias5(((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"matrixitemnametemplate") : stack1), depth0))
    + "</p>\n					<p class=\"product-details-full-content-header-title\" itemprop=\"name\">1"
    + alias4(alias5(((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"displayname") : stack1), depth0))
    + "</p>\n					<p class=\"product-details-full-content-header-title\" itemprop=\"name\">2"
    + alias4(alias5(((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"storedescription") : stack1), depth0))
    + "</p>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_sca_is_matrix") : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "					<div data-cms-area=\"item_info\" data-cms-area-filters=\"path\"></div>\n				</div>\n			<div class=\"product-details-full-divider\"></div>\n\n			<div class=\"product-details-full-main\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isItemProperlyConfigured") : depth0),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.program(19, data, 0),"data":data})) != null ? stack1 : "")
    + "\n				<div id=\"banner-details-bottom\" class=\"product-details-full-banner-details-bottom\" data-cms-area=\"item_info_bottom\" data-cms-area-filters=\"page_type\"></div>\n			</div>\n			</div>\n\n		</section>\n\n		<div data-cms-area=\"product_details_full_cms_area_5\" data-cms-area-filters=\"page_type\"></div>\n		<div data-cms-area=\"product_details_full_cms_area_6\" data-cms-area-filters=\"path\"></div>\n\n		<section data-view=\"Product.Information\"></section>\n\n		<div class=\"product-details-full-divider-desktop\"></div>\n\n		<div data-cms-area=\"product_details_full_cms_area_7\" data-cms-area-filters=\"path\"></div>\n\n		<!--div data-view=\"ProductReviews.Center\"></div-->\n\n		<div data-cms-area=\"product_details_full_cms_area_8\" data-cms-area-filters=\"path\"></div>\n\n		<div class=\"product-details-full-content-related-items\">\n			<div data-view=\"Related.Items\"></div>\n		</div>\n\n		<div class=\"product-details-full-content-correlated-items\">\n			<div data-view=\"Correlated.Items\"></div>\n		</div>\n		<div id=\"banner-details-bottom\" class=\"content-banner banner-details-bottom\" data-cms-area=\"item_details_banner_bottom\" data-cms-area-filters=\"page_type\"></div>\n	</article>\n</div>\n\n\n<script type=\"text/javascript\">\n		$( \".custitem_bo_mx_config\" ).appendTo( \".custitem_bo_mx_config\" );\n		$( \".custcol_io_water_sys\" ).appendTo( \".custcol_io_water_sys_header\" );\n		$( \".custitembo_mx_disp_opts\" ).appendTo( \".custitembo_mx_disp_opts\" );\n		$( \".custitem_bo_mx_colour\" ).appendTo( \".custitem_bo_mx_colour_header\" );\n\n		$('.product-details-full-content-store-facet-part-type-value:contains(\"&nbsp;\")').parent('div').hide()\n</script>\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/Borg_Base_Theme/19.1.0/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/Borg_Base_Theme/19.1.0/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'product_details_full'; return template;});