define('site_search.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"site-search\" data-type=\"site-search\"> \n    <a href=\"#\" class=\"close-button\"></a>\n    <div class=\"site-search-content\">\n        <form class=\"site-search-content-form\" method=\"GET\" action=\"/search\" data-action=\"search\">\n            <div class=\"site-search-content-input\">\n				<div data-view=\"ItemsSeacher\"></div>\n                \n				<a class=\"site-search-input-reset\" data-type=\"search-reset\"><i class=\"site-search-input-reset-icon\"></i></a>\n                <i class=\"site-search-input-icon\"></i>\n            </div>\n            <button class=\"site-search-button-submit\" type=\"submit\"></button>\n        </form>\n        <div class=\"dummy-search\">\n             <div data-cms-area=\"dummy_search\" data-cms-area-filters=\"global\"></div>\n             <h3 class=\"search-heading\">Most search for:</h3>\n            <ul>\n                <li class=\"search-item\">\n                    <a class=\"search-link\" href=\"https://www.borgandoverstrom.com/en/find-a-distributor/\">Find a distributor of Borg &amp; Overström </a>\n                </li>\n                <li class=\"search-item\">\n                    <a class=\"search-link\" href=\"https://www.borgandoverstrom.com/en/m/water-dispensers/\">View all Borg &amp; Overström water dispensers </a>\n                </li>\n                <li class=\"search-item\">\n                    <a class=\"search-link\" href=\"https://www.borgandoverstrom.com/en/become-a-distributor/\">Become a distributor of Borg &amp; Overström </a>\n                </li>\n                <li class=\"search-item\">\n                    <a class=\"search-link\" href=\"https://www.borgandoverstrom.com/en/support/how-to-videos/\">Where can I watch technical how-to videos? </a>\n                </li>\n                <li class=\"search-item\">\n                    <a class=\"search-link\" href=\"https://www.borgandoverstrom.com/en/support/faqs/\">I'd like to review frequently asked questions </a>\n                </li>\n                <li class=\"search-item\">\n                    <a class=\"search-link\" href=\"https://www.borgandoverstrom.com/en/support/manuals/\">Where can I find technical manuals? </a>\n                </li>\n                <li class=\"search-item\">\n                    <a class=\"search-link\" href=\"https://www.borgandoverstrom.com/en/contact-us/\">Where can I view all contact details? </a>\n                </li>\n            </ul>\n        </div>\n        \n    </div>\n\n</div>\n\n<script>\n\n$(\".close-button\").click(function() {\n    $(\".site-search\").css('display', 'none');\n});\n\n\n\n</script>\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'site_search'; return template;});