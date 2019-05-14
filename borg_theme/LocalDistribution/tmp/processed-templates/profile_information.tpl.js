define('profile_information.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    return "	<a href=\"/\" class=\"profile-information-button-back\">\n		<i class=\"profile-information-button-back-icon\"></i>\n		"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Back to Account",{"name":"translate","hash":{},"data":data}))
    + "\n	</a>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "\n					<small class=\"profile-information-form-label\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Required",{"name":"translate","hash":{},"data":data}))
    + " <span class=\"profile-information-form-group-label-required\">*</span></small>\n\n					<div class=\"profile-information-row\" data-input=\"firstname\" data-validation=\"control-group\">\n						<label class=\"profile-information-label\" for=\"firstname\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"First Name",{"name":"translate","hash":{},"data":data}))
    + "\n							<span class=\"profile-information-input-required\">*</span>\n						</label>\n						<div class=\"profile-information-group-form-controls\" data-validation=\"control\">\n							<input type=\"text\" class=\"profile-information-input-large\" id=\"firstname\" name=\"firstname\" value=\""
    + alias3(((helper = (helper = compilerNameLookup(helpers,"firstName") || (depth0 != null ? compilerNameLookup(depth0,"firstName") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"firstName","hash":{},"data":data}) : helper)))
    + "\">\n						</div>\n					</div>\n\n					<div class=\"profile-information-row\" data-input=\"lastname\" data-validation=\"control-group\">\n						<label class=\"profile-information-label\" for=\"lastname\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Last Name",{"name":"translate","hash":{},"data":data}))
    + "\n							<span class=\"profile-information-input-required\">*</span>\n						</label>\n						<div class=\"profile-information-group-form-controls\" data-validation=\"control\">\n							<input type=\"text\" class=\"profile-information-input-large\" id=\"lastname\" name=\"lastname\" value=\""
    + alias3(((helper = (helper = compilerNameLookup(helpers,"lastName") || (depth0 != null ? compilerNameLookup(depth0,"lastName") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"lastName","hash":{},"data":data}) : helper)))
    + "\">\n						</div>\n					</div>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "					<div class=\"profile-information-row\" data-input=\"companyname\" data-validation=\"control-group\">\n						<label class=\"profile-information-label\" for=\"companyname\">\n							"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Company Name",{"name":"translate","hash":{},"data":data}))
    + "\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isCompanyFieldRequired") : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.program(8, data, 0),"data":data})) != null ? stack1 : "")
    + "						</label>\n						<div class=\"profile-information-group-form-controls\" data-validation=\"control\">\n							<input type=\"text\" class=\"profile-information-input-large\" id=\"companyname\" name=\"companyname\" value=\""
    + alias3(((helper = (helper = compilerNameLookup(helpers,"companyName") || (depth0 != null ? compilerNameLookup(depth0,"companyName") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"companyName","hash":{},"data":data}) : helper)))
    + "\">\n						</div>\n					</div>\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "								<small class=\"profile-information-input-required\">*</small>\n";
},"8":function(container,depth0,helpers,partials,data) {
    return "								<small class=\"profile-information-input-optional\">"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"(optional)",{"name":"translate","hash":{},"data":data}))
    + "</small>\n";
},"10":function(container,depth0,helpers,partials,data) {
    return "							"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Phone Number (ex/$(0))",(depth0 != null ? compilerNameLookup(depth0,"phoneFormat") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n";
},"12":function(container,depth0,helpers,partials,data) {
    return "							"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Phone Number",{"name":"translate","hash":{},"data":data}))
    + "\n";
},"14":function(container,depth0,helpers,partials,data) {
    return "							<small class=\"profile-information-input-required\">*</small>\n";
},"16":function(container,depth0,helpers,partials,data) {
    return "							<small class=\"profile-information-input-optional\">"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"(optional)",{"name":"translate","hash":{},"data":data}))
    + "</small>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showBackToAccount") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n<div class=\"profile-information\">\n<h2 class=\"profile-information-header\">"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"pageHeader") || (depth0 != null ? compilerNameLookup(depth0,"pageHeader") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pageHeader","hash":{},"data":data}) : helper)))
    + "</h2>\n\n<div data-type=\"alert-placeholder\"></div>\n<section class=\"profile-information-row-fluid\">\n\n	<div class=\"profile-information-col\">\n		<form class=\"contact_info\">\n			<fieldset>\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isNotCompany") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isCompanyAndShowCompanyField") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n				<div class=\"profile-information-row\" data-input=\"phone\" data-validation=\"control-group\">\n					<label class=\"profile-information-label\" for=\"phone\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"phoneFormat") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.program(12, data, 0),"data":data})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isPhoneFieldRequired") : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.program(16, data, 0),"data":data})) != null ? stack1 : "")
    + "					</label>\n					<div class=\"profile-information-group-form-controls\" data-validation=\"control\">\n						<input type=\"tel\" class=\"profile-information-input-large\" id=\"phone\" name=\"phone\" data-type=\"phone\" value=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"phone") || (depth0 != null ? compilerNameLookup(depth0,"phone") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"phone","hash":{},"data":data}) : helper)))
    + "\">\n					</div>\n				</div>\n\n				<div class=\"profile-information-row\">\n					<label class=\"profile-information-label\">"
    + alias4((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Email",{"name":"translate","hash":{},"data":data}))
    + "</label>\n						<p class=\"profile-information-input-email\" id=\"email\">"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"email") || (depth0 != null ? compilerNameLookup(depth0,"email") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"email","hash":{},"data":data}) : helper)))
    + " | <a class=\"profile-information-change-email-address\" data-action=\"change-email\">"
    + alias4((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Change Address",{"name":"translate","hash":{},"data":data}))
    + "</a></p>\n				</div>\n\n			</fieldset>\n			<div class=\"profile-information-form-actions\">\n				<button type=\"submit\" class=\"profile-information-button-update\">"
    + alias4((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Update",{"name":"translate","hash":{},"data":data}))
    + "</button>\n			</div>\n		</form>\n	</div>\n</section>\n</div>\n\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/Borg_Base_Theme/19.1.0/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/Borg_Base_Theme/19.1.0/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'profile_information'; return template;});