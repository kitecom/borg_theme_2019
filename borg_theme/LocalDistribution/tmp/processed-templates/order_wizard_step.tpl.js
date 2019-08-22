define('order_wizard_step.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<header class=\"order-wizard-step-header\">\n	<h2 data-type=\"wizard-step-name-container\" class=\"order-wizard-step-title\">"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"title") || (depth0 != null ? compilerNameLookup(depth0,"title") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"title","hash":{},"data":data}) : helper)))
    + "  </h2>\n</header>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "				<button class=\"order-wizard-step-button-continue\" data-action=\"submit-step\">\n					"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"continueButtonLabel") || (depth0 != null ? compilerNameLookup(depth0,"continueButtonLabel") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"continueButtonLabel","hash":{},"data":data}) : helper)))
    + "\n				</button>\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showBottomMessage") : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "					<small class=\"order-wizard-step-message "
    + alias4(((helper = (helper = compilerNameLookup(helpers,"bottomMessageClass") || (depth0 != null ? compilerNameLookup(depth0,"bottomMessageClass") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"bottomMessageClass","hash":{},"data":data}) : helper)))
    + "\">\n						"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"bottomMessage") || (depth0 != null ? compilerNameLookup(depth0,"bottomMessage") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"bottomMessage","hash":{},"data":data}) : helper)))
    + "\n						<a href=\"https://store.borgandoverstrom.com/all-items\" class=\"back\" >\n							"
    + alias4((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Or you can continue shopping",{"name":"translate","hash":{},"data":data}))
    + "\n						</a>\n					</small>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div data-action=\"skip-login-message\" class=\"order-wizard-step-guest-message\"></div>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showTitle") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n<div data-type=\"alert-placeholder-step\"></div>\n\n<div class=\"order-wizard-step-review-wrapper\">\n	<section class=\"order-wizard-step-review-main\">\n		<div id=\"wizard-step-review-left\"></div>\n	</section>\n	\n	<section id=\"wizard-step-review-right\" class=\"order-wizard-step-review-secondary\">\n	</section>\n\n</div>\n<div data-cms-area=\"order_wizard_cms_area_1\" data-cms-area-filters=\"page_type\"></div>\n<div class=\"order-wizard-step-content-wrapper\">\n	\n	<div class=\"order-wizard-step-content-main\">\n		<div data-cms-area=\"order_wizard_cms_area_2\" data-cms-area-filters=\"page_type\"></div>\n		<section id=\"wizard-step-content\"></section>\n		<div data-cms-area=\"order_wizard_cms_area_3\" data-cms-area-filters=\"page_type\"></div>\n	</div>\n\n\n	<div class=\"order-wizard-step-content-secondary follow-scroll\">\n		\n		<section id=\"wizard-step-content-right\" ></section>\n		\n		<div class=\"order-wizard-step-actions-right\">\n			<div class=\"order-wizard-step-button-container\">\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showContinueButton") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "				"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"displayName") || (depth0 != null ? compilerNameLookup(depth0,"displayName") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"displayName","hash":{},"data":data}) : helper)))
    + "\n			</div>\n		</div>\n	</div>\n	\n\n	\n</div>\n<script type=\"text/javascript\">\n	$(function() {\n  	var loc = window.location.href; // returns the full URL\n  	if(/review/.test(loc)) {\n    $('#wizard-step-content-right').addClass('review'); \n  	}\n	});\n\n	\n</script>	\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'order_wizard_step'; return template;});