define('overview_home.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "\n		<table class=\"overview-home-orders-list-table\">\n				<thead class=\"overview-home-content-table\">\n					<tr class=\"overview-home-content-table-header-row\">\n						<th class=\"overview-home-content-table-header-row-title\">\n							<span>"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Purchase No.",{"name":"translate","hash":{},"data":data}))
    + "</span>\n						</th>\n						<th class=\"overview-home-content-table-header-row-date\">\n							<span>"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Date",{"name":"translate","hash":{},"data":data}))
    + "</span>\n						</th>\n						<th class=\"overview-home-content-table-header-row-currency\">\n							<span>"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Amount",{"name":"translate","hash":{},"data":data}))
    + "</span>\n						</th>\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isSCISIntegrationEnabled") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "						<th class=\"overview-home-content-table-header-row-track\">\n							<span>"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Track Items",{"name":"translate","hash":{},"data":data}))
    + "</span>\n						</th>\n					</tr>\n				</thead>\n				<tbody class=\"overview-home-purchases-list\" data-view=\"Order.History.Results\"></tbody>\n			</table>\n\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "							<th class=\"overview-home-content-table-header-row-origin\">\n								<span>"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Origin",{"name":"translate","hash":{},"data":data}))
    + "</span>\n							</th>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "							<th class=\"overview-home-content-table-header-row-status\">\n								<span>"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Status",{"name":"translate","hash":{},"data":data}))
    + "</span>\n							</th>\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "			<div class=\"overview-home-orders-empty-section\">\n				<h5>"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"You don't have any purchases in your account right now.",{"name":"translate","hash":{},"data":data}))
    + "</h5>\n			</div>\n";
},"8":function(container,depth0,helpers,partials,data) {
    return "	<div class=\"overview-home-header-links\">\n		"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Need Help? Contact <a href=\"$(0)\">Customer Service</a>",(depth0 != null ? compilerNameLookup(depth0,"customerSupportURL") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n	</div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<section class=\"overview-home\">\n	<div class=\"overview-home-orders\" data-permissions=\""
    + alias3(((helper = (helper = compilerNameLookup(helpers,"purchasesPermissions") || (depth0 != null ? compilerNameLookup(depth0,"purchasesPermissions") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"purchasesPermissions","hash":{},"data":data}) : helper)))
    + "\">\n		<div class=\"overview-home-orders-title\">\n			<h3>"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Recent Purchases",{"name":"translate","hash":{},"data":data}))
    + "</h3>\n			<a href=\"/purchases\" class=\"overview-home-orders-title-link\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"View Purchase History",{"name":"translate","hash":{},"data":data}))
    + "</a>\n		</div>\n		<div class=\"overview-home-order-history-results-container\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"collectionLengthGreaterThan0") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + "		</div>\n	</div>\n\n	<!--div class=\"ma-home\">\n		<div class=\"ma-home-orders\"><!--div data-cms-area=\"ma_home_orders\" data-cms-area-filters=\"path\" class=\"myaccount_cms_area\"></div>\n			<h3>Orders</h3>\n			<p>Track, modify or cancel an order or make a return</p>\n			<a href=\"#\">View your orders</a>\n		</div>\n		<div class=\"ma-home-acc-mgmnt\"><div data-cms-area=\"ma_home_acc_mgmnt\" data-cms-area-filters=\"path\" class=\"myaccount_cms_area\"></div></div>\n		<div class=\"ma-home-resources\"><div data-cms-area=\"ma_home_resources\" data-cms-area-filters=\"path\" class=\"myaccount_cms_area\"></div></div>\n		<div class=\"ma-home-settings\"><div data-cms-area=\"ma_home_settings\" data-cms-area-filters=\"path\" class=\"myaccount_cms_area\"></div></div>\n		<div class=\"ma-home-appliances\"><div data-cms-area=\"ma_home_appliances\" data-cms-area-filters=\"path\" class=\"myaccount_cms_area\"></div></div>\n		<div class=\"ma-home-news\"><div data-cms-area=\"ma_home_news\" data-cms-area-filters=\"path\" class=\"myaccount_cms_area\"></div></div>\n		<div class=\"ma-home-comms\"><div data-cms-area=\"ma_home_comms\" data-cms-area-filters=\"path\" class=\"myaccount_cms_area\"></div></div>\n		<div class=\"ma-home-slas\"><div data-cms-area=\"ma_home_slas\" data-cms-area-filters=\"path\" class=\"myaccount_cms_area\"></div></div>\n	</div-->\n\n</section>\n<section class=\"overview-home-mysettings\">\n	<h3>"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"My Settings",{"name":"translate","hash":{},"data":data}))
    + "</h3>\n	<div class=\"overview-home-mysettings-row\">\n		<div class=\"overview-home-mysettings-profile\">\n			<div data-view=\"Overview.Profile\"></div>\n		</div>\n		<div class=\"overview-home-mysettings-shipping\">\n			<div data-view=\"Overview.Shipping\"></div>\n		</div>\n		<div class=\"overview-home-mysettings-payment\">\n			<div data-view=\"Overview.Payment\"></div>\n		</div>\n	</div>\n</section>\n<div data-view=\"Overview.Banner\"></div>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"hasCustomerSupportURL") : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; ctx._theme_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'overview_home'; return template;});