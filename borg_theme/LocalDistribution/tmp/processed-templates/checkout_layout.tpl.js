define('checkout_layout.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"layout\" class=\"checkout-layout\">\n	<header id=\"site-header\" class=\"checkout-layout-header\" data-view=\"Header\"></header>\n	<div id=\"main-container\">\n		<div class=\"checkout-layout-breadcrumb\" data-view=\"Global.Breadcrumb\" data-type=\"breadcrumb\"></div>\n		<div class=\"checkout-layout-notifications\">\n			<div data-view=\"Notifications\"></div>\n		</div>\n		<!-- Main Content Area -->\n		\n		<div id=\"content\" class=\"checkout-layout-content\"></div>\n		<!-- / Main Content Area -->\n		\n	</div>\n	<footer id=\"site-footer\" class=\"checkout-layout-footer\" data-view=\"Footer\"></footer>\n</div>\n<script type=\"text/javascript\">\n//STICKY SIDEBAR	\n	(function($) {\n	    var element = $('.follow-scroll'),\n	        originalY = element.offset().top;\n	    \n	    // Space between element and top of screen (when scrolling)\n	    var topMargin = 20;\n	    \n	    // Should probably be set in CSS; but here just for emphasis\n	    element.css('position', 'relative');\n	    \n	    $(window).on('scroll', function(event) {\n	        var scrollTop = $(window).scrollTop();\n	        \n	        element.stop(false, true).animate({\n	            top: scrollTop < originalY\n	                    ? 0\n	                    : scrollTop - originalY + topMargin\n	        }, 250);\n	    });\n	})\n	(jQuery);\n	\n</script>\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'checkout_layout'; return template;});