define('order_wizard_msr_package_creation.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "		<div class=\"order-wizard-msr-package-creation-header\">\n			<h5 class=\"order-wizard-msr-package-creation-header-subtitle\"> \n				"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Select shipping address",{"name":"translate","hash":{},"data":data}))
    + " \n			</h5>\n		</div>\n		<div class=\"order-wizard-msr-package-creation-header-row\" >\n			<div class=\"order-wizard-msr-package-creation-shipping-left\">\n				<select data-action=\"set-shipments-address-selector\" class=\"order-wizard-msr-package-creation-multishipto-address-selector\" >\n"
    + ((stack1 = compilerNameLookup(helpers,"each").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"addresses") : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "				</select>\n			</div>\n			<div class=\"order-wizard-msr-package-creation-shipping-right\" >\n				<a href=\""
    + alias3(((helper = (helper = compilerNameLookup(helpers,"editAddressesUrl") || (depth0 != null ? compilerNameLookup(depth0,"editAddressesUrl") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"editAddressesUrl","hash":{},"data":data}) : helper)))
    + "\"  class=\"order-wizard-msr-package-creation-shipping-add-edit-link\"> "
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Add / Edit Addresses",{"name":"translate","hash":{},"data":data}))
    + " </a>\n			</div>\n		</div>\n		<div>\n			<h5 class=\"order-wizard-msr-package-creation-header-subtitle\">\n				"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Select products for this address",{"name":"translate","hash":{},"data":data}))
    + " \n			</h5>\n		</div>\n		<div data-type=\"items-selection-control\" class=\"order-wizard-msr-package-creation-items-remaining-list\">\n			<div class=\"order-wizard-msr-package-creation-row\">\n				<div class=\"order-wizard-msr-package-creation-multishipto-table-container\">\n					<table class=\"order-wizard-msr-package-creation-multishipto-table\">\n						<th colspan=\"3\" data-action=\"select-unselect-all\" class=\"order-wizard-msr-package-creation-multishipto-table-header-select\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"hasMultipleUnsetLines") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "						</th>\n						<th class=\"order-wizard-msr-package-creation-multishipto-table-header-qty\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Qty",{"name":"translate","hash":{},"data":data}))
    + "</th>\n						<th class=\"order-wizard-msr-package-creation-multishipto-table-header-unit-price\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Unit Price",{"name":"translate","hash":{},"data":data}))
    + "</th>\n						<th class=\"order-wizard-msr-package-creation-multishipto-table-header-amount\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Amount",{"name":"translate","hash":{},"data":data}))
    + "</th>\n					</table> \n				</div>\n\n				<div data-type=\"items-remaining-list\">\n					<table class=\"order-wizard-msr-package-creation-products-table md2sm\" data-view=\"ShippableItems.Collection\"></table>\n				</div>\n			</div>\n		</div>\n		<div data-type=\"module-footer\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isAnySelectedItem") : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.program(17, data, 0),"data":data})) != null ? stack1 : "")
    + "				\n			<button data-action=\"create-shipments\" class=\"order-wizard-msr-package-creation-button-create\" "
    + ((stack1 = compilerNameLookup(helpers,"unless").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isCreateShipmentEnabled") : depth0),{"name":"unless","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n				"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"createShipmentLabel") || (depth0 != null ? compilerNameLookup(depth0,"createShipmentLabel") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"createShipmentLabel","hash":{},"data":data}) : helper)))
    + "\n			</button>\n		</div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "						<option value=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"addressId") || (depth0 != null ? compilerNameLookup(depth0,"addressId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"addressId","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isSelected") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " >\n							"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"addressText") || (depth0 != null ? compilerNameLookup(depth0,"addressText") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"addressText","hash":{},"data":data}) : helper)))
    + "\n						</option>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "selected";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "							    <input type=\"checkbox\" data-type=\"selectunselect-all-checkbox\" "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"areAllItemSelected") : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " />\n							    <label style=\"display:inline;\"> "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"areAllItemSelected") : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.program(10, data, 0),"data":data})) != null ? stack1 : "")
    + " </label>\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "checked";
},"8":function(container,depth0,helpers,partials,data) {
    return " "
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Unselect all",{"name":"translate","hash":{},"data":data}))
    + " ";
},"10":function(container,depth0,helpers,partials,data) {
    return " "
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Select all (<span data-type=\"item-remaining-count\">$(0)</span>)",(depth0 != null ? compilerNameLookup(depth0,"allItemsLength") : depth0),{"name":"translate","hash":{},"data":data}))
    + " ";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "				<div class=\"order-wizard-msr-package-creation-ship-address\">\n					<p class=\"order-wizard-msr-package-creation-item-count\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"isSelectedItemsLengthGreaterThan1") : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.program(15, data, 0),"data":data})) != null ? stack1 : "")
    + "					</p>\n\n					<div data-type=\"multishipto-address-selected\" class=\"order-wizard-msr-package-creation-multishipto-address-selected\" >\n						<div data-view=\"Address.Details\" class=\"order-wizard-msr-package-creation-single-address\"></div>\n					</div>\n				</div>\n";
},"13":function(container,depth0,helpers,partials,data) {
    return "							"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"The <span data-type=\"item-selected-count\">$(0)</span> products you selected will be shipped to:",(depth0 != null ? compilerNameLookup(depth0,"selectedItemsLength") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n";
},"15":function(container,depth0,helpers,partials,data) {
    return "							"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"<span data-type=\"item-selected-count\" class=\"hidden\">$(0)</span>The product you selected will be shipped to:",(depth0 != null ? compilerNameLookup(depth0,"selectedItemsLength") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n";
},"17":function(container,depth0,helpers,partials,data) {
    return "				<p class=\"order-wizard-msr-package-creation-item-count\">"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"<span data-type=\"item-selected-count\">$(0)</span> products selected",(depth0 != null ? compilerNameLookup(depth0,"selectedItemsLength") : depth0),{"name":"translate","hash":{},"data":data}))
    + "</p>\n";
},"19":function(container,depth0,helpers,partials,data) {
    return "disabled=\"disabled\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div>\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"isAnyUnsetLine") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'order_wizard_msr_package_creation'; return template;});