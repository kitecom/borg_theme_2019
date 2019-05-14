define('payment_wizard_invoice_module.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "	<div class=\"payment-wizard-invoice-module-list-subheader\">\n			<table class=\"payment-wizard-invoice-module-table\">\n				<thead class=\"payment-wizard-invoice-module-table-header\">\n					<tr>\n						<th class=\"payment-wizard-invoice-module-table-select-col\">\n							&nbsp;\n						</th>\n						<th class=\"payment-wizard-invoice-module-table-invoice-number\">\n							<span>"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Invoice No.",{"name":"translate","hash":{},"data":data}))
    + "</span>\n						</th>\n						<th class=\"payment-wizard-invoice-module-table-invoice-due-date\">\n							<span>"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Due date",{"name":"translate","hash":{},"data":data}))
    + "</span>\n						</th>\n						<th class=\"payment-wizard-invoice-module-table-invoice-amount\">\n							<span>"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Amount Due",{"name":"translate","hash":{},"data":data}))
    + "</span>\n						</th>\n						<th class=\"payment-wizard-invoice-module-table-invoice-action\">\n							&nbsp;\n						</th>\n					</tr>\n				</thead>\n			<tbody class=\"payment-wizard-invoice-module-table-body\" data-view=\"Invoices.Collection\"></tbody>\n			</table>\n		</div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "	<p class=\"payment-wizard-invoice-module-list-empty\">\n		"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"You don't have any Open Invoices at the moment,<br/>see <a href=\"/paid-invoices\">Invoices Paid In Full</a>",{"name":"translate","hash":{},"data":data}))
    + "\n	</p>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div data-view=\"ListHeader.View\"></div>\n\n<div class=\"payment-wizard-invoice-module-payment-list\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"isInvoiceLengthGreaterThan0") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "</div>\n\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/Borg_Base_Theme/19.1.0/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/Borg_Base_Theme/19.1.0/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'payment_wizard_invoice_module'; return template;});