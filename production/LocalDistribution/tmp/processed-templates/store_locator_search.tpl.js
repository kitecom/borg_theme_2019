define('store_locator_search.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    return "store-locator-search-button-after-find";
},"3":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "						<div class=\"store-locator-search-buttons-container-or-wrap\">\n							<div class=\"store-locator-search-buttons-container-or\" data-type=\"geolocation-or\"><span>"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"or",{"name":"translate","hash":{},"data":data}))
    + "</span></div>\n						</div>\n						<div class=\"store-locator-search-buttons-container-geolocalization\" data-type=\"geolocation-button\">\n							<button type=\"button\" class=\"store-locator-search-button-current\" data-action=\"use-geolocation\">\n								<i class=\"store-locator-search-button-current-icon\"></i> "
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Use Current Location",{"name":"translate","hash":{},"data":data}))
    + "\n							</button>\n						</div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<form class=\"store-locator-search\">\n	<div class=\"store-locator-search-search-view\">\n		<div class=\"store-locator-search-enter-location\">\n			\n			<div class=\"store-locator-search-group\" data-input=\"city\" data-validation=\"control-group\">\n				<label class=\"store-locator-search-group-label\" for=\"city\">\n					"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Enter Address, Zip Code or City",{"name":"translate","hash":{},"data":data}))
    + " \n				</label>\n				<div class=\"store-locator-search-group-form-controls\" data-validation=\"control\">\n					<input id=\"autocomplete\" type=\"text\" name=\"city\" data-type=\"autocomplete-input\" class=\"store-locator-search-input-autocomplete\"/>\n				</div>\n				<div class=\"store-locator-search-buttons-container\">\n					<div class=\"store-locator-search-buttons-container-find\">\n						<button class=\"store-locator-search-button-find "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showResults") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" type=\"submit\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Find Stores",{"name":"translate","hash":{},"data":data}))
    + "</button>\n					</div>\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showUseCurrentLocationButton") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "				</div>\n			</div>\n\n			\n			<div class=\"store-locator-search-geolocation\" data-type=\"location-geolocation\">\n				<div class=\"store-locator-search-geolocation-message-warning\" data-action=\"message-warning\"></div>\n			</div>\n		</div>\n	</div>\n</form>\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; ctx._theme_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'store_locator_search'; return template;});