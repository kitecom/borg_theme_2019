define('shopping_layout.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"layout\" class=\"shopping-layout\">\n	<header id=\"site-header\" class=\"shopping-layout-header\" data-view=\"Header\">\n\n		<div class=\"shopping-layout-breadcrumb\" itemscope itemtype=\"https://schema.org/WebPage\">\n			<div data-view=\"Global.Breadcrumb\" data-type=\"breadcrumb\"></div>\n		</div>\n	</header>\n	<div id=\"main-container\">\n\n		<div class=\"shopping-layout-notifications\">\n			<div data-view=\"Notifications\"></div>\n		</div>\n		<!-- Main Content Area -->\n		<div id=\"content\" class=\"shopping-layout-content\"></div>\n		<!-- / Main Content Area -->\n	</div>\n	<footer id=\"site-footer\" class=\"shopping-layout-footer\" data-view=\"Footer\"></footer>\n</div>\n\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; ctx._theme_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'shopping_layout'; return template;});