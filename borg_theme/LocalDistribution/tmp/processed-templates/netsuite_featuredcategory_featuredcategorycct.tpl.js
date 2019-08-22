define('netsuite_featuredcategory_featuredcategorycct.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    return "featuredcategorycct-container-empty";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "            <div class=\"featuredcategorycct-header-align-"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"headerPosition") || (depth0 != null ? compilerNameLookup(depth0,"headerPosition") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"headerPosition","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"headerIsHtml") : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "            </div>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"headerAllowLink") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return "                        <a href=\""
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"customUrl") || (depth0 != null ? compilerNameLookup(depth0,"customUrl") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"customUrl","hash":{},"data":data}) : helper)))
    + "\" data-action=\"goToCategory\">\n                            <div class=\"featuredcategorycct-header-container\">\n                                    "
    + ((stack1 = ((helper = (helper = compilerNameLookup(helpers,"headerText") || (depth0 != null ? compilerNameLookup(depth0,"headerText") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"headerText","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n                            </div>\n                        </a>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "                        <div class=\"featuredcategorycct-header-container\">\n                            "
    + ((stack1 = ((helper = (helper = compilerNameLookup(helpers,"headerText") || (depth0 != null ? compilerNameLookup(depth0,"headerText") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"headerText","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n                        </div>\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"headerAllowLink") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.program(12, data, 0),"data":data})) != null ? stack1 : "");
},"10":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                        <a href=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"customUrl") || (depth0 != null ? compilerNameLookup(depth0,"customUrl") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"customUrl","hash":{},"data":data}) : helper)))
    + "\" data-action=\"goToCategory\">\n                            <h3 class=\"featuredcategorycct-header-container\">"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"headerText") || (depth0 != null ? compilerNameLookup(depth0,"headerText") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"headerText","hash":{},"data":data}) : helper)))
    + "</h3>\n                        </a>\n";
},"12":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                        <h3 class=\"featuredcategorycct-header-container\">"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"headerText") || (depth0 != null ? compilerNameLookup(depth0,"headerText") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"headerText","hash":{},"data":data}) : helper)))
    + "</h3>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<section class=\"featuredcategorycct-container "
    + ((stack1 = compilerNameLookup(helpers,"unless").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"hasItems") : depth0),{"name":"unless","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n        <div class=\"content featuredcategoryCCT\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"hasHeader") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            <div\n                data-view=\"NetSuite.FeaturedCategoryCCT.Items.View\"\n                class=\"row row-flex featuredcategorycct-grid\">\n            </div>\n            <div class=\"featuredcategorycct-button-wrapper\">\n                <div data-view=\"NetSuite.FeaturedCategoryCCT.Button.View\"></div>\n            </div>\n        </div>\n</section>";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/NetSuite/FeaturedCategory/1.1.0/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'netsuite_featuredcategory_featuredcategorycct'; return template;});