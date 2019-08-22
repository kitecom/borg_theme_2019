define('suitecommerce_customfields_checkout_field.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "    <h3 class=\"custom-fields-checkout-field-heading\">"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"label") || (depth0 != null ? compilerNameLookup(depth0,"label") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"label","hash":{},"data":data}) : helper)))
    + "</h3>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"isCheckbox") : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(compilerNameLookup(partials,"checkboxField"),depth0,{"name":"checkboxField","data":data,"indent":"      ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(compilerNameLookup(partials,"inputFieldLabel"),depth0,{"name":"inputFieldLabel","data":data,"indent":"      ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "      <div class=\"custom-fields-checkout-field-control\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"isTextArea") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "      </div>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(compilerNameLookup(partials,"inputTextAreaField"),depth0,{"name":"inputTextAreaField","data":data,"indent":"          ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"9":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"isDate") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.program(12, data, 0),"data":data})) != null ? stack1 : "");
},"10":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(compilerNameLookup(partials,"inputDateField"),depth0,{"name":"inputDateField","data":data,"indent":"            ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"12":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(compilerNameLookup(partials,"inputTextField"),depth0,{"name":"inputTextField","data":data,"indent":"            ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"14":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "  <div class=\"custom-fields-checkout-field-checkbox\">\n    <input\n      id=\"custom_field_"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"fieldId") || (depth0 != null ? compilerNameLookup(depth0,"fieldId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fieldId","hash":{},"data":data}) : helper)))
    + "\"\n      class=\"custom-fields-checkout-field-input-checkbox\"\n      type=\"checkbox\"\n      name=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"fieldId") || (depth0 != null ? compilerNameLookup(depth0,"fieldId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fieldId","hash":{},"data":data}) : helper)))
    + "\"\n      data-validation=\"control\">\n    <label class=\"custom-fields-checkout-field-label-checkbox\" for=\"custom_field_"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"fieldId") || (depth0 != null ? compilerNameLookup(depth0,"fieldId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fieldId","hash":{},"data":data}) : helper)))
    + "\">\n      "
    + alias4(((helper = (helper = compilerNameLookup(helpers,"label") || (depth0 != null ? compilerNameLookup(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "\n    </label>\n  </div>\n";
},"16":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "  <label for=\"custom_field_"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"fieldId") || (depth0 != null ? compilerNameLookup(depth0,"fieldId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fieldId","hash":{},"data":data}) : helper)))
    + "\" class=\"custom-fields-checkout-field-label\">\n    "
    + alias4(((helper = (helper = compilerNameLookup(helpers,"label") || (depth0 != null ? compilerNameLookup(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isMandatory") : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  </label>\n";
},"17":function(container,depth0,helpers,partials,data) {
    return "      <span class=\"custom-fields-checkout-field-label-required\">*</span>\n";
},"19":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "  <textarea\n    id=\"custom_field_"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"fieldId") || (depth0 != null ? compilerNameLookup(depth0,"fieldId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fieldId","hash":{},"data":data}) : helper)))
    + "\"\n    class=\"custom-fields-checkout-field-input-textarea\"\n    name=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"fieldId") || (depth0 != null ? compilerNameLookup(depth0,"fieldId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fieldId","hash":{},"data":data}) : helper)))
    + "\"\n    placeholder=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"placeholder") || (depth0 != null ? compilerNameLookup(depth0,"placeholder") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"placeholder","hash":{},"data":data}) : helper)))
    + "\"\n    "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isMandatory") : depth0),{"name":"if","hash":{},"fn":container.program(20, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    data-validation=\"control\"\n    maxlength=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"maxLength") || (depth0 != null ? compilerNameLookup(depth0,"maxLength") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"maxLength","hash":{},"data":data}) : helper)))
    + "\">\n  </textarea>\n";
},"20":function(container,depth0,helpers,partials,data) {
    return "required";
},"22":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "  <input\n    id=\"custom_field_"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"fieldId") || (depth0 != null ? compilerNameLookup(depth0,"fieldId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fieldId","hash":{},"data":data}) : helper)))
    + "\"\n    class=\"custom-fields-checkout-field-input-date\"\n    type=\"date\"\n    name=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"fieldId") || (depth0 != null ? compilerNameLookup(depth0,"fieldId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fieldId","hash":{},"data":data}) : helper)))
    + "\"\n    placeholder=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"placeholder") || (depth0 != null ? compilerNameLookup(depth0,"placeholder") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"placeholder","hash":{},"data":data}) : helper)))
    + "\"\n    "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isMandatory") : depth0),{"name":"if","hash":{},"fn":container.program(20, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    data-validation=\"control\"\n    data-field-type=\"date\"\n    data-format=\"dd/mm/yyyy\">\n";
},"24":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "  <input\n    id=\"custom_field_"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"fieldId") || (depth0 != null ? compilerNameLookup(depth0,"fieldId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fieldId","hash":{},"data":data}) : helper)))
    + "\"\n    class=\"custom-fields-checkout-field-input-text\"\n    type=\"text\"\n    name=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"fieldId") || (depth0 != null ? compilerNameLookup(depth0,"fieldId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fieldId","hash":{},"data":data}) : helper)))
    + "\"\n    placeholder=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"placeholder") || (depth0 != null ? compilerNameLookup(depth0,"placeholder") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"placeholder","hash":{},"data":data}) : helper)))
    + "\"\n    "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isMandatory") : depth0),{"name":"if","hash":{},"fn":container.program(20, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    data-validation=\"control\"\n    maxlength=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"maxLength") || (depth0 != null ? compilerNameLookup(depth0,"maxLength") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"maxLength","hash":{},"data":data}) : helper)))
    + "\">  \n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<!-- htmllint spec-char-escape=\"false\" -->\n<div\n  id=\"custom-fields-checkout-"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"fieldId") || (depth0 != null ? compilerNameLookup(depth0,"fieldId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fieldId","hash":{},"data":data}) : helper)))
    + "\"\n  class=\"custom-fields-checkout-field\"\n  data-type=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"type") || (depth0 != null ? compilerNameLookup(depth0,"type") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "\"\n  data-validation=\"control-group\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isHeading") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.program(3, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "</div>\n<!-- htmllint spec-char-escape=\"true\" -->\n\n<!-- htmllint id-no-dup=\"false\" -->\n\n\n\n\n<!-- htmllint id-no-dup=\"true\" -->\n\n<script type=\"text/javascript\">\n  if ($.cookie(\"StoreEmail\") !== null) {                 \n      var cookieval = $.cookie(\"StoreEmail\");            \n      var inputs = document.getElementById(\"custom_field_custbody_web_opb_email\");                                 \n      inputs.value =cookieval;\n  }\n</script>";
},"main_d":  function(fn, props, container, depth0, data, blockParams, depths) {

  var decorators = container.decorators;

  fn = compilerNameLookup(decorators,"inline")(fn,props,container,{"name":"inline","hash":{},"fn":container.program(14, data, 0, blockParams, depths),"inverse":container.noop,"args":["checkboxField"],"data":data}) || fn;
  fn = compilerNameLookup(decorators,"inline")(fn,props,container,{"name":"inline","hash":{},"fn":container.program(16, data, 0, blockParams, depths),"inverse":container.noop,"args":["inputFieldLabel"],"data":data}) || fn;
  fn = compilerNameLookup(decorators,"inline")(fn,props,container,{"name":"inline","hash":{},"fn":container.program(19, data, 0, blockParams, depths),"inverse":container.noop,"args":["inputTextAreaField"],"data":data}) || fn;
  fn = compilerNameLookup(decorators,"inline")(fn,props,container,{"name":"inline","hash":{},"fn":container.program(22, data, 0, blockParams, depths),"inverse":container.noop,"args":["inputDateField"],"data":data}) || fn;
  fn = compilerNameLookup(decorators,"inline")(fn,props,container,{"name":"inline","hash":{},"fn":container.program(24, data, 0, blockParams, depths),"inverse":container.noop,"args":["inputTextField"],"data":data}) || fn;
  return fn;
  }

,"useDecorators":true,"usePartial":true,"useData":true,"useDepths":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/SuiteCommerce/CustomFields/1.1.1/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'suitecommerce_customfields_checkout_field'; return template;});