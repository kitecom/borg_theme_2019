define('global_views_modal.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "				<h2 class=\"global-views-modal-content-header-title\">\n					"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"pageHeader") || (depth0 != null ? compilerNameLookup(depth0,"pageHeader") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pageHeader","hash":{},"data":data}) : helper)))
    + "\n				</h2>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"modal-dialog global-views-modal "
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"modalDialogClass") || (depth0 != null ? compilerNameLookup(depth0,"modalDialogClass") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"modalDialogClass","hash":{},"data":data}) : helper)))
    + "\">\n	<div class=\"global-views-modal-content\">\n		<!--Modal-Header -->\n		<div id=\"modal-header\" class=\"global-views-modal-content-header\">\n			<button type=\"button\" class=\"global-views-modal-content-header-close\" data-dismiss=\"modal\" aria-hidden=\"true\">\n				&times;\n			</button>\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showPageHeader") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "		</div>\n		<!--Modal-content -->\n		<div id=\"modal-body\" data-type=\"modal-body\" class=\" global-views-modal-content-body\" data-view=\"Child.View\">\n		</div>\n	</div>\n</div>\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; ctx._theme_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'global_views_modal'; return template;});