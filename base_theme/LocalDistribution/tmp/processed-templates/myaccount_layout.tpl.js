define('myaccount_layout.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"layout\" class=\"myaccount-layout\">\n	<header id=\"site-header\" class=\"myaccount-layout-header\" data-view=\"Header\"></header>\n\n	<div id=\"main-container\" class=\"myaccount-layout-container\">\n\n		<div class=\"myaccount-layout-breadcrumb\" data-view=\"Global.Breadcrumb\" data-type=\"breadcrumb\"></div>\n		<div class=\"myaccount-layout-notifications\">\n			<div data-view=\"Notifications\"></div>\n		</div>\n		<div class=\"myaccount-layout-error-placeholder\"></div>\n\n		<h2 class=\"myaccount-layout-title\">"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"My Account",{"name":"translate","hash":{},"data":data}))
    + "</h2>\n		<div class=\"myaccount-layout-row\">\n			<nav id=\"side-nav\" class=\"myaccount-layout-side-nav\" data-view=\"MenuTree\"></nav>\n\n			<div id=\"content\" class=\"myaccount-layout-main\"></div>\n		</div>\n\n	</div>\n\n	<footer id=\"site-footer\" class=\"myaccount-layout-footer\" data-view=\"Footer\"></footer>\n\n</div>\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/SuiteCommerce/Suite_Commerce_Base_Theme/19.1.0/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/SuiteCommerce/Suite_Commerce_Base_Theme/19.1.0/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'myaccount_layout'; return template;});