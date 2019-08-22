/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Checkout
define(
	'Checkout.Component'
,	[
		'SC.VisualComponent'
	,	'SC.Configuration'
	,	'OrderWizard.Model'

	,	'jQuery'
	,	'underscore'
	]
,	function(
		SCVisualComponent
	,	SCConfiguration
	,	OrderWizardModel

	,	jQuery
	,	_
	)
{
	'use strict';

	var is_wizard_router_ready = jQuery.Deferred()
	,	order_wizard_model = OrderWizardModel.getInstance()

		// @function format formats An entity data grouping both commons attributes (SCIS and SCA) and non-commons. The last goes into the 'extras' key
		// @private
		// @param {Object} entity Data object to format
		// @param {Array<String>} commonAttrs Array with a string of all the common attributes that are at the first level of the returned formatted object
		// @return {Object} A Formatted object structured with all the unique properties inside the extra object
	,	format = function format(entity, commonAttrs){
			var formatted = {extras: {}};

			_.keys(entity).forEach(function(attr){
				if(_.contains(commonAttrs, attr))
				{
					formatted[attr] = entity[attr];
				}
				else
				{
					formatted.extras[attr] = entity[attr];
				}
			});

			return formatted;
		};

	return function CheckoutComponentGenerator(application)
	{
		// @class Checkout.Component This is the concrete front-end Checkout implementation of SuiteCommerce Advanced / SuiteCommerce Standard.
		// See @?class Base.Component
		// @extends Base.Component
		// @public @extlayer
		var api_methods = {

			application: application

		,	componentName: 'Checkout'

		,	DEFAULT_VIEW: 'Wizard.View'

		,	WIZARD_VIEW: 'Wizard.View'

		,	_WIZARD_VIEW_ID: 'checkout'

		,	_isViewFromComponent: function _isViewFromComponent(view)
			{
				view = view || this.viewToBeRendered || this.application.getLayout().getCurrentView();

				var view_identifier = this._getViewIdentifier(view)
				,	view_prototype_id = view && this._getViewIdentifier(view.prototype);

				return (view && (view_identifier === this._WIZARD_VIEW_ID || view_prototype_id === this._WIZARD_VIEW_ID));
			}

		,	_getViewIdentifier: function _getViewIdentifier(view)
			{
				return view && view.attributes && view.attributes.id;
			}

		,	_setOrderWizardRouter: function _setOrderWizardRouter(order_wizard_router)
			{
				this.order_wizard_router = order_wizard_router;
                var init_promise = order_wizard_router && order_wizard_router.init_promise;
				if(init_promise)
				{
                    init_promise.then(is_wizard_router_ready.resolve, is_wizard_router_ready.reject);
                }
			}

		,	_normalizeStepUrl: function _normalizeStepUrl(inner_step_url)
			{
				return inner_step_url.replace(/\?.*/, '');
			}

		,	_normalizeModule: function _normalizeModule(module)
			{
				var options = module.module[1]
				,	module_id = options.module_id
				,	module_index = options.module_index;

				options.module_id && delete options.module_id;
				options.module_index && delete options.module_index;

				return {
					step_url: module.step_url
				,	module: {
						classname: _.isString(module.module[0]) ? module.module[0] : undefined
					,	id: module_id
					,	index: module_index
					,	options: options
					}
				};
			}

		,	_normalizeModuleInstance: function _normalizeModuleInstance(inner_module_instance, index)
			{
				return {
					id: inner_module_instance.module_id
				,	is_active: !!inner_module_instance.isActive()
				,	is_ready: !!inner_module_instance.isReady
				,	index: index
				};
			}

		,	_normalizeStep: function _normalizeStep(inner_step)
			{
				var step = inner_step ? {
					name: inner_step.getName()
				,	url: inner_step.url
				,	show_step: !!inner_step.showStep()
				,	state: inner_step.state
				,	step_group_name: inner_step.stepGroup.name
				,	modules: _.map(inner_step.moduleInstances, this._normalizeModuleInstance)
				} : undefined;

				return step;
			}

		,	_normalizeStepGroup: function _normalizeStepGroup(inner_step_group)
			{
				var self = this
				,	step_group = _.deepCopy({
						index: inner_step_group.index
					,	name: inner_step_group.name
					,	url: inner_step_group.url
					,	show_group: inner_step_group.showStepGroup()
					,	state: inner_step_group.state
					})
				,	commonStepGroupAttrs = [
						'index'
					,	'name'
					,	'url'
					,	'show_group'
					,	'state'
					,	'steps'
					];

				step_group.steps = _.map(inner_step_group.steps, function(step, index)
				{
					return self._normalizeStep(step, index);
				});

				return format(step_group, commonStepGroupAttrs);
			}

			// @method getCurrentStep Returns the current checkout's step info
			// @public @extlayer
			// @return {Deferred<CheckoutStep>} Return a Deferred that is resolved in case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	getCurrentStep: function getCurrentStep()
			{
				var self = this
				,	deferred = jQuery.Deferred();

				try
				{
					var current_step = self.order_wizard_router.getCurrentStep();
					deferred.resolve(self._normalizeStep(current_step));
				}
				catch(error)
				{
					deferred.reject(error);
				}
				return deferred;
			}

		,	setCurrentStep: function setCurrentStep(data)
			{
				var self = this
				,	deferred = jQuery.Deferred();

				try
				{
					if(!_.isObject(data) || !data.step_url)
					{
					   this._reportError('INVALID_PARAM', 'Invalid parameter. Must specify a step_url');
					}

					var stepsOrder =  self.order_wizard_router.stepsOrder
					,	steps =  self.order_wizard_router.steps
					,	current_step_url = self.order_wizard_router.currentStep
					,	current_step_index = _.indexOf(stepsOrder, current_step_url)
					,	target_step_index = _.indexOf(stepsOrder, data.step_url);

					if(_.isEmpty(current_step_url))
					{
					   this._reportError('INVALID_STATE', 'Invalid state. There is no current step yet');
					}

					if(target_step_index < 0)
					{
					   this._reportError('INVALID_PARAM', 'Invalid parameter. step_url must a valid step url');
					}

					self.cancelableTrigger('beforeSetCurrentStep', data.step_url)
					.done(function()
					{
						var promise = jQuery.Deferred().resolve()
						,	step_url
						,	step;

						function queue_submits(step)
						{
							promise = promise.pipe(function(){
								return step._submit();
							});
						}

						function queue_previous(step)
						{
							promise = promise.pipe(function(){
								return step._previousStep();
							});
						}

						if(current_step_index < target_step_index)
						{
							for(var i = current_step_index; i < target_step_index; i++)
							{
								step_url = stepsOrder[i];
								step = steps[step_url];

								if(!step.showStep())
								{
									continue;
								}

								queue_submits(step);
							}
						}
						else if(current_step_index > target_step_index)
						{
							for(var j = current_step_index; j > target_step_index; j--)
							{
								step_url = stepsOrder[j];
								step = steps[step_url];

								if(!step.showStep())
								{
									continue;
								}

								queue_previous(step);
							}
						}

						promise
						.done(function()
						{
							self.order_wizard_router.navigate(data.step_url, {trigger: false});
							self.order_wizard_router._runStep();
							deferred.resolve(data);
						})
						.fail(function(result)
						{
							self.order_wizard_router.navigate(result.step_url, {trigger: false});
							self.order_wizard_router._runStep();
							deferred.reject(result);
						});

					})
					.fail(deferred.reject);

				}
				catch(error)
				{
					deferred.reject(error);
				}
				return deferred;
			}

			// @method getStepGroupsInfo Returns the step groups of the checkout flow
			// @public @extlayer
			// @return {Deferred<Array<CheckoutStepGroup>>} Return a Deferred that is resolved in case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	getStepGroupsInfo: function getStepGroupsInfo()
			{
				var self = this
				,	deferred = jQuery.Deferred();

				try
				{
					var steps = self.order_wizard_router.stepGroups;

					deferred.resolve(_.map(steps, function(step)
					{
						return self._normalizeStepGroup(step);
					}));
				}
				catch(error)
				{
					deferred.reject(error);
				}
				return deferred;
			}

			// @method getStepsInfo Returns the steps of the checkout flow
			// @public @extlayer
			// @return {Deferred<Array<CheckoutStep>>} Return a Deferred that is resolved in case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	getStepsInfo: function getStepsInfo()
			{
				var self = this
				,	deferred = jQuery.Deferred();

				try
				{
					var steps = self.order_wizard_router.steps
					,	steps_order = self.order_wizard_router.stepsOrder;

					deferred.resolve(_.map(steps_order, function(step_url)
					{
						var step = steps[step_url];
						return self._normalizeStep(step);
					}));
				}
				catch(error)
				{
					deferred.reject(error);
				}
				return deferred;
			}

			// @method getCheckoutFlow Return the name of the configured checkout flow
			// @public @extlayer
			// @return {String}
		,	getCheckoutFlow: function getCheckoutFlow()
			{
				var deferred = jQuery.Deferred();

				try
				{
					var checkoutStepsMap = _.invert(this.application.getConfig('checkoutStepsMap'))
					,	checkoutStepsName = this.application.getConfig('checkoutStepsName');

					deferred.resolve(checkoutStepsMap[checkoutStepsName] || checkoutStepsName);
				}
				catch(error)
				{
					deferred.reject(error);
				}
				return deferred;
			}

		,	_getStep: function _getStep(step_url)
			{
				if(!step_url)
				{
				   this._reportError('INVALID_PARAM', 'Invalid parameter. Must specify a step_url');
				}

				var	step = this.order_wizard_router.steps[step_url];

				if(!step)
				{
					this._reportError('INVALID_PARAM', 'Invalid parameter. No step group found for ' + step_url);
				}

				return step;
			}

			// @method addModuleToStep Adds a new module to a step
			// @public @extlayer
			// @param {AddModuleData} data
			// @return {Deferred} Return a Deferred that is resolved in case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	addModuleToStep: function addModuleToStep(data)
			{
				var self = this
				,	deferred = jQuery.Deferred();

				try
				{
					if(!_.isObject(data) || !_.isObject(data.module) || !_.isNumber(data.module.index) || !_.isString(data.module.classname) || !_.isString(data.module.id))
					{
					   self._reportError('INVALID_PARAM', 'Invalid parameter. It must be a valid object');
					}

					var step = self._getStep(data.step_url);

					var module = data.module;
					module.options = module.options || {};
					module.options.module_id = module.id;
					module.options.module_index = module.index;

					step.addModule([
						module.classname
					,	module.options
					])
					.done(function()
					{
						var current_view = self.application.getLayout().getCurrentView();
						current_view && current_view.render();

						deferred.resolve();
					})
					.fail(deferred.reject);

				}
				catch(error)
				{
					deferred.reject(error);
				}
				return deferred;
			}

			// @method removeModuleFromStep Removes a module from a step
			// @public @extlayer
			// @param {RemoveModuleData} data
			// @return {Deferred} Return a Deferred that is resolved in case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	removeModuleFromStep: function removeModuleFromStep(data)
			{
				var self = this
				,	deferred = jQuery.Deferred();

				try
				{
					if(!_.isObject(data) || !_.isString(data.module_id))
					{
					   this._reportError('INVALID_PARAM', 'Invalid parameter. It must be a valid object');
					}

					var step = this._getStep(data.step_url);

					var module = _.findWhere(step.moduleInstances, {module_id: data.module_id})
					,	module_index = _.indexOf(step.moduleInstances, module);

					self.cancelableTrigger('beforeRemoveModuleFromStep', data)
					.done(function()
					{
						step.moduleInstances.splice(module_index, 1);
						module.destroy();

						var current_view = self.application.getLayout().getCurrentView();
						current_view && current_view.render();

						self.cancelableTrigger('afterRemoveModuleFromStep', data);
						deferred.resolve();
					})
					.fail(deferred.reject);
				}
				catch(error)
				{
					deferred.reject(error);
				}
				return deferred;
			}

			// @method addStepsGroup Adds a new steps group
			// @public @extlayer
			// @param {AddStepGroupData} data
			// @return {Deferred<CheckoutStepGroup>} Return a Deferred that is resolved in case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	addStepsGroup: function addStepsGroup(data)
			{
				var self = this
				,	deferred = jQuery.Deferred();

				try
				{
					if(!_.isObject(data) || !_.isObject(data.group) || !_.isString(data.group.name) || !_.isString(data.group.url) || !_.isNumber(data.group.index))
					{
					   self._reportError('INVALID_PARAM', 'Invalid parameter. It must be a valid object');
					}

					var stepGroups =  self.order_wizard_router.stepGroups;

					if(stepGroups[data.group.name])
					{
						self._reportError('INVALID_PARAM', 'Invalid parameter. Already exists a step group: ' + data.group.name);
					}

					data.group.steps = [{url: data.group.url}];

					self.order_wizard_router._compileStepGroup(data.group, data.group.index)
					.then(
						function(step_group)
						{
							var current_view = self.application.getLayout().getCurrentView();
							current_view && current_view.render();

							deferred.resolve(self._normalizeStepGroup(step_group));
						}
					,	deferred.reject
					);

				}
				catch(error)
				{
					deferred.reject(error);
				}
				return deferred;
			}

			// @method removeStepsGroup Removes a steps group
			// @public @extlayer
			// @param {RemoveStepGroupData} data
			// @return {Deferred} Return a Deferred that is resolved in case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	removeStepsGroup: function removeStepsGroup(data)
			{
				var self = this
				,	deferred = jQuery.Deferred();

				try
				{
					if(!_.isObject(data) || !_.isString(data.group_name))
					{
					   this._reportError('INVALID_PARAM', 'Invalid parameter. It must be a valid object');
					}

					var steps_groups =  self.order_wizard_router.stepGroups
					,	steps_group = steps_groups[data.group_name];

					if(!steps_group)
					{
						self._reportError('INVALID_PARAM', 'Invalid parameter. Does not exists a step group: ' + data.group_name);
					}

					if(steps_group.steps.length)
					{
						self._reportError('INVALID_PARAM', 'Invalid parameter. The step group (' + data.group_name + ') cannot be removed because it has steps');
					}

					self.cancelableTrigger('beforeRemoveStepsGroup', data)
					.done(function()
					{
						delete steps_groups[data.group_name];

						var groups = _.values(steps_groups);
						_.each(groups, function(group, group_index)
						{
							group.index = group_index;
						});
						self.order_wizard_router.stepGroups = _.indexBy(groups, 'name');

						var current_view = self.application.getLayout().getCurrentView();
						current_view && current_view.render();

						self.cancelableTrigger('afterRemoveStepsGroup', data);
						deferred.resolve();
					})
					.fail(deferred.reject);
				}
				catch(error)
				{
					deferred.reject(error);
				}
				return deferred;
			}

			// @method addStep Adds a new step to a step_group
			// @public @extlayer
			// @param {AddStepData} data
			// @return {Deferred<CheckoutStep>} Return a Deferred that is resolved in case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	addStep: function addStep(data)
			{
				var self = this
				,	deferred = jQuery.Deferred();

				try
				{
					if(!_.isObject(data) || !_.isObject(data.step) || !_.isString(data.step.name) || !_.isString(data.step.group_name) || !_.isString(data.step.url) || !_.isFunction(data.step.isActive))
					{
					   self._reportError('INVALID_PARAM', 'Invalid parameter. It must be a valid object');
					}

					var steps =  self.order_wizard_router.steps
					,	stepGroups =  self.order_wizard_router.stepGroups;

					if(steps[data.step.url])
					{
						self._reportError('INVALID_PARAM', 'Invalid parameter. Already exists a step: ' + data.step.url);
					}

					var step_group = stepGroups[data.step.group_name];

					if(!step_group)
					{
						self._reportError('INVALID_PARAM', 'Invalid parameter. Does not exists a step group: ' + data.step.group_name);
					}

					data.step.step_index = data.step.index;
					delete data.step.index;
					delete data.step.group_name;

					self.order_wizard_router._compileStep(data.step, step_group)
					.then(
						function(new_step)
						{
							var current_view = self.application.getLayout().getCurrentView();
							current_view && current_view.render();

							deferred.resolve(self._normalizeStep(new_step));
						}
					,	deferred.reject
					);

				}
				catch(error)
				{
					deferred.reject(error);
				}
				return deferred;
			}

			// @method removeStep Removes a step from a step_group
			// @public @extlayer
			// @param {String} step_url
			// @return {Deferred} Return a Deferred that is resolved in case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	removeStep: function removeStep(data)
			{
				var self = this
				,	deferred = jQuery.Deferred();

				try
				{
					if(!_.isObject(data) || !_.isString(data.step_url))
					{
					   this._reportError('INVALID_PARAM', 'Invalid parameter. It must be a valid object');
					}

					var steps =  self.order_wizard_router.steps
					,	step = steps[data.step_url];

					if(!step)
					{
						self._reportError('INVALID_PARAM', 'Invalid parameter. Does not exists a step for the url: ' + data.step_url);
					}

					self.cancelableTrigger('beforeRemoveStep', data)
					.done(function()
					{
						self.order_wizard_router.stepsOrder = _.reject(self.order_wizard_router.stepsOrder, function(step_url)
						{
							return step_url === data.step_url;
						});

						step.stepGroup.steps = _.reject(step.stepGroup.steps, function(step_group_step)
						{
							return step_group_step === step;
						});

						delete steps[data.step_url];
						self.order_wizard_router.route(data.step_url, jQuery.noop);
						self.order_wizard_router.route(data.step_url + '?:options', jQuery.noop);

						var current_view = self.application.getLayout().getCurrentView();
						current_view && current_view.render();

						self.cancelableTrigger('afterRemoveStep', data);
						deferred.resolve();
					})
					.fail(deferred.reject);
				}
				catch(error)
				{
					deferred.reject(error);
				}
				return deferred;
			}

		};

		//Wrap public methods to load the checkout wizard before its execution
		_.each(api_methods, function(method, name)
		{
			if(name.indexOf('_') !== 0 && _.isFunction(method))
			{
				api_methods[name] = _.wrap(method, function(fn)
				{
					var self = this
					,	args = _.toArray(arguments).slice(1);

					return is_wizard_router_ready.then(
						function()
						{
							try
							{
								return fn.apply(self, args);
							}
							catch(error)
							{
								return jQuery.Deferred().reject(error);
							}
						}
					);
				});
			}
		});

		//@class Checkout.Component @extend Base.Component
		var checkout_component = SCVisualComponent.extend(api_methods);

		var innerToOuterMap = [
			{inner: 'before:OrderWizardStep.addModule', outer: 'beforeAddModuleToStep', normalize: checkout_component._normalizeModule}
		,	{inner: 'after:OrderWizardStep.addModule', outer: 'afterAddModuleToStep', normalize: checkout_component._normalizeModule}
		,	{inner: 'before:OrderWizardStep.submit', outer: 'beforeSetCurrentStep', normalize: checkout_component._normalizeStepUrl}
		,	{inner: 'before:OrderWizardStep.previousStep', outer: 'beforeSetCurrentStep', normalize: checkout_component._normalizeStepUrl}
		,	{inner: 'before:OrderWizardRouter.runStep', outer: 'beforeSetCurrentStep', normalize: checkout_component._normalizeStepUrl}
		,	{inner: 'after:OrderWizardRouter.runStep', outer: 'afterSetCurrentStep', normalize: checkout_component._normalizeStepUrl}

		,	{inner: 'before:OrderWizardRouter.compileStep', outer: 'beforeAddStep', normalize: null}
		,	{inner: 'after:OrderWizardRouter.compileStep', outer: 'afterAddStep', normalize: null}
		,	{inner: 'before:OrderWizardRouter.compileStepGroup', outer: 'beforeAddStepsGroup', normalize: null}
		,	{inner: 'after:OrderWizardRouter.compileStepGroup', outer: 'afterAddStepsGroup', normalize: null}

		];

		checkout_component._suscribeToInnerEvents(innerToOuterMap, order_wizard_model);

		return checkout_component;
	};

});

// jsdoc description for data:

// @class RemoveStepGroupData
// @property {String} group_name

// @class AddStepData
// @property {String} name
// @property {String} url
// @property {Function} isActive
// @property {String} group_name
// @property {Number} index

// @class AddStepGroupData
// @property {String} name
// @property {String} url
// @property {Number} index

// @class AddModuleData
// @property {String} step_url
// @property {ModuleData} module

// @class ModuleData
// @property {String} id
// @property {String} classname
// @property {ModuleOptions} options

// @class RemoveModuleData
// @property {String} step_url
// @property {String} module_id

// @class CheckoutStepGroup
// @property {Number} index
// @property {String} name
// @property {String} url
// @property {Boolean} show_group
// @property {String} state
// @property {Array<CheckoutStep>} steps

// @class CheckoutStep
// @property {String} url It is the step identifier
// @property {String} name
// @property {Boolean} show_step
// @property {String} state
// @property {String} step_group_name
// @property {Array<CheckoutStepModule>} modules

// @class CheckoutStepModule
// @property {String} id
// @property {Boolean} is_active
// @property {Boolean} is_ready
// @property {Number} index
