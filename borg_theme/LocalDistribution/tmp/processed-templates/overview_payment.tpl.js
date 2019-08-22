define('overview_payment.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "		<div data-view=\"CreditCard.View\"></div>\n		<div class=\"overview-payment-card-button-edit-container\">\n			<a class=\"overview-payment-card-button-edit\" href=\"/creditcards/"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"creditCardInternalid") || (depth0 != null ? compilerNameLookup(depth0,"creditCardInternalid") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"creditCardInternalid","hash":{},"data":data}) : helper)))
    + "\" data-toggle=\"show-in-modal\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Edit",{"name":"translate","hash":{},"data":data}))
    + "</a>\n		</div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "		<div class=\"overview-payment-card-content\">\n			<p class=\"add-card\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"We have no default credit card on file for this account.",{"name":"translate","hash":{},"data":data}))
    + " <a href=\"/creditcards/new\" class=\"overview-payment-card-button-edit\" data-toggle=\"show-in-modal\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Click here to add one",{"name":"translate","hash":{},"data":data}))
    + "</a></p>\n		</div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<article class=\"overview-payment\">\n	<div class=\"overview-payment-header\">\n		<h4>"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(alias1,"Default Payment Method",{"name":"translate","hash":{},"data":data}))
    + "</h4>\n	</div>\n\n	<section class=\"overview-payment-card\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"hasDefaultCreditCard") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "	</section>\n</article>\n\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'overview_payment'; return template;});