define('login_register_login.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    return "\n		"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Login below to checkout with an existing account",{"name":"translate","hash":{},"data":data}))
    + "\n	";
},"3":function(container,depth0,helpers,partials,data) {
    return " autofocus ";
},"5":function(container,depth0,helpers,partials,data) {
    return "			<div class=\"login-register-login-form-controls-group\" data-validation=\"control-group\">\n				<div class=\"login-register-login-form-controls\" data-validation=\"control\">\n					<input value=\"true\" type=\"hidden\" name=\"redirect\">\n				</div>\n			</div>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "				<div data-view=\"GlobalMessageSessionTimeout\"></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<!--h2 class=\"login-register-login-title\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Returning customer",{"name":"translate","hash":{},"data":data}))
    + "</h2-->\n<h3>Trade Login</h3>\n<p class=\"login-register-login-description\">\n	<!--"
    + ((stack1 = compilerNameLookup(helpers,"unless").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isSkipLogin") : depth0),{"name":"unless","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "-->\n	Login using your email address and password. If you do not have valid login credentials, please contact your account manager.\n</p>\n\n<small class=\"login-register-login-required\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Required <span class=\"login-register-login-form-required\">*</span>",{"name":"translate","hash":{},"data":data}))
    + "</small>\n\n<form class=\"login-register-login-form\" novalidate>\n	<fieldset class=\"login-register-login-form-fieldset\">\n		<div class=\"login-register-login-form-controls-group\" data-validation=\"control-group\">\n			<label class=\"login-register-login-form-label\" for=\"login-email\">\n				"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Email Address <small class=\"login-register-login-form-required\">*</small>",{"name":"translate","hash":{},"data":data}))
    + "\n			</label>\n			<div class=\"login-register-login-form-controls\" data-validation=\"control\">\n				<input "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"hasAutoFocus") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " type=\"email\" name=\"email\" id=\"login-email\" class=\"login-register-login-form-input\" placeholder=\""
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"your@email.com",{"name":"translate","hash":{},"data":data}))
    + "\"/>\n			</div>\n		</div>\n\n		<div class=\"login-register-login-form-controls-group\" data-validation=\"control-group\">\n			<label class=\"login-register-login-form-label\" for=\"login-password\">\n				"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Password <small class=\"login-register-login-form-required\">*</small>",{"name":"translate","hash":{},"data":data}))
    + "\n			</label>\n			<div class=\"login-register-login-form-controls\" data-validation=\"control\">\n				<input type=\"password\" name=\"password\" id=\"login-password\" class=\"login-register-login-form-input\">\n			</div>\n		</div>\n\n		<div data-view=\"Login.CustomFields\"></div>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isRedirect") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n		<div data-type=\"alert-placeholder\" class=\"login-register-login-form-messages\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isUserSessionTimedOut") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "		</div>\n\n		<div class=\"login-register-login-form-controls-group\" data-type=\"form-login-action\">\n\n			<button type=\"submit\" class=\"login-register-login-submit\" data-action=\"login-button\">\n				"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Log In",{"name":"translate","hash":{},"data":data}))
    + "\n			</button>\n\n			<a class=\"login-register-login-forgot\" data-action=\"forgot-password\" href=\"/forgot-password\">\n				"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Forgot password?",{"name":"translate","hash":{},"data":data}))
    + "\n			</a>\n		</div>\n	</fieldset>\n</form>\n\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; ctx._theme_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'login_register_login'; return template;});