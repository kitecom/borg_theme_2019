define('transaction_line_views_cell_actionable.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return " class=\""
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"generalClass") || (depth0 != null ? compilerNameLookup(depth0,"generalClass") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"generalClass","hash":{},"data":data}) : helper)))
    + "\" ";
},"3":function(container,depth0,helpers,partials,data) {
    return "	    		<span class=\"transaction-line-views-cell-actionable-free-badge\">"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"FREE",{"name":"translate","hash":{},"data":data}))
    + "</span>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "				<a "
    + ((stack1 = ((helper = (helper = compilerNameLookup(helpers,"linkAttributes") || (depth0 != null ? compilerNameLookup(depth0,"linkAttributes") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"linkAttributes","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + ">\n					<img src=\""
    + alias3((compilerNameLookup(helpers,"resizeImage") || (depth0 && compilerNameLookup(depth0,"resizeImage")) || alias2).call(alias1,((stack1 = (depth0 != null ? compilerNameLookup(depth0,"thumbnail") : depth0)) != null ? compilerNameLookup(stack1,"url") : stack1),"thumbnail",{"name":"resizeImage","hash":{},"data":data}))
    + "\" alt=\""
    + alias3(container.lambda(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"thumbnail") : depth0)) != null ? compilerNameLookup(stack1,"altimagetext") : stack1), depth0))
    + "\">\n				</a>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.escapeExpression;

  return "				<img src=\""
    + alias1((compilerNameLookup(helpers,"resizeImage") || (depth0 && compilerNameLookup(depth0,"resizeImage")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? compilerNameLookup(depth0,"thumbnail") : depth0)) != null ? compilerNameLookup(stack1,"url") : stack1),"thumbnail",{"name":"resizeImage","hash":{},"data":data}))
    + "\" alt=\""
    + alias1(container.lambda(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"thumbnail") : depth0)) != null ? compilerNameLookup(stack1,"altimagetext") : stack1), depth0))
    + "\">\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "			<a "
    + ((stack1 = ((helper = (helper = compilerNameLookup(helpers,"linkAttributes") || (depth0 != null ? compilerNameLookup(depth0,"linkAttributes") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"linkAttributes","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + " class=\"transaction-line-views-cell-actionable-name-link\">\n				"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"item") : depth0)) != null ? compilerNameLookup(stack1,"_name") : stack1), depth0))
    + "\n			</a>\n";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "				<span class=\"transaction-line-views-cell-actionable-name-viewonly\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"item") : depth0)) != null ? compilerNameLookup(stack1,"_name") : stack1), depth0))
    + "</span>\n";
},"13":function(container,depth0,helpers,partials,data) {
    return "		<div class=\"transaction-line-views-cell-actionable-price\">\n			<div data-view=\"Item.Price\"></div>\n		</div>\n";
},"15":function(container,depth0,helpers,partials,data) {
    return "			<div class=\"transaction-line-views-cell-actionable-summary\" data-view=\"Item.Summary.View\"></div>\n";
},"17":function(container,depth0,helpers,partials,data) {
    return "			<div class=\"transaction-line-views-cell-actionable-alert-placeholder\" data-type=\"alert-placeholder\"></div>\n";
},"19":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression;

  return "			<div class=\"alert alert-"
    + alias1(((helper = (helper = compilerNameLookup(helpers,"customAlertType") || (depth0 != null ? compilerNameLookup(depth0,"customAlertType") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"customAlertType","hash":{},"data":data}) : helper)))
    + "\">\n				"
    + alias1(container.lambda(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"item") : depth0)) != null ? compilerNameLookup(stack1,"_cartCustomAlert") : stack1), depth0))
    + "\n			</div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<tr id=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"lineId") || (depth0 != null ? compilerNameLookup(depth0,"lineId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lineId","hash":{},"data":data}) : helper)))
    + "\" data-item-id=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"itemId") || (depth0 != null ? compilerNameLookup(depth0,"itemId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"itemId","hash":{},"data":data}) : helper)))
    + "\" data-type=\"order-item\" "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showGeneralClass") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " >\n	<td class=\"transaction-line-views-cell-actionable-table-first\">\n		<div class=\"transaction-line-views-cell-actionable-thumbnail\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isFreeGift") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isNavigable") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "		</div>\n	</td>\n	<td class=\"transaction-line-views-cell-actionable-table-middle\">\n		<div class=\"transaction-line-views-cell-actionable-name\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isNavigable") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.program(11, data, 0),"data":data})) != null ? stack1 : "")
    + "		</div>\n"
    + ((stack1 = compilerNameLookup(helpers,"unless").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isFreeGift") : depth0),{"name":"unless","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "		<div data-view=\"Item.Sku\"></div>\n		<div data-view=\"Item.Tax.Info\"></div>\n		<div class=\"transaction-line-views-cell-actionable-options\">\n			<div data-view=\"Item.SelectedOptions\"></div>\n		</div>\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showSummaryView") : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "		<div class=\"transaction-line-views-cell-actionable-stock\" data-view=\"ItemViews.Stock.View\">\n		</div>\n\n		<div data-view=\"StockDescription\"></div>\n	</td>\n	<td class=\"transaction-line-views-cell-actionable-table-last\" valign=\"bottom\">\n		<div data-view=\"Item.Actions.View\"></div>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showAlert") : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showCustomAlert") : depth0),{"name":"if","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	</td>\n</tr>\n\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'transaction_line_views_cell_actionable'; return template;});