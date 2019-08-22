define('product_details_full.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    return "matrix";
},"3":function(container,depth0,helpers,partials,data) {
    return "id=\"wrap\"";
},"5":function(container,depth0,helpers,partials,data) {
    return "id=\"notwrap\"";
},"7":function(container,depth0,helpers,partials,data) {
    return "					&nbsp;\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "						<div class=\"attributes\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitemcustitem_facet_model") : stack1),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitemcustitem_facet_config") : stack1),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitemcustitem_facet_disp_opts") : stack1),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_facet_colour") : stack1),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_facet_voltage") : stack1),{"name":"if","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_facet_acc_type") : stack1),{"name":"if","hash":{},"fn":container.program(20, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_facet_part_type") : stack1),{"name":"if","hash":{},"fn":container.program(22, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_facet_compatibility") : stack1),{"name":"if","hash":{},"fn":container.program(24, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "						\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_facet_brand") : stack1),{"name":"if","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "						\n						</div>\n";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "							<div class=\"product-details-full-content-store-facet-model\">\n								<span class=\"attr-name\">Model: </span>\n								<span class=\"attr-value\">"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitemcustitem_facet_model") : stack1), depth0))
    + "</span>\n							</div>\n";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "								<div class=\"product-details-full-content-store-facet-config\">\n									<span class=\"attr-name\">Configuration: </span>\n									<span class=\"attr-value\">"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitemcustitem_facet_config") : stack1), depth0))
    + "</span>\n								</div>\n";
},"14":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "								<div class=\"product-details-full-content-store-facet-disp-opts\">\n									<span class=\"attr-name\">Dispense Options: </span>\n									<span class=\"attr-value\">"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitemcustitem_facet_disp_opts") : stack1), depth0))
    + "</span>\n								</div>\n";
},"16":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "								<div class=\"product-details-full-content-store-facet-colour\">\n									<span class=\"attr-name\">Colour: </span>\n									<span class=\"attr-value\">"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_facet_colour") : stack1), depth0))
    + "</span>\n								</div>\n";
},"18":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "								<div class=\"product-details-full-content-store-facet-voltage\">\n									<span class=\"attr-name\">Voltage: </span>\n									<span class=\"attr-value\">"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_facet_voltage") : stack1), depth0))
    + "</span>\n								</div>\n";
},"20":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "							<div class=\"product-details-full-content-store-facet-acc-type\">\n								<span class=\"attr-name\">Accessory Type: </span>\n								<span class=\"attr-value\">"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_facet_acc_type") : stack1), depth0))
    + "</span>\n							</div>\n";
},"22":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "							<div class=\"product-details-full-content-store-facet-part-type\">\n								<span class=\"attr-name\">Part Type: </span>\n								<span class=\"attr-value\">"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_facet_part_type") : stack1), depth0))
    + "</span>\n							</div>\n";
},"24":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "							<div class=\"product-details-full-content-store-facet-compat\">\n								<span class=\"attr-name\">Compatibilty: </span>\n								<span class=\"attr-value\">"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_facet_compatibility") : stack1), depth0))
    + "</span>\n							</div>\n";
},"26":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "							<div class=\"product-details-full-content-store-facet-brand\">\n								<span class=\"attr-name\">Brand: </span>\n								<span class=\"attr-value\">"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_facet_brand") : stack1), depth0))
    + "</span>\n							</div>\n";
},"28":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "					<form id=\"product-details-full-form\" data-action=\"submit-form\" method=\"POST\">\n\n						<section class=\"product-details-full-info\">\n							<div id=\"banner-summary-bottom\" class=\"product-details-full-banner-summary-bottom\"></div>\n						</section>\n\n						<section data-view=\"Product.Options\"></section>\n\n						<div data-view=\"Product.Sku\"></div>\n\n						<div data-view=\"Product.Price\"></div>\n						<div data-view=\"Quantity.Pricing\"></div>\n\n						\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"isPriceEnabled") : depth0),{"name":"if","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n						<div data-view=\"StockDescription\"></div>\n\n						<!--div data-view=\"SocialSharing.Flyout\" class=\"product-details-full-social-sharing\"></div-->\n\n						<div class=\"product-details-full-main-bottom-banner\">\n							<div id=\"banner-summary-bottom\" class=\"product-details-full-banner-summary-bottom\"></div>\n						</div>\n					</form>\n";
},"29":function(container,depth0,helpers,partials,data) {
    return "						<div class=\"actions\">\n							<div data-view=\"Quantity\" class=\"qty\"></div>\n							<section class=\"product-details-full-actions\">\n							<div class=\"product-details-full-actions-container\">\n									<div data-view=\"MainActionView\"></div>\n\n								</div>\n								<div class=\"product-details-full-actions-container\">\n									<div data-view=\"AddToProductList\" class=\"product-details-full-actions-addtowishlist\"></div>\n\n									<!--div data-view=\"ProductDetails.AddToQuote\" class=\"product-details-full-actions-addtoquote\"></div-->\n								</div>\n\n							</section>\n						</div>\n";
},"31":function(container,depth0,helpers,partials,data) {
    return "					<div data-view=\"GlobalViewsMessageView.WronglyConfigureItem\"></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"product-details-full "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_sca_is_matrix") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n	<header class=\"product-details-full-header\">\n		<div id=\"banner-content-top\" class=\"product-details-full-banner-top\"></div>\n	</header>\n	<div class=\"product-details-full-divider-desktop\"></div>\n	<article class=\"product-details-full-content\" itemscope itemtype=\"https://schema.org/Product\">\n		<meta itemprop=\"url\" content=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"itemUrl") || (depth0 != null ? compilerNameLookup(depth0,"itemUrl") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"itemUrl","hash":{},"data":data}) : helper)))
    + "\">\n		<div id=\"banner-details-top\" class=\"product-details-full-banner-top-details\"></div>\n\n		<section class=\"product-details-full-main-content\">\n\n			<div class=\"product-details-full-main-content-left\">\n				<div class=\"product-details-full-image-gallery-container wrap\" "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_sca_is_matrix") : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + ">\n					<div id=\"banner-image-top\" class=\"content-banner banner-image-top\"></div>\n					<div data-view=\"Product.ImageGallery\"></div>\n					<div id=\"banner-image-bottom\" class=\"content-banner banner-image-bottom\"></div>\n				</div>\n			</div>\n\n			<div class=\"product-details-full-main-content-right\">\n				<div class=\"product-details-full-content-header\">\n\n					<div class=\"product-details-full-content-header-title "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_sca_is_matrix") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n					<h1 class=\"product-details-full-content-header-title\" itemprop=\"name\">	\n						"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"pageHeader") || (depth0 != null ? compilerNameLookup(depth0,"pageHeader") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pageHeader","hash":{},"data":data}) : helper)))
    + "\n					</h1>\n						<div class=\"product-views-option-radio-value custcol_io_config_header\"></div>\n						<div class=\"product-views-option-radio-value custcol_io_water_sys_header\"></div>\n						<div class=\"product-views-option-radio-value custcol_io_disp_opts_header\"></div>\n						<div class=\"product-views-option-radio-value custcol_io_colour_header\"></div>\n						<!--span class=\"sku-holder\" data-view=\"Product.Sku\"></span-->\n					</div>\n					<div class=\"item-stock-info\" data-view=\"Product.Stock.Info\"></div>\n					<!--div class=\"product-details-full-rating\" data-view=\"Global.StarRating\"></div-->\n					<p class=\"product-details-full-content-header-desc\" itemprop=\"description\">\n					"
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"storedescription") : stack1), depth0)) != null ? stack1 : "")
    + "\n					</p>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"item") : stack1)) != null ? compilerNameLookup(stack1,"custitem_sca_is_matrix") : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "				</div>\n			<div class=\"product-details-full-divider\"></div>\n\n			<div class=\"product-details-full-main\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isItemProperlyConfigured") : depth0),{"name":"if","hash":{},"fn":container.program(28, data, 0),"inverse":container.program(31, data, 0),"data":data})) != null ? stack1 : "")
    + "\n\n			</div>\n		</section>\n\n		\n\n		<section data-view=\"Product.Information\"></section>\n\n		<div class=\"product-details-full-divider-desktop\"></div>\n\n\n		<!--div data-view=\"ProductReviews.Center\"></div-->\n\n		<div class=\"product-details-full-content-related-items\">\n			<div data-view=\"Related.Items\"></div>\n		</div>\n		\n		<div class=\"product-details-full-content-correlated-items\">\n			<div data-view=\"Correlated.Items\"></div>\n		</div>\n	</article>\n</div>\n\n\n<script type=\"text/javascript\">\n	$( \".custcol_io_config\" ).appendTo( \".custcol_io_config_header\" );\n	$( \".custcol_io_water_sys\" ).appendTo( \".custcol_io_water_sys_header\" );\n	$( \".custcol_io_disp_opts\" ).appendTo( \".custcol_io_disp_opts_header\" );\n	$( \".custcol_io_colour\" ).appendTo( \".custcol_io_colour_header\" );\n\n	$('.attr-value:contains(\"&nbsp;\")').parent('div').hide()\n\n	$(window).scroll(function() {    \n	    var scroll = $(window).scrollTop();\n\n	    if (scroll >= 300) {\n	        $(\".wrap\").addClass(\"unfixed\");\n	    } else {\n	        $(\".wrap\").removeClass(\"unfixed\");\n	    }\n	});\n</script>\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'product_details_full'; return template;});