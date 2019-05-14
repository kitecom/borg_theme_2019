/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Wizard
define('Wizard.Router'
,	[	'Wizard.View'
	,	'Wizard.Step'
	,	'Wizard.StepGroup'
	,	'Profile.Model'

	,	'Backbone'
	,	'underscore'
	,	'jQuery'
	,	'Utils'
	]
,	function (
		View
	,	Step
	,	StepGroup
	,	ProfileModel

	,	Backbone
	,	_
	,	jQuery
	)
{
	'use strict';

	// @class Wizard.Router Main component of the wizard, controls routes, the step flow, and to show each
	// step. In general, when something is referred as 'the wizard' is probably an instance of this class. @extend Backbone.Router
	return Backbone.Router.extend({

		//@property {Wizard.Step} step
		step: Step

		//@property {Wizard.View} view
	,	view: View

		//@property {Wizard.StepGoupd} StepGroup
	,	stepGroup: StepGroup

		// @method initialize Initializes internals and loads configuration
		// @param {ApplicationSkeleton} application @param {Object} options
	,	initialize: function (application, options)
		{
			// @property {ApplicationSkeleton} application
			this.application = application;
			// @property {Object<String,Wizard.Step>} steps dictionary of step instances by name
			this.steps = {};
			// @property {Array<String>} stepsOrder Array of step URLs
			this.stepsOrder = [];
			// @property {String} currentStep URL of the current Step
			this.currentStep = '';
			// @property {Object<String,Wizard.StepGroup>} stepGroups Dictionary of step group instances by its URLs
			this.stepGroups = {};
			// @property {Array} handledErrors
			this.handledErrors = [];

			this.options = options;

			if (options && options.model)
			{
				this.model = options.model;
			}

			var init_promise;

			if (options && options.steps)
			{
				init_promise = this.compileConfiguration(options.steps);
			}

			// remove duplicates from the handledErrors array
			this.handledErrors = _.uniq(this.handledErrors);

			return init_promise || jQuery.Deferred().resolve();
		}

		/*
		@method compileConfiguration
		Instantiates all the Steps and StepGroups based on the configuration.
		The Expected configuration is as follows:

			[
				{
					name: "Step Group"
				,	steps: [
						{
							name: "Step"
						,	url: "step-url"
						,	modules: [
								'Module.Name'
							]
						}
					]
				}
			]

		@param {Array} step_groups  This is an Array of Step Groups (Name and Steps), where Steps is an Array of Steps (Name, URL, Modules),
		where Modules is an Array of Strings that will be required(). In general this object is exactly the same as defined in the application's Configuration.js file
		*/
	,	compileConfiguration: function (step_groups)
		{
			var self = this
			,	promise = jQuery.Deferred();

			// Iterates all the steps
			var promises = _.map(step_groups, function (step_group, index)
			{
				if (step_group.steps)
				{
					// Instantiates the StepGroup
					return self._compileStepGroup(step_group, index)
					.then(
						function(step_group_instance)
					{
						// Iterates the step of the step group
							var step_promises =  _.map(step_group.steps, function (step)
						{
								return self._compileStep(step, step_group_instance);
						});

							return jQuery.when.apply(jQuery, step_promises);
						}
					,	promise.reject
					);
				}
					});

			jQuery.when.apply(jQuery, promises).then(promise.resolve, promise.reject);

			return promise;
		}

	,	_compileStep: function _compileStep(step, step_group_instance)
		{
			var deferred = jQuery.Deferred();
			try
			{
				var self = this;

				self.promise = self.promise || jQuery.Deferred().resolve();

				self.promise = self.promise.then(
					function()
					{
						try
						{
							var	step_index = _.isNumber(step.step_index) ? step.step_index : self.stepsOrder.length;

							delete step.step_index;

							// Extends the base class with your configuration
							var StepClass = self.step.extend(step);

							// Initializes it
							self.steps[step.url] = new StepClass({
								wizard: self
							,	stepGroup: step_group_instance
							,	step_url: step.url
							});

							// add the step to the step-group
							step_group_instance.steps.push(self.steps[step.url]);

							// sets it in an ordered group
							self.stepsOrder.splice(step_index, 0, step.url);

							// Routes it
							self._registerPageType({ routes: [step.url, step.url + '?:options'] });

							deferred.resolve(self.steps[step.url]);
						}
						catch(error)
						{
							deferred.reject(error);
						}
					}
				,	function(error){
						deferred.reject(error);
						return jQuery.Deferred().resolve();
					}
				);

			}
			catch(error)
			{
				deferred.reject(error);
			}
			return deferred;
		}

	,	_registerPageType: function _registerPageType(options)
		{
			var pageType = this.application.getComponent('PageType');

			pageType.registerPageType({
				'name': 'wizard'
			,	'routes': options.routes
			,	'view': View
			});
		}

	,	_compileStepGroup: function _compileStepGroup(step_group, index)
		{
			var deferred = jQuery.Deferred();
			try
			{
				var self = this
				,	step_group_instance = new self.stepGroup(step_group.name, step_group.steps[0].url);

				var groups = _.values(self.stepGroups);

				groups.splice(index, 0, step_group_instance);
				_.each(groups, function(group, group_index)
				{
					group.index = group_index;
				});

				self.stepGroups = _.indexBy(groups, 'name');

				deferred.resolve(step_group_instance);
			}
			catch(error)
			{
				deferred.reject(error);
			}
			return deferred;
		}

		// @method getCurrentStep @return {Wizard.Step} the current step object
	,	getCurrentStep: function ()
		{
			return this.steps[this.currentStep];
		}

		// @method goToNextStep finds the next steps and navigates to it
	,	goToNextStep: function ()
		{
			var next_step_url = this.getNextStepUrl()
			,	url_options = _.parseUrlOptions(Backbone.history.location.hash);

			if (next_step_url)
			{
				var params = Backbone.history.location.hash ? Backbone.history.location.hash.split('?') : [];

				this.indirectURL = true;
				this.navigate(url_options.force ? _.addParamsToUrl(next_step_url, {force: true}) : next_step_url, {trigger: true});
			}
		}

		// @method getNextStepUrl @param {Number} index @return {String}
	,	getNextStepUrl: function (index)
		{
			index = index || _.indexOf(this.stepsOrder, this.currentStep);

			if (~index && index + 1 < this.stepsOrder.length)
			{
				if (this.steps[this.stepsOrder[index + 1]].showStep(this))
				{
					return this.stepsOrder[index + 1];
				}

				return this.getNextStepUrl(index + 1);
			}
		}

		// @method getActiveStepsGroups @return {Array<Wizard.StepGroup>}
	,	getActiveStepsGroups: function ()
		{
			return _(this.stepGroups).filter(function (step_group)
			{
				return step_group.showStepGroup();
			});
		}

		// @method getFirstStepUrl @return {String}
	,	getFirstStepUrl: function ()
		{
			var active_steps = this.getActiveStepsGroups();

			return active_steps[0] && active_steps[0].getURL();
		}

		// @method goToPreviousStep finds the previous steps and navigates to it
	,	goToPreviousStep: function ()
		{
			var previous_step_url = _.addParamsToUrl(this.getPreviousStepUrl(), {force: true});

			if (previous_step_url)
			{
				var params = previous_step_url.split('?');

				this.indirectURL = true;
				this.navigate(previous_step_url, {trigger: true});
			}
		}

		// @method getPreviousStepUrl
		// @param {Number} index
		// @return {String}
	,	getPreviousStepUrl: function (index)
		{
			if (_.isUndefined(index))
			{
				index = _.indexOf(this.stepsOrder, this.currentStep);
			}

			if (index > 0)
			{
				if (this.steps[this.stepsOrder[index - 1]].showStep(this))
				{
					return this.stepsOrder[index - 1];
				}

				return this.getPreviousStepUrl(index - 1);
			}
			else
			{
				var base_step = this.stepsOrder[0];

				if (this.steps[base_step].showStep(this))
				{
					return base_step;
				}
			}
		}

		// @method getStepPosition Returns the distance of the current step from the start and to the end
		// If you are in the 2nd step of a 5 steps wizard it will return:
		// { fromBegining: 1, toLast: 3 }
		//@param {String} URL
		//@return {fromBegining:Number,toLast:Number}
	,	getStepPosition: function (url)
		{
			var index = _.indexOf(this.stepsOrder, url || this.currentStep)
			,	fromBegining = 0
			,	toLast = 0
			,	keys = _.keys(this.steps);

			for (var i = 0; i < keys.length; i++)
			{
				if (i < index && this.steps[keys[i]].showStep())
				{
					fromBegining++;
				}
				else if (i > index && this.steps[keys[i]].showStep())
				{
					toLast++;
				}
			}

			return {
				fromBegining: fromBegining
			,	toLast: toLast
			};
		}

		// @method isCurrentStepFirst
		// @return {Boolean}
	,	isCurrentStepFirst: function ()
		{
			var current_step_index = _.indexOf(this.stepsOrder, this.currentStep);

			if (current_step_index > 0)
			{
				do
				{
					if (this.steps[this.stepsOrder[--current_step_index]].showStep())
					{
						return false;
					}
				} while (current_step_index);
			}
			return true;
		}

	,	_runStep: function _runStep()
		{
			return this.runStep.apply(this, arguments);
		}

		// @method runStep Executes the current step: Calls the status methods of the steps (past, present, future).
		// And renders the Frame view.
	,	runStep: function ()
		{
			var url = Backbone.history.fragment
			,	self = this
			,	promise = jQuery.Deferred();

			// We allow URLs to have options but they are still identified by the original string,
			// so we need to take them out if present
			url = url.split('?')[0];

			if (this.steps[url])
			{
				
				var confirmation = this._getPropAsModelInstance('confirmation');

				confirmation = confirmation && (confirmation.get('confirmationnumber') || confirmation.get('tranid') || confirmation.get('internalid'));

				var profile_model = ProfileModel.getInstance();

				if ((this.application.getConfig('checkoutApp.skipLogin') && this.application.getConfig('siteSettings.registration.registrationoptional') === 'T' && profile_model.get('isRecognized') === 'F') || profile_model.get('isLoggedIn') === 'T')
				{
					// We keep a reference to the current step URL here
					this.currentStep = url;

					// Iterates all the steps and calls the status methods
					var method_to_call = 'past'
					,	current_group
					,	past_promises = [];

					_.each(this.stepsOrder, function (step)
					{
						if (step === url)
						{
							self.steps[step].present();
							self.steps[step].state = 'present';
							self.steps[step].stepGroup.state = 'present';
							self.steps[step].tellModules('present');
							method_to_call = 'future';
							current_group = self.steps[step].stepGroup;
						}
						else
						{
							self.steps[step].tellModules(method_to_call);
							var past_promise = !confirmation && self.steps[step][method_to_call]();

							if(method_to_call === 'past' && past_promise)
							{
								past_promise = past_promise.then(jQuery.noop, function()
								{
									throw step;
								});
							}
							past_promises.push(past_promise);

							self.steps[step].state = method_to_call;

							// if the step is contained in the current_group we don't change the group state
							if (self.steps[step].stepGroup !== current_group)
							{
								self.steps[step].stepGroup.state = method_to_call;
							}
						}
					});

					jQuery.when.apply(jQuery, past_promises).then(
						promise.resolve
					,   function(step_url)
                        {
                            //If some of the "past" steps failed, browse back to that step
                            promise.reject();
                            Backbone.history.navigate(step_url, {trigger: true});
                        }
                    );
				}
				else
				{
					promise.reject();
					Backbone.history.navigate('login-register', {trigger: true});
				}
			}
			else
			{
                promise.resolve();
            }

			return promise;
		}
		
		// @method _getPropAsModelInstance Make a new instance if the property isn't a Backbone.Model instance
		// @param {Backbone.Model|Object} name
		// @return {Backbone.Model}
		,	_getPropAsModelInstance: function _getPropAsModelInstance(name)
			{				
				var property = this.model ? this.model.get(name) : null;	

				if (!(property instanceof Backbone.Model)) {
					property = new Backbone.Model(property);
				}

				return property;
			}

		// @method processErrorMessage Fix errors message that contains anchors HTML to correctly point to URLs
		// that are not handle by the navigation helper
		// @param {String} error_message
		// @return {String}
	,	processErrorMessage: function (error_message)
		{
			var $error = jQuery('<div>').append(error_message);
			$error.find('a').attr('data-navigation', 'ignore-click');

			return $error.html();
		}

		// @method manageError central hub for managing errors, the errors should be in the format:
		// ```{errorCode:'ERR_WS_SOME_ERROR', errorMessage:'Some message'}```.
		// The method also receives the step in case that the error is not handled by any module
	,	manageError: function (error, step)
		{
			if (_.isObject(error) && error.responseText)
			{
				error = JSON.parse(error.responseText);
			}
			else if (_.isString(error) || _.isNumber(error))
			{
				error = {errorCode:'ERR_WS_UNHANDLED_ERROR', errorMessage: error};
			}
			else if (!_.isObject(error))
			{
				error = {errorCode:'ERR_WS_UNHANDLED_ERROR', errorMessage:_('An error has occurred').translate()};
			}

			if (~_.indexOf(this.handledErrors, error.errorCode))
			{
				this.trigger(error.errorCode, error);
			}
			else
			{
				// if the error is not handled but we receive a step we delegate the error to it
				if (step)
				{
					step.moduleError(null, error);
				}
				else
				{
					// if no one is listening for this error, we show the message on the current step
					this.getCurrentStep().error = error;
					this.getCurrentStep().showError();
				}
			}
		}
	});
});
