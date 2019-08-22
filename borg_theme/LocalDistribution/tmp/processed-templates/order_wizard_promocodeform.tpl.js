define('order_wizard_promocodeform.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "	<div class=\"order-wizard-promocodeform\">\n		<div class=\"order-wizard-promocodeform-expander-head\">\n			<a class=\"order-wizard-promocodeform-expander-head-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#order-wizard-promocode\" aria-expanded=\"false\" aria-controls=\"order-wizard-promocode\">\n				"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Have a Promo Code?",{"name":"translate","hash":{},"data":data}))
    + "\n				<i class=\"order-wizard-promocodeform-tooltip\" data-toggle=\"tooltip\" title=\""
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"<b>Promo Code</b><br>To redeem a promo code, simply enter your information and we will apply the offer to your purchase during checkout.",{"name":"translate","hash":{},"data":data}))
    + "\"></i>\n				<i class=\"order-wizard-promocodeform-expander-toggle-icon\"></i>\n			</a>\n		</div>\n		<div class=\"order-wizard-promocodeform-expander-body collapse\" id=\"order-wizard-promocode\"  data-type=\"promo-code-container\" data-action=\"show-promo-code-container\" aria-expanded=\"false\" data-target=\"#order-wizard-promocode\">\n			<div class=\"order-wizard-promocodeform-expander-container\">\n				<div data-view=\"Cart.PromocodeForm\"></div>\n			</div>\n		</div>\n		<div data-cms-area=\"order_wizard_promocodeform_cms_area_1\" data-cms-area-filters=\"page_type\"></div>\n	</div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<!--\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"showPromocodeForm") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "-->\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'order_wizard_promocodeform'; return template;});