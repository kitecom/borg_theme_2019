define('paymentinstrument_creditcard_edit_form_securitycode.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "<div class=\"paymentinstrument-creditcard-edit-form-securitycode\">\n	<div class=\"paymentinstrument-creditcard-edit-form-securitycode-group\" data-input=\"ccsecuritycode\" data-validation=\"control-group\">\n		<label class=\"paymentinstrument-creditcard-edit-form-securitycode-group-label\" for=\"ccsecuritycode\">\n			"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Security Number",{"name":"translate","hash":{},"data":data}))
    + " <span class=\"paymentinstrument-creditcard-edit-form-securitycode-group-label-required\">*</span>\n		</label>\n\n		<div class=\"paymentinstrument-creditcard-edit-form-securitycode-controls\" data-validation=\"control\">\n			<input type=\"text\" class=\"paymentinstrument-creditcard-edit-form-securitycode-group-input\" id=\"ccsecuritycode\" name=\"ccsecuritycode\" value=\""
    + alias3(((helper = (helper = compilerNameLookup(helpers,"value") || (depth0 != null ? compilerNameLookup(depth0,"value") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\" maxlength=\"4\">\n\n			<a href=\"#\" class=\"paymentinstrument-creditcard-edit-form-securitycode-link\">\n				<span class=\"paymentinstrument-creditcard-edit-form-securitycode-icon-container\">\n					<i class=\"paymentinstrument-creditcard-edit-form-securitycode-icon\"  data-toggle=\"popover\" data-placement=\"bottom\" data-title=\""
    + alias3(((helper = (helper = compilerNameLookup(helpers,"creditCardHelpTitle") || (depth0 != null ? compilerNameLookup(depth0,"creditCardHelpTitle") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"creditCardHelpTitle","hash":{},"data":data}) : helper)))
    + "\"/>\n				</span>\n			</a>\n		</div>\n	</div>\n</div>\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/Borg_Base_Theme/19.1.0/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/Borg_Base_Theme/19.1.0/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'paymentinstrument_creditcard_edit_form_securitycode'; return template;});