define('netsuite_featuredcategory_button.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <a href=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"buttonLink") || (depth0 != null ? compilerNameLookup(depth0,"buttonLink") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"buttonLink","hash":{},"data":data}) : helper)))
    + "\" data-action=\"goToCategory\" class=\"featuredcategorycct-"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"buttonStyle") || (depth0 != null ? compilerNameLookup(depth0,"buttonStyle") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"buttonStyle","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"buttonText") || (depth0 != null ? compilerNameLookup(depth0,"buttonText") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"buttonText","hash":{},"data":data}) : helper)))
    + "</a>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"featuredcategorycct-button-container\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"showButton") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/NetSuite/FeaturedCategory/1.1.0/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'netsuite_featuredcategory_button'; return template;});