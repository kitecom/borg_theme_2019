define('suitecommerce_customfields_checkout_field_checkbox.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"custom-fields-checkout-field-checkbox\">\n  <input\n    id=\"custom_field_"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"fieldId") || (depth0 != null ? compilerNameLookup(depth0,"fieldId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fieldId","hash":{},"data":data}) : helper)))
    + "\"\n    class=\"custom-fields-checkout-field-input-checkbox\"\n    type=\"checkbox\"\n    name=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"fieldId") || (depth0 != null ? compilerNameLookup(depth0,"fieldId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fieldId","hash":{},"data":data}) : helper)))
    + "\"\n    data-validation=\"control\">\n  <label class=\"custom-fields-checkout-field-label-checkbox\" for=\"custom_field_"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"fieldId") || (depth0 != null ? compilerNameLookup(depth0,"fieldId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fieldId","hash":{},"data":data}) : helper)))
    + "\">\n    "
    + alias4(((helper = (helper = compilerNameLookup(helpers,"label") || (depth0 != null ? compilerNameLookup(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "\n  </label>\n</div>\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/SuiteCommerce/CustomFields/1.1.1/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'suitecommerce_customfields_checkout_field_checkbox'; return template;});