define('invoice_open_list.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    return "	<a href=\"/\" class=\"invoice-open-list-button-back\">\n		<i class=\"invoice-open-list-button-back-icon\"></i>\n		"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Back to Account",{"name":"translate","hash":{},"data":data}))
    + "\n	</a>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "		<div data-view=\"Invoices.Message\"></div>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "			<a data-permissions=\"transactions.tranCustPymt.2, transactions.tranCustInvc.1\" data-type=\"make-a-payment\" class=\"invoice-open-list-button-payment\"\n			"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"enableMakeAPaymentButton") : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.program(8, data, 0),"data":data})) != null ? stack1 : "")
    + ">\n					"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(alias1,"Make a Payment",{"name":"translate","hash":{},"data":data}))
    + "\n			</a>\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "href=\"/make-a-payment\"";
},"8":function(container,depth0,helpers,partials,data) {
    return "disabled";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\n			<table class=\"invoice-open-list-records\">\n				<thead class=\"invoice-open-list-records-head\">\n					<tr class=\"invoice-open-list-records-head-row\">\n						<th></th>\n						<th></th>\n"
    + ((stack1 = compilerNameLookup(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"columns") : depth0),{"name":"each","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "				</thead>\n\n				<tbody class=\"invoice-open-list-records-body\" data-view=\"Invoice.Results\"></tbody>\n\n			</table>\n\n";
},"11":function(container,depth0,helpers,partials,data) {
    var helper;

  return "						<th>\n								"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"label") || (depth0 != null ? compilerNameLookup(depth0,"label") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"label","hash":{},"data":data}) : helper)))
    + "\n						</th>\n";
},"13":function(container,depth0,helpers,partials,data) {
    return "			<div class=\"invoice-open-list-no-records\">\n				<h5>"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"You don't have any Open Invoices at the moment,<br/>see <a href=\"/paid-invoices\" class=\"invoice-open-list-anchor-paid\">Invoices Paid In Full</a>",{"name":"translate","hash":{},"data":data}))
    + "</h5>\n			</div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showBackToAccount") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n<section class=\"invoice-open-list\">\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showInvoices") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n	<header class=\"invoice-open-list-header\">\n		<h2 class=\"invoice-open-list-title\">"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"pageHeader") || (depth0 != null ? compilerNameLookup(depth0,"pageHeader") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"pageHeader","hash":{},"data":data}) : helper)))
    + "</h2>\n	</header>\n\n	<div class=\"invoice-open-list-header-nav\">\n		<div class=\"invoice-open-list-header-button-group\">\n			<span class=\"invoice-open-list-header-button-open\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Open",{"name":"translate","hash":{},"data":data}))
    + "</span>\n			<a href=\"/paid-invoices\" class=\"invoice-open-list-header-button-paid\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Paid in Full",{"name":"translate","hash":{},"data":data}))
    + "</a>\n		</div>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showMakeAPaymentButton") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	</div>\n\n	<div data-view=\"ListHeader\"></div>\n\n	<div class=\"invoice-open-list-body\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showInvoices") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.program(13, data, 0),"data":data})) != null ? stack1 : "")
    + "	</div>\n</section>\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'invoice_open_list'; return template;});