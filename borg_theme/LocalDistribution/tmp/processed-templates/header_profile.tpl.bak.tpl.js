define('header_profile.tpl.bak.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "	<a class=\"header-profile-welcome-link\" href=\"#\" data-toggle=\"dropdown\">\n		dropdown\n	</a>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"showMyAccountMenu") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "		<ul class=\"header-profile-menu-myaccount-container\">\n			<li data-view=\"Header.Menu.MyAccount\">\n				<a href=\"my_account\">my account</a>\n			</li>\n		</ul>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"showLoginMenu") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"showLogin") : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"header-profile-menu-login-container\">\n	<ul class=\"header-profile-menu-login\">\n		<li>\n			<a class=\"header-profile-login-link\" data-touchpoint=\"login\" data-hashtag=\"login-register\" href=\"#\">\n				"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(alias1,"Login",{"name":"translate","hash":{},"data":data}))
    + "\n			</a>\n		</li>\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showRegister") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	</ul>\n	</div>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "			<li> | </li>\n			<li>\n				<a class=\"header-profile-register-link\" data-touchpoint=\"register\" data-hashtag=\"login-register\" href=\"#\">\n					"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Register",{"name":"translate","hash":{},"data":data}))
    + "\n				</a>\n			</li>\n";
},"9":function(container,depth0,helpers,partials,data) {
    return "		<a class=\"header-profile-loading-link\">\n			<i class=\"header-profile-loading-icon\"></i>\n			<span class=\"header-profile-loading-indicator\"></span>\n		</a>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<a class=\"header-profile-login-link\" data-touchpoint=\"login\" data-hashtag=\"login-register\" href=\"#\">\n	<!--"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(alias1,"Login",{"name":"translate","hash":{},"data":data}))
    + "-->\n	<svg id=\"icon-user\" viewbox=\"0 0 16 17.2\" style=\"fill: #fff; max-height: 80px;\">\n	<path d=\"M4.4 5.6c0-2 1.6-3.7 3.7-3.7 2 0 3.7 1.6 3.7 3.7 0 2-1.6 3.6-3.5 3.6h-.1-.1c-2.2-.1-3.7-1.7-3.7-3.6m7 4.4c1.3-1 2.2-2.6 2.2-4.4C13.6 2.5 11.1 0 8 0 4.9 0 2.4 2.5 2.4 5.6c0 1.8.8 3.4 2.2 4.4C1.9 11.3 0 14 0 17.2h1.9c0-3.3 2.6-6 5.9-6.1h.4c3.3.1 5.9 2.8 5.9 6.1H16c0-3.2-1.8-5.9-4.6-7.2\">\n	</path>\n</svg>\n</a>\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showExtendedMenu") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'header_profile.tpl.bak'; return template;});