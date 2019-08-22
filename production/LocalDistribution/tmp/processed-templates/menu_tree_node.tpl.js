define('menu_tree_node.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression;

  return "\n<div class=\"menu-tree-node\" data-type=\"menu-tree-node-expandable\" data-type=\"menu-tree-node-expandable\" data-id='"
    + alias2(alias1(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"node") : depth0)) != null ? compilerNameLookup(stack1,"id") : stack1), depth0))
    + "' data-permissions=\""
    + alias2(alias1(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"node") : depth0)) != null ? compilerNameLookup(stack1,"permission") : stack1), depth0))
    + "\" data-permissions-operator=\""
    + alias2(alias1(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"node") : depth0)) != null ? compilerNameLookup(stack1,"permissionOperator") : stack1), depth0))
    + "\">\n\n	<a class=\"menu-tree-node-item-anchor\" data-target=\"#menu-tree-node-"
    + alias2(alias1(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"node") : depth0)) != null ? compilerNameLookup(stack1,"id") : stack1), depth0))
    + "\" data-action=\"expander\" data-id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"node") : depth0)) != null ? compilerNameLookup(stack1,"id") : stack1), depth0))
    + "\">\n		"
    + alias2(alias1(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"node") : depth0)) != null ? compilerNameLookup(stack1,"name") : stack1), depth0))
    + "\n		<i class=\"menu-tree-node-item-icon\"></i>\n	</a>\n\n	<div id=\"menu-tree-node-"
    + alias2(alias1(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"node") : depth0)) != null ? compilerNameLookup(stack1,"id") : stack1), depth0))
    + "\" data-type=\"menu-tree-node-expander\" class=\"menu-tree-node-submenu menu-tree-node-submenu-level-"
    + alias2(((helper = (helper = compilerNameLookup(helpers,"level") || (depth0 != null ? compilerNameLookup(depth0,"level") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"level","hash":{},"data":data}) : helper)))
    + " collapse\">\n		<div class=\"menu-tree-node-submenu-wrapper\" data-view=\"MenuItems.Collection\"></div>\n	</div>\n\n</div>\n\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "\n<div class=\"menu-tree-node\" data-type=\"menu-tree-node\" data-permissions=\""
    + alias2(alias1(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"node") : depth0)) != null ? compilerNameLookup(stack1,"permission") : stack1), depth0))
    + "\" data-permissions-operator=\""
    + alias2(alias1(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"node") : depth0)) != null ? compilerNameLookup(stack1,"permissionOperator") : stack1), depth0))
    + "\">\n\n	<a class=\"menu-tree-node-item-anchor\" href=\""
    + alias2(alias1(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"node") : depth0)) != null ? compilerNameLookup(stack1,"url") : stack1), depth0))
    + "\" target=\""
    + alias2(alias1(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"node") : depth0)) != null ? compilerNameLookup(stack1,"target") : stack1), depth0))
    + "\" data-id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"node") : depth0)) != null ? compilerNameLookup(stack1,"id") : stack1), depth0))
    + "\">"
    + alias2(alias1(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"node") : depth0)) != null ? compilerNameLookup(stack1,"name") : stack1), depth0))
    + "</a>\n\n</div>\n\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? compilerNameLookup(depth0,"node") : depth0)) != null ? compilerNameLookup(stack1,"showChildren") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; ctx._theme_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'menu_tree_node'; return template;});