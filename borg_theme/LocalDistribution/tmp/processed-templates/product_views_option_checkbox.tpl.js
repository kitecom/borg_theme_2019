define('product_views_option_checkbox.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "			<label class=\"product-views-option-checkbox-label\" for=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"cartOptionId") || (depth0 != null ? compilerNameLookup(depth0,"cartOptionId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cartOptionId","hash":{},"data":data}) : helper)))
    + "\">\n				"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"label") || (depth0 != null ? compilerNameLookup(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "\n			</label>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "checked";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"cartOptionId") || (depth0 != null ? compilerNameLookup(depth0,"cartOptionId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cartOptionId","hash":{},"data":data}) : helper)))
    + "-container\" class=\"product-views-option-checkbox\" data-type=\"option\" data-cart-option-id=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"cartOptionId") || (depth0 != null ? compilerNameLookup(depth0,"cartOptionId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cartOptionId","hash":{},"data":data}) : helper)))
    + "\" data-item-option-id=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"itemOptionId") || (depth0 != null ? compilerNameLookup(depth0,"itemOptionId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"itemOptionId","hash":{},"data":data}) : helper)))
    + "\">\n	<div class=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"cartOptionId") || (depth0 != null ? compilerNameLookup(depth0,"cartOptionId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cartOptionId","hash":{},"data":data}) : helper)))
    + "-controls-group\" data-validation=\"control-group\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showLabel") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "		<div data-validation=\"control\">			\n			<input\n				name=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"cartOptionId") || (depth0 != null ? compilerNameLookup(depth0,"cartOptionId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cartOptionId","hash":{},"data":data}) : helper)))
    + "\"\n				type=\"checkbox\"\n				id=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"cartOptionId") || (depth0 != null ? compilerNameLookup(depth0,"cartOptionId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cartOptionId","hash":{},"data":data}) : helper)))
    + "\"\n				class=\"product-views-option-checkbox-input\"\n				value=\"T\"\n				"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isActive") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "				\n				>			\n		</div>\n	</div>\n</div>\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'product_views_option_checkbox'; return template;});