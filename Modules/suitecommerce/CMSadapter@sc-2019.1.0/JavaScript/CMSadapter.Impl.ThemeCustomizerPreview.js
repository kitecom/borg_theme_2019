/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*
@module CMSadapter
@class CMSadapterImpl.CustomContentType the class that has the core integration using the CMS API.
*/
define('CMSadapter.Impl.ThemeCustomizerPreview'
,	[
		'CMSadapter.Component'
	,	'Utils'
	,	'Url'
	,	'jQuery'
	,	'underscore'
	,	'sass'

	]
,	function (
		CMSadapterComponent
	,	Utils
	,	Url
	,	jQuery
	,	_
	,	Sass
)
{
	'use strict';
	var EDITABLE_REGEX = /\/\*\s+<<\s+var:([^\s]+)\s+\*\/\s+([^\/]+)\s+\/\*\s+>>\s+\*\//gi
	,	ESCAPED_INTERPOLATION_REGEX = /\\#{/gi
	,   VARIABLE_REGEX = /\$[A-Za-z0-9_-]*|([_a-zA-Z][A-Za-z0-9_-]*)\s*\(/g
	,	FUNCTION_WHITELIST = ['rgb', 'rgba', 'red', 'green', 'blue', 'mix', 'hsl', 'hsla', 'hue', 'saturation', 'lightness', 'adjust-hue'
								, 'lighten', 'darken', 'saturate', 'desaturate', 'grayscale', 'complement', 'invert', 'alpha', 'rgba', 'opacify'
                                , 'transparentize', 'adjust-color', 'scale-color', 'change-color', 'ie-hex-str', 'unquote', 'quote', 'str-length'
                                , 'str-insert', 'str-index', 'str-slice', 'to-upper-case', 'to-lower-case', 'percentage', 'round', 'ceil', 'floor'
                                , 'abs', 'min', 'max', 'random', 'length', 'nth', 'set-nth', 'join', 'append', 'zip', 'index', 'list-separator'
                                , 'is-bracketed', 'map-get', 'map-merge', 'map-remove', 'map-keys', 'map-values', 'map-has-key', 'keywords'
                                , 'selector-nest', 'selector-append', 'selector-extend', 'selector-replace', 'selector-unify', 'is-superselector'
                                , 'simple-selectors', 'selector-parse', 'feature-exists', 'variable-exists', 'global-variable-exists', 'function-exists'
                                , 'mixin-exists', 'content-exists', 'inspect', 'type-of', 'unit', 'unit-less', 'comprable', 'call', 'get-function'
                                , 'if', 'unique-id', 'fade_in', 'expression', 'calc']
	,	URL_REGEX = /url\(([^)]+)(\))/g
	,	METADATA_REGEX = /\/\* values \*\/[\s]*\/\*(([^*]|\*(?!\/))*)\*\/[\s]*\/\* groups \*\/[\s]*\/\*(([^*]|\*(?!\/))*)\*\/([\s]*\/\* warnings \*\/[\s]*\/\*(([^*]|\*(?!\/))*)\*\/)?/;


	function CMSadapterImplThemeCustomizerPreview (application, CMS)
	{
		this.applicationName = application.name;
		Sass.setWorkerUrl(Utils.getAbsoluteUrl('javascript/sass.worker.js'));
		this.CMS = CMS;
		this.sassCompiler = null;
		this.previewCSS = '';
		this.originalPreviewCSS = '';
		this.originalChangedVariables = {};
		//Ordered list, if element A depends of B, A will appear first
		this.completeSetOfVariablesInOrder = [];
		this.toProcess = null;
		this.isCompiling = false;
		//URL of the css with the metadata
		this.stylesheetHref = '';
		//variables used to synchronize CSS reloading
		this.reloadCSSRequestId = null;
		this.listenForCMS();
	}
	_.extend(CMSadapterImplThemeCustomizerPreview.prototype, {

		listenForCMS: function listenForCMS ()
		{
			var self = this;
			if (SC.ENVIRONMENT.isExtended && SC.ENVIRONMENT.embEndpointUrl)
			{
				this.CMS.on('theme:config:get', function (promise)
				{
					self.loadPreviewEnvironment(promise);
				});
				this.CMS.on('theme:styles:overrideCss', function (promise, changedVariables)
				{
					if (_.size(changedVariables) > 0)
					{
						self.toProcess = {promise: promise, changedVariables: changedVariables};
						self.previewChangedVariables();
					}
					else
					{
						//Restore theme defaults
						self.restoreThemeDefaults(promise);
					}
				});
				this.CMS.on('theme:styles:save', function (promise, changedVariables)
				{
					self.saveThemeStyles(promise, changedVariables);
				});
				this.CMS.on('theme:styles:revertCss', function (promise)
				{
					//cancel button click
					self.themeRevertCss(promise);
				});
			}
		}
		/**
		 * By calling this method the sass.js compiler is going to be loaded as well as
		 * the css+metadata for the current application(shopping, my account, checkout)
		 * This method should be triggered when SMT admin is opened
		 **/
		,	loadPreviewEnvironment: function loadPreviewEnvironment (promise)
		{
			//Prevent to get the css url when edition is canceled
			!this.stylesheetHref && this.setStylesheetHref();
			var self = this
			,	loadedCSS
				//Load and add the css with metadata to the DOM
			,	variablesCalculatedValuePromise = jQuery.ajax({
					url: self.stylesheetHref
				,	dataType: 'text'
				})
				.then(function (css)
				{
					loadedCSS = css;
					var variablesMetadata = self.extractVariablesMetadata(css);
					self.completeSetOfVariablesInOrder = self.identifyNonCompilableVariables(self.getDependenciesInOrder(variablesMetadata.values));
					return variablesMetadata;
				})

			,	themeDataPromise = jQuery.ajax(SC.ENVIRONMENT.embEndpointUrl)
					.then(function (themeData)
					{
						self.saveEndpoint = themeData.saveEndpoint;
						self.compileEndpoint = themeData.compileEndpoint;
						return themeData;
					});
			jQuery.when(variablesCalculatedValuePromise, themeDataPromise)
				.then(function (variablesMetadata, themeData)
				{
					var areEditableVariables = _.findWhere(self.completeSetOfVariablesInOrder, {editable: true});
					if ( areEditableVariables)
					{
						self.applyLoadedCSS(loadedCSS, themeData.editedSettings)
							.then(function (calculatedVariablesValue)
							{
								//Used if theme edition is canceled
								self.originalPreviewCSS = self.previewCSS;
								self.originalChangedVariables = themeData.editedSettings;
								//Remove defaults css from the dom, all stylesheets in the header are going to be removed
								self.removeDefaultStyles();
								var themeSettings = {
									skins: themeData.skins
									,	formData: {
										values: variablesMetadata.values
										,	structure: variablesMetadata.groups
										,	warnings: variablesMetadata.warnings
									}
									,	editedSettings: themeData.editedSettings
									,	currentSettings: calculatedVariablesValue
								};
								promise.resolve(themeSettings);
							})
							.fail(function (error) {
								promise.reject({
									errors: 'Error loading or processing metadata. Details: ' + JSON.stringify(error)
								});
							});
					}
					else
					{
						//if there are not editable variables, the theme is not editable
						promise.resolve({});
					}
				})
				.fail(function (error)
				{
					promise.reject({
						errors: 'Error loading or processing metadata. Details: ' + JSON.stringify(error)
					});
				});
		}
		,	themeRevertCss: function themeRevertCss (promise)
		{
			this.discardReload();
			this.applyLoadedCSS(this.originalPreviewCSS, this.originalChangedVariables)
				.then(promise.resolve)
				.fail(function (error)
				{
					promise.reject({
						errors: 'Error reverting the changes. Details: ' + JSON.stringify(error)
					});
				});
		}
		,	previewChangedVariables: function previewChangedVariables ()
		{
			if (this.toProcess !== null && !this.isCompiling)
			{
				this.isCompiling = true;
				var self = this
				,	promise = this.toProcess.promise
				,	changedVariables = this.toProcess.changedVariables;
				this.toProcess = null;
				this.getVariablesCalculatedValue(changedVariables, true)
					.then(function (variablesComputedValue)
					{
						if (self.toProcess === null)
						{
							var newCSS = self.replaceVariablesValueOnPreviewCSS(variablesComputedValue);
							self.applyPreviewCSS(newCSS);
							promise.resolve(self.getEditableVariablesOnly(variablesComputedValue));

							self.themeStylesReloadValues(changedVariables);
						}
					})
					.fail(function (error)
					{
						if (self.toProcess === null)
						{
							promise.reject({
								errors: 'Error previewing. Details: ' + JSON.stringify(error)
							});
						}
					})
					.always(function ()
					{
						self.isCompiling = false;
						self.previewChangedVariables();
					});
			}
		}
		,	saveThemeStyles: function saveThemeStyles (promise, changedVariables)
		{
			var self = this
			,	callbacks = {
					then: function (variablesValue)
					{
						promise.resolve(variablesValue);
						//Used if theme edition is canceled
						self.originalPreviewCSS = self.previewCSS;
						self.originalChangedVariables = changedVariables;
					}
				,	fail: function (error)
					{
						promise.reject({
							errors: 'Error saving the theme. Details: ' + JSON.stringify(error)
						});
					}
			};
			self.reloadCSS(changedVariables, true, callbacks);
		}
		,	restoreThemeDefaults: function restoreThemeDefaults (promise)
		{
			var self = this
			,	callbacks = {
					then: function (variablesValue)
					{
						promise.resolve(variablesValue);
					}
					,	fail: function (error)
					{
						promise.reject({
							errors: 'Error restoring theme defaults. Details:' + JSON.stringify(error)
						});
					}
			};
			self.reloadCSS({}, false, callbacks);
		}
		,	reloadCSS: function reloadCSS (changedVariables, save, callbacks)
		{
			var self = this
			,	endPoint = save ? this.saveEndpoint : this.compileEndpoint;
			//Build endpoint url
			endPoint.data.skin = JSON.stringify(changedVariables);
			endPoint.data.app = this.applicationName.toLowerCase();
			//discard reloadCSS or planned reloadCSS
			self.discardReload();
			var reloadCSSRequestId = self.reloadCSSRequestId;
			function doIfIsLastReloadExec (fn)
			{
				reloadCSSRequestId === self.reloadCSSRequestId && fn();
			}
			var promise = jQuery.ajax(endPoint)
				.then(function (response)
				{
					if (response.header && response.header.status.code !== 'SUCCESS')
					{
						if (callbacks && callbacks.fail)
						{
							doIfIsLastReloadExec(function ()
							{
								callbacks.fail(response);
							});
						}
					}
					else
					{
						doIfIsLastReloadExec(function ()
						{
							self.applyLoadedCSS(response.css, changedVariables)
								.then(function (variablesValue)
								{
									if (callbacks && callbacks.then)
									{
										callbacks.then(variablesValue);
									}
								});
						});
					}
				});
			if (callbacks)
			{
				callbacks.fail && promise.fail(function (error)
				{
					doIfIsLastReloadExec(function ()
					{
						callbacks.fail(error);
					});
				});
				callbacks.always && promise.always(function (result)
				{
					doIfIsLastReloadExec(function ()
					{
						callbacks.always(result);
					});
				});
			}
		}
		,	themeStylesReloadValues: function themeStylesReloadValues (changedVariables)
		{
			var self = this;
			//discard reloadCSS or planned reloadCSS
			this.discardReload();
			self.reloadCSSRequestId = setTimeout(function ()
				{
					var callbacks = {
						then: function (variablesValue)
						{
							self.CMS.trigger('theme:styles:reloadValues', {
								errors: null
							,	values: variablesValue
							});
						}
					,	fail: function (error)
						{
							self.CMS.trigger('theme:styles:reloadValues', {
								errors: 'Error reloading values from server. Details: ' + JSON.stringify(error)
							});
						}
					};
					self.reloadCSS(changedVariables, false, callbacks);
				}
				, 5000);
		}
		,	fixRelativeURLs: function fixRelativeURLs (css, baseURL)
		{
			var output = css.replace(URL_REGEX, function (matched, relative)
			{
				//remove spaces, single and double quotes
				relative = relative.trim();
				if (relative[0] === '\'' || relative[0] === '"')
				{
					relative = relative.substr(1, relative.length - 2);
				}
				return 'url(' + new Url().parse(relative).resolve(baseURL).toString() + ')';
			});
			return output;
		}
		,	getEditableVariablesOnly: function getEditableVariablesOnly (variablesCalculatedValue)
		{
			//Filter the variables to return only the editable ones
			var editableVariables = {};
			_.each(this.completeSetOfVariablesInOrder, function (variable)
			{
				if (variable.editable && variablesCalculatedValue[variable.name] !== undefined)
				{
					editableVariables[variable.name] = variablesCalculatedValue[variable.name];
				}
			});
			return editableVariables;
		}
		,	applyPreviewCSS: function applyPreviewCSS (css)
		{
			var tagId = 'nsCSSWithMetadata'
			,	styleTag = document.getElementById(tagId);
			if (!styleTag)
			{
				styleTag = window.document.createElement('style');
				styleTag.id = tagId;
				window.document.body.appendChild(styleTag);
			}
			styleTag.innerHTML = css;
		}
		,	applyLoadedCSS: function applyLoadedCSS (css, changedVariables)
		{
			var self = this;
			this.previewCSS = this.fixRelativeURLs(css, this.stylesheetHref);
			this.applyPreviewCSS(this.previewCSS);
			var variablesValuesFromCSS = this.extractVariablesValuesFromCSS(this.previewCSS);
			this.setVariablesDefaultValue(variablesValuesFromCSS);
			return this.getVariablesCalculatedValue(changedVariables)
				.then(function (calculatedVariablesValue)
				{
					return self.getEditableVariablesOnly(calculatedVariablesValue);
				});
		}
		,	extractVariablesMetadata: function extractVariablesMetadata (css)
		{
			var variablesMetadata = {}
			,	matches = css.match(METADATA_REGEX);
			variablesMetadata.values = JSON.parse(this.unescapeNumberSign(matches[1])).values;
			variablesMetadata.groups = JSON.parse(matches[3]).groups;
			variablesMetadata.warnings = matches[5];
			return variablesMetadata;
		}
		,	getAffectedVariables: function getAffectedVariables (editedVariables)
		{
			var affectedVariables = []
			,	derivedVars = {};
			function addToDerivedVars (derivedVar)
			{
				derivedVars[derivedVar.name] = true;
			}
			for (var i = this.completeSetOfVariablesInOrder.length - 1; i >= 0; i--)
			{
				var variableName = this.completeSetOfVariablesInOrder[i].name;
				//Avoid to add duplicated variables in "affectedVariables" array
				if (editedVariables[variableName] !== undefined || derivedVars[variableName] !== undefined)
				{
					affectedVariables.push(this.completeSetOfVariablesInOrder[i]);
					_.each(this.completeSetOfVariablesInOrder[i].derived, addToDerivedVars);
				}
			}
			return affectedVariables.reverse();
		}
		,	buildDummySass: function buildDummySass (affectedVariables, editedVariables)
		{
			var self = this
			,	wrapFunction = '@function quotes-verbatim($value) {\n' +
				'  @if (type-of($value) == "string") {\n' +
				'    // SASS doesn\'t have str-is-quoted, and quoted and unquoted strings compare\n' +
				'    // equal. I noticed that list expressions give away whether a string is quoted,\n' +
				'    // though, so here\'s how we can return a string with explicit quotes.\n' +
				'    $list-expr: "#{inspect(($value, ""))}";\n' +
				'    @return str-slice($list-expr, 0, str-length($list-expr) - 4);\n' +
				'  }\n' +
				'  @else {\n' +
				'    @return $value;\n' +
				'  }\n' +
				'}\n' +
				'  \n' +
				'@function wrap($name, $value) {\n' +
				'  @if (outputstyle() != "COMPRESSED") {\n' +
				'    @if ($value) {\n' +
				'      @return unquote("/* << var:" + $name + " */ " + quotes-verbatim($value) + " /* >> */");\n' +
				'    }\n' +
				'    @return null;\n' +
				'  }\n' +
				'  @return $value;\n' +
				'};'
			,	variablesDeclaration = ''
			,	dummyClassBody = '';
			for (var i = affectedVariables.length - 1; i >= 0; i--)
			{
				var variableName = affectedVariables[i].name
				,	variableValue;
				if (editedVariables[variableName] !== undefined)
				{
					variableValue = editedVariables[variableName];
				}
				else
				{
					if (affectedVariables[i].nonCompilable)
					{
						//use the value in the css
						variableValue = affectedVariables[i].defaultValue;
					}
					else
					{
						variableValue = affectedVariables[i].expr;
					}
				}
				if (variableValue !== undefined)
				{
					variablesDeclaration += self.buildSASSVariableDeclaration(variableName, variableValue);
					dummyClassBody += self.buildSASSVariableUsageStatement(variableName);
				}
			}
			return wrapFunction + variablesDeclaration + '\n' + '.dummyClass {\n' + dummyClassBody + '\n}';
		}
		,	buildDummyCSS: function buildDummyCSS (sassStr)
		{
			var self = this
			,	promise = jQuery.Deferred()
			,	retried = false;
			function compilerHandler (compilerOutput)
			{
				if (compilerOutput.status === 0)
				{
					promise.resolve(compilerOutput.text);
				}
				else
				{
					if (!retried)
					{
						retried = true;
						self.getSassCompiler(true).compile(sassStr, compilerHandler);
					}
					else
					{
						promise.reject(compilerOutput.message ? compilerOutput.message : 'Unexpected error compiling front-end SASS variables');
					}
				}
			}
			self.getSassCompiler().compile(sassStr, compilerHandler);
			return promise;
		}
		,	extractVariablesValuesFromCSS: function extractVariablesValuesFromCSS (css)
		{
			var result
			,	variables = {};
			while ((result = EDITABLE_REGEX.exec(css)) !== null)
			{
				var name = result[1];
				variables[name] = result[2];
			}
			return variables;
		}
		/**
		 * @method replaceVariablesValueOnPreviewCSS
		 * @param {variableName: String} editedVariables
		 * @returns {string} copy the the attribute "previewCSS" with the supplied values changed
		 */
		,	replaceVariablesValueOnPreviewCSS: function replaceVariablesValueOnPreviewCSS (editedVariables)
		{
			var output = this.previewCSS.replace(EDITABLE_REGEX, function (matched, name)
			{
				var editedValue = editedVariables[name] !== undefined;
				if (!editedValue)
				{
					return matched;
				}
				else
				{
					return '/* << var:' + name + ' */ ' + editedVariables[name] + ' /* >> */';
				}
			});
			return output;
		}
		/**
		 *	@method getVariablesCalculatedValue For each variable in the metadata compute his value using the supplied changes"
		 *	@param changedVariables {Object} Map with all edited variables
		 *	@return Promise The promise is resolved with an object with each variables and his calculated value
		 * */
		,	getVariablesCalculatedValue: function getVariablesCalculatedValue (changedVariables, affectedsOnly)
		{
			var self = this
			,	affectedVariables = affectedsOnly ? this.getAffectedVariables(changedVariables) : this.completeSetOfVariablesInOrder
			,	sass = this.buildDummySass(affectedVariables, changedVariables || {});
			return this.buildDummyCSS(sass).then(function (css)
			{
				return self.extractVariablesValuesFromCSS(css);
			});
		}
		/**
		 * @method getDependenciesInOrder The method should be called only once, when the environment is initialised
		 * @param Array<Object> siblings SASS variables metadata
		 * @return Array<Object> Ordered list, if element A depends of B, A will appear first
		 * */
		,	getDependenciesInOrder: function getDependenciesInOrder (siblings)
		{
			function find (startIndex, array, elementName)
			{
				for (var i = startIndex; i < array.length; i++)
				{
					if (array[i].name === elementName)
					{
						return i;
					}
				}
				return -1; //not found
			}
			function mergeBranches (branch1, branch2)
			{
				var branch1Index = 0
					,	branch2Index = 0
					,	mergeResult = []
					,	mergedElements = {};

				while (branch1Index < branch1.length || branch2Index <  branch2.length)
				{
					if (branch1Index < branch1.length)
					{
						var searchedElementIndex = find(branch2Index,  branch2, branch1[branch1Index].name);
						if (searchedElementIndex >= 0)
						{
							while (branch2Index <= searchedElementIndex)
							{
								if (!mergedElements[branch2[branch2Index].name])
								{
									mergeResult.push(branch2[branch2Index]);
									mergedElements[branch2[branch2Index].name] = true;
								}
								branch2Index++;
							}
						}
						else
						{
							if (!mergedElements[orderedDependencies[branch1Index].name])
							{
								mergeResult.push(orderedDependencies[branch1Index]);
								mergedElements[orderedDependencies[branch1Index].name] = true;
							}
						}
						branch1Index++;
					}
					else
					{
						//add all elements in  branch2 that were not included yet
						mergeResult = mergeResult.concat( branch2.slice(branch2Index));
						branch2Index = branch2.length;
					}
				}
				return mergeResult;
			}
			var self = this
			,	orderedDependencies = [];
			_.each(siblings, function (sibling)
			{
				if (sibling.derived && sibling.derived.length)
				{
					var branchOrderedDependencies = self.getDependenciesInOrder(sibling.derived);
					if (orderedDependencies.length)
					{
						//merge two sets of ordered dependencies
						orderedDependencies = mergeBranches(orderedDependencies, branchOrderedDependencies);
					}
					else
					{
						orderedDependencies = branchOrderedDependencies;
					}
				}
			});
			return mergeBranches(orderedDependencies, siblings);
		}
		,	buildSASSVariableDeclaration: function buildSASSVariableDeclaration (name, value)
		{
			return name + ':' + value + ';';
		}
		,	buildSASSVariableUsageStatement: function buildSASSVariableUsageStatement (name)
		{
			var cssPropertyName = name.substring(1);
			return '\t' + cssPropertyName + ': wrap(\'' + name + '\', ' + name + ');';
		}
		,	getSassCompiler: function getSassCompiler (cleanUp)
		{
			if (!this.sassCompiler)
			{
				this.sassCompiler = new Sass();
			}
			else
			{
				if (cleanUp)
				{
					this.sassCompiler.destroy();
					this.sassCompiler = new Sass();
				}
			}
			return this.sassCompiler;
		}
		,	identifyNonCompilableVariables: function identifyNonCompilableVariables (variables)
		{
			var availableVariables = {};
			function setAsNotCompilable (variable)
			{
				variable.nonCompilable = true;
				_.each(variable.derived, function (derived)
				{
					setAsNotCompilable(derived);
				});
			}
			function findInFunctionsWhiteList (func)
			{
				return _.find(FUNCTION_WHITELIST, function (validFunc)
				{
					return validFunc === func;
				});
			}
			for (var i = variables.length - 1; i >= 0; i--)
			{
				var variable = variables[i];
				/*The $overrides variable should not be part of metadata, is used to apply new variables
				* values during backend compilation, pre-processor is adding it so need's to be removed during
				* frontend compilation*/
				if (variable.name === '$overrides')
				{
					setAsNotCompilable(variable)
				}
				else if (!variable.nonCompilable)
				{
					//if has not been labeled as not compilable yet, check the expression
					//parse expression to extract variables and functions
					var	parsed = variable.expr.match(VARIABLE_REGEX);
					if (parsed)
					{
						for (var j = 0; j < parsed.length; j++)
						{
							var member = parsed[j];
							if (member[0] !== '$')
							{
								//if is a function must exist in the white list
								member = member.substring(0, member.indexOf('('));
								var isValidFunc = findInFunctionsWhiteList(member);
								if (!isValidFunc)
								{
									setAsNotCompilable(variable);
								}
							}
							else
							{
								//if is a variable must exist in "availableVariables"
								if (!availableVariables[member])
								{
									setAsNotCompilable(variable);
								}
							}
						}
					}
					if (!variable.nonCompilable)
					{
						//set the variable as existing and compilable
						availableVariables[variables[i].name] = true;
					}
				}
			}
			return variables;
		}
		,	unescapeNumberSign: function unscapeChardInVariablesExpression (str)
		{
			return str.replace(ESCAPED_INTERPOLATION_REGEX, '#{');
		}
		,	setVariablesDefaultValue: function setVariablesDefaultValue (variablesDefaultValue)
		{
			_.each(this.completeSetOfVariablesInOrder, function (variable)
			{
				variable.defaultValue = variablesDefaultValue[variable.name];
			});
		}
		,	setStylesheetHref: function setStylesheetHref ()
		{
			var stylesheets = jQuery('link[rel="stylesheet"]', window.document.head)
			//Build the path to the css with the metadata
			//Get a non IE url
			,	stylesheetHref = _.find(stylesheets.get(), function (linkDomElement)
			{
				if (!linkDomElement.href.match(/((_\d+){2}\.css(\?.*)*)$/))
				{
					return true;
				}
			});
			//Get the url of the production css without the extension
			stylesheetHref = stylesheetHref.href.match(/(.*)(\.css(\?.*)*)$/)[1];
			this.stylesheetHref = stylesheetHref.substring(0, stylesheetHref.lastIndexOf('/') + 1) + 'smt_' + stylesheetHref.substring(stylesheetHref.lastIndexOf('/') + 1) + '.css?t=' + new Date().getTime();
		}
		,	removeDefaultStyles: function removeDefaultStyles ()
		{
			var stylesheets = jQuery('link[rel="stylesheet"]', window.document.head);
			stylesheets.remove();
		}
		,	discardReload: function discardReload ()
		{
			//discard reloadCSS or planned reloadCSS
			clearTimeout(this.reloadCSSRequestId);
			this.reloadCSSRequestId = _.uniqueId('id_');
		}
	});
	return CMSadapterImplThemeCustomizerPreview;
});
