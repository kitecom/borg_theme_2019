define('order_history_list_tracking_number.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"showContentOnEmpty") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "		<span class=\"order-history-list-tracking-number-not-available-label\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Tracking Number:",{"name":"translate","hash":{},"data":data}))
    + "</span>\n		<span class=\"order-history-list-tracking-number-not-available "
    + alias3(((helper = (helper = compilerNameLookup(helpers,"contentClass") || (depth0 != null ? compilerNameLookup(depth0,"contentClass") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"contentClass","hash":{},"data":data}) : helper)))
    + "\">\n			"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"N/A",{"name":"translate","hash":{},"data":data}))
    + "\n		</span>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"isTrackingNumberCollectionLengthEqual1") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(12, data, 0),"data":data})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showTrackPackagesLabel") : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "			<span class=\"order-history-list-tracking-number-available-label\">"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(alias1,"Tracking Number:",{"name":"translate","hash":{},"data":data}))
    + " </span>\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"firstTrackingNumberName") : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.program(10, data, 0),"data":data})) != null ? stack1 : "");
},"6":function(container,depth0,helpers,partials,data) {
    return "			<span class=\"order-history-list-tracking-number-label\">\n				"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Track Package",{"name":"translate","hash":{},"data":data}))
    + ":\n			</span>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "			<a target=\"_blank\" class=\"order-history-list-tracking-number-control-numbers-link\" data-action=\"tracking-number\" href=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"firstTrackingNumberURL") || (depth0 != null ? compilerNameLookup(depth0,"firstTrackingNumberURL") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"firstTrackingNumberURL","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"firstTrackingNumberName") || (depth0 != null ? compilerNameLookup(depth0,"firstTrackingNumberName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"firstTrackingNumberName","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = compilerNameLookup(helpers,"firstTrackingNumberText") || (depth0 != null ? compilerNameLookup(depth0,"firstTrackingNumberText") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"firstTrackingNumberText","hash":{},"data":data}) : helper)))
    + "</a>\n";
},"10":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "			<a target=\"_blank\" class=\"order-history-list-tracking-number-control-numbers-link\" data-action=\"tracking-number\" href=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"firstTrackingNumberURL") || (depth0 != null ? compilerNameLookup(depth0,"firstTrackingNumberURL") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"firstTrackingNumberURL","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"firstTrackingNumberText") || (depth0 != null ? compilerNameLookup(depth0,"firstTrackingNumberText") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"firstTrackingNumberText","hash":{},"data":data}) : helper)))
    + "</a>\n";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "		<div class=\"order-history-list-tracking-number-control\">\n			<button class=\"order-history-list-tracking-number-control-button\"  data-toggle=\"dropdown\">\n				"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(alias1,"Track Packages",{"name":"translate","hash":{},"data":data}))
    + "\n				<i class=\"order-history-list-tracking-number-control-toggle-icon\"></i>\n			</button>\n			<div class=\"order-history-list-tracking-number-control-numbers "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"collapseElements") : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n				<ul>\n"
    + ((stack1 = compilerNameLookup(helpers,"each").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"trackingNumbers") : depth0),{"name":"each","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "				</ul>\n			</div>\n		</div>\n";
},"13":function(container,depth0,helpers,partials,data) {
    return "collapsed";
},"15":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "					<li>\n						<a target=\"_blank\" class=\"order-history-list-tracking-number-control-numbers-link\" data-action=\"tracking-number\" href=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"serviceURL") || (depth0 != null ? compilerNameLookup(depth0,"serviceURL") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"serviceURL","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"trackingNumber") || (depth0 != null ? compilerNameLookup(depth0,"trackingNumber") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"trackingNumber","hash":{},"data":data}) : helper)))
    + "</a>\n						"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"serviceName") || (depth0 != null ? compilerNameLookup(depth0,"serviceName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"serviceName","hash":{},"data":data}) : helper)))
    + "\n					</li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"isTrackingNumberCollectionEmpty") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'order_history_list_tracking_number'; return template;});