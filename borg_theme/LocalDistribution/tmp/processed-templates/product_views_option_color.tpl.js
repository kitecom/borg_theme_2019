define('product_views_option_color.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "			<div class=\"product-views-option-color-label-header\">\n				<label class=\"product-views-option-color-label\" for=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"cartOptionId") || (depth0 != null ? compilerNameLookup(depth0,"cartOptionId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cartOptionId","hash":{},"data":data}) : helper)))
    + "\">\n					"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"label") || (depth0 != null ? compilerNameLookup(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + ":\n				</label>\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showSelectedValue") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "				"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showRequiredLabel") : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n			</div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "					<span class=\"product-views-option-color-value "
    + alias4(((helper = (helper = compilerNameLookup(helpers,"cartOptionId") || (depth0 != null ? compilerNameLookup(depth0,"cartOptionId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cartOptionId","hash":{},"data":data}) : helper)))
    + "\" data-value=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"cartOptionId") || (depth0 != null ? compilerNameLookup(depth0,"cartOptionId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cartOptionId","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(container.lambda(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"selectedValue") : depth0)) != null ? compilerNameLookup(stack1,"label") : stack1), depth0))
    + "</span>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "<span class=\"product-views-option-color-label-required\">*</span>";
},"6":function(container,depth0,helpers,partials,data) {
    return "product-views-option-color-container-small";
},"8":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"internalId") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"9":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=helpers.helperMissing, alias5="function";

  return "					<div class=\"product-views-option-color-picker\">\n						<label class=\"product-views-option-color-picker-label\">\n							<input\n								class=\"product-views-option-color-picker-input\"\n								type=\"radio\"\n								name=\""
    + alias2(alias1((depths[1] != null ? compilerNameLookup(depths[1],"cartOptionId") : depths[1]), depth0))
    + "\"\n								id=\""
    + alias2(alias1((depths[1] != null ? compilerNameLookup(depths[1],"cartOptionId") : depths[1]), depth0))
    + "\"\n								data-action=\"changeOption\"\n								value=\""
    + alias2(((helper = (helper = compilerNameLookup(helpers,"internalId") || (depth0 != null ? compilerNameLookup(depth0,"internalId") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"internalId","hash":{},"data":data}) : helper)))
    + "\"\n								"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias3,(depth0 != null ? compilerNameLookup(depth0,"isActive") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n								data-toggle=\"set-option\"\n								data-active=\""
    + alias2(((helper = (helper = compilerNameLookup(helpers,"isActive") || (depth0 != null ? compilerNameLookup(depth0,"isActive") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"isActive","hash":{},"data":data}) : helper)))
    + "\"\n								data-available=\""
    + alias2(((helper = (helper = compilerNameLookup(helpers,"isAvailable") || (depth0 != null ? compilerNameLookup(depth0,"isAvailable") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"isAvailable","hash":{},"data":data}) : helper)))
    + "\" />\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias3,(depth0 != null ? compilerNameLookup(depth0,"isColorTile") : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0, blockParams, depths),"inverse":container.program(17, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "						</label>\n					</div>\n";
},"10":function(container,depth0,helpers,partials,data) {
    return "checked";
},"12":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=helpers.helperMissing, alias4="function";

  return "								<span data-label=\"label-"
    + alias1(container.lambda((depths[1] != null ? compilerNameLookup(depths[1],"cartOptionId") : depths[1]), depth0))
    + "\" value=\""
    + alias1(((helper = (helper = compilerNameLookup(helpers,"internalId") || (depth0 != null ? compilerNameLookup(depth0,"internalId") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"internalId","hash":{},"data":data}) : helper)))
    + "\"\n									class=\"product-views-option-color-picker-box "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias2,(depth0 != null ? compilerNameLookup(depth0,"isActive") : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias2,(depth0 != null ? compilerNameLookup(depth0,"isLightColor") : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\"\n									style=\"background: "
    + alias1(((helper = (helper = compilerNameLookup(helpers,"custcol_io_colour") || (depth0 != null ? compilerNameLookup(depth0,"custcol_io_colour") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"custcol_io_colour","hash":{},"data":data}) : helper)))
    + "\"></span>\n";
},"13":function(container,depth0,helpers,partials,data) {
    return "active";
},"15":function(container,depth0,helpers,partials,data) {
    return "product-views-option-color-picker-box-white-border";
},"17":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=helpers.helperMissing, alias5="function";

  return "								<img data-label=\"label-"
    + alias2(alias1((depths[1] != null ? compilerNameLookup(depths[1],"cartOptionId") : depths[1]), depth0))
    + "\" value=\""
    + alias2(((helper = (helper = compilerNameLookup(helpers,"internalId") || (depth0 != null ? compilerNameLookup(depth0,"internalId") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"internalId","hash":{},"data":data}) : helper)))
    + "\"\n									src=\""
    + alias2((compilerNameLookup(helpers,"resizeImage") || (depth0 && compilerNameLookup(depth0,"resizeImage")) || alias4).call(alias3,((stack1 = (depth0 != null ? compilerNameLookup(depth0,"image") : depth0)) != null ? compilerNameLookup(stack1,"src") : stack1),"tinythumb",{"name":"resizeImage","hash":{},"data":data}))
    + "\"\n									style=\"height:"
    + alias2(alias1(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"image") : depth0)) != null ? compilerNameLookup(stack1,"height") : stack1), depth0))
    + ";width:"
    + alias2(alias1(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"image") : depth0)) != null ? compilerNameLookup(stack1,"width") : stack1), depth0))
    + "\"\n									alt=\""
    + alias2(((helper = (helper = compilerNameLookup(helpers,"label") || (depth0 != null ? compilerNameLookup(depth0,"label") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"label","hash":{},"data":data}) : helper)))
    + "\"\n									class=\"product-views-option-color-picker-box-img\">\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"cartOptionId") || (depth0 != null ? compilerNameLookup(depth0,"cartOptionId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cartOptionId","hash":{},"data":data}) : helper)))
    + "-container\" class=\"product-views-option-color\" data-type=\"option\" data-cart-option-id=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"cartOptionId") || (depth0 != null ? compilerNameLookup(depth0,"cartOptionId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cartOptionId","hash":{},"data":data}) : helper)))
    + "\" data-item-option-id=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"itemOptionId") || (depth0 != null ? compilerNameLookup(depth0,"itemOptionId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"itemOptionId","hash":{},"data":data}) : helper)))
    + "\">\n	<div class=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"cartOptionId") || (depth0 != null ? compilerNameLookup(depth0,"cartOptionId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cartOptionId","hash":{},"data":data}) : helper)))
    + "-controls-group\" data-validation=\"control-group\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showLabel") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "		<div class=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"cartOptionId") || (depth0 != null ? compilerNameLookup(depth0,"cartOptionId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cartOptionId","hash":{},"data":data}) : helper)))
    + "-controls product-views-option-color-container "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showSmall") : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" data-validation=\"control\">\n"
    + ((stack1 = compilerNameLookup(helpers,"each").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"values") : depth0),{"name":"each","hash":{},"fn":container.program(8, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "		</div>\n	</div>\n</div>\n\n";
},"useData":true,"useDepths":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'product_views_option_color'; return template;});