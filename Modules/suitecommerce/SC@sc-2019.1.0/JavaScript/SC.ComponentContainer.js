/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module SC
define('SC.ComponentContainer'
,	[
		'underscore'
	]
,	function (
		_
	)
{
	'use strict';

	// @function sealComponent helper method to avoid that customers overwrite the component properties
	// @param {SC.BaseComponent} component component to be sealed
	// @param {String} component_name the component name
	// @private
	function sealComponent(component, component_name)
	{	
		try{
			_.each(component, function(value, prop)
		    {
		        Object.defineProperty(component, prop, {
		            get: function()
	            	{ 
	            		return value; 
	            	}
		        ,   set: function()
		        	{ 
		        		throw new Error('You cannot override property ' + prop + ' of component '+ component_name);
		        	} 
		        });
		    });
		}
		catch(e)
		{

		}

	    return component;
	}

	// @class SC.ComponentContainer Manager of components. Extensions can get components implementations and register new component 
	// classes. A component is referenced always by its name. Host application provides a container instance to extensions through 
	// method @?method SC.SC.ExtensionEntryPoint.mountToApp
	return {
		
		// @property {Object} _components All the SC.Components loaded into the current application
		// @private
		_components: {}

		// @method registerComponent Allows to register a new component into the running application
		// it also seals the component, so as to not add new properties or messing up with the available
		// components APIs.
		// @param {SC.BaseComponent} component Component to be registered
		// @public @extlayer
		// @return {Void}
	,	registerComponent: function registerComponent(component)
		{
			if (component && component.componentName)
			{	
				this._components[component.componentName] = sealComponent(component, component.componentName);
				return;
			}
			var error = new Error('Invalid component parameter, make sure you specify a componentName property and getProxy method');
			error.name = 'INVALID_PARAM';
			throw error;
		}

		// @method getComponent Returns the requested component based on its name if there is no component with that name registered in this container
		// @public @extlayer
		// @param {String} component_name
		// @return {SC.BaseComponent|null}
	,	getComponent: function getComponent(component_name)
		{
			return this._components[component_name] || null;
		}
	};

});



// @class SC.ExtensionEntryPoint An extension entry point an object provided by extensions implementing the method mountToApp that the host 
// application calls passing a @?class SS.ComponentContainer instance so the extension can get concrete Component implementations
// (@?class SC.BaseComponent) or register new components to implement new extension points. See @?class SC.ComponentContainer
// @method mountToApp When the host application starts, it will call this method for each activated extension, in order of activation. 
// @param {SC.ComponentContainer} componentContainer
// @public @extlayer