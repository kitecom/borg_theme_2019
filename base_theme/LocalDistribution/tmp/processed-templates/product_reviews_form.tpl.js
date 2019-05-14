define('product_reviews_form.tpl', ['Handlebars','Handlebars.CompilerNameLookup','facets_item_cell_list.tpl'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    return "		<p>"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"You need to be logged in to write a review, <a href=\"#\" data-touchpoint=\"login\">click here</a> to log in.",{"name":"translate","hash":{},"data":data}))
    + "</p>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "\n		<h1>"
    + ((stack1 = ((helper = (helper = compilerNameLookup(helpers,"header") || (depth0 != null ? compilerNameLookup(depth0,"header") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"header","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</h1>\n\n		<div class=\"product-reviews-form-divider\"></div>\n\n		<div class=\"product-reviews-form-item-cell\">\n			<div data-view=\"Facets.ItemCell\" data-template=\"facets_item_cell_list\"></div>\n		</div>\n		<div class=\"product-reviews-form-content\">\n			<form id=\"new-product-review\" class=\"product-reviews-form-new\" action=\"POST\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showStarRatingAttributes") : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n				<p class=\"product-reviews-form-content-title\">\n					"
    + alias4((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Rating",{"name":"translate","hash":{},"data":data}))
    + "\n				</p>\n				<div id=\"rating\" data-view=\"Global.StarRating\" data-validation=\"control-group\" class=\"product-reviews-form-global-star-rating\"></div>\n\n				<div class=\"product-reviews-form-content-groups\">\n					<div class=\"product-reviews-form-content-group\" data-validation=\"control-group\" data-input=\"writerName\">\n						<label class=\"product-reviews-form-content-group-label\" for=\"writerName\">"
    + alias4((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Your Name",{"name":"translate","hash":{},"data":data}))
    + "</label>\n						<div class=\"product-reviews-form-controls\" data-validation=\"control\">\n							<input type=\"text\" id=\"writerName\" class=\"product-reviews-form-content-group-input\" name=\"writerName\" value=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"writer") || (depth0 != null ? compilerNameLookup(depth0,"writer") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"writer","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"\">\n							<p class=\"product-reviews-form-help\">"
    + alias4((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"For privacy reasons, please do not use your full name or email address.",{"name":"translate","hash":{},"data":data}))
    + "</p>\n						</div>\n					</div>\n					<div class=\"product-reviews-form-content-group\" data-validation=\"control-group\" data-input=\"text\">\n						<label class=\"product-reviews-form-content-group-label\" for=\"text\">"
    + alias4((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Write your review",{"name":"translate","hash":{},"data":data}))
    + "</label>\n						<div class=\"product-reviews-form-controls\" data-validation=\"control\">\n							<textarea id=\"text\" class=\"product-reviews-form-content-group-text\" name=\"text\">"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"text") || (depth0 != null ? compilerNameLookup(depth0,"text") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"text","hash":{},"data":data}) : helper)))
    + "</textarea>\n						</div>\n					</div>\n					<div class=\"product-reviews-form-content-group\" data-validation=\"control-group\" data-input=\"title\">\n						<label class=\"product-reviews-form-content-group-label\" for=\"title\">"
    + alias4((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"A headline for your review",{"name":"translate","hash":{},"data":data}))
    + "</label>\n						<div class=\"product-reviews-form-controls\" data-validation=\"control\">\n							<input type=\"text\" id=\"title\" class=\"product-reviews-form-content-group-input\" name=\"title\" value=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"title") || (depth0 != null ? compilerNameLookup(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"\">\n						</div>\n					</div>\n				</div>\n				<div class=\"product-reviews-form-actions\">\n					<button type=\"submit\" class=\"product-reviews-form-actions-button-submit\">"
    + alias4((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Submit",{"name":"translate","hash":{},"data":data}))
    + "</button>\n			  		<button type=\"button\" data-action=\"preview\" class=\"product-reviews-form-actions-button-preview\">"
    + alias4((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Preview",{"name":"translate","hash":{},"data":data}))
    + "</button>\n			  		<a class=\"product-reviews-form-actions-button-back\" href=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"itemUrl") || (depth0 != null ? compilerNameLookup(depth0,"itemUrl") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"itemUrl","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Back to Product",{"name":"translate","hash":{},"data":data}))
    + "</a>\n				</div>\n			</form>\n		</div>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "					<p class=\"product-reviews-form-content-title\">\n						"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"How does this product feel overall?",{"name":"translate","hash":{},"data":data}))
    + "\n					</p>\n\n					<div class=\"product-reviews-form-content-rating\" data-view=\"Global.StarRatingAttribute\"></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"product-reviews-form\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"isLoginRequiredAndIsNotLoggedIn") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "</div>\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/SuiteCommerce/Suite_Commerce_Base_Theme/19.1.0/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/SuiteCommerce/Suite_Commerce_Base_Theme/19.1.0/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'product_reviews_form'; return template;});