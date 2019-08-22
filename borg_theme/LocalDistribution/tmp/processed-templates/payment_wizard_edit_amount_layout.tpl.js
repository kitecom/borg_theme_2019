define('payment_wizard_edit_amount_layout.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "			<div class=\"payment-wizard-edit-amount-layout-form-row\">\n				<span class=\"payment-wizard-edit-amount-layout-form-row-left\">"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"amountDueLabel") || (depth0 != null ? compilerNameLookup(depth0,"amountDueLabel") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"amountDueLabel","hash":{},"data":data}) : helper)))
    + ":</span>\n				<span class=\"payment-wizard-edit-amount-layout-form-row-right\">"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"amountDueFormatted") || (depth0 != null ? compilerNameLookup(depth0,"amountDueFormatted") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"amountDueFormatted","hash":{},"data":data}) : helper)))
    + "</span>\n			</div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "			<div class=\"payment-wizard-edit-amount-layout-form-row\">\n				<span class=\"payment-wizard-edit-amount-layout-form-row-left\">\n					"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Invoices ($(0))",(depth0 != null ? compilerNameLookup(depth0,"selectedInvoicesLength") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n				</span>\n				<span class=\"payment-wizard-edit-amount-layout-form-row-right\">\n					"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"invoiceTotalFormatted") || (depth0 != null ? compilerNameLookup(depth0,"invoiceTotalFormatted") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"invoiceTotalFormatted","hash":{},"data":data}) : helper)))
    + "\n				</span>\n			</div>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "			<div class=\"payment-wizard-edit-amount-layout-discount-section\">\n				<div class=\"payment-wizard-edit-amount-layout-form-row\">\n					<span class=\"payment-wizard-edit-amount-layout-form-row-left\">\n						"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Applicable discount $(0)",(depth0 != null ? compilerNameLookup(depth0,"discountFormatted") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n					</span>\n					<span class=\"payment-wizard-edit-amount-layout-form-row-right\" data-type=\"applied-discount-ammount\">- "
    + alias3(((helper = (helper = compilerNameLookup(helpers,"discountAmountFormatted") || (depth0 != null ? compilerNameLookup(depth0,"discountAmountFormatted") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"discountAmountFormatted","hash":{},"data":data}) : helper)))
    + "</span>\n				</div>\n				<hr />\n				<div class=\"payment-wizard-edit-amount-layout-form-row\">\n					<span class=\"payment-wizard-edit-amount-layout-form-row-left\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Your payment:",{"name":"translate","hash":{},"data":data}))
    + "</span>\n					<span class=\"payment-wizard-edit-amount-layout-form-row-right\" data-type=\"specified-payment-ammount\" >"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"dueWithDiscountFormatted") || (depth0 != null ? compilerNameLookup(depth0,"dueWithDiscountFormatted") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"dueWithDiscountFormatted","hash":{},"data":data}) : helper)))
    + "</span>\n				</div>\n			</div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"payment-wizard-edit-amount-layout\">\n	<form id=\"editAmountToPayForm\" class=\"payment-wizard-edit-amount-layout-form\" data-action=\"edit-amount-form\">\n	<div>\n		<div class=\"payment-wizard-edit-amount-layout-form-row\">\n			<span class=\"payment-wizard-edit-amount-layout-form-row-left\">"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"originalAmountLabel") || (depth0 != null ? compilerNameLookup(depth0,"originalAmountLabel") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"originalAmountLabel","hash":{},"data":data}) : helper)))
    + ":</span>\n			<span class=\"payment-wizard-edit-amount-layout-form-row-right\">"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"originalAmountFormatted") || (depth0 != null ? compilerNameLookup(depth0,"originalAmountFormatted") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"originalAmountFormatted","hash":{},"data":data}) : helper)))
    + "</span>\n		</div>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showAmountDue") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n		<hr/>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showSelectedInvoicesLength") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n		<div class=\"payment-wizard-edit-amount-layout-form-row\" data-validation=\"control-group\">\n			<span class=\"payment-wizard-edit-amount-layout-form-row-left-amount\">"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"inputLabel") || (depth0 != null ? compilerNameLookup(depth0,"inputLabel") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"inputLabel","hash":{},"data":data}) : helper)))
    + "</span>\n			<span class=\"payment-wizard-edit-amount-layout-form-row-right\">\n				<div class=\"payment-wizard-edit-amount-layout-form-row-currency\" data-validation=\"control\">\n					<input name=\"amount\" data-action=\"edit-amount\" autofocus type=\"text\" class=\"payment-wizard-edit-amount-layout-form-row-currency-selector-select\" value=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"inputValue") || (depth0 != null ? compilerNameLookup(depth0,"inputValue") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"inputValue","hash":{},"data":data}) : helper)))
    + "\" />\n					<span class=\"payment-wizard-edit-amount-layout-form-row-currency-selector-addon\">"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"currencySymbol") || (depth0 != null ? compilerNameLookup(depth0,"currencySymbol") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"currencySymbol","hash":{},"data":data}) : helper)))
    + "</span>\n				</div>\n			</span>\n		</div>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showDiscountApplied") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n		<div class=\"payment-wizard-edit-amount-layout-form-action\">\n			<input type=\"submit\" value=\""
    + alias4((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Save",{"name":"translate","hash":{},"data":data}))
    + "\" class=\"payment-wizard-edit-amount-layout-form--action-button\" data-action=\"save-amount\" />\n		</div>\n	</div>\n	</form>\n</div>\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'payment_wizard_edit_amount_layout'; return template;});