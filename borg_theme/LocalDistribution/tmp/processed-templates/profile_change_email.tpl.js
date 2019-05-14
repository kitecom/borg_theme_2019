define('profile_change_email.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<section class=\"profile-change-email\">\n	<div data-type=\"alert-placeholder\"></div>\n	<div class=\"profile-change-email-form-area\">\n		<form class=\"profile-change-email-form\">\n			<fieldset>\n				<small class=\"profile-change-email-form-label\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Required",{"name":"translate","hash":{},"data":data}))
    + " <span class=\"profile-change-email-form-group-label-required\">*</span></small>\n\n				<div class=\"profile-change-email-form-group\" data-input=\"new_email\" data-validation=\"control-group\">\n					<label class=\"profile-change-email-form-group-label\" for=\"new_email\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"New Email",{"name":"translate","hash":{},"data":data}))
    + " <span class=\"profile-change-email-form-group-label-required\">*</span></label>\n					<div  class=\"profile-change-email-group-form-controls\" data-validation=\"control\">\n						<input type=\"email\" class=\"profile-change-email-form-group-input\" id=\"new_email\" name=\"new_email\" value=\"\" placeholder=\""
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"your@email.com",{"name":"translate","hash":{},"data":data}))
    + "\">\n					</div>\n				</div>\n\n				<div class=\"profile-change-email-form-group\" data-input=\"confirm_email\" data-validation=\"control-group\">\n					<label class=\"profile-change-email-form-group-label\" for=\"confirm_email\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Confirm New Email",{"name":"translate","hash":{},"data":data}))
    + " <span class=\"profile-change-email-form-group-label-required\">*</span></label>\n					<div  class=\"profile-change-email-group-form-controls\" data-validation=\"control\">\n						<input type=\"email\" class=\"profile-change-email-form-group-input\" id=\"confirm_email\" name=\"confirm_email\" value=\"\" placeholder=\""
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"your@email.com",{"name":"translate","hash":{},"data":data}))
    + "\">\n					</div>\n				</div>\n\n				<div class=\"profile-change-email-form-group\" data-input=\"current_email\" data-validation=\"control-group\">\n					<label class=\"profile-change-email-form-group-label\" for=\"current_password\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Password",{"name":"translate","hash":{},"data":data}))
    + " <span class=\"profile-change-email-form-group-label-required\">*</span></label>\n					<div  class=\"profile-change-email-group-form-controls\" data-validation=\"control\">\n						<input type=\"password\" class=\"profile-change-email-form-group-input\" id=\"current_password\" name=\"current_password\" value=\"\">\n					</div>\n				</div>\n			</fieldset>\n			<p class=\"profile-change-email-form-info-block\"><small> "
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"You will still be able to login with your current email address and password until your new email address is verified.",{"name":"translate","hash":{},"data":data}))
    + " </small></p>\n			<div class=\"profile-change-email-form-actions\">\n				<button type=\"submit\" class=\"profile-change-email-form-actions-change\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Send Verification Email",{"name":"translate","hash":{},"data":data}))
    + "</button>\n			</div>\n		</form>\n	</div>\n</section>";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/Borg_Base_Theme/19.1.0/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/Borg_Base_Theme/19.1.0/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'profile_change_email'; return template;});