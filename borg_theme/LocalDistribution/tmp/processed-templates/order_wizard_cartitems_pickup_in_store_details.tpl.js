define('order_wizard_cartitems_pickup_in_store_details.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "	<section class=\"order-wizard-cartitems-pickup-in-store-details-container\">\n		<div class=\"order-wizard-cartitems-pickup-in-store-details-body\">\n			<h4 class=\"order-wizard-cartitems-pickup-in-store-details-title\">\n				"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Pick Up at $(0)",((stack1 = (depth0 != null ? compilerNameLookup(depth0,"location") : depth0)) != null ? compilerNameLookup(stack1,"name") : stack1),{"name":"translate","hash":{},"data":data}))
    + "\n			</h4>\n			<div class=\"order-wizard-cartitems-pickup-in-store-details-address\">\n				<div class=\"order-wizard-cartitems-pickup-in-store-details-address-container\" data-view=\"PickupInStore.StoreLocationInfo\"></div>\n			</div>\n			<div class=\"order-wizard-cartitems-pickup-in-store-details-item-list\">\n					<div data-view=\"Items.Collection\"></div>\n			</div>\n		</div>\n	</section>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"showLocation") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'order_wizard_cartitems_pickup_in_store_details'; return template;});