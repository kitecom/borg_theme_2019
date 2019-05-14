__sc_ssplibraries_t0 = new Date().getTime(); 
window.suiteLogs = window.suiteLogs || false; 
release_metadata = {"name":"SuiteCommerce Advanced","prodbundle_id":"273662","baselabel":"SCA_2019.1","version":"2019.1.0","datelabel":"2019.04.09","buildno":"4"}
/**
 * @license almond 0.3.3 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/almond/LICENSE
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part, normalizedBaseParts,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name) {
            name = name.split('/');
            lastIndex = name.length - 1;

            // If wanting node ID compatibility, strip .js from end
            // of IDs. Have to do this here, and not in nameToUrl
            // because node allows either .js or non .js to map
            // to same file.
            if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
            }

            // Starts with a '.' so need the baseName
            if (name[0].charAt(0) === '.' && baseParts) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that 'directory' and not name of the baseName's
                //module. For instance, baseName of 'one/two/three', maps to
                //'one/two/three.js', but we want the directory, 'one/two' for
                //this normalization.
                normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                name = normalizedBaseParts.concat(name);
            }

            //start trimDots
            for (i = 0; i < name.length; i++) {
                part = name[i];
                if (part === '.') {
                    name.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    // If at the start, or previous value is still ..,
                    // keep them so that when converted to a path it may
                    // still work when converted to a path, even though
                    // as an ID it is less than ideal. In larger point
                    // releases, may be better to just kick out an error.
                    if (i === 0 || (i === 1 && name[2] === '..') || name[i - 1] === '..') {
                        continue;
                    } else if (i > 0) {
                        name.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
            //end trimDots

            name = name.join('/');
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    //Creates a parts array for a relName where first part is plugin ID,
    //second part is resource ID. Assumes relName has already been normalized.
    function makeRelParts(relName) {
        return relName ? splitPrefix(relName) : [];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relParts) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0],
            relResourceName = relParts[1];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relResourceName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relResourceName));
            } else {
                name = normalize(name, relResourceName);
            }
        } else {
            name = normalize(name, relResourceName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i, relParts,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;
        relParts = makeRelParts(relName);

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relParts);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, makeRelParts(callback)).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

//     Underscore.js 1.9.1
//     http://underscorejs.org
//     (c) 2009-2018 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            this ||
            {};

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

  // Create quick reference variables for speed access to core prototypes.
  var push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for their old module API. If we're in
  // the browser, add `_` as a global object.
  // (`nodeType` is checked to ensure that `module`
  // and `exports` are not HTML elements.)
  if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.9.1';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      // The 2-argument case is omitted because we’re not using it.
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  var builtinIteratee;

  // An internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
    return _.property(value);
  };

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // This abstraction hides the internal-only argCount argument.
  _.iteratee = builtinIteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // Some functions take a variable number of arguments, or a few expected
  // arguments at the beginning and then a variable number of values to operate
  // on. This helper accumulates all remaining arguments past the function’s
  // argument length (or an explicit `startIndex`), into an array that becomes
  // the last argument. Similar to ES6’s "rest parameter".
  var restArguments = function(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var shallowProperty = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  var has = function(obj, path) {
    return obj != null && hasOwnProperty.call(obj, path);
  }

  var deepGet = function(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = shallowProperty('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  var createReduce = function(dir) {
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    var reducer = function(obj, iteratee, memo, initial) {
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      if (!initial) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };

    return function(obj, iteratee, memo, context) {
      var initial = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = restArguments(function(obj, path, args) {
    var contextPath, func;
    if (_.isFunction(path)) {
      func = path;
    } else if (_.isArray(path)) {
      contextPath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    return _.map(obj, function(context) {
      var method = func;
      if (!method) {
        if (contextPath && contextPath.length) {
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection.
  _.shuffle = function(obj) {
    return _.sample(obj, Infinity);
  };

  // Sample **n** random values from a collection using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = _.random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior, partition) {
    return function(obj, iteratee, context) {
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (has(result, key)) result[key]++; else result[key] = 1;
  });

  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (_.isString(obj)) {
      // Keep surrogate pair characters together
      return obj.match(reStrSymbol);
    }
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = group(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, Boolean);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, output) {
    output = output || [];
    var idx = output.length;
    for (var i = 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        // Flatten current level of array or arguments object.
        if (shallow) {
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        } else {
          flatten(value, shallow, strict, output);
          idx = output.length;
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = restArguments(function(array, otherArrays) {
    return _.difference(array, otherArrays);
  });

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // The faster algorithm will not work with an iteratee if the iteratee
  // is not a one-to-one function, so providing an iteratee will disable
  // the faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted && !iteratee) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = restArguments(function(arrays) {
    return _.uniq(flatten(arrays, true, true));
  });

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      var j;
      for (j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = restArguments(function(array, rest) {
    rest = flatten(rest, true, true);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  });

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices.
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = restArguments(_.unzip);

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values. Passing by pairs is the reverse of _.pairs.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions.
  var createPredicateIndexFinder = function(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  };

  // Returns the first index on an array-like that passes a predicate test.
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions.
  var createIndexFinder = function(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Chunk a single array into multiple arrays, each containing `count` or fewer
  // items.
  _.chunk = function(array, count) {
    if (count == null || count < 1) return [];
    var result = [];
    var i = 0, length = array.length;
    while (i < length) {
      result.push(slice.call(array, i, i += count));
    }
    return result;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments.
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = restArguments(function(func, context, args) {
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var bound = restArguments(function(callArgs) {
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    return bound;
  });

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder by default, allowing any combination of arguments to be
  // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
  _.partial = restArguments(function(func, boundArgs) {
    var placeholder = _.partial.placeholder;
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });

  _.partial.placeholder = _;

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = restArguments(function(obj, keys) {
    keys = flatten(keys, false, false);
    var index = keys.length;
    if (index < 1) throw new Error('bindAll must be passed function names');
    while (index--) {
      var key = keys[index];
      obj[key] = _.bind(obj[key], obj);
    }
  });

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = restArguments(function(func, wait, args) {
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  });

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;

    var later = function(context, args) {
      timeout = null;
      if (args) result = func.apply(context, args);
    };

    var debounced = restArguments(function(args) {
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        var callNow = !timeout;
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(this, args);
      } else {
        timeout = _.delay(later, wait, this, args);
      }

      return result;
    });

    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = null;
    };

    return debounced;
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  _.restArguments = restArguments;

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  var collectNonEnumProps = function(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  };

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`.
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object.
  // In contrast to _.map it returns an object.
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = _.keys(obj),
        length = keys.length,
        results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  // The opposite of _.object.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`.
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, defaults) {
    return function(obj) {
      var length = arguments.length;
      if (defaults) obj = Object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s).
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test.
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Internal pick helper function to determine if `obj` has key `key`.
  var keyInObj = function(value, key, obj) {
    return key in obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = restArguments(function(obj, keys) {
    var result = {}, iteratee = keys[0];
    if (obj == null) return result;
    if (_.isFunction(iteratee)) {
      if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
      keys = _.allKeys(obj);
    } else {
      iteratee = keyInObj;
      keys = flatten(keys, false, false);
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  });

  // Return a copy of the object without the blacklisted properties.
  _.omit = restArguments(function(obj, keys) {
    var iteratee = keys[0], context;
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
      if (keys.length > 1) context = keys[1];
    } else {
      keys = _.map(flatten(keys, false, false), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  });

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq, deepEq;
  eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
  };

  // Internal recursive comparison function for `isEqual`.
  deepEq = function(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
      case '[object Symbol]':
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
  var nodelist = root.document && root.document.childNodes;
  if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    return _.isNumber(obj) && isNaN(obj);
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, path) {
    if (!_.isArray(path)) {
      return has(obj, path);
    }
    var length = path.length;
    for (var i = 0; i < length; i++) {
      var key = path[i];
      if (obj == null || !hasOwnProperty.call(obj, key)) {
        return false;
      }
      obj = obj[key];
    }
    return !!length;
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  // Creates a function that, when passed an object, will traverse that object’s
  // properties down the given `path`, specified as an array of keys or indexes.
  _.property = function(path) {
    if (!_.isArray(path)) {
      return shallowProperty(path);
    }
    return function(obj) {
      return deepGet(obj, path);
    };
  };

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    if (obj == null) {
      return function(){};
    }
    return function(path) {
      return !_.isArray(path) ? obj[path] : deepGet(obj, path);
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

  // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // Traverses the children of `obj` along `path`. If a child is a function, it
  // is invoked with its parent as context. Returns the value of the final
  // child, or `fallback` if any child is undefined.
  _.result = function(obj, path, fallback) {
    if (!_.isArray(path)) path = [path];
    var length = path.length;
    if (!length) {
      return _.isFunction(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]];
      if (prop === void 0) {
        prop = fallback;
        i = length; // Ensure we don't continue iterating.
      }
      obj = _.isFunction(prop) ? prop.call(obj) : prop;
    }
    return obj;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    var render;
    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var chainResult = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_, args));
      };
    });
    return _;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return chainResult(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return chainResult(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return String(this._wrapped);
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define == 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}());

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*
@module ssp.libraries

Contains the core utilities and base classes to build high level back-end entity models that then are used by .ss services.

This code is based on SuiteScript and Commerce API.

 * Supports a simple events infrastructure (inspired on Backbone.Events)

 * Supports an Application object that can be used for high level operations like obtaining environment data,
paginated search results

 * Supports console.log, console.err, etc

 * High level utilities for mapping search results, format dates and currencies, records meta information, etc.


@class Events
A module that can be mixed in to *any object* in order to provide it with
custom events. You may bind with `on` or remove with `off` callback functions
to an event; triggering an event fires all callbacks in succession.

	var object = {};
	_.extend(object, Events);
	object.on('expand', function(){ alert('expanded'); });
	object.trigger('expand');

*/
define('Events'
,	[
		'underscore'
	]
,	function(
		_
	)
{
	'use strict';

	var slice = Array.prototype.slice
		// Regular expression used to split event strings
	,	eventSplitter = /\s+/;

	// Backbone.Events
	// -----------------
	// A module that can be mixed in to *any object* in order to provide it with
	// custom events. You may bind with `on` or remove with `off` callback functions
	// to an event; trigger`-ing an event fires all callbacks in succession.
	//
	//     var object = {};
	//     _.extend(object, Events);
	//     object.on('expand', function(){ alert('expanded'); });
	//     object.trigger('expand');
	var Events = {

		// @method on Bind one or more space separated events, `events`, to a `callback`
		// function. Passing `"all"` will bind the callback to all events fired.
		// @param {String|Array<String>} events
		// @param {Function} callback
		// @param {Object} context
		// return {Backbone.Events}
		on: function(events, callback, context)
		{
			var calls, event, node, tail, list;

			if (!callback)
			{
				return this;
			}

			events = events.split(eventSplitter);
			calls = this._callbacks || (this._callbacks = {});

			// Create an immutable callback list, allowing traversal during
			// modification.  The tail is an empty object that will always be used
			// as the next node.
			while (!!(event = events.shift())) {
				list = calls[event];
				node = list ? list.tail : {};
				node.next = tail = {};
				node.context = context;
				node.callback = callback;
				calls[event] = {tail: tail, next: list ? list.next : node};
			}

			return this;
		},

		// @method off Remove one or many callbacks. If `context` is null, removes all callbacks
		// with that function. If `callback` is null, removes all callbacks for the
		// event. If `events` is null, removes all bound callbacks for all events.
		// @param {String|Array<String>} events
		// @param {Function} callback
		// @param {Object} context
		// @return {Backbone.Events}
		off: function(events, callback, context)
		{
			var event, calls, node, tail, cb, ctx;

			// No events, or removing *all* events.
			if (!(calls = this._callbacks))
			{
				return;
			}

			if (!(events || callback || context)) {
				delete this._callbacks;
				return this;
			}

			// Loop through the listed events and contexts, splicing them out of the
			// linked list of callbacks if appropriate.
			events = events ? events.split(eventSplitter) : _.keys(calls);
			while (!!(event = events.shift())) {
				node = calls[event];
				delete calls[event];

				if (!node || !(callback || context))
				{
					continue;
				}

				// Create a new list, omitting the indicated callbacks.
				tail = node.tail;
				while ((node = node.next) !== tail) {
					cb = node.callback;
					ctx = node.context;
					if ((callback && cb !== callback) || (context && ctx !== context)) {
						this.on(event, cb, ctx);
					}
				}
			}

			return this;
		},

		// @param trigger Trigger one or many events, firing all bound callbacks. Callbacks are
		// passed the same arguments as `trigger` is, apart from the event name
		// (unless you're listening on `"all"`, which will cause your callback to
		// receive the true name of the event as the first argument).
 		// @param {String|Array<String>} events
		trigger: function(events)
		{
			var event, node, calls, tail, args, all, rest;
			if (!(calls = this._callbacks))
			{
				return this;
			}
			all = calls.all;
			events = events.split(eventSplitter);
			rest = slice.call(arguments, 1);

			// For each event, walk through the linked list of callbacks twice,
			// first to trigger the event, then to trigger any `"all"` callbacks.
			while (!!(event = events.shift())) {
				if (!!(node = calls[event])) {
					tail = node.tail;
					while ((node = node.next) !== tail) {
						node.callback.apply(node.context || this, rest);
					}
				}
				if (!!(node = all))
				{
					tail = node.tail;
					args = [event].concat(rest);
					while ((node = node.next) !== tail) {
						node.callback.apply(node.context || this, args);
					}
				}
			}

			return this;
		}
	};

	// Aliases for backwards compatibility.
	Events.bind = Events.on;
	Events.unbind = Events.off;

	return Events;
});

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

	// @function sealComponent helper method to avoid that customers overwrite the component
	// properties
	// @param {SC.BaseComponent} component component to be sealed
	// @param {String} component_name the component name
	// @private
	function sealComponent(component, component_name)
	{
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

	    return component;
	}

	// @class SC.ComponentContainer Manager of components. Extensions can get components implementations and register new component 
	// classes. A component is referenced by its name. Host application provides a container instance to extensions through 
	// method @?method SC.SC.ExtensionEntryPoint.mountToApp  TODO

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

			throw {
				status: SC.ERROR_IDENTIFIERS.invalidParameter.status
			,	code: SC.ERROR_IDENTIFIERS.invalidParameter.code
			,	message: 'Invalid component parameter, make sure you specify a componentName property and getProxy method'
			};
		}

		// @method getComponent Returns the requested component based on its name if it exists
		// @public @extlayer
		// @param {String} component_name
		// @return {SC.BaseComponent|null}
	,	getComponent: function getComponent(component_name)
		{
			return this._components[component_name] || null;
		}
	};

});

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

define('SuiteLogs',
	[
	
		'underscore'
	]
,	function (
		_
	)
{
	'use strict';

	function pad (number)
	{
		if (number < 10)
		{
			return '0' + number;
		}
		return number;
	}

	function getParameters(parameters)
	{
		return _.map(parameters, function (parameter)
		{
			var type = typeof parameter
			
			
				return type === 'string' || type === 'number' ? parameter : type;
			

			
		});
	}
	function getTime (time)
	{
		var date = new Date(time);
		
		return pad(date.getUTCHours()) +
		':' + pad(date.getUTCMinutes()) +
		':' + pad(date.getUTCSeconds()) +
		'.' + (date.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5);
	}
	function processError (e)
		{
			var status = 500
			,	code = 'ERR_UNEXPECTED'
			,	message = 'error';

			if (e instanceof nlobjError)
			{
				code = e.getCode();
				message = e.getDetails();
				status = badRequestError.status;
			}
			else if (_.isObject(e) && !_.isUndefined(e.status))
			{
				status = e.status;
				code = e.code;
				message = e.message;
			}
			else
			{
				var error = nlapiCreateError(e);
				code = error.getCode();
				message = (error.getDetails() !== '') ? error.getDetails() : error.getCode();
			}

			if (code === 'INSUFFICIENT_PERMISSION')
			{
				status = forbiddenError.status;
				code = forbiddenError.code;
				message = forbiddenError.message;
			}

			var content = {
				errorStatusCode: parseInt(status,10).toString()
			,	errorCode: code
			,	errorMessage: message
			};

			if (e.errorDetails)
			{
				content.errorDetails = e.errorDetails;
			}

			return content;
		}

	var LOG = function (name, parameters, level, parent)
	{

		this.start = new Date().getTime();
		this.name = name;
		this.parameters = getParameters(parameters);
		this.level = level;
		this.ts = this.start - __sc_ssplibraries_t0;
		this.parent = parent

		return this;
	}

	LOG.prototype.finish = function (error)
	{
		if (this.end)
		{
			return;
		}
		if (error)
		{
			this.error = processError(error);
		}
		this.end = new Date().getTime();
		this.duration = this.end - this.start;
	};

	LOG.prototype.toJSON = function ()
	{
		this.finish();

		return {
				pid: 1
			,	tid: 1
			,	ts: this.ts
			,	dur: this.duration
			,	name: this.name
			,	ph: 'X'
			,	args: {
					ms: this.duration 
				,	_nestLevel: this.level
				,	_startTime: getTime(this.start)
				,	_endTime: getTime(this.end)
				,	_durationMS: this.duration
				,	_mainMessage: this.name
				,	error: this.error
				,	parameters : this.parameters
			}
		}
	};

	var LOGS = []
	,	LEVEL = 0
	,	CURRENT_NODE = new LOG('ROOT', null, LEVEL);

	return {
		start: function (name, parameters)
		{
			CURRENT_NODE = new LOG(name, parameters, LEVEL, CURRENT_NODE);
			LOGS.push(CURRENT_NODE);
			LEVEL = LEVEL + 1;
		}
	,	end: function (error)
		{
			LEVEL = LEVEL === 0 ? 0 : LEVEL - 1;
			CURRENT_NODE.finish(error);
			CURRENT_NODE = CURRENT_NODE.parent ? CURRENT_NODE.parent : CURRENT_NODE;
		}
	,	toJSON: function ()
		{
			return {
				TOTALTIME: new Date().getTime() - __sc_ssplibraries_t0
			,	traceEvents: _.map(LOGS, function (log){ return log.toJSON()})
			}
		}
	}
});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module SC
define('SC.Models.Init'
	, [
		'underscore'
	,	'SuiteLogs'
	]
	, function (
		_
	,	SuiteLogs
	)
	{
		'use strict';

		var wrapped_objects = {}
		,	suite_script_functions_to_wrap = [
				'nlapiCreateSearch'
			,	'nlapiLoadRecord'
			,	'nlapiSearchRecord'
			,	'nlapiSubmitRecord'
			,	'nlapiCreateRecord'
			,	'nlapiLookupField'
			,	'nlapiSubmitField'
			,	'nlapiCreateFile'
			,	'nlapiDeleteFile'
			,	'nlapiLoadFile'
			,	'nlapiSubmitFile'
			,	'nlapiTransformRecord'
			,	'nlapiVoidTransaction'
			,	'nlapiLoadSearch'
			,	'nlapiLoadConfiguration'
			,	'nlapiSubmitConfiguration'
			,	'nlapiGetLogin'
			]
		,	container = null
			, session = null
			, customer = null
			, context = null
			, order = null;

		// only initialize vars when the context actually have the functions
		switch (nlapiGetContext().getExecutionContext())
		{
		case 'suitelet':
			context = nlapiGetContext();
			break;
		case 'webstore':
		case 'webservices':
		case 'webapplication':
			container = nlapiGetWebContainer();
			session = container.getShoppingSession();
			customer = session.getCustomer();
			context = nlapiGetContext();
			order = session.getOrder();
			break;
		default:
			break;
		}

		function wrapObject(object, class_name)
		{
			if (!wrapped_objects[class_name])
			{
				wrapped_objects[class_name] = {};

				for (var method_name in object)
				{
					if (method_name !== 'prototype')
					{
						wrapped_objects[class_name][method_name] = wrap(object, method_name, class_name);
					}
				}
			}

			return wrapped_objects[class_name];
		}

		function wrap(object, method_name, class_name, original_function)
		{
			return function ()
			{
				var result
				,	function_name = class_name + '.' + method_name + '()';
			
				SuiteLogs.start(function_name, arguments);

				try
				{
					if (original_function)
					{
						result = original_function.apply(object, arguments);
					}
					else
					{
						result = object[method_name].apply(object, arguments);
					}
					SuiteLogs.end();
				}
				catch (e)
				{
					SuiteLogs.end(e);

					throw e;
				}

				return result;
			};
		}

		if (window.suiteLogs)
		{
			_.each(suite_script_functions_to_wrap, function (method_name)
			{
				this[method_name] = wrap(this, method_name, 'SuiteScript', this[method_name]);
			}, this);

			return {
				container: wrapObject(container, 'WebContainer')
				, session: wrapObject(session, 'ShoppingSession')
				, customer: wrapObject(customer, 'Customer')
				, context: wrapObject(context, 'Context')
				, order: wrapObject(order, 'Order')
			};
		}
		else
		{
			return {
				container: container
				, session: session
				, customer: customer
				, context: context
				, order: order
			};
		}
	});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ssp.libraries
define('Utils'
	, [
		'SC.Models.Init'
		, 'underscore'
	]
	, function (
		ModelsInit
		, _
	)
	{
		'use strict';

		function _getColumnLabel(column)
		{
			var formula = column.getFormula();
			if (formula)
			{
				// if the column is a formula prefer the label
				// because the name is autogenerated: 'formulanumeric' or similar
				return column.getLabel() || column.getName();
			}
			else
			{
				return column.getName();
			}
		}

		// @class Utils contain global utility methods from high level API for searching records, format currencies, record type meta information, etc
		var Utils = {

			//@function deepCopy Deep Copy of the object taking care of Backbone models
			//@param {Object} obj Object to be copy
			//@return {Object}
			deepCopy: function deepCopy(obj)
			{

				if (_.isFunction(obj) || this.isInstanceOfnlobjRecord(obj))
				{
					return null;
				}

				var copy = {}
					, self = this;

				if (_.isArray(obj))
				{
					copy = [];
					_.each(obj, function (value)
					{
						!_.isFunction(value) && copy.push(self.deepCopy(value));
					});
				}
				else if (_.isObject(obj))
				{
					for (var i = 0; i < Object.keys(obj).length; i++)
					{
						var attr = Object.keys(obj)[i];
						var value = obj[attr];
						if (!_.isFunction(value) && _.isString(attr) && attr.indexOf('_') !== 0)
						{
							copy[attr] = self.deepCopy(value);
						}
					}
				}
				else
				{
					copy = obj;
				}

				return copy;
			}

			, isInstanceOfnlobjRecord: function (record)
			{
				return record && !_.isString(record) && !_.isNumber(record) && !_.isBoolean(record) &&
					_.isFunction(record.getRecordType) && _.isFunction(record.getId);
			}

			// @method isDateType
			// @param {string}
			// @returns {Boolean}
			, isDateType: function (field)
			{
				//Return true if the type of this field is expected to be date.
				return field === 'trandate' || field === 'createddate' || field === 'datecreated';
			}

			, transformDateFormat: function (format)
			{
				// Format conversion
				// Suitescript value - moment value
				//
				// Date format
				// 	"fmMM/DDfm/YYYY" ~ MM/DD/YYYY
				// 	"fmDD/MMfm/YYYY" ~ DD/MM/YYYY
				// 	"fmDD-Monfm-YYYY" ~ DD-MMM-YYYY
				// 	"fmDD.MMfm.YYYY" ~ DD.MM.YYYY
				// 	"fmDD-MONTHfm-YYYY" ~ DD-MMMM-YYYY
				// 	"fmDD MONTHfm", YYYY ~ DD MMMM, YYYY
				// 	"YYYY-fmMM-DDfm" ~ YYYY-MM-DD
				// 	"DD/MM/YYYY" ~ DD/MM/YYYY
				// 	"DD-Mon-YYYY" ~ DD-MMM-YYYY
				// 	"DD-MONTH-YYYY" ~ DD-MMMM-YYYY
				//
				// LongDate Format
				// 	"fmDD Monthfm YYYY" ~ DD MMMM YYYY
				// 	"fmMonth DDfm, YYYY" ~ MMMM DD, YYYY
				//	"YYYY fmMonth DDfm" ~ YYYY MMMM DD
				// 	"Month DD, YYYY" ~ MMMM DD, YYYY
				// 	"DD Month YYYY" ~ DD MMMM, YYYY
				// 	"YYYY Month DD" ~ YYYY MMMM DD

				return format.toUpperCase()
					.replace('FMMM', 'MM')
					.replace('MMFM', 'MM')
					.replace('FMDD', 'DD')
					.replace('DDFM', 'DD')
					.replace('MONTHFM', 'MMMM')
					.replace('FMMONTH', 'MMMM')
					.replace('MONTH', 'MMMM')
					.replace('MONFM', 'MMM')
					.replace('FMMON', 'MMM')
					.replace('MON', 'MMM');
			}

			, transformTimeFormat: function (format)
			{
				// Format conversion
				// Suitescript value - moment value
				//"fmHH:fmMI am" ~ hh:mm A
				//"fmHH24:fmMI" ~ HH:mm
				//"fmHH-fmMI am" ~ hh-mm A
				//"fmHH24-fmMI" ~ HH-mm

				return format.toUpperCase()
					.replace('FMHH', 'hh')
					.replace('FMMI', 'mm')
					.replace('hh24', 'HH')
					.replace('AM', 'A');
			}

			// @method mapSearchResult
			// @param {Array<nlobjSearchColumn>}
			// @param {nlobjSearchColumn} apiElement columns
			// @returns {Object}
			, mapSearchResult: function mapSearchResult(columns, apiElement)
			{
				var element = {};

				columns.forEach(function (column)
				{
					var col = column.searchColumn
						, name = col.getName()
						, text = apiElement.getText(name, col.getJoin(), col.getSummary())
						, value = apiElement.getValue(name, col.getJoin(), col.getSummary())
						, has_function = col.getFunction()
						, fieldName = column.fieldName
						, is_datetype = Utils.isDateType(fieldName);

					//If this field is trandate, datecreated or createddate and has no functions associated, we apply the nlapiStringToDate
					//	function to convert this field in a date (ISO 8601 - https://www.w3.org/TR/NOTE-datetime).
					element[fieldName] = is_datetype && !has_function ? nlapiStringToDate(value) : value;

					if (text)
					{
						element[fieldName + '_text'] = text;
					}
				});
				return element;
			}

			// @method mapSearchResults Extracts search results to a JSON-friendly format.
			// @param {Array<nlobjSearchColumn>} searchColumns
			// @param {Array<nlobjSearchResult>} searchResults
			// @return {Array<nlobjSearchResult>} mapped results
			// @private
			, mapSearchResults: function mapSearchResults(searchColumns, searchResults)
			{
				if (!searchColumns || !searchResults)
				{
					return [];
				}

				var nameToCol = {} // mapping columnName -> columns with that name
					, columns = []; // array of { searchColumn: (nlobjSearchColumn), fieldName: (name in result) }

				// detect columns with the same name
				_.each(searchColumns, function (col)
				{
					var name = _getColumnLabel(col);
					columns.push(
					{
						searchColumn: col
					});
					nameToCol[name] = (nameToCol[name] || 0) + 1;
				});
				// sets fieldNames for each column
				_.each(columns, function (column)
				{
					var searchColumn = column.searchColumn
						, isANameClash = nameToCol[_getColumnLabel(searchColumn)] > 1
						, coulumnJoim = searchColumn.getJoin();

					column.fieldName = _getColumnLabel(searchColumn);
					if (isANameClash && coulumnJoim)
					{
						column.fieldName += '_' + coulumnJoim;
					}
				});

				return searchResults.map(function (apiElement)
				{
					return Utils.mapSearchResult(columns, apiElement);
				});
			}

			// @method mapLoadResult
			// @param {Array<nlobjSearchColumn>} columns
			// @param {nlobjRecord} record
			// @return {Object}
			, mapLoadResult: function mapLoadResult(columns, record)
			{
				var record_info = {};
				columns.forEach(function (name)
				{
					var value = record.getFieldValue(name);
					if (name === 'image' && !!value)
					{
						var imageRecord = nlapiLoadFile(value);
						if (!!imageRecord)
						{
							record_info[name] = imageRecord.getURL();
						}
						else
						{
							record_info[name] = '';
						}
					}
					else
					{
						record_info[name] = value;
					}
				});
				return record_info;
			}

			, loadAndExecuteSearch: function loadAndExecuteSearch(searchName, filters)
			{
				var savedSearch = nlapiLoadSearch(null, searchName);
				var filtersSS = savedSearch.getFilters();
				savedSearch.setFilterExpression(filters);
				savedSearch.addFilters(filtersSS);
				var runSearch = savedSearch.runSearch();
				var searchResults = runSearch.getResults(0, 1000);
				return Utils.mapSearchResults(savedSearch.getColumns(), searchResults);
			}

			// @method loadAndMapSearch
			// @param {String}searchName
			// @param {Array<nlobjSearchFilter>} filters
			// @return {Array<nlobjSearchResult>} mapped results
			, loadAndMapSearch: function loadAndMapSearch(searchName, filters)
			{
				var savedSearch;
				filters = filters || [];

				try
				{
					savedSearch = nlapiLoadSearch(null, searchName);
				}
				catch (err)
				{
					console.log('Unable to load search ' + searchName, err);
					return [];
				}
				var searchResults = nlapiSearchRecord(null, searchName, filters);
				return Utils.mapSearchResults(savedSearch.getColumns(), searchResults);
			}


			/**
			 * @method mapOptions @param {String} record_options
			 */
			, mapOptions: function mapOptions(record_options)
			{
				var options_rows = record_options.split('\u0004');
				var options_items = options_rows.map(function (row)
				{
					return row.split('\u0003');
				});
				var options = {};
				options_items.forEach(function (item)
				{
					options[item[0]] = {
						name: item[0]
						, desc: item[2]
						, value: item[3]
					};
				});
				return options;
			}

			/**
			 * @method makeid @param {Number} maxLength
			 */
			, makeid: function makeid(maxLength)
			{
				return Math.random().toString(36).substring(2, (maxLength + 2) || 5);
			}

			/**
			 * @method getMolecule
			 * @param {nlobjRequest} request
			 * @returns {String}
			 *		''		system
			 *		'f'		system.f
			 *		'p'		system.p
			 *		'na1.f'	system.na1.f
			 */
			, getMolecule: function getMolecule(request)
			{
				var regex = /https:\/\/system(.*)\.netsuite\.com/;
				var molecule = request.getURL().match(regex);
				return molecule && molecule[1] || '';
			}

			// @method formatReceiptCurrency @param {String|Number} value
			, formatReceiptCurrency: function formatReceiptCurrency(value)
			{
				var parsedValue = parseFloat(value);
				if (parsedValue < 0)
				{
					if (value.substring)
					{
						return '($ ' + value.substring(1) + ')';
					}

					return '($ ' + value.toFixed(2).substring(1) + ')';
				}

				return '$ ' + parsedValue.toFixed(2);
			}


			// @method sanitizeString Remove any HTML code form the string
			// @param {String} text String with possible HTML code in it
			// @return {String} HTML-free string
			, sanitizeString: function (text)
			{
				return text ? text.replace(/<br>/g, '\n').replace(/</g, '&lt;').replace(/\>/g, '&gt;') : '';
			}

			// @method formatCurrency @param {String} value @param {String} symbol
			, formatCurrency: function (value, symbol)
			{
				var value_float 
				, 	beforeValue = true;

				if (!value || isNaN(value))
				{
					value_float = parseFloat(0); //return value;
				}else{
					value_float = parseFloat(value); //return value;
				}

				var negative = value_float < 0;
				value_float = Math.abs(value_float);
				value_float = parseInt((value_float + 0.005) * 100, 10) / 100;

				var value_string = value_float.toString()
				, groupseparator = ','
					, decimalseparator = '.'
					, negativeprefix = '('
					, negativesuffix = ')'
					, settings = SC && SC.ENVIRONMENT && SC.ENVIRONMENT.siteSettings ? SC.ENVIRONMENT.siteSettings :
					{};

				if (window.hasOwnProperty('groupseparator'))
				{
					groupseparator = window.groupseparator;
				}
				else if (settings.hasOwnProperty('groupseparator'))
				{
					groupseparator = settings.groupseparator;
				}

				if (window.hasOwnProperty('decimalseparator'))
				{
					decimalseparator = window.decimalseparator;
				}
				else if (settings.hasOwnProperty('decimalseparator'))
				{
					decimalseparator = settings.decimalseparator;
				}

				if (window.hasOwnProperty('negativeprefix'))
				{
					negativeprefix = window.negativeprefix;
				}
				else if (settings.hasOwnProperty('negativeprefix'))
				{
					negativeprefix = settings.negativeprefix;
				}

				if (window.hasOwnProperty('negativesuffix'))
				{
					negativesuffix = window.negativesuffix;
				}
				else if (settings.hasOwnProperty('negativesuffix'))
				{
					negativesuffix = settings.negativesuffix;
				}

				value_string = value_string.replace('.', decimalseparator);
				var decimal_position = value_string.indexOf(decimalseparator);

				// if the string doesn't contains a .
				if (!~decimal_position)
				{
					value_string += decimalseparator + '00';
					decimal_position = value_string.indexOf(decimalseparator);
				}
				// if it only contains one number after the .
				else if (value_string.indexOf(decimalseparator) === (value_string.length - 2))
				{
					value_string += '0';
				}

				var thousand_string = '';
				for (var i = value_string.length - 1; i >= 0; i--)
				{
					//If the distance to the left of the decimal separator is a multiple of 3 you need to add the group separator
					thousand_string = (i > 0 && i < decimal_position && (((decimal_position - i) % 3) === 0) ? groupseparator : '') + value_string[i] + thousand_string;
				}

				var currencies = ModelsInit.session.getSiteSettings(['currencies']).currencies;

				if (!symbol)
				{
					if (typeof ModelsInit.session !== 'undefined' && ModelsInit.session.getShopperCurrency)
					{
						try
						{
							symbol = ModelsInit.session.getShopperCurrency().symbol;
						}
						catch (e)
						{}
					}
					else if (settings.shopperCurrency)
					{
						symbol = settings.shopperCurrency.symbol;
					}
					else if (SC && SC.ENVIRONMENT && SC.ENVIRONMENT.currentCurrency)
					{
						symbol = SC.ENVIRONMENT.currentCurrency.symbol;
					}

					if (!symbol)
					{
						symbol = '$';
					}
				}

				var matchingcurrency;

				if(!isNaN(symbol)){
					matchingcurrency = _.findWhere(currencies, {
						internalid: symbol
					});
				}else{
					matchingcurrency = _.findWhere(currencies, {
						symbol: symbol
					});
				}

				if(matchingcurrency){
					beforeValue = (matchingcurrency.symbolplacement == 1);
					symbol = matchingcurrency.symbol;
				}
			
				var aux = negative ? (negativeprefix + thousand_string + negativesuffix) : thousand_string;
				value_string = beforeValue ? symbol + aux : aux + symbol;

				return value_string;
			}
			

			, isDepartmentMandatory: function (record)
			{
				if (record)
				{
					var field = record.getField('department');

					return field && field.mandatory;
				}
				else
				{
					var department_mandatory = this._getAccountingPreferenceField('DEPTMANDATORY');

					return department_mandatory === 'T';
				}

			}

			, isLocationMandatory: function ()
			{
				var location_mandatory = this._getAccountingPreferenceField('LOCMANDATORY');

				return location_mandatory === 'T';
			}

			, isClassMandatory: function ()
			{

				var class_mandatory = this._getAccountingPreferenceField('CLASSMANDATORY');

				return class_mandatory === 'T';
			}

			, isFulfillmentRequestEnabled: function ()
			{
				return this.isFeatureEnabled('FULFILLMENTREQUEST');
			}

			, isFeatureEnabled: function (feature)
			{
				return ModelsInit.context.getFeature(feature);
			}

			// @method isCheckoutDomain determines if we are in a secure checkout
			// domain or in a secure single domain environment
			// @return {Boolean} true if in checkout or in single domain
			, isCheckoutDomain: function isCheckoutDomain()
			{
				return ModelsInit.session.isCheckoutSupported();
			}

			// @method isShoppingDomain determines if we are in shopping domain (secure or non secure)
			//  or in a secure single domain environment
			// @return {Boolean} true if in shopping or single domain
			, isShoppingDomain: function isShoppingDomain()
			{
				return ModelsInit.session.isShoppingSupported();
			}

			// @method isSingleDomain determines if we are in a single domain environment
			// @return {Boolean} true if single domain
			, isSingleDomain: function isSingleDomain()
			{
				return this.isShoppingDomain() && this.isCheckoutDomain();
			}

			// @method isInShopping determines if we are in shopping ssp
			// @return {Boolean} true if in shopping domain, false if in checkout or myaccount
			, isInShopping: function isInShopping(request)
			{
				return this.isShoppingDomain() && (request.getHeader('X-SC-Touchpoint') === 'shopping' || request.getParameter('X-SC-Touchpoint') === 'shopping');
			}

			, isHttpsSupported: function isHttpsSupported()
			{
				return ~ModelsInit.session.getSiteSettings(['touchpoints']).touchpoints.home.indexOf('https');
			}

			// @method isInCheckout determines if we are in checkout ssp or my account ssp
			// @return {Boolean} true if in checkout domain
			, isInCheckout: function isInCheckout(request)
			{
				var self = this;

				if (!self.isSingleDomain())
				{
					return self.isCheckoutDomain();
				}
				else
				{
					var paypal_complete = ModelsInit.context.getSessionObject('paypal_complete') === 'T'
						, is_in_checkout = request.getHeader('X-SC-Touchpoint') === 'checkout' ||
						request.getHeader('X-SC-Touchpoint') === 'myaccount' ||
						request.getParameter('X-SC-Touchpoint') === 'checkout' ||
						request.getParameter('X-SC-Touchpoint') === 'myaccount';

					return self.isCheckoutDomain() && (is_in_checkout || paypal_complete);
				}
			}

			// Not used for now because there is only Full permissions on accountingpreferences
			, _isAccountingPreferenceEnabled: function (preference)
			{
				var accounting_preferences;

				try
				{
					accounting_preferences = nlapiLoadConfiguration('accountingpreferences');
				}
				catch (err)
				{
					// The operation requires "Accounting Preferences" permission.
					// Validation is ommited if the user doesn't have it.
					return;
				}

				return accounting_preferences.getFieldValue(preference) === 'T';
			}

			, _getAccountingPreferenceField: function (preference)
			{
				try
				{
					var context = ModelsInit.context
						, accounting_preferences = context.getPreference(preference);

					return accounting_preferences;
				}
				catch (err)
				{
					return;
				}
			}

			// @method toCurrency @param {String} amount @return {Number}
			, toCurrency: function (amount)
			{
				var r = parseFloat(amount);

				return isNaN(r) ? 0 : r;
			}

			// @method recordTypeExists returns true if and only if the given record type name is present in the current account - useful for checking if a bundle is installed or not in this account.
			// @param {String} record_type_name @return{Boolean}
			, recordTypeExists: function (record_type_name)
			{
				try
				{
					nlapiCreateSearch(record_type_name, null, [], []);
				}
				catch (error)
				{
					return false;
				}
				return true;
			}

			// @method recordTypeHasField returns true if and only if the given field_name exists on the given record_type_name.
			// @param {String} record_type_name @param {String} field_name @return {Boolean}
			, recordTypeHasField: function (record_type_name, field_name)
			{
				try
				{
					nlapiLookupField(record_type_name, 1, field_name);
					return true;
				}
				catch (error)
				{
					return false;
				}
			}


			, getTransactionType: function (internalid)
			{
				try
				{
					return nlapiLookupField('transaction', internalid, 'recordtype');
				}
				catch (error)
				{
					return '';
				}

			}

			//@method getItemOptionsObject Parse an item string options into an object
			//@param {String} options_string String containg all item options
			//@return {Utils.ItemOptionsObject} Returns an object with the properties: id, name, value, displayvalue and mandatory
			, getItemOptionsObject: function (options_string)
			{
				var options_object = [];

				if (options_string && options_string !== '- None -')
				{
					var split_char_3 = String.fromCharCode(3)
						, split_char_4 = String.fromCharCode(4);

					_.each(options_string.split(split_char_4), function (option_line)
					{
						option_line = option_line.split(split_char_3);
						//@class Utils.ItemOptionsObject
						options_object.push(
						{
							//@property {String} id
							id: option_line[0] //OPTION INTERNAL ID (lowercase)
								//@property {String} name
							, name: option_line[2] //OPTION LABEL
								//@property {String} value
							, value: option_line[3] // TO REMOVE
								//@property {String} displayValue
							, displayvalue: option_line[4] // TO REMOVE
								//@property {String} mandatory
							, mandatory: option_line[1] // Boolean

							//,	value: {label: option_line[4], internalid: option_line[3]}
						});
						//@class Utils
					});
				}

				return options_object;
			}

			// @method setPaymentMethodToResult @param {nlobjRecord} record @param {Object} result
			, setPaymentMethodToResult: function (record, result)
			{
				var paymentmethod = {
						type: record.getFieldValue('paymethtype')
						, primary: true
						, name: record.getFieldText('paymentmethod')
					}
					, ccnumber = record.getFieldValue('ccnumber');

				if (ccnumber)
				{
					paymentmethod.type = 'creditcard';

					paymentmethod.creditcard = {
						ccnumber: ccnumber
						, ccexpiredate: record.getFieldValue('ccexpiredate')
						, ccname: record.getFieldValue('ccname')
						, internalid: record.getFieldValue('creditcard')
						, paymentmethod:
						{
							ispaypal: 'F'
							, name: record.getFieldText('paymentmethod')
							, creditcard: 'T'
							, internalid: record.getFieldValue('paymentmethod')
						}
					};
				}

				if (record.getFieldValue('ccstreet'))
				{
					paymentmethod.ccstreet = record.getFieldValue('ccstreet');
				}

				if (record.getFieldValue('cczipcode'))
				{
					paymentmethod.cczipcode = record.getFieldValue('cczipcode');
				}

				if (record.getFieldValue('terms'))
				{
					paymentmethod.type = 'invoice';

					paymentmethod.purchasenumber = record.getFieldValue('otherrefnum');

					paymentmethod.paymentterms = {
						internalid: record.getFieldValue('terms')
						, name: record.getFieldText('terms')
					};
				}

				result.paymentmethods = [paymentmethod];
			}

			//@method trim Remove starting and ending spaced from the passed in string
			//@param {String} str
			//@return {String}
			, trim: function trim(str)
			{
				return str.replace(/^\s+|\s+$/gm, '');
			}

			//@method stringEndsWith Indicate if the first string ends with the second one
			//@para {String} str Original string used to check it end
			//@param {String} suffix
			//@return {Boolean}
			, stringEndsWith: function (str, suffix)
			{
				return str.indexOf(suffix, str.length - suffix.length) !== -1;
			}

			, getPathFromObject: function (object, path, default_value)
				{
					if (!path)
					{
						return object;
					}
					else if (object)
					{
						var tokens = path.split('.')
							, prev = object
							, n = 0;

						while (!_.isUndefined(prev) && n < tokens.length)
						{
							prev = prev[tokens[n++]];
						}

						if (!_.isUndefined(prev))
						{
							return prev;
						}
					}

					return default_value;
				}
				// @method setPathFromObject @param {Object} object @param {String} path a path with values separated by dots @param {Any} value the value to set
			, setPathFromObject: function (object, path, value)
			{
				if (!path)
				{
					return;
				}
				else if (!object)
				{
					return;
				}

				var tokens = path.split('.')
					, prev = object;

				for (var token_idx = 0; token_idx < tokens.length - 1; ++token_idx)
				{
					var current_token = tokens[token_idx];

					if (_.isUndefined(prev[current_token]))
					{
						prev[current_token] = {};
					}
					prev = prev[current_token];
				}

				prev[_.last(tokens)] = value;
			}

			// @method getTodayDate @return {Date}
			, getTodayDate: function ()
			{
				this.today = this.today || new Date().getTime();
				return new Date(this.today);
			}

			, removeSecondsFromDateTimeField: function removeSecondsFromDateTimeField(value)
			{
				if (value)
				{
					var aux = value.split(':')
						, result = aux[0] + ':' + aux[1];

					if (aux.length === 3)
					{
						var ampm = aux[2].split(' ')[1];
						result += ' ' + ampm;
					}

					return nlapiStringToDate(result);
				}
				else
				{
					return null;
				}
			}

			//@method getCurrencyById Get currency by internalid
			//@return {Currency}
		,	getCurrencyById: function (currency_id)
			{
				var selected_currency
				,	siteSettings_currencies = ModelsInit.session.getSiteSettings(['currencies']);

				if (currency_id && siteSettings_currencies) {
					selected_currency = _.find(siteSettings_currencies.currencies, function (currency)
					{
						return currency.internalid === currency_id;
					});				
				}
				
				return selected_currency;
			}				
		};

		return Utils;
	});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

define('Console'
,	[
		'underscore'
	]
,	function (
		_
	)
{
	'use strict';

	// Create server side console
	// use to log on SSP application
	if (typeof console === 'undefined') {
		console = {};
	}
	// Maximum length for details and title for nlapiLogExecution.
	// Actual maxTitleLength is 99, setting to 95 to use the remaining characters to make "pagination" possible.
	var maxDetailsLength = 3995
	,	maxTitleLength = 95;

	/* Mostly to display the actual UNEXPECTED_ERROR */
	function basicClone(value)
	{
		var t = typeof value;
		if (t === 'function')
		{
			return 'function';
		}
		else if (!value || t !== 'object')
		{
			return value;
		}
		else
		{
			var o = {};
			Object.keys(value).forEach(function (key)
			{
				var val = value[key];
				var t2 = typeof(val);
				if (t2 === 'string' || t2 === 'number' || t2 === 'boolean')
				{
					o[key] = val;
				}
				else
				{
					o[key] = t2;
				}
			});
			return o;
		}
	}

	function stringify(value)
	{
		if (value && value.toJSON)
		{
			return value.toJSON();
		}
		else
		{
			value = basicClone(value);
			return JSON.stringify(value);
		}
	}

	// Pass these methods through to the console if they exist, otherwise just
	// fail gracefully. These methods are provided for convenience.
	var console_methods = 'assert clear count debug dir dirxml exception group groupCollapsed groupEnd info log profile profileEnd table time timeEnd trace warn'.split(' ')
	,	idx = console_methods.length
	,	noop = function(){};

	while (--idx >= 0)
	{
		var method = console_methods[idx];

		if (typeof console[method] === 'undefined')
		{
			console[method] = noop;
		}
	}

	if (typeof console.memory === 'undefined')
	{
		console.memory = {};
	}

	_.each({'log': 'DEBUG', 'info': 'AUDIT', 'error': 'EMERGENCY', 'warn': 'ERROR'}, function (value, key)
	{
		console[key] = function ()
		{
			var title, details;
			if (arguments.length > 1)
			{
				title = arguments[0];
				title = typeof title === 'object'? stringify(title): title;
				details = arguments[1];
				details = typeof details === 'object'? stringify(details): details;
			}
			else
			{
				title = '';
				details = arguments[0] || 'null';
			}
			if(details && details.length > maxDetailsLength)
			{
				details = details.match(new RegExp('.{1,' + maxDetailsLength + '}', 'g'));
			}
			else
			{
				details = [details];
			}
			_.each(details, function(detail, key, list)
			{
				var newTitle = list.length > 1 ? title.substring(0, maxTitleLength) + '(' + (key + 1) + ')' : title;
				nlapiLogExecution(value, newTitle, detail);
			});
		};
	});

	_.extend(console, {

		timeEntries: []

	,	trace: function()
		{
			try {
				''.foobar();
			}
			catch(err)
			{
				var stack = err.stack.replace(/^[^\(]+?[\n$]/gm, '')
      				.replace(/^\s+at\s+/gm, '')
      				.replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
      				.split('\n');
  				console.log(stack);
			}
		}

	,	time: function (text)
		{
			if (typeof text === 'string')
			{
				console.timeEntries[text] = Date.now();
			}
		}

	,	timeEnd: function (text)
		{
			if (typeof text === 'string')
			{
				if (!arguments.length)
				{
					console.warn('TypeError:', 'Not enough arguments');
				}
				else
				{
					if (typeof console.timeEntries[text] !== 'undefined')
					{
						console.log(text + ':', Date.now() - console.timeEntries[text] + 'ms');
						delete console.timeEntries[text];
					}
				}
			}
		}
	});

	return console;
});

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//Backend Configuration file
// @module ssp.libraries
// @class Configuration Backend Configuration file
define('Configuration'
,	[
		'Utils'
	,	'underscore'
	,	'SC.Models.Init'
	,	'Console'
	]
,	function(
		Utils
	,	_
	,	ModelsInit
	)
{
	'use strict';
	function deepExtend(target, source)
	{
		if(_.isArray(target) || !_.isObject(target))
		{
			return source;
		}
		_.each(source, function(value, key)
		{
			if(key in target)
			{
				target[key] = deepExtend(target[key], value);
			}
			else
			{
				target[key] = value;
			}
		});
		return target;
	}
	function adaptValuestoOldFormat(configurationObj){
		//Adapt the values of multiDomain.hosts.languages and multiDomain.hosts.currencies to the structure requiered by hosts
		configurationObj.hosts = [];
		if (configurationObj.multiDomain && configurationObj.multiDomain.hosts && configurationObj.multiDomain.hosts.languages)
		{
			_.each(configurationObj.multiDomain.hosts.languages, function(language)
			{
				var storedHost = _.find(configurationObj.hosts, function(host)
				{
					return host.title === language.host;
				});

				function getLanguageObj()
				{
					return {
						title: language.title
						,	host: language.domain
						,	locale: language.locale
					};
				}

				if (!storedHost)
				{
					configurationObj.hosts.push(
						{
							title: language.host
							,	languages: [
							getLanguageObj()
						]
							,	currencies: _.filter(configurationObj.multiDomain.hosts.currencies, function(currency)
						{
							return currency.host === language.host;
						})
						});
				}
				else
				{
					storedHost.languages.push(
						getLanguageObj()
					);
				}
			});
		}

		configurationObj.categories = ModelsInit.context.getSetting('FEATURE', 'COMMERCECATEGORIES') === 'T' ? configurationObj.categories : false;

		/* globals __sc_ssplibraries_t0 */
		if (typeof(__sc_ssplibraries_t0) !== 'undefined')
		{
			configurationObj.__sc_ssplibraries_time = new Date().getTime() - __sc_ssplibraries_t0;
		}
	}

	function Configuration(config)
	{
		var effectiveDomain = config.domain || ModelsInit.session.getEffectiveShoppingDomain();
		var effectiveSiteId = config.siteId || ModelsInit.session.getSiteSettings(['siteid']).siteid;
		/* globals ConfigurationManifestDefaults */
		this.configurationProperties = typeof (ConfigurationManifestDefaults) === 'undefined' ? {} : ConfigurationManifestDefaults;
		// then we read from the record, if any, and mix the values with the default values in the manifest.
		if (Utils.recordTypeExists('customrecord_ns_sc_configuration'))
		{
			var config_key = effectiveDomain ? effectiveSiteId + '|' + effectiveDomain : effectiveSiteId + '|all'
			,	search = nlapiCreateSearch('customrecord_ns_sc_configuration', [new nlobjSearchFilter('custrecord_ns_scc_key', null, 'is', config_key)], [new nlobjSearchColumn('custrecord_ns_scc_value')])
			,	result = search.runSearch().getResults(0, 1000);
			var configuration = result.length && JSON.parse((result[result.length - 1]).getValue('custrecord_ns_scc_value')) || {};
			//add default values defined by extesions
			if (configurationExtensions[effectiveDomain])
			{
				this.configurationProperties = deepExtend(this.configurationProperties, configurationExtensions[effectiveDomain]);
			}
			//override with default values with the ones in the configuration record
			this.configurationProperties = deepExtend(this.configurationProperties, configuration);
			adaptValuestoOldFormat(this.configurationProperties);
		}
	}
	Configuration.prototype = {
		get: function(path, defaultValue){
			if (!path){
				return this.configurationProperties;
			}else{
				return Utils.getPathFromObject(this.configurationProperties, path, defaultValue);
			}
		},
		set: function(path, newValue){
			Utils.setPathFromObject(this.configurationProperties, path, newValue);
		}
	};
	/*
	* Default singleton configuration object
	* */
	var configuration = null;
	var configurationExtensions = {};
	var config = {};
	function initializeSingleton(){
		if (!configuration) {
			configuration = new Configuration(config);
		}
	}
	Configuration.get = function(path, defaultValue){
		initializeSingleton();
		return configuration.get(path, defaultValue);
	};
	Configuration.set = function(path, newValue){
		initializeSingleton();
		configuration.set(path, newValue);
	};
	/**
	 * Overwrite configuration values, by domain
	 * @param extensions is an object with domain as attributes and configuration values as value of each domaing. e.g. {'mydomain.com': {}}
	 */
	Configuration.overwriteByDomain = function(extensions){
		configuration = null;
		configurationExtensions = extensions;
	}
	/**
	 * @param configParam Object with configurations to be used when the singleton configuration object is created. e.g. {domain: '', siteId: 1}
	 */
	Configuration.setConfig = function(configParam){
		configuration = null;
		config = configParam;
	}
	return Configuration;
});

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module SspLibraries
define(
	'Application.Error'
	, []
	, function ()
	{
		'use strict';

		return {
			//@property {Object} badRequestError
			badRequestError:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'ERR_BAD_REQUEST'
					// @property {String} message
				, message: 'SCIS cannot compute this request. Try again.'
			}

			//@property {Object} unauthorizedError
			, unauthorizedError:
			{
				// @property {Number} status
				status: 401
					// @property {String} code
				, code: 'ERR_USER_NOT_LOGGED_IN'
					// @property {String} message
				, message: 'You are not logged in.'
			}

			//@property {Object} sessionTimedOutError
			, sessionTimedOutError:
			{
				// @property {Number} status
				status: 401
					// @property {String} code
				, code: 'ERR_USER_SESSION_TIMED_OUT'
					// @property {String} message
				, message: 'Your session has timed out. Please log in again.'
			}

			//@property {Object} forbiddenError
			, forbiddenError:
			{
				// @property {Number} status
				status: 403
					// @property {String} code
				, code: 'ERR_INSUFFICIENT_PERMISSIONS'
					// @property {String} message
				, message: 'You do not have permission to perform this action. Contact an administrator to ensure you have the correct permissions.'
			}

			//@property {Object} notFoundError
			, notFoundError:
			{
				// @property {Number} status
				status: 404
					// @property {String} code
				, code: 'ERR_RECORD_NOT_FOUND'
					// @property {String} message
				, message: 'Record is not found.'
			}

			//@property {Object} methodNotAllowedError
			, methodNotAllowedError:
			{
				// @property {Number} status
				status: 405
					// @property {String} code
				, code: 'ERR_METHOD_NOT_ALLOWED'
					// @property {String} message
				, message: 'This action is not allowed. Contact an administrator to ensure you have the correct permissions.'
			}

			//@property {Object} invalidItemsFieldsAdvancedName
			, invalidItemsFieldsAdvancedName:
			{
				// @property {Number} status
				status: 500
					// @property {String} code
				, code: 'ERR_INVALID_ITEMS_FIELDS_ADVANCED_NAME'
					// @property {String} message
				, message: 'Contact an administrator to check if the field set has been created.'
			}

			//***** SCIS ERRORS *****
			//@property {Object} orderIdRequired
			, orderIdRequired:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'ORDER_REQUIRED'
					// @property {String} message
				, message: 'You must specify an Order ID.'
			}

			//@property {Object} notImplemented
			, notImplemented:
			{
				// @property {Number} status
				status: 501
					// @property {String} code
				, code: 'NOT_IMPLEMENTED'
					// @property {String} message
				, message: 'Not implemented.'
			}

			//@property {Object} noSiteId
			, noSiteId:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'NO_SITE_ID'
					// @property {String} message
				, message: 'No siteId in this session. Try logging in again.'
			}

			//@property {Object} missingSiteId
			, missingSiteId:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'MISSING_SITE_ID'
					// @property {String} message
				, message: 'The siteId parameter is required'
			}

			//@property {Object} noOrderIdOrCreditMemoId
			, noOrderIdOrCreditMemoId:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'ORDER_ID_OR_CREDIT_MEMO_ID'
					// @property {String} message
				, message: 'The orderId or creditMemoId is required.'
			}

			//@property {Object} noOrderIdOrCreditMemoId
			, notApplicableCreditMemo:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'NOT_APPLICABLE_CREDIT_MEMO'
					// @property {String} message
				, message: 'Credit Memo is not applicable to this order. Assign the customer on the credit memo to the invoice, and then verify the credit memo balance.'
			}

			//@property {Object} refundMethodRequired
			, refundMethodRequired:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'REFUND_METHOD_REQUIRED'
					// @property {String} message
				, message: 'You must specify the payment method for the refund.'
			}

			//@property {Object} invalidOrderId
			, invalidOrderId:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'INVALID_ORDER_ID'
					// @property {String} message
				, message: 'ID for this order is not valid.'
			}

			//@property {Object} invalidReturnedQuantity
			, invalidReturnedQuantity:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'INVALID_RETURNED_QUANTITY'
					// @property {String} message
				, message: 'The quantity being returned exceeds the available quantity.'
			}

			//@property {Object} customerNotFound
			, customerNotFound:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'CUSTOMER_NOT_FOUND'
					// @property {String} message
				, message: 'Customer is not found.'
			}

			//@property {Object} customerNotExist
			, customerNotExist:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'CUSTOMER_NOT_EXIST'
					// @property {String} message
				, message: 'Customer does not exist.'
			}

			//@property {Object} customerRequired
			, customerRequired:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'CUSTOMER_REQUIRED'
					// @property {String} message
				, message: 'Customer is requred.'
			}

			//@property {Object} entityIdRequired
			, entityIdRequired:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'ENTITY_ID_REQUIRED'
					// @property {String} message
				, message: 'The entityId is required.'
			}

			//@property {Object} unexpectedError
			, unexpectedError:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'UNEXPECTED_ERROR'
					// @property {String} message
				, message: 'An Unexpected Error has occurred.'
			}

			//@property {Object} unexpectedError
			, deviceNotFound:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'DEVICE_NOT_FOUND'
					// @property {String} message
				, message: 'Device was not found.'
			}

			//@property {Object} ParameterMissing
			, ParameterMissing:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'PARAMETER_MISSING'
					// @property {String} message
				, message: 'Missing parameter.'
			}

			//@property {Object} printingTechnologyNotFound
			, printingTechnologyNotFound:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'PRINTING_TECHNOLOGY_NOT_FOUND'
					// @property {String} message
				, message: 'Printing technology not found.'
			}

			//@property {Object} invalidURL
			, invalidURL:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'INVALID_URL'
					// @property {String} message
				, message: 'URL is not valid.'
			}

			//@property {Object} invalidParameter
			, invalidParameter:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'INVALID_PARAMETER'
					// @property {String} message
				, message: 'Parameter is not valid.'
			}

			//@property {Object} missingParamenter
			, missingParamenter:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'MISSING_PARAMETER'
					// @property {String} message
				, message: 'Missing parameter.'
			}

			//@property {Object} notFoundEmployeeLocation
			, notFoundEmployeeLocation:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'NOT_FOUND_EMPLOYEE_LOCATION'
					// @property {String} message
				, message: 'The current user is not associated with a location. A location must be selected on the employee record.'
			}

			//@property {Object} notAvailableEmployeeLocation
			, notAvailableEmployeeLocation:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'EMPLOYEE_LOCATION_NOT_AVAILABLE'
					// @property {String} message
				, message: 'You dont have the device location available.'
			}


			//@property {Object} requiredSalesAssociateLocation
			, requiredSalesAssociateLocation:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'REQUIRED_SALES_ASSOCIATE_LOCATION'
					// @property {String} message
				, message: 'The sales associate requires a location to create the order. A location must be selected on the employee record.'
			}

			//@property {Object} invalidTransactionType
			, invalidTransactionType:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'INVALID_TRANSACTION_TYPE'
					// @property {String} message
				, message: 'Transaction type is not valid.'
			}

			//@property {Object} locationAddressMissingFields
			, locationAddressMissingFields:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'LOCATION_ADDRESS_MISSING_FIELDS'
					// @property {String} message
				, message: 'Location address is missing required information. Please complete the form to proceed.'
			}

			, locationSettingsNotFound:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'LOCATION_SETTINGS_NOT_FOUND'
					// @property {String} message
				, message: 'Location setting is not found for current location.'
			}

			, locationIsRequired:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'LOCATION_IS_REQUIRED'
					// @property {String} message
				, message: 'Location is required.'
			}

			//@property {Object} impossibleApplyCoupon
			, impossibleApplyCoupon:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'IMPOSSIBLE_APPLY_CUPON'
					// @property {String} message
				, message: 'Unable to apply the coupon.'
			}

			, savedSearchInvalidColumn:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'SAVED_SEARCH_INVALID_COLUMN'
					// @property {String} message
				, message: 'Column index is not valid in the Saved Search.'
			}

			, savedSearchNotFound:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'SAVED_SEARCH_NOT_FOUND'
					// @property {String} message
				, message: 'Saved Search is not found.'
			}

			, savedSearchMissingParameter:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'SAVED_SEARCH_MISSING_PARAMETER'
					// @property {String} message
				, message: 'Saved Search is missing a parameter.'
			}

			, itemNotInSubsidiary:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'ITEM_NOT_IN_SUBSIDIARY'
					// @property {String} message
				, message: 'Item is not configured for current subsidiary.'
			}

			, giftAuthcodeAlreadyExists:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'GIFT_AUTH_CODE_ALREADY_EXIST'
					// @property {String} message
				, message: 'A Gift Card with the same authorization code already exists.'
			}

			, unapprovedPayment:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'UNAPPROVED_PAYMENT'
					// @property {String} message
				, message: 'Unapproved Payment.'
			}

			, notFoundPayment:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'NOT_FOUND_PAYMENT'
					// @property {String} message
				, message: 'No payments found.'
			}

			, necessarySubmitOrder:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'NECESSARY_SUBMIT_ORDER'
					// @property {String} message
				, message: 'The order must be submitted to update payments.'
			}

			, notFoundPaymentMethodForUser:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'NOT_FOUND_PAYMENT_METHOD_FOR_USER'
					// @property {String} message
				, message: 'Payment Method not found for the current user.'
			}

			, forceCancellablePayment:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'FORCE_CANCELLABLE_PAYMENT'
					// @property {String} message
				, message: 'Unable to force cancellation of a payment that can be canceled.'
			}

			, itemNotConfiguredForSubsidiary:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'ITEM_NOT_CONFIGURED_FOR_SUBSIDIARY'
					// @property {String} message
				, message: 'Item is not configured for the current subsidiary.'
			}

			, transactionHasBeenResumed:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'TRANSACTION_HAS_BEEN_RESUMED'
					// @property {String} message
				, message: 'The transaction has been resumed.'
			}

			, loadBeforeSubmit:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'LOAD_BEFORE_SUBMIT'
					// @property {String} message
				, message: 'BackendOpen the record before submitting it.'
			}

			, unknownRecord:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'UNKNOWN_RECORD'
					// @property {String} message
				, message: 'Unknown record type.'
			}

			, missingDrawerConfiguration:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'MISSING_DRAWER_CONFIGURATION'
					// @property {String} message
				, message: 'SCIS STORE SAFE ACCOUNT and SCIS CASH DRAWER DIFFERENCE fields are not configured for the current location. An administrator must make this change.'
			}

			, invalidStartingCash:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'INVALID_STARTING_CASH'
					// @property {String} message
				, message: 'Starting cash must be a positive number greather than cero.'
			}

			, cashDrawerIsBeignUsed:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'CASH_DRAWER_IS_BEIGN_USED'
					// @property {String} message
				, message: 'This cash drawer is being used by other user, please select a diferent one.'
			}

			, lastDeviceConnectionError:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'ERROR_SET_LAST_DEVICE_CONNECTION'
					// @property {String} message
				, message: 'Error saving the last device connection.'
			}

			, invalidWithdrawingAmount:
			{
				// @property {Number} status
				status: 400
					// @property {String} code
				, code: 'ERROR_INVALID_WITHDRAWING_AMOUNT'
					// @property {String} message
				, message: 'You cannot withdraw an amount of cash greater than the amount in the cash drawer.'
			}

			, emvInvoiceFailedAutoRefundSucced:
			{
				code: 'EMV_INVOICE_FAILED_CUSTOMER_REFUNDED'
				, status: 400
				, message: 'Invoice did not save, customer’s payment was refunded.'
			}

			, emvInvoiceFailedRefundManually:
			{
				code: 'EMV_INVOICE_FAILED_REFUND_MANUALLY'
				, status: 400
				, message: 'Invoice did not save, customer payment not refunded.'
			}

			, emvInvoiceFailedAutoRefundFailed:
			{
				code: 'EMV_INVOICE_FAILED_REFUND_FAILED'
				, status: 400
				, message: 'Invoice did not save, customer payment not refunded.'
			}
			//***** END SCIS ERROR *****
		};

	});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/* exported forbiddenError, SC, unauthorizedError, notFoundError, methodNotAllowedError, sessionTimedOutError, invalidItemsFieldsAdvancedName */
/* jshint -W079 */

// @module ssp.libraries

// This stands for SuiteCommerce
var SC = {};

define(
	'Application'
,	[
		'underscore'
	,	'Events'
	,	'SC.ComponentContainer'
	,	'SC.Models.Init'
	,	'Configuration'
	,	'Application.Error'
	,	'Utils'
	,	'Console'
	]
,	function(
		_
	,	Events
	,	SCComponentContainer
	,	ModelsInit
	,	Configuration
	,	ApplicationError
	,	Utils
	)
{
	'use strict';

	// @class Application @extends SC.CancelableEvents
	// The Application object contains high level functions to interact with low level suitescript and Commerce API
	// like obtaining all the context environment information, sending HTTP responses, defining HTTP errors, searching with paginated results, etc.
	var Application = _.extend({

		init: function () {}

		//GENERAL-CONTEXT

		// @method getEnvironment returns an Object with high level settings. Gets the information with session.getSiteSettings()
		// and then mix it with high level information like languages, permissions, currencies, hosts, etc.  also it will take care of calling
		// session.setShopperCurrency and session.setShopperLanguage to automatically set this information in the shopper session according to passed request parameters.
		// @param {ShoppingSession} session
		// @param {nlobjRequest} request - used for read passed parameters in the url, i.e. in sc.environment.ssp?lang=es_ES
		// @return {Object} an object with many environment properties serializable to JSON.
	,	getEnvironment: function getEnvironment(request)
		{
			Configuration.set('cms.useCMS', Configuration.get().cms.useCMS && ModelsInit.context.getSetting('FEATURE', 'ADVANCEDSITEMANAGEMENT') === 'T') ;

			// Sets Default environment variables
			var siteSettings = ModelsInit.session.getSiteSettings(['currencies', 'languages'])
			,	result = {
					baseUrl: ModelsInit.session.getAbsoluteUrl2('/{{file}}')
				,	currentHostString: Application.getHost()
				,	availableHosts: Configuration.get().hosts || []
				,	availableLanguages: siteSettings.languages || []
				,	availableCurrencies: siteSettings.currencies || []
				,	companyId: ModelsInit.context.getCompany()
				,	casesManagementEnabled: ModelsInit.context.getSetting('FEATURE', 'SUPPORT') === 'T'
				,	giftCertificatesEnabled: ModelsInit.context.getSetting('FEATURE', 'GIFTCERTIFICATES') === 'T'
				,	paymentInstrumentEnabled: ModelsInit.context.getSetting('FEATURE', 'PAYMENTINSTRUMENTS') === 'T'
				,	currencyCodeSpecifiedOnUrl : ''
				,	useCMS: Configuration.get().cms.useCMS
				};

			// If there are hosts associated in the site we iterate them to check which we are in
			// and which language and currency we are in
			if (result.availableHosts.length && Utils.isShoppingDomain())
			{
				var pushLanguage = function (language)
				{
					result.availableLanguages.push(_.extend({}, language, available_languages_object[language.locale]));
					}
				,	pushCurrency = function (currency)
				{
					result.availableCurrencies.push(_.extend({}, currency, available_currencies_object[currency.code]));
				};

				for (var i = 0; i < result.availableHosts.length; i++)
				{
					var host = result.availableHosts[i];
					if (host.languages && host.languages.length)
					{
						// looks for the language match
						for (var n = 0; n < host.languages.length; n++)
						{
							var language = host.languages[n];

							if (language.host === result.currentHostString)
							{
								// if we found the language we mark the host and the language and we brake
								result = _.extend(result, {
									currentHost: host
								,	currentLanguage: language
								});

								// Enhances the list of languages with the info provided by the site settings
								var available_languages_object = _.object(_.pluck(result.availableLanguages, 'locale'), result.availableLanguages);

								result.availableLanguages = [];

								_.each(host.languages, pushLanguage);

								break;
							}
						}
					}

					if (result.currentHost)
					{
						//////////////////////////////////////////////////////////////
						// Set the available currency based on the hosts currencies //
						//////////////////////////////////////////////////////////////
						var available_currencies_object = _.object(_.pluck(result.availableCurrencies, 'code'), result.availableCurrencies);
						result.availableCurrencies = [];
						_.each(host.currencies, pushCurrency);
						break;
					}
				}
			}

			//////////////////////////////////////
			// Sets the Currency of the shopper //
			//////////////////////////////////////
			var currency_codes = _.pluck(result.availableCurrencies, 'code');

			// there is a code passed in and it's on the list lets use it
			if (request.getParameter('cur') && ~currency_codes.indexOf(request.getParameter('cur')))
			{
				result.currentCurrency = _.find(result.availableCurrencies, function (currency)
				{
					return currency.code === request.getParameter('cur');
				});
				result.currencyCodeSpecifiedOnUrl = result.currentCurrency.code;
			}
			// The currency of the current user is valid fot this host let's just use that
			else if (ModelsInit.session.getShopperCurrency().code && ~currency_codes.indexOf(ModelsInit.session.getShopperCurrency().code))
			{
				result.currentCurrency = _.find(result.availableCurrencies, function (currency)
				{
					return currency.code === ModelsInit.session.getShopperCurrency().code;
				});
				result.currencyCodeSpecifiedOnUrl = result.currentCurrency.code;
			}
			else if (result.availableCurrencies && result.availableCurrencies.length)
			{
				result.currentCurrency = _.find(result.availableCurrencies, function (currency)
				{
					result.currencyCodeSpecifiedOnUrl =  currency.code;
					return currency.isdefault === 'T';
				});
			}
			// We should have result.currentCurrency setted by now
			result.currentCurrency && ModelsInit.session.setShopperCurrency(result.currentCurrency.internalid);

			result.currentCurrency = _.find(result.availableCurrencies, function (currency)
			{
				return currency.code === ModelsInit.session.getShopperCurrency().code;
			});

			///////////////////////////////////////
			// Sets the Language in the Shopper //
			///////////////////////////////////////
			if (!result.currentLanguage)
			{
				var shopper_preferences = ModelsInit.session.getShopperPreferences()
				,	shopper_locale = shopper_preferences.language.locale
				,	locales = _.pluck(result.availableLanguages, 'locale');

				if (request.getParameter('lang') && ~locales.indexOf(request.getParameter('lang')))
				{
					result.currentLanguage = _.find(result.availableLanguages, function (language)
					{
						return language.locale === request.getParameter('lang');
					});
				}
				else if (shopper_locale && ~locales.indexOf(shopper_locale))
				{
					result.currentLanguage = _.find(result.availableLanguages, function (language)
					{
						return language.locale === shopper_locale;
					});
				}
				else if (result.availableLanguages && result.availableLanguages.length)
				{
					result.currentLanguage = _.find(result.availableLanguages, function (language)
					{
						return language.isdefault === 'T';
					});
				}
			}

			// We should have result.currentLanguage set by now
			result.currentLanguage && ModelsInit.session.setShopperLanguageLocale(result.currentLanguage.locale);

			// Shopper Price Level
			result.currentPriceLevel = ModelsInit.session.getShopperPriceLevel().internalid ? ModelsInit.session.getShopperPriceLevel().internalid : ModelsInit.session.getSiteSettings(['defaultpricelevel']).defaultpricelevel;

			return result;
		}

		// @method getPermissions
		// @return {transactions: Object, lists: Object}
	,	getPermissions: function getPermissions()
		{
			// transactions.tranCustInvc.1,transactions.tranCashSale.1
			var purchases_permissions = [
					ModelsInit.context.getPermission('TRAN_SALESORD')
				,	ModelsInit.context.getPermission('TRAN_CUSTINVC')
				,	ModelsInit.context.getPermission('TRAN_CASHSALE')
				]
			,	purchases_returns_permissions = [
					ModelsInit.context.getPermission('TRAN_RTNAUTH')
				,	ModelsInit.context.getPermission('TRAN_CUSTCRED')
				];

			return	{
				transactions: {
					tranCashSale: ModelsInit.context.getPermission('TRAN_CASHSALE')
				,	tranCustCred: ModelsInit.context.getPermission('TRAN_CUSTCRED')
				,	tranCustDep: ModelsInit.context.getPermission('TRAN_CUSTDEP')
				,	tranCustPymt: ModelsInit.context.getPermission('TRAN_CUSTPYMT')
				,	tranStatement: ModelsInit.context.getPermission('TRAN_STATEMENT')
				,	tranCustInvc: ModelsInit.context.getPermission('TRAN_CUSTINVC')
				,	tranItemShip: ModelsInit.context.getPermission('TRAN_ITEMSHIP')
				,	tranSalesOrd: ModelsInit.context.getPermission('TRAN_SALESORD')
				,	tranEstimate: ModelsInit.context.getPermission('TRAN_ESTIMATE')
				,	tranRtnAuth: ModelsInit.context.getPermission('TRAN_RTNAUTH')
				,	tranDepAppl: ModelsInit.context.getPermission('TRAN_DEPAPPL')
				,	tranSalesOrdFulfill: ModelsInit.context.getPermission('TRAN_SALESORDFULFILL')
				,	tranFind: ModelsInit.context.getPermission('TRAN_FIND')
				,	tranPurchases: _.max(purchases_permissions)
				,	tranPurchasesReturns: _.max(purchases_returns_permissions)
				}
			,	lists: {
					regtAcctRec: ModelsInit.context.getPermission('REGT_ACCTREC')
				,	regtNonPosting: ModelsInit.context.getPermission('REGT_NONPOSTING')
				,	listCase: ModelsInit.context.getPermission('LIST_CASE')
				,	listContact: ModelsInit.context.getPermission('LIST_CONTACT')
				,	listCustJob: ModelsInit.context.getPermission('LIST_CUSTJOB')
				,	listCompany: ModelsInit.context.getPermission('LIST_COMPANY')
				,	listIssue: ModelsInit.context.getPermission('LIST_ISSUE')
				,	listCustProfile: ModelsInit.context.getPermission('LIST_CUSTPROFILE')
				,	listExport: ModelsInit.context.getPermission('LIST_EXPORT')
				,	listFind: ModelsInit.context.getPermission('LIST_FIND')
				,	listCrmMessage: ModelsInit.context.getPermission('LIST_CRMMESSAGE')
				}
			};
		}

		// @method getHost
	,	getHost: function ()
		{
			return request.getURL().match(/http(s?):\/\/([^\/]*)\//)[2];
		}

		// @method sendContent writes the given content in the request object using the right headers, and content type
		// @param {String} content
		// @param {Object} options
		// @deprecated Only included for backward compatibility, please use the same method available in SspLibraries, 'Service.Controller' module
	,	sendContent: function (content, options)
		{
			// Default options
			options = _.extend({status: 200, cache: false}, options || {});

			// Triggers an event for you to know that there is content being sent
			Application.trigger('before:Application.sendContent', content, options);

			// We set a custom status
			response.setHeader('Custom-Header-Status', parseInt(options.status, 10).toString());

			// The content type will be here
			var content_type = false;

			// If its a complex object we transform it into an string
			if (_.isArray(content) || _.isObject(content))
			{
				content_type = 'JSON';
				content = JSON.stringify( content );
			}

			//Set the response chache option
			if (options.cache)
			{
				response.setCDNCacheable(options.cache);
			}

			// Content type was set so we send it
			content_type && response.setContentType(content_type);

			response.write(content);

			Application.trigger('after:Application.sendContent', content, options);
		}

		// @method processError builds an error object suitable to send back in the http response.
		// @param {nlobjError|Application.Error}
		// @returns {errorStatusCode:Number,errorCode:String,errorMessage:String} an error object suitable to send back in the http response.
		// @deprecated Only included for backward compatibility, please use the same method available in SspLibraries, 'Service.Controller' module
	,	processError: function (e)
		{
			var status = 500
			,	code = 'ERR_UNEXPECTED'
			,	message = 'error';

			if (e instanceof nlobjError)
			{
				code = e.getCode();
				message = e.getDetails();
				status = badRequestError.status;
			}
			else if (_.isObject(e) && !_.isUndefined(e.status))
			{
				status = e.status;
				code = e.code;
				message = e.message;
			}
			else
			{
				var error = nlapiCreateError(e);
				code = error.getCode();
				message = (error.getDetails() !== '') ? error.getDetails() : error.getCode();
			}

			if (code === 'INSUFFICIENT_PERMISSION')
			{
				status = forbiddenError.status;
				code = forbiddenError.code;
				message = forbiddenError.message;
			}

			var content = {
				errorStatusCode: parseInt(status,10).toString()
			,	errorCode: code
			,	errorMessage: message
			};

			if (e.errorDetails)
			{
				content.errorDetails = e.errorDetails;
			}

			return content;
		}

		// @method sendError process the error and then writes it in the http response. @param {nlobjError|Application.Error}
		// @deprecated Only included for backward compatibility, please use the same method available in SspLibraries, 'Service.Controller' module
	,	sendError: function (e)
		{
			// @event before:Application.sendError
			Application.trigger('before:Application.sendError', e);

			var content = Application.processError(e)
			,	content_type = 'JSON';

			response.setHeader('Custom-Header-Status', content.errorStatusCode);

            content = JSON.stringify(content);

			response.setContentType(content_type);

			response.write(content);

			// @event before:Application.sendError
			Application.trigger('after:Application.sendError', e);
		}

		//SEARCHES
		// @method getPaginatedSearchResults
		// @param {page:Number,columns:Array<nlobjSearchColumn>,filters:Array<nlobjSearchFilter>,record_type:String,results_per_page:Number} options
		// @returns {records:Array<nlobjSearchResult>,totalRecordsFound:Number,page:Number}
	,	getPaginatedSearchResults: function (options)
		{
			options = options || {};

			var results_per_page = options.results_per_page || Configuration.get('suitescriptResultsPerPage')
			,	page = options.page || 1
			,	columns = options.columns || []
			,	filters = options.filters || []
			,	record_type = options.record_type
			,	range_start = (page * results_per_page) - results_per_page
			,	range_end = page * results_per_page
			,	do_real_count = _.any(columns, function (column)
				{
					return column.getSummary();
				})
			,	result = {
					page: page
				,	recordsPerPage: results_per_page
				,	records: []
				};

			if (!do_real_count || options.column_count)
			{
				var column_count = options.column_count || new nlobjSearchColumn('internalid', null, 'count')
				,	count_result = nlapiSearchRecord(record_type, null, filters, [column_count]);

				result.totalRecordsFound = parseInt(count_result[0].getValue(column_count), 10);
			}

			if (do_real_count || (result.totalRecordsFound > 0 && result.totalRecordsFound > range_start))
			{
				var search = nlapiCreateSearch(record_type, filters, columns).runSearch();
				result.records = search.getResults(range_start, range_end);

				if (do_real_count && !options.column_count)
				{
					result.totalRecordsFound = search.getResults(0, 1000).length;
				}
			}

			return result;
		}


		// @method getAllSearchResults
		// @param {String} record_type
		// @param {Array<nlobjSearchFilter>} filters
		// @param {Array<nlobjSearchColumn>} columns
		// @return {Array<nlobjSearchResult>}
	,	getAllSearchResults: function (record_type, filters, columns)
		{
			var search = nlapiCreateSearch(record_type, filters, columns);
			search.setIsPublic(true);

			var searchRan = search.runSearch()
			,	bolStop = false
			,	intMaxReg = 1000
			,	intMinReg = 0
			,	result = [];

			while (!bolStop && ModelsInit.context.getRemainingUsage() > 10)
			{
				// First loop get 1000 rows (from 0 to 1000), the second loop starts at 1001 to 2000 gets another 1000 rows and the same for the next loops
				var extras = searchRan.getResults(intMinReg, intMaxReg);

				result = Application.searchUnion(result, extras);
				intMinReg = intMaxReg;
				intMaxReg += 1000;
				// If the execution reach the the last result set stop the execution
				if (extras.length < 1000)
				{
					bolStop = true;
				}
			}

			return result;
		}

		// @method addFilterSite @param adds filters to current search filters so it matches given site ids.
		// @param {Array<String>} filters
	,	addFilterSite: function (filters)
		{
			var search_filter_array = this.getSearchFilterArray();

			search_filter_array.length && filters.push(new nlobjSearchFilter('website', null, 'anyof', search_filter_array));
		}

		// @method addFilterSite @param adds filters to current search filters so it matches given website item ids.
		// @param {Array<String>} filters
	,	addFilterItem: function (filters)
		{
			var search_filter_array = this.getSearchFilterArray();

			search_filter_array.length && filters.push(new nlobjSearchFilter('website', 'item', 'anyof', search_filter_array));
		}

		// @method getSearchFilterArray @return {Array<String>} current record search filters array taking in account multi site feature
	,	getSearchFilterArray: function ()
		{
			var site_id = ModelsInit.session.getSiteSettings(['siteid']).siteid
			,	filter_site = Configuration.get('filterSite')
			,	search_filter_array = [];

			// Validate if: MULTISITE, site_id, filter_site and also if filter_site is different of 'all'
			if (ModelsInit.context.getFeature('MULTISITE') && site_id && filter_site.option && 'all' !== filter_site.option)
			{
				if(filter_site.option === 'siteIds' && filter_site.ids)
				{
					search_filter_array = filter_site.ids;
				}
				search_filter_array.push(site_id, '@NONE@');
			}

			return _.uniq(search_filter_array);
		}

		// @method searchUnion utility method for unite two arrays @param {Array} target @param {Array} array
	,	searchUnion: function (target, array)
		{
			return target.concat(array);
		}
	,	getNonManageResourcesPathPrefix: function()
		{
			if(BuildTimeInf && BuildTimeInf.isSCLite)
			{
				if (Configuration.get('unmanagedResourcesFolderName'))
				{
					return 'site/' + Configuration.get('unmanagedResourcesFolderName') + '/';
				}
				else
				{
					return 'default/';
				}
			}
			return '';
		}
	,	getFaviconPath: function()
		{
			if(Configuration.get('faviconPath') && Configuration.get('faviconPath') !== '')
			{
				return Configuration.get('faviconPath') + '/';
			}
			/*jshint -W117 */
			else if(isExtended && themeAssetsPath !== '')
			{
				return themeAssetsPath;
			}
			/*jshint +W117 */

			return this.getNonManageResourcesPathPrefix();
		}
	}, Events, SCComponentContainer);

	// Default error objects
	// @class Application.Error a high level error object that can be processed and written in the response using processError and sendError methods
	//console.log('Application.Error', JSON.stringify(Application.error));

	return Application;
});

	//@property {Object} badRequestError
var	badRequestError = {
		// @property {Number} status
		status: 400
		// @property {String} code
	,	code: 'ERR_BAD_REQUEST'
		// @property {String} message
	,	message: 'Bad Request'
	}

	//@property {Object} unauthorizedError
,	unauthorizedError = {
		// @property {Number} status
		status: 401
		// @property {String} code
	,	code: 'ERR_USER_NOT_LOGGED_IN'
		// @property {String} message
	,	message: 'Not logged In'
	}

	//@property {Object} sessionTimedOutError
,	sessionTimedOutError = {
		// @property {Number} status
		status: 401
		// @property {String} code
	,	code: 'ERR_USER_SESSION_TIMED_OUT'
		// @property {String} message
	,	message: 'User session timed out'
	}

	//@property {Object} forbiddenError
,	forbiddenError = {
		// @property {Number} status
		status: 403
		// @property {String} code
	,	code: 'ERR_INSUFFICIENT_PERMISSIONS'
		// @property {String} message
	,	message: 'Insufficient permissions'
	}

	//@property {Object} notFoundError
,	notFoundError = {
		// @property {Number} status
		status: 404
		// @property {String} code
	,	code: 'ERR_RECORD_NOT_FOUND'
		// @property {String} message
	,	message: 'Not found'
	}

	//@property {Object} methodNotAllowedError
,	methodNotAllowedError = {
		// @property {Number} status
		status: 405
		// @property {String} code
	,	code: 'ERR_METHOD_NOT_ALLOWED'
		// @property {String} message
	,	message: 'Sorry, you are not allowed to perform this action.'
	}

	//@property {Object} invalidItemsFieldsAdvancedName
,	invalidItemsFieldsAdvancedName = {
		// @property {Number} status
		status: 500
		// @property {String} code
	,	code:'ERR_INVALID_ITEMS_FIELDS_ADVANCED_NAME'
		// @property {String} message
	,	message: 'Please check if the fieldset is created.'
	};

SC.ERROR_IDENTIFIERS = require('Application.Error');

var Backbone = {};
Backbone.Validation = (function(_){
  'use strict';

  // Default options
  // ---------------

  var defaultOptions = {
    forceUpdate: false,
    selector: 'name',
    labelFormatter: 'sentenceCase',
    valid: Function.prototype,
    invalid: Function.prototype
  };


  // Helper functions
  // ----------------

  // Formatting functions used for formatting error messages
  var formatFunctions = {
    // Uses the configured label formatter to format the attribute name
    // to make it more readable for the user
    formatLabel: function(attrName, model) {
      return defaultLabelFormatters[defaultOptions.labelFormatter](attrName, model);
    },

    // Replaces nummeric placeholders like {0} in a string with arguments
    // passed to the function
    format: function() {
      var args = Array.prototype.slice.call(arguments),
          text = args.shift();
      return text.replace(/\{(\d+)\}/g, function(match, number) {
        return typeof args[number] !== 'undefined' ? args[number] : match;
      });
    }
  };

  // Flattens an object
  // eg:
  //
  //     var o = {
  //       owner: {
  //         name: 'Backbone',
  //         address: {
  //           street: 'Street',
  //           zip: 1234
  //         }
  //       }
  //     };
  //
  // becomes:
  //
  //     var o = {
  //       'owner': {
  //         name: 'Backbone',
  //         address: {
  //           street: 'Street',
  //           zip: 1234
  //         }
  //       },
  //       'owner.name': 'Backbone',
  //       'owner.address': {
  //         street: 'Street',
  //         zip: 1234
  //       },
  //       'owner.address.street': 'Street',
  //       'owner.address.zip': 1234
  //     };
  // This may seem redundant, but it allows for maximum flexibility
  // in validation rules.
  var flatten = function (obj, into, prefix) {
    into = into || {};
    prefix = prefix || '';

    _.each(obj, function(val, key) {
      if(obj.hasOwnProperty(key)) {
        if (!!val && _.isArray(val)) {
          _.forEach(val, function(v, k) {
            flatten(v, into, prefix + key + '.' + k + '.');
            into[prefix + key + '.' + k] = v;
          });
        } else if (!!val && typeof val === 'object' && val.constructor === Object) {
          flatten(val, into, prefix + key + '.');
        }

        // Register the current level object as well
        into[prefix + key] = val;
      }
    });

    return into;
  };

  // Validation
  // ----------

  var Validation = (function(){

    // Returns an object with undefined properties for all
    // attributes on the model that has defined one or more
    // validation rules.
    var getValidatedAttrs = function(model, attrs) {
      attrs = attrs || _.keys(model.validation || {});
      return _.reduce(attrs, function(memo, key) {
        memo[key] = void 0;
        return memo;
      }, {});
    };

    // Returns an array with attributes passed through options
    var getOptionsAttrs = function(options, view) {
      var attrs = options.attributes;
      if (_.isFunction(attrs)) {
        attrs = attrs(view);
      } else if (_.isString(attrs) && (_.isFunction(defaultAttributeLoaders[attrs]))) {
        attrs = defaultAttributeLoaders[attrs](view);
      }
      if (_.isArray(attrs)) {
        return attrs;
      }
    };


    // Looks on the model for validations for a specified
    // attribute. Returns an array of any validators defined,
    // or an empty array if none is defined.
    var getValidators = function(model, attr) {
      var attrValidationSet = model.validation ? model.validation[attr] || {} : {};

      // If the validator is a function or a string, wrap it in a function validator
      if (_.isFunction(attrValidationSet) || _.isString(attrValidationSet)) {
        attrValidationSet = {
          fn: attrValidationSet
        };
      }

      // Stick the validator object into an array
      if(!_.isArray(attrValidationSet)) {
        attrValidationSet = [attrValidationSet];
      }

      // Reduces the array of validators into a new array with objects
      // with a validation method to call, the value to validate against
      // and the specified error message, if any
      return _.reduce(attrValidationSet, function(memo, attrValidation) {
        _.each(_.without(_.keys(attrValidation), 'msg'), function(validator) {
          memo.push({
            fn: defaultValidators[validator],
            val: attrValidation[validator],
            msg: attrValidation.msg
          });
        });
        return memo;
      }, []);
    };

    // Validates an attribute against all validators defined
    // for that attribute. If one or more errors are found,
    // the first error message is returned.
    // If the attribute is valid, an empty string is returned.
    var validateAttr = function(model, attr, value, computed) {
      // Reduces the array of validators to an error message by
      // applying all the validators and returning the first error
      // message, if any.
      return _.reduce(getValidators(model, attr), function(memo, validator){
        // Pass the format functions plus the default
        // validators as the context to the validator
        var ctx = _.extend({}, formatFunctions, defaultValidators),
            result = validator.fn.call(ctx, value, attr, validator.val, model, computed);

        if(result === false || memo === false) {
          return false;
        }
        if (result && !memo) {
          return validator.msg || result;
        }
        return memo;
      }, '');
    };

    // Loops through the model's attributes and validates the specified attrs.
    // Returns and object containing names of invalid attributes
    // as well as error messages.
    var validateModel = function(model, attrs, validatedAttrs) {
      var error,
          invalidAttrs = {},
          isValid = true,
          computed = _.clone(attrs);

      _.each(validatedAttrs, function(val, attr) {
        error = validateAttr(model, attr, val, computed);
        if (error) {
          invalidAttrs[attr] = error;
          isValid = false;
        }
      });

      return {
        invalidAttrs: invalidAttrs,
        isValid: isValid
      };
    };

    // Contains the methods that are mixed in on the model when binding
    var mixin = function(view, options) {
      return {

        // Check whether or not a value, or a hash of values
        // passes validation without updating the model
        preValidate: function(attr, value) {
          
            return validateAttr(this, attr, value, _.extend({}, this.attributes));
          
        },

        // Check to see if an attribute, an array of attributes or the
        // entire model is valid. Passing true will force a validation
        // of the model.
        isValid: function(option) {
          var flattened, attrs, error, invalidAttrs;

          option = option || getOptionsAttrs(options, view);

          if(_.isString(option)){
            attrs = [option];
          } else if(_.isArray(option)) {
            attrs = option;
          }
          if (attrs) {
            flattened = flatten(this.attributes);
            //Loop through all associated views
            _.each(this.associatedViews, function(view) {
              _.each(attrs, function (attr) {
                error = validateAttr(this, attr, flattened[attr], _.extend({}, this.attributes));
                if (error) {
                  options.invalid(view, attr, error, options.selector);
                  invalidAttrs = invalidAttrs || {};
                  invalidAttrs[attr] = error;
                } else {
                  options.valid(view, attr, options.selector);
                }
              }, this);
            }, this);
          }

          if(option === true) {
            invalidAttrs = this.validate();
          }
          if (invalidAttrs) {
            this.trigger('invalid', this, invalidAttrs, {validationError: invalidAttrs});
          }
          return attrs ? !invalidAttrs : this.validation ? this._isValid : true;
        },

        // This is called by Backbone when it needs to perform validation.
        // You can call it manually without any parameters to validate the
        // entire model.
        validate: function(attrs, setOptions){
          var model = this,
              validateAll = !attrs,
              opt = _.extend({}, options, setOptions),
              validatedAttrs = getValidatedAttrs(model, getOptionsAttrs(options, view)),
              allAttrs = _.extend({}, validatedAttrs, model.attributes, attrs),
              flattened = flatten(allAttrs),
              changedAttrs = attrs ? flatten(attrs) : flattened,
              result = validateModel(model, allAttrs, _.pick(flattened, _.keys(validatedAttrs)));

          model._isValid = result.isValid;

          //After validation is performed, loop through all associated views
          _.each(model.associatedViews, function(view){

            // After validation is performed, loop through all validated and changed attributes
            // and call the valid and invalid callbacks so the view is updated.
            _.each(validatedAttrs, function(val, attr){
                var invalid = result.invalidAttrs.hasOwnProperty(attr),
                  changed = changedAttrs.hasOwnProperty(attr);

                if(!invalid){
                  opt.valid(view, attr, opt.selector);
                }
                if(invalid && (changed || validateAll)){
                  opt.invalid(view, attr, result.invalidAttrs[attr], opt.selector);
                }
            });
          });

          // Trigger validated events.
          // Need to defer this so the model is actually updated before
          // the event is triggered.
          //_.defer(function() {
          //  model.trigger('validated', model._isValid, model, result.invalidAttrs);
          //  model.trigger('validated:' + (model._isValid ? 'valid' : 'invalid'), model, result.invalidAttrs);
          //});

          // Return any error messages to Backbone, unless the forceUpdate flag is set.
          // Then we do not return anything and fools Backbone to believe the validation was
          // a success. That way Backbone will update the model regardless.
          if (!opt.forceUpdate && _.intersection(_.keys(result.invalidAttrs), _.keys(changedAttrs)).length > 0) {
            return result.invalidAttrs;
          }
        }
      };
    };

    // Helper to mix in validation on a model. Stores the view in the associated views array.
    var bindModel = function(view, model, options) {
      if (model.associatedViews) {
        model.associatedViews.push(view);
      } else {
        model.associatedViews = [view];
      }
      _.extend(model, mixin(view, options));
    };

    // Removes view from associated views of the model or the methods
    // added to a model if no view or single view provided
    var unbindModel = function(model, view) {
      if (view && model.associatedViews && model.associatedViews.length > 1){
        model.associatedViews = _.without(model.associatedViews, view);
      } else {
        delete model.validate;
        delete model.preValidate;
        delete model.isValid;
        delete model.associatedViews;
      }
    };

    // Mix in validation on a model whenever a model is
    // added to a collection
    var collectionAdd = function(model) {
      bindModel(this.view, model, this.options);
    };

    // Remove validation from a model whenever a model is
    // removed from a collection
    var collectionRemove = function(model) {
      unbindModel(model);
    };

    // Returns the public methods on Backbone.Validation
    return {

      // Current version of the library
      version: '0.11.3',

      // Called to configure the default options
      configure: function(options) {
        _.extend(defaultOptions, options);
      },

      // Hooks up validation on a view with a model
      // or collection
      bind: function(view, options) {
        options = _.extend({}, defaultOptions, defaultCallbacks, options);

        var model = view.model,
            collection = view.collection;

        if(typeof model === 'undefined' && typeof collection === 'undefined'){
          throw 'Before you execute the binding your view must have a model or a collection.\n' +
                'See http://thedersen.com/projects/backbone-validation/#using-form-model-validation for more information.';
        }

        if(model) {
          bindModel(view, model, options);
        }
        else if(collection) {
          collection.each(function(model){
            bindModel(view, model, options);
          });
          collection.bind('add', collectionAdd, {view: view, options: options});
          collection.bind('remove', collectionRemove);
        }
      },

      // Removes validation from a view with a model
      // or collection
      unbind: function(view) {
        var model = view.model,
            collection = view.collection;

        if(model) {
          unbindModel(model, view);
        }
        if(collection) {
          collection.each(function(model){
            unbindModel(model, view);
          });
          collection.unbind('add', collectionAdd);
          collection.unbind('remove', collectionRemove);
        }
      },

      // Used to extend the Backbone.Model.prototype
      // with validation
      mixin: mixin(null, defaultOptions)
    };
  }());


  // Callbacks
  // ---------

  var defaultCallbacks = Validation.callbacks = {

    // Gets called when a previously invalid field in the
    // view becomes valid. Removes any error message.
    // Should be overridden with custom functionality.
    valid: function(view, attr, selector) {
      view.$('[' + selector + '~="' + attr + '"]')
          .removeClass('invalid')
          .removeAttr('data-error');
    },

    // Gets called when a field in the view becomes invalid.
    // Adds a error message.
    // Should be overridden with custom functionality.
    invalid: function(view, attr, error, selector) {
      view.$('[' + selector + '~="' + attr + '"]')
          .addClass('invalid')
          .attr('data-error', error);
    }
  };


  // Patterns
  // --------

  var defaultPatterns = Validation.patterns = {
    // Matches any digit(s) (i.e. 0-9)
    digits: /^\d+$/,

    // Matches any number (e.g. 100.000)
    number: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,

    // Same as email but is more restrictive and matches the same emails as the Netsuite backend UI
    // Source: https://system.netsuite.com/javascript/NLUtil.jsp__NS_VER=2014.1.0&minver=154&locale=en_US.nlqs
    //        (Search for NLValidationUtil_SIMPLE_EMAIL_PATTERN)
    netsuiteEmail: /^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[a-z0-9]+(?:-+[a-z0-9]+)*\.)+(?:zw|zone|zm|za|yt|yokohama|ye|yandex|yachts|xyz|xxx|xn--zfr164b|xn--ygbi2ammx|xn--yfro4i67o|xn--xkc2dl3a5ee0h|xn--xkc2al3hye2a|xn--wgbl6a|xn--wgbh1c|xn--unup4y|xn--ses554g|xn--s9brj9c|xn--rhqv96g|xn--q9jyb4c|xn--pgbs0dh|xn--p1ai|xn--ogbpf8fl|xn--o3cw4h|xn--nqv7fs00ema|xn--nqv7f|xn--ngbc5azd|xn--mgbx4cd0ab|xn--mgberp4a5d4ar|xn--mgbc0a9azcg|xn--mgbbh1a71e|xn--mgbayh7gpa|xn--mgbab2bd|xn--mgbaam7a8h|xn--mgba3a4f16a|xn--mgb9awbf|xn--lgbbat1ad8j|xn--l1acc|xn--kput3i|xn--kpry57d|xn--kprw13d|xn--j6w193g|xn--j1amh|xn--io0a7i|xn--i1b6b1a6a2e|xn--h2brj9c|xn--gecrj9c|xn--fzc2c9e2c|xn--fpcrj9c3d|xn--fiqz9s|xn--fiqs8s|xn--fiq64b|xn--fiq228c5hs|xn--d1acj3b|xn--czru2d|xn--czr694b|xn--clchc0ea0b2g2a9gcd|xn--cg4bki|xn--c1avg|xn--90a3ac|xn--80aswg|xn--80asehdb|xn--80ao21a|xn--80adxhks|xn--6qq986b3xl|xn--6frz82g|xn--55qx5d|xn--55qw42g|xn--4gbrim|xn--45brj9c|xn--3e0b707e|xn--3ds443g|xn--3bst00m|wtf|wtc|ws|works|williamhill|wiki|wien|whoswho|wf|wed|website|webcam|watch|wang|vu|voyage|voto|voting|vote|vodka|vn|vlaanderen|vision|villas|viajes|vi|vg|vet|versicherung|ventures|vegas|ve|vc|vacations|va|uz|uy|us|uno|university|uk|ug|ua|tz|tw|tv|tt|travel|training|trade|tr|tp|toys|town|top|tools|tokyo|today|to|tn|tm|tl|tk|tj|tirol|tips|tienda|th|tg|tf|tel|technology|td|tc|tax|tattoo|sz|systems|sy|sx|sv|suzuki|surgery|surf|support|supply|supplies|su|st|sr|spiegel|space|soy|solutions|solar|sohu|software|social|so|sn|sm|sl|sk|sj|singles|si|shoes|shiksha|sh|sg|sexy|services|se|sd|scot|schule|schmidt|scb|sc|sb|saarland|sa|ryukyu|rw|ruhr|ru|rs|rodeo|rocks|ro|rio|rich|reviews|rest|republican|report|repair|rentals|ren|reisen|reise|rehab|red|recipes|realtor|re|quebec|qpon|qa|py|pw|pub|pt|ps|properties|productions|pro|press|praxi|pr|post|pn|pm|plumbing|place|pl|pk|pink|pictures|pics|physio|photos|photography|photo|ph|pg|pf|pe|parts|partners|paris|pa|ovh|organic|org|onl|ong|om|okinawa|nz|nyc|nu|nrw|nra|nr|np|no|nl|ninja|ni|nhk|ngo|ng|nf|neustar|net|ne|nc|navy|name|nagoya|na|mz|my|mx|mw|mv|museum|mu|mt|ms|mr|mq|mp|motorcycles|moscow|mortgage|monash|moe|moda|mobi|mo|mn|mm|ml|mk|mini|mil|miami|mh|mg|menu|melbourne|meet|media|me|md|mc|marketing|market|mango|management|maison|ma|ly|lv|luxury|luxe|lu|lt|ls|lr|lotto|london|loans|lk|link|limo|limited|lighting|life|li|lgbt|lease|lc|lb|lawyer|land|lacaixa|la|kz|ky|kw|kred|krd|kr|kp|koeln|kn|km|kiwi|kitchen|kim|ki|kh|kg|ke|kaufen|juegos|jp|joburg|jobs|jo|jm|jetzt|je|it|is|ir|iq|io|investments|international|int|insure|institute|ink|info|industries|in|immobilien|im|il|ie|id|hu|ht|hr|house|host|horse|homes|holiday|holdings|hn|hm|hk|hiv|hiphop|healthcare|haus|hamburg|gy|gw|guru|guitars|guide|gu|gt|gs|gripe|green|gratis|graphics|gr|gq|gp|gov|gop|gn|gmo|gm|globo|global|glass|gl|gives|gift|gi|gh|gg|gf|gent|ge|gd|gb|gallery|gal|ga|futbol|furniture|fund|frogans|fr|foundation|foo|fo|fm|florist|flights|fk|fj|fitness|fishing|fish|financial|finance|fi|feedback|farm|fail|exposed|expert|exchange|events|eus|eu|et|estate|es|er|equipment|enterprises|engineering|engineer|email|eg|ee|education|edu|ec|dz|durban|domains|do|dnp|dm|dk|dj|discount|directory|direct|digital|diamonds|desi|dentist|dental|democrat|degree|deals|de|dating|dance|cz|cy|cx|cw|cv|cuisinella|cu|cruises|creditcard|credit|cr|country|corp|coop|cool|cooking|contractors|consulting|construction|condos|computer|company|community|com|cologne|college|coffee|codes|co|cn|cm|club|clothing|clinic|cleaning|claims|cl|ck|city|citic|ci|church|christmas|cheap|ch|cg|cf|ceo|center|cd|cc|catering|cat|cash|careers|career|care|cards|capital|capetown|cancerresearch|camp|camera|cab|ca|bzh|bz|by|bw|bv|buzz|builders|build|bt|bs|brussels|br|boutique|bo|bn|bmw|bm|blue|blackfriday|black|bj|biz|bio|bike|bid|bi|bh|bg|bf|best|berlin|beer|be|bd|bb|bayern|bargains|bar|ba|az|axa|ax|aw|autos|audio|auction|au|attorney|at|associates|asia|as|arpa|army|archi|ar|aq|ao|an|am|al|airforce|ai|agency|ag|af|aero|ae|ad|actor|active|accountants|academy|ac)$/i,
    
    // Matches a valid email address (e.g. mail@example.com)
    email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,

    // Mathes any valid url (e.g. http://www.xample.com)
    url: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
  };


  // Error messages
  // --------------

  // Error message for the build in validators.
  // {x} gets swapped out with arguments form the validator.
  var defaultMessages = Validation.messages = {
    required: '{0} is required',
    acceptance: '{0} must be accepted',
    min: '{0} must be greater than or equal to {1}',
    max: '{0} must be less than or equal to {1}',
    range: '{0} must be between {1} and {2}',
    length: '{0} must be {1} characters',
    minLength: '{0} must be at least {1} characters',
    maxLength: '{0} must be at most {1} characters',
    rangeLength: '{0} must be between {1} and {2} characters',
    oneOf: '{0} must be one of: {1}',
    equalTo: '{0} must be the same as {1}',
    pattern: '{0} must be a valid {1}'
  };

  // Label formatters
  // ----------------

  // Label formatters are used to convert the attribute name
  // to a more human friendly label when using the built in
  // error messages.
  // Configure which one to use with a call to
  //
  //     Backbone.Validation.configure({
  //       labelFormatter: 'label'
  //     });
  var defaultLabelFormatters = Validation.labelFormatters = {

    // Returns the attribute name with applying any formatting
    none: function(attrName) {
      return attrName;
    },

    // Converts attributeName or attribute_name to Attribute name
    sentenceCase: function(attrName) {
      return attrName.replace(/(?:^\w|[A-Z]|\b\w)/g, function(match, index) {
        return index === 0 ? match.toUpperCase() : ' ' + match.toLowerCase();
      }).replace(/_/g, ' ');
    },

    // Looks for a label configured on the model and returns it
    //
    //      var Model = Backbone.Model.extend({
    //        validation: {
    //          someAttribute: {
    //            required: true
    //          }
    //        },
    //
    //        labels: {
    //          someAttribute: 'Custom label'
    //        }
    //      });
    label: function(attrName, model) {
      return (model.labels && model.labels[attrName]) || defaultLabelFormatters.sentenceCase(attrName, model);
    }
  };

  // AttributeLoaders

  var defaultAttributeLoaders = Validation.attributeLoaders = {
    inputNames: function (view) {
      var attrs = [];
      if (view) {
        view.$('form [name]').each(function () {
          if (/^(?:input|select|textarea)$/i.test(this.nodeName) && this.name &&
            this.type !== 'submit' && attrs.indexOf(this.name) === -1) {
            attrs.push(this.name);
          }
        });
      }
      return attrs;
    }
  };


  // Built in validators
  // -------------------

  var defaultValidators = Validation.validators = (function(){
    // Use native trim when defined
    var trim = String.prototype.trim ?
      function(text) {
        return text === null ? '' : String.prototype.trim.call(text);
      } :
      function(text) {
        var trimLeft = /^\s+/,
            trimRight = /\s+$/;

        return text === null ? '' : text.toString().replace(trimLeft, '').replace(trimRight, '');
      };

    // Determines whether or not a value is a number
    var isNumber = function(value){
      return _.isNumber(value) || (_.isString(value) && value.match(defaultPatterns.number));
    };

    // Determines whether or not a value is empty
    var hasValue = function(value) {
      return !(_.isNull(value) || _.isUndefined(value) || (_.isString(value) && trim(value) === '') || (_.isArray(value) && _.isEmpty(value)));
    };

    return {
      // Function validator
      // Lets you implement a custom function used for validation
      fn: function(value, attr, fn, model, computed) {
        if(_.isString(fn)){
          fn = model[fn];
        }
        return fn.call(model, value, attr, computed);
      },

      // Required validator
      // Validates if the attribute is required or not
      // This can be specified as either a boolean value or a function that returns a boolean value
      required: function(value, attr, required, model, computed) {
        var isRequired = _.isFunction(required) ? required.call(model, value, attr, computed) : required;
        if(!isRequired && !hasValue(value)) {
          return false; // overrides all other validators
        }
        if (isRequired && !hasValue(value)) {
          return this.format(defaultMessages.required, this.formatLabel(attr, model));
        }
      },

      // Acceptance validator
      // Validates that something has to be accepted, e.g. terms of use
      // `true` or 'true' are valid
      acceptance: function(value, attr, accept, model) {
        if(value !== 'true' && (!_.isBoolean(value) || value === false)) {
          return this.format(defaultMessages.acceptance, this.formatLabel(attr, model));
        }
      },

      // Min validator
      // Validates that the value has to be a number and equal to or greater than
      // the min value specified
      min: function(value, attr, minValue, model) {
        if (!isNumber(value) || value < minValue) {
          return this.format(defaultMessages.min, this.formatLabel(attr, model), minValue);
        }
      },

      // Max validator
      // Validates that the value has to be a number and equal to or less than
      // the max value specified
      max: function(value, attr, maxValue, model) {
        if (!isNumber(value) || value > maxValue) {
          return this.format(defaultMessages.max, this.formatLabel(attr, model), maxValue);
        }
      },

      // Range validator
      // Validates that the value has to be a number and equal to or between
      // the two numbers specified
      range: function(value, attr, range, model) {
        if(!isNumber(value) || value < range[0] || value > range[1]) {
          return this.format(defaultMessages.range, this.formatLabel(attr, model), range[0], range[1]);
        }
      },

      // Length validator
      // Validates that the value has to be a string with length equal to
      // the length value specified
      length: function(value, attr, length, model) {
        if (!_.isString(value) || value.length !== length) {
          return this.format(defaultMessages.length, this.formatLabel(attr, model), length);
        }
      },

      // Min length validator
      // Validates that the value has to be a string with length equal to or greater than
      // the min length value specified
      minLength: function(value, attr, minLength, model) {
        if (!_.isString(value) || value.length < minLength) {
          return this.format(defaultMessages.minLength, this.formatLabel(attr, model), minLength);
        }
      },

      // Max length validator
      // Validates that the value has to be a string with length equal to or less than
      // the max length value specified
      maxLength: function(value, attr, maxLength, model) {
        if (!_.isString(value) || value.length > maxLength) {
          return this.format(defaultMessages.maxLength, this.formatLabel(attr, model), maxLength);
        }
      },

      // Range length validator
      // Validates that the value has to be a string and equal to or between
      // the two numbers specified
      rangeLength: function(value, attr, range, model) {
        if (!_.isString(value) || value.length < range[0] || value.length > range[1]) {
          return this.format(defaultMessages.rangeLength, this.formatLabel(attr, model), range[0], range[1]);
        }
      },

      // One of validator
      // Validates that the value has to be equal to one of the elements in
      // the specified array. Case sensitive matching
      oneOf: function(value, attr, values, model) {
        if(!_.include(values, value)){
          return this.format(defaultMessages.oneOf, this.formatLabel(attr, model), values.join(', '));
        }
      },

      // Equal to validator
      // Validates that the value has to be equal to the value of the attribute
      // with the name specified
      equalTo: function(value, attr, equalTo, model, computed) {
        if(value !== computed[equalTo]) {
          return this.format(defaultMessages.equalTo, this.formatLabel(attr, model), this.formatLabel(equalTo, model));
        }
      },

      // Pattern validator
      // Validates that the value has to match the pattern specified.
      // Can be a regular expression or the name of one of the built in patterns
      pattern: function(value, attr, pattern, model) {
        if (!hasValue(value) || !value.toString().match(defaultPatterns[pattern] || pattern)) {
          return this.format(defaultMessages[pattern] || defaultMessages.inlinePattern, this.formatLabel(attr, model), pattern);
        }
      }
    };
  }());

  // Set the correct context for all validators
  // when used from within a method validator
  _.each(defaultValidators, function(validator, key){
    defaultValidators[key] = _.bind(defaultValidators[key], _.extend({}, formatFunctions, defaultValidators));
  });

  return Validation;
}(_));

define("Backbone.Validation", (function (global) {
    return function () {
        var ret, fn;
        return ret || global.Backbone.Validation;
    };
}(this)));

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ssp.libraries
// Supports infrastructure for defining model classes by using SCModel.
define('SC.EventWrapper',
	[
		'Application'
	,	'Backbone.Validation'
	,	'underscore'
	,	'SuiteLogs'
	]
,	function (
			Application
		,	BackboneValidation
		,	_
		,	SuiteLogs
	)
{
	'use strict';

	return {
		name: 'SCEventWrapper'

		/*
		@method extend use SCEventEmitter.extend to define new models. Example:

		var MyCoolThing = SCEventEmitter.extend({
			name: 'MyCoolThing'
		,	get: function(id)
			{
				return this.serialize(nlapiLoadRecord('MyCoolThingRecordType', id));
			}
		,	serialize: function() {...TODO...}
		});

		@param {name:String} model the properties and methods of the new class. The name is mandatory
		@return {SCModel} the new instance model with the new properties added ready to be used
		*/
	,	extend: function (model)
		{
			if (!model.name && !this.name)
			{
				throw {
					status: 400
				,	code: 'ERR_MISSING_MODEL_NAME'
				,	message: 'Missing model name.'
				};
			}

			var new_model = {};

			_.extend(new_model, this, model);

			_.each(new_model, function extendFunctionWithEvents(value, key)
			{
				if (typeof value === 'function' && key !== 'extend')
				{
					new_model[key] = wrapFunctionWithEvents(key, new_model, value);
				}
			});

			return new_model;
		}
	};

	// @method wrapFunctionWithEvents Gives to the received method the ability to trigger events.
	// @return {Function} result The function wrapped with events.
	function wrapFunctionWithEvents (methodName, model, fn)
	{
		return _.wrap(fn, function wrapFunctionWithEvents(func)
		{
			// Gets the arguments passed to the function from the execution code (removes func from arguments)
			var args = _.toArray(arguments).slice(1)
			,	functionName = model.name + '.' + methodName
			,	result;

			
			// Fires the 'before:ObjectName.MethodName' event most common 'before:Model.method'
			Application.trigger.apply(Application, ['before:' + functionName, this].concat(args));

			if (window.suiteLogs)
			{
				try
				{
					SuiteLogs.start(functionName, args);
					result = func.apply(this, args);
					SuiteLogs.end();
				}
				catch (e)
				{
					SuiteLogs.end(e);
					throw e;
				}
			}	
			else
			{
				result = func.apply(this, args);
			}

			// Fires the 'before:ObjectName.MethodName' event adding result as 1st parameter
			Application.trigger.apply(Application, ['after:' + functionName, this, result].concat(args));

			// Returns the result from the execution of the real code, modifications may happend in the after event
			return result;
		});
	}
});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ssp.libraries
define(
	'ServiceController.Validations'
,	[
		'underscore'
	,	'Utils'
	,	'Application'
	,	'SC.Models.Init'
	]
,	function (
		_
	,	Utils
	,	Application
	,	ModelsInit
	)
{

	'use strict';

	return {
		// @method _evaluatePermissions Evaluates if the permissions demanded are fulfilled by the user of the service
		// @parameter {transactions: Object, lists: Object} user_permissions The permissions the user has
		// @parameter {Object} required_permissions Object literal with all the permissions required by the current service
		// @parameter {String} permissions_operator The operator that must be applied to the array of permissions required by the current service
		// @return {Boolean} True if the permissions have been validated
		_evaluatePermissions: function (user_permissions, required_permissions, permissions_operator)
		{

			permissions_operator = permissions_operator || 'and';
			var	evaluation = permissions_operator !== 'or';

			if (permissions_operator !== 'and' && permissions_operator !== 'or')
			{
				console.log('Invalid permissions operator. Allowed values are: or, and');
				return false;
			}

			if (!_.isArray(required_permissions))
			{
				console.log('Invalid permissions format in controller', this.name);
				return false;
			}

			_.each(required_permissions, function (perm)
			{

				var tokens = perm.split('.');

				var partial_evaluation = !(tokens.length === 3 &&
					tokens[2] < 5 &&
					user_permissions &&
					user_permissions[tokens[0]] &&
					user_permissions[tokens[0]][tokens[1]] < tokens[2]);

				if (permissions_operator === 'or')
				{
					evaluation = evaluation || partial_evaluation;
				}
				else
				{
					evaluation = evaluation &&  partial_evaluation;
				}
			});

			return evaluation;
		}

		// @method requirePermissions
		// @parameter {Object} options
	,	requirePermissions: function (options)
		{
			var required_permissions = (options.list || []).concat(options.extraList || []);

			if (!this._evaluatePermissions(Application.getPermissions(), required_permissions, options.operator))
			{
				throw forbiddenError;
			}
		}

		// @method validateSecure If http protocol is not secure, throw an error
	,	requireSecure: function ()
		{
			if (!Utils.isCheckoutDomain())
			{
				throw methodNotAllowedError;
			}
		}

		// @method validateLoggedInPPS Verifies if user is not logged in and Pwd protected site is enabled, and if registration is enabled
	,	requireLoggedInPPS: function ()
		{
			// We've got to disable passwordProtectedSite and loginToSeePrices features if customer registration is disabled.
			// Note that this condition is expressed with 'registrationmandatory' property being 'T'
			var isRegistrationDisabled = ModelsInit.session.getSiteSettings(['registration']).registration.registrationmandatory === 'T';
			if (!isRegistrationDisabled && ModelsInit.session.getSiteSettings(['siteloginrequired']).siteloginrequired==='T' && !ModelsInit.session.isLoggedIn2())
			{
				throw unauthorizedError;
			}
		}

		// @method requireLogin If user not logged in, throw an error
	,	requireLogin: function ()
		{
			if (!ModelsInit.session.isLoggedIn2())
			{
				throw unauthorizedError;
			}
		}

		// @method checkLoggedInCheckout Pass only if we are not in checkout OR if we are logged in
	,	checkLoggedInCheckout: function()
		{
			//if SECURE AND NOT loggedIn
			if (Utils.isInCheckout(request) && !ModelsInit.session.isLoggedIn2())
			{
				throw unauthorizedError;
			}
		}
	};
});

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/* global badRequestError */
// @module ssp.libraries
define(
	'ServiceController'
,	[
		'SC.EventWrapper'
	,	'Application'
	,	'SC.Models.Init'
	,	'ServiceController.Validations'
	,	'SuiteLogs'
	,	'underscore'
	]
,	function (
		SCEventWrapper
	,	Application
	,	ModelsInit
	,	ServiceControllerValidations
	,	SuiteLogs
	,	_
	)
{
	'use strict';

	// @class ServiceController Defines the controller used by all autogenerated services
	// @extends Transaction.Model
	return SCEventWrapper.extend({

		// @property {String} name Mandatory for all ssp-libraries model
		name: 'ServiceController'

		// @method getMethod Returns which http method is used by the request
		// @return {String}
	,	getMethod: function ()
		{
			return this.request.getMethod().toLowerCase();
		}

		// @property {ServiceController.Options} options The needed permissions, validations, etc, that are exposed so they're easily extendible
	,	options: {}

		// @method _deepObjectExtend Makes a deep copy of the objects passed as parameters
		// @parameter {Service.ValidationOptions.common} target Object literal with required validation common to all methods
		// @parameter {Service.ValidationOptions.<Object>} source Object literal with required validation specific to the http method used
		// @return {Service.ValidationOptions.Extended} Object with all the validation required for the current service
	,	_deepObjectExtend: function _deepObjectExtend (target, source)
		{
			for (var prop in source)
			{
				if (prop in target)
				{
					this._deepObjectExtend(target[prop], source[prop]);
				}
				else
				{
					target[prop] = source[prop];
				}
			}
			return target;
		}

		// @method getOptions Get the validation options related to the current service
		// @parameter {String} method The HTTP method used in the request
		// @return {ServiceController.options} Object with all the validation options of the current service
	,	getOptions: function (method)
		{
      		this.options = this.options instanceof Function ? this.options() : this.options;
			return this._deepObjectExtend(this.options.common || {}, this.options[method] || {});
		}

		// @method handle Executes the function associated with the HTTP method in the proper ServiceController
		// @parameter {Service.ValidationOptions.Extended} validation_options Object literal with the validation options
		// @return {Void} This method doesn't return anything, but the functions it calls can throw errors if validation fails
	,	validateRequest: function (validation_options)
		{
			_.each(validation_options, function (validation_option, validation_name)
			{
				if (validation_option && _.isFunction(ServiceControllerValidations[validation_name]))
				{
					ServiceControllerValidations[validation_name](validation_option);
				}
			});
		}

		// @method handle Executes the function associated with the HTTP method in the proper ServiceController
		// @parameter {nlobjRequest} request
		// @parameter {nlobjResponse} response
		// @return {Void} The methods invoked on return doesn't return anything (but they can throw errors)
	,	handle: function (request, response)
		{
			this.request = request;
			this.response = response;
			this.method = this.getMethod();
			this.data = JSON.parse(this.request.getBody() || '{}');

            var options = this.getOptions(this.method);
            
			try
			{
				this.validateRequest(options);

				if (_.isFunction(this[this.method]))
				{
					var result = this[this.method]();
					if(result)
					{
						return this.sendContent(result, options);
					}
				}
				else
				{
					return this.sendError(methodNotAllowedError);
				}
			}
			catch (e)
			{
				return this.sendError(e, options);
			}
		}

		// @method sendContent Writes the given content in the request object using the right headers, and content type
		// @param {String} content
		// @param {Object} options
		// @?ref Application.sendContent The present method replaces its namesake in Application, which is outdated
	,	sendContent: function (content, options)
		{
			// Default options
			options = _.extend({status: 200, cache: false, jsonp_enabled: false}, options || {});

			// Triggers an event for you to know that there is content being sent
			Application.trigger('before:ServiceController.sendContent', content, options);

			// We set a custom status
			this.response.setHeader('Custom-Header-Status', parseInt(options.status, 10).toString());

			// The content type will be here
			var content_type = false;

			// If its a complex object we transform it into an string
			if (_.isArray(content) || _.isObject(content))
			{
				if (window.suiteLogs)
				{
					content.__SuiteLogs = SuiteLogs.toJSON();
				}

				content_type = 'JSON';
				content = JSON.stringify( content );
			}
            
            // If you set a jsonp callback this will honor it
			if (options.jsonp_enabled && this.request.getParameter('jsonp_callback'))
			{
				content_type = 'JAVASCRIPT';
				content = this.request.getParameter('jsonp_callback') + '(' + content + ');';
			}

			//Set the response cache option
			if (options.cache)
			{
				this.response.setCDNCacheable(options.cache);
			}

            if (options.content_type)
            {
                content_type = options.content_type;
            }

			// Content type was set so we send it
			content_type && this.response.setContentType(content_type);

			this.response.write(content);

			Application.trigger('after:ServiceController.sendContent', content, options);
		}

		// @method processError Builds an error object suitable to be sent back in the http response.
		// @param {nlobjError || Application.Error}
		// @returns {errorStatusCode:Number, errorCode:String, errorMessage:String} An error object suitable to send back in the http response.
		// @?ref Application.processError The present method replaces its namesake in Application, which is outdated
	,	processError: function (e)
		{
			var status = 500
			,	code = 'ERR_UNEXPECTED'
			,	message = 'error';

			if (e instanceof nlobjError)
			{
				code = e.getCode();
				message = e.getDetails();
				status = badRequestError.status;
			}
			else if (_.isObject(e) && !_.isUndefined(e.status))
			{
				status = e.status;
				code = e.code;
				message = e.message;
			}
			else
			{
				var error = nlapiCreateError(e);
				code = error.getCode();
				message = (error.getDetails() !== '') ? error.getDetails() : error.getCode();
			}

			if (code === 'INSUFFICIENT_PERMISSION')
			{
				status = forbiddenError.status;
				code = forbiddenError.code;
				message = forbiddenError.message;
			}

			var content = {
				errorStatusCode: parseInt(status,10).toString()
			,	errorCode: code
			,	errorMessage: message
			};

			if (e.errorDetails)
			{
				content.errorDetails = e.errorDetails;
			}

			if (e.messageParams)
			{
				content.errorMessageParams = e.messageParams;
			}

			return content;
		}

		// @method sendError Process the error and then writes it in the http response
		// @param {nlobjError || Application.Error} e
		// @?ref Application.sendError The present method replaces its namesake in Application, which is outdated
	,	sendError: function (e, options)
		{
            options = _.extend({jsonp_enabled: false}, options || {});
            
			_.extend(e, {'serviceControllerName': this.name});

			// @event before:ServiceController.sendError
			Application.trigger('before:ServiceController.sendError', e);

			var content = this.processError(e)
			,	content_type = 'JSON';

			this.response.setHeader('Custom-Header-Status', content.errorStatusCode);

			if (window.suiteLogs)
			{
				content.__SuiteLogs = SuiteLogs.toJSON();
			}
			
            content = JSON.stringify(content);
            
            // If you set a jsonp callback this will honor it
			if (options.jsonp_enabled && this.request.getParameter('jsonp_callback'))
			{
				content_type = 'JAVASCRIPT';
				content = this.request.getParameter('jsonp_callback') + '(' + content + ');';
			}

			this.response.setContentType(content_type);

			this.response.write(content);

			// @event after:ServiceController.sendError
			Application.trigger('after:ServiceController.sendError', e);
		}
	});
});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ssp.libraries
// Supports infrastructure for defining model classes by using SCModel.
define('SC.Model',
	[
		'SC.EventWrapper'
	,	'Backbone.Validation'
	,	'underscore'
	]
,	function (
		SCEventWrapper
	,	BackboneValidation
	,	_
	)
{
	'use strict';

	/*
	@class SCModel Subclasses of SC.EventWrapper are used to implement the RESTFUL methods for accessing a particular
	resource, in general a netsuite record like commerce order, session, or custom record.

	Note: When using SCModel for defining models think more on object singletons like in classes.

	Note: Also SCModel instances support Aspect Oriented functionality on methods so users can register to before or after a method of model is called.
	For example, we can hook to the time when an LiveOrder is submitted so we can customize its behavior like this:

	Application.on('before:LiveOrder:save', function()
	{
		... do something before submitting a live order ...
	})
	*/
	var SCModel = SCEventWrapper.extend({

		name: 'SCModel'

	,	validate: function validate(data)
		{
			//if the model has specified validation logic
			if (this.validation)
			{
				var validator = _.extend({
						validation: this.validation
					,	attributes: data
					}, BackboneValidation.mixin)

				,	invalidAttributes = validator.validate();

				if (!validator.isValid())
				{
					throw {
						status: 400
					,	code: 'ERR_BAD_REQUEST'
					,	message: invalidAttributes
					};
				}
			}
		}
	});

	return SCModel;
});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// CreditCard.Model.js
// ----------------
// This file define the functions to be used on Credit Card service
define('CreditCard.Model'
,	[
		'SC.Model'
	,	'SC.Models.Init'
	, 	'underscore'
	]
,	function (
		SCModel
	,	ModelsInit
	, 	_
)
{
	'use strict';
	return SCModel.extend({
		name: 'CreditCard'
		
	,	validation: {
			ccname: {required: true, msg: 'Name is required'}
		,	paymentmethod: {required: true, msg: 'Card Type is required'}
		,	ccnumber: {required: true, msg: 'Card Number is required'}
		,	expmonth: {required: true, msg: 'Expiration is required'}
		,	expyear: {required: true, msg: 'Expiration is required'}
		}
		
	,	get: function (id)
		{
			//Return a specific credit card
			return ModelsInit.customer.getCreditCard(id);
		}
		
	,	getDefault: function ()
		{
			//Return the credit card that the customer setted to default
			return _.find(ModelsInit.customer.getCreditCards(), function (credit_card)
			{
				return credit_card.ccdefault === 'T';
			});
		}
		
	,	list: function ()
		{
			//Return all the credit cards with paymentmethod
			return _.filter(ModelsInit.customer.getCreditCards(), function (credit_card)
			{
				return credit_card.paymentmethod;
			});
		}
		
	,	update: function (id, data)
		{
			//Update the credit card if the data is valid
			this.validate(data);
			data.internalid = id;

			return ModelsInit.customer.updateCreditCard(data);
		}
		
	,	create: function (data)
		{
			//Create a new credit card if the data is valid
			this.validate(data);

			return ModelsInit.customer.addCreditCard(data);
		}
		
	,	remove: function (id)
		{
			//Remove a specific credit card
			return ModelsInit.customer.removeCreditCard(id);
		}
	});	
});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// PaymentInstrument.Model.js
// ----------------
// This file define the functions to be used on Payment Method service
define('PaymentInstrument.Model'
,	[
		'SC.Model'
	,	'SC.Models.Init'
	, 	'underscore'
	]
,	function (
		SCModel
	,	ModelsInit
	, 	_
)
{
	'use strict';
	return SCModel.extend({
		name: 'PaymentInstrument'

	,	paymentInstruments: []

	,	get: function (id)
		{
			//Return a specific payment instrument
			return this.getRecordFields(this.getRecord(id));
		}

	,	getRecordFields: function (record)
		{
			var result = {};
			//@property {String} internalid
			result.internalid = record.getFieldValue('id');
			//@property {Boolean} isinactive
			result.isinactive = record.getFieldValue('isinactive');
			//@property {Boolean} preserveonfile
			result.preserveonfile = record.getFieldValue('preserveonfile');
			//@property {String} expirationdate
			result.expirationdate = record.getFieldValue('expirationdate');
			//@property {String} recordtype
			result.recordtype = record.getFieldValue('recordtype');
			//@property {String} id
			result.id = record.getFieldValue('id');
			//@property {String} cardnumber
			result.cardnumber = record.getFieldValue('cardnumber');
			//@property {Boolean} isdefault
			result.isdefault = record.getFieldValue('isdefault');
			//@property {Boolean} isdefault
			result.mask = record.getFieldValue('mask');
			//@property {Cardbrand} cardbrand
			result.cardbrand = {
				internalid: record.getFieldValue('cardbrand')
			,	name: record.getFieldText('cardbrand')
			};
			//@property {Instrumenttype} instrumenttype
			result.instrumenttype = {
				internalid: record.getFieldValue('instrumenttype')
			,	name: record.getFieldText('instrumenttype')
			};
			//@property {State} state
			result.state = {
				internalid: record.getFieldValue('state')
			,	name: record.getFieldText('state')
			};
			//@property {Entity} entity
			result.entity = {
				internalid: record.getFieldValue('entity')
			,	name: record.getFieldText('entity')
			};
			//@property {Paymentmethod} paymentmethod
			result.paymentmethod = this.getPaymentMethod(record.getFieldValue('paymentmethod'));

			return result;
		}

	,	getDefault: function ()
		{
			//Return the  payment instrument that the customer setted to default
			return _.find(this.paymentInstruments, function (payment_instrument)
			{
				return payment_instrument.ccdefault === 'T';
			});
		}

	,	list: function ()
		{
			//Return all the payment instruments that are not inactive
			var filters = [new nlobjSearchFilter('customer', null, 'is', nlapiGetUser()), new nlobjSearchFilter('isInactive', null, 'is', 'F')]
			,    columns = {
					internalid: new nlobjSearchColumn('internalid')
				,    paymentmethod: new nlobjSearchColumn('paymentmethod')
				,    mask: new nlobjSearchColumn('mask')
				,    default: new nlobjSearchColumn('default')
				,    lastfourdigits: new nlobjSearchColumn('lastfourdigits')
				,    cardLastFourDigits: new nlobjSearchColumn('cardLastFourDigits')
				,    paymentinstrumenttype: new nlobjSearchColumn('paymentinstrumenttype')
				,    cardExpDate: new nlobjSearchColumn('cardExpDate')
				,    cardTokenExpDate: new nlobjSearchColumn('cardTokenExpDate')
				,    nameOnCard: new nlobjSearchColumn('nameOnCard')
				,    generalTokenExpirationDate: new nlobjSearchColumn('generalTokenExpirationDate')
				,    cardTokenCardExpDate: new nlobjSearchColumn('cardTokenCardExpDate')
			}
			,	search_results = Application.getAllSearchResults('paymentinstrument', filters, _.values(columns))
			,	self = this;

			_.each(search_results, function (search_result)
			{
				var payment_method_id = search_result.getValue('paymentmethod');

				self.paymentInstruments.push({
					internalid: search_result.getValue('internalid')
					,	paymentmethod: self.getPaymentMethod(payment_method_id)
					,	instrumenttypeValue: search_result.getValue('paymentinstrumenttype')
					,	recordType: self.parseToRecordType(search_result.getText('paymentinstrumenttype'))
					,	mask: search_result.getValue('mask')
					,	ccdefault: search_result.getValue('default')
					,	cardexpirationdate: search_result.getValue('cardExpDate') || search_result.getValue('cardTokenCardExpDate') || search_result.getValue('generalTokenExpirationDate')
					,	ccname: search_result.getValue('nameOnCard')
					,	cardlastfourdigits: search_result.getValue('lastfourdigits') || search_result.getValue('cardLastFourDigits')
				});
			});

			return this.paymentInstruments;
		}

	,	update: function (id, data)
		{
			//Update the payment instrument

			var record = this.getRecord(id);
			record.setFieldValue('isdefault', data.ccdefault);

			return nlapiSubmitRecord(record);
		}

	,	create: function (data)
		{
			//Create a new credit card

			var payment_method = data.paymentmethod.split(',')[0];

			var pi = nlapiCreateRecord('paymentCard');
			pi.setFieldValue('entity', nlapiGetUser());
			pi.setFieldValue('cardnumber', data.ccnumber);
			pi.setFieldValue('nameoncard', data.ccname);
			pi.setFieldValue('expirationdate', data.expmonth + '/' + data.expyear);
			pi.setFieldValue('paymentmethod', payment_method);

			return nlapiSubmitRecord(pi);
		}

	,	remove: function (id)
		{
			var record = this.getRecord(id);
			record.setFieldValue('isinactive','T');

			return nlapiSubmitRecord(record);
		}

	,	getPaymentMethod: function (paymentmethodid)
		{
			var payment_methods = ModelsInit.session.getPaymentMethods();

			return _.findWhere(payment_methods, {internalid: paymentmethodid})
		}

	,	getRecord: function (id)
		{
			this.list();

			var record = _.find(this.paymentInstruments, function (payment_instrument)
			{
				return payment_instrument.internalid === id;
			});

			return nlapiLoadRecord(record.recordType, id);
		}

	,	parseToRecordType: function (name)
		{
			var recordType =  name.replace(/\s/g, "");

			return recordType;
		}
	});
});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// PaymentMethod.Model.js
// ----------------
// This file define the functions to be used on Payment Method service
define('PaymentMethod.Model'
,	[
		'SC.Model'
	,	'SC.Models.Init'
	,	'CreditCard.Model'
	,	'PaymentInstrument.Model'
	, 	'underscore'
	]
,	function (
		SCModel
	,	ModelsInit
	,	CreditCardModel
	,	PaymentInstrumentModel
	, 	_
)
{
	'use strict';

	var PaymentMethodModel =  SCModel.extend({
		name: 'PaymentMethod'

	,	get: function (id)
		{
			//Return a specific payment method
			return this.paymentmethod.get(id);
		}

	,	getDefault: function ()
		{
			//Return the payment method that the customer setted to default
			return this.paymentmethod.getDefault();
		}

	,	list: function ()
		{
			//Return all the payment methods
			return this.paymentmethod.list();
		}

	,	update: function (id, data)
		{
			//Update the payment method if the data is valid
			return this.paymentmethod.update(id, data);
		}

	,	create: function (data)
		{
			//Create a new payment method if the data is valid
			return this.paymentmethod.create(data);
		}

	,	remove: function (id)
		{
			//Remove a specific payment method
			return this.paymentmethod.remove(id);
		}
	});

	PaymentMethodModel.paymentmethod = (function (){
		var paymentInstrumentEnabled = ModelsInit.context.getSetting('FEATURE', 'PAYMENTINSTRUMENTS') === 'T';

		if(paymentInstrumentEnabled){
			return PaymentInstrumentModel;
		}

		return CreditCardModel;
	})();

	return PaymentMethodModel;
});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Profile
// This file define the functions to be used on profile service
define(
	'Profile.Model'
,	[
		'SC.Model'
	,	'SC.Models.Init'
	,	'PaymentMethod.Model'
	,	'Utils'
	]
,	function (
		SCModel
	,	ModelsInit
	,	PaymentMethodModel
	,	Utils
	)
{
	'use strict';

	return SCModel.extend({
		name: 'Profile'

	,	validation: {
			firstname: {required: true, msg: 'First Name is required'}

		// This code is commented temporally, because of the inconsistences between Checkout and My Account regarding the require data from profile information (Checkout can miss last name)
		,	lastname: {required: true, msg: 'Last Name is required'}

		,	email: {required: true, pattern: 'email', msg: 'Email is required'}
		,	confirm_email: {equalTo: 'email', msg: 'Emails must match'}
		}

	,	isSecure: Utils.isInCheckout(request)

	,	get: function ()
		{
			var profile = {};

			//You can get the profile information only if you are logged in.
			if (ModelsInit.session.isLoggedIn2() && this.isSecure)
			{

				//Define the fields to be returned
				this.fields = this.fields || ['isperson', 'email', 'internalid', 'name', 'overduebalance', 'phoneinfo', 'companyname', 'firstname', 'lastname', 'middlename', 'emailsubscribe', 'campaignsubscriptions', 'paymentterms', 'creditlimit', 'balance', 'creditholdoverride', 'stage'];

				profile = ModelsInit.customer.getFieldValues(this.fields);

				//Make some attributes more friendly to the response
				if(profile.phoneinfo)
				{
					profile.phone = profile.phoneinfo.phone;
					profile.altphone = profile.phoneinfo.altphone;
					profile.fax = profile.phoneinfo.fax;
				}
				profile.type = profile.isperson ? 'INDIVIDUAL' : 'COMPANY';

				profile.creditlimit = parseFloat(profile.creditlimit || 0);
				profile.creditlimit_formatted = Utils.formatCurrency(profile.creditlimit);

				profile.balance = parseFloat(profile.balance || 0);
				profile.balance_formatted = Utils.formatCurrency(profile.balance);

				profile.balance_available = profile.creditlimit - profile.balance;
				profile.balance_available_formatted = Utils.formatCurrency(profile.balance_available);

				profile.paymentmethods = PaymentMethodModel.list();
				profile.creditcards = ModelsInit.context.getSetting('FEATURE', 'PAYMENTINSTRUMENTS') === 'T' ? [] : profile.paymentmethods;
			}
			else
			{
				profile = ModelsInit.customer.getFieldValues(['addressbook', 'balance', 'campaignsubscriptions', 'companyname', 'creditcards', 'creditholdoverride', 'creditlimit', 'email', 'emailsubscribe', 'firstname', 'internalid', 'isperson', 'lastname', 'middlename', 'name', 'paymentterms', 'phoneinfo', 'vatregistration', 'stage']);

				profile.isLoggedIn = ModelsInit.session.isLoggedIn2() ? 'T' : 'F';
				profile.isRecognized = ModelsInit.session.isRecognized() ? 'T' : 'F';
				profile.isGuest = ModelsInit.customer.isGuest() ? 'T' : 'F';
				profile.priceLevel = ModelsInit.session.getShopperPriceLevel().internalid ? ModelsInit.session.getShopperPriceLevel().internalid : ModelsInit.session.getSiteSettings('defaultpricelevel');

				profile.internalid = nlapiGetUser() + '';
			}

			profile.isGuest = ModelsInit.customer.isGuest() ? 'T' : 'F';
			profile.subsidiary = ModelsInit.session.getShopperSubsidiary();
			profile.language = ModelsInit.session.getShopperLanguageLocale();
			profile.currency = ModelsInit.session.getShopperCurrency();
			profile.priceLevel = ModelsInit.session.getShopperPriceLevel().internalid ? ModelsInit.session.getShopperPriceLevel().internalid : ModelsInit.session.getSiteSettings(['defaultpricelevel']).defaultpricelevel;
			profile.customer = (profile.stage === 'CUSTOMER');
			profile.customfields = ModelsInit.customer.getCustomFields();

			return profile;
		}

	,	update: function (data)
		{
			var login = nlapiGetLogin();

			if (data.current_password && data.password && data.password === data.confirm_password)
			{
				//Updating password
				return login.changePassword(data.current_password, data.password);
			}

			this.currentSettings = ModelsInit.customer.getFieldValues();

			//Define the customer to be updated

			var customerUpdate = {
				internalid: parseInt(nlapiGetUser(), 10)
			};

			//Assign the values to the customer to be updated

			customerUpdate.firstname = data.firstname;

			if(data.lastname !== '')
			{
				customerUpdate.lastname = data.lastname;
			}

			if(this.currentSettings.lastname === data.lastname)
			{
				delete this.validation.lastname;
			}

			customerUpdate.companyname = data.companyname;

			customerUpdate.phoneinfo = {
					altphone: data.altphone
				,	phone: data.phone
				,	fax: data.fax
			};

			if(data.phone !== '')
			{
				customerUpdate.phone = data.phone;
			}

			if(this.currentSettings.phone === data.phone)
			{
				delete this.validation.phone;
			}

			customerUpdate.emailsubscribe = (data.emailsubscribe && data.emailsubscribe !== 'F') ? 'T' : 'F';

			if (!(this.currentSettings.companyname === '' || this.currentSettings.isperson || ModelsInit.session.getSiteSettings(['registration']).registration.companyfieldmandatory !== 'T'))
			{
				this.validation.companyname = {required: true, msg: 'Company Name is required'};
			}

			if (!this.currentSettings.isperson)
			{
				delete this.validation.firstname;
				delete this.validation.lastname;
			}

			//Updating customer data
			if (data.email && data.email !== this.currentSettings.email && data.email === data.confirm_email && data.isGuest === 'T')
				{
					customerUpdate.email = data.email;
				}
			else if (data.new_email && data.new_email === data.confirm_email && data.new_email !== this.currentSettings.email)
				{
				ModelsInit.session.login({
					email: data.email
				,	password: data.current_password
				});
				login.changeEmail(data.current_password, data.new_email, true);
			}

			// Patch to make the updateProfile call work when the user is not updating the email
			data.confirm_email = data.email;

			this.validate(data);
			// check if this throws error
			ModelsInit.customer.updateProfile(customerUpdate);

			if (data.campaignsubscriptions)
			{
				ModelsInit.customer.updateCampaignSubscriptions(data.campaignsubscriptions);
			}

			return this.get();
		}
	});
});

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/* global invalidItemsFieldsAdvancedName */
// StoreItem.js
// ----------
// Handles the fetching of items information for a collection of order items
// If you want to fetch multiple items please use preloadItems before/instead calling get() multiple times.

/* jshint -W053 */
// We HAVE to use "new String"
// So we (disable the warning)[https:// groups.google.com/forum/#!msg/jshint/O-vDyhVJgq4/hgttl3ozZscJ]
define(
	'StoreItem.Model'
,	[	'SC.Model'
	,	'SC.Models.Init'
	,	'underscore'
	,	'Configuration'
	]
,	function (
		SCModel
	,	ModelsInit

	,	_
	,	Configuration
	)
{
	'use strict';
	return SCModel.extend({
		name: 'StoreItem'

		// Returns a collection of items with the items iformation
		// the 'items' parameter is an array of objects {id,type}
		// fieldset_name allows to specify an alternative fieldset distinct
		// from the one specified in the configuration.
	,	preloadItems: function (items, fieldset_name)
		{
			var self = this
			,	items_by_id = {}
			,	parents_by_id = {}
			,	fieldKeys = Configuration.get('fieldKeys')
			,	itemsFieldsStandardKeys = fieldKeys && fieldKeys.itemsFieldsStandardKeys || [];

			if(!itemsFieldsStandardKeys.length)
			{
				return {};
			}

			items = items || [];

			this.preloadedItems = this.preloadedItems || {};

			items.forEach(function (item)
			{
				if (!item.id || !item.type || item.type === 'Discount' || item.type === 'OthCharge' || item.type === 'Markup')
				{
					return;
				}

				if (!self.getPreloadedItem(item.id, fieldset_name))
				{
					items_by_id[item.id] = {
						internalid: new String(item.id).toString()
					,	itemtype: item.type
					,	itemfields: itemsFieldsStandardKeys
					};
				}
			});

			if (!_.size(items_by_id))
			{
				return this.preloadedItems;
			}

			var items_details = this.getItemFieldValues(items_by_id, fieldset_name);

			// Generates a map by id for easy access. Notice that for disabled items the array element can be null
			_.each(items_details, function (item)
			{
				if (item && typeof item.itemid !== 'undefined')
				{
					if (item.itemoptions_detail && item.itemoptions_detail.matrixtype === 'child')
					{
						parents_by_id[item.itemoptions_detail.parentid] = {
							internalid: new String(item.itemoptions_detail.parentid).toString()
						,	itemtype: item.itemtype
						,	itemfields:itemsFieldsStandardKeys
						};
					}

					self.setPreloadedItem(item.internalid, item, fieldset_name);
				}
			});

			if (_.size(parents_by_id))
			{
				var parents_details = this.getItemFieldValues(parents_by_id, fieldset_name);

				_.each(parents_details, function (item)
				{
					if (item && typeof item.itemid !== 'undefined')
					{
						self.setPreloadedItem(item.internalid, item, fieldset_name);
					}
				});
			}

			// Adds the parent information to the child
			_.each(this.preloadedItems, function (item)
			{
				if (item.itemoptions_detail && item.itemoptions_detail.matrixtype === 'child')
				{
					item.matrix_parent = self.getPreloadedItem(item.itemoptions_detail.parentid, fieldset_name);
				}
			});

			return this.preloadedItems;
		}

	,	getItemFieldValues: function (items_by_id, fieldset_name)
		{
			var	item_ids = _.values(items_by_id)
			,	is_advanced = ModelsInit.session.getSiteSettings(['sitetype']).sitetype === 'ADVANCED';

			// Check if we have access to fieldset
			if (is_advanced)
			{
				try
				{
					fieldset_name = _.isUndefined(fieldset_name) ? Configuration.get('fieldKeys.itemsFieldsAdvancedName') : fieldset_name;

					// SuiteCommerce Advanced website have fieldsets
					return ModelsInit.session.getItemFieldValues(fieldset_name, _.pluck(item_ids, 'internalid')).items;
				}
				catch (e)
				{
					throw invalidItemsFieldsAdvancedName;
				}
			}
			else
			{
				// Sitebuilder website version doesn't have fieldsets
				return ModelsInit.session.getItemFieldValues(item_ids);
			}
		}

		// Return the information for the given item
	,	get: function (id, type, fieldset_name)
		{
			this.preloadedItems = this.preloadedItems || {};

			if (!this.getPreloadedItem(id, fieldset_name))
			{
				this.preloadItems([{
					id: id
				,	type: type
				}]
				,	fieldset_name);
			}

			return this.getPreloadedItem(id, fieldset_name);
		}

	,	getPreloadedItem: function (id, fieldset_name)
		{
			return this.preloadedItems[this.getItemKey(id, fieldset_name)];
		}

	,	setPreloadedItem: function (id, item, fieldset_name)
		{
			this.preloadedItems[this.getItemKey(id, fieldset_name)] = item;
		}

	,	getItemKey: function (id, fieldset_name)
		{
			fieldset_name = _.isUndefined(fieldset_name) && Configuration.get('fieldKeys') ? Configuration.get('fieldKeys.itemsFieldsAdvancedName') : fieldset_name;

			return id + '#' + fieldset_name;
		}

	,	set: function (item, fieldset_name)
		{
			this.preloadedItems = this.preloadedItems || {};

			if (item.internalid)
			{
				this.setPreloadedItem(item.internalid, item, fieldset_name);
			}
		}
	});
});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module SiteSettings
// Pre-processes the SiteSettings to be used on the site
define(
	'SiteSettings.Model'
,	[	'SC.Model'
	,	'SC.Models.Init'
	,	'underscore'
	,	'Utils'
	,	'Configuration'
	]
,	function (
		SCModel
	,	ModelsInit
	,	_
	,	Utils
	,	Configuration
	)
{
	'use strict';

	var settings_cache;

	// @class SiteSettings Pre-processes the SiteSettings to be used on the site. For performance reasons it
	// adds a cache layer using netsuite's application cache. Cache use the siteid in the keyword to support multi sites.
	// Cache douration can be configured in cacheTtl property. Some properties like touchpoints, siteid, languages and currencies are never cached.
	// @extends SCModel
	return SCModel.extend({

		name: 'SiteSettings'

		// @method get the site settings. Notice that can be cached @returns { ShoppingSession.SiteSettings}
	,	get: function ()
		{
			var i
			,	countries
			,	shipToCountries
			,	settings;

			if (settings_cache)
			{
				settings = settings_cache;
			}
			else
			{
				settings = ModelsInit.session.getSiteSettings();

				if (settings.shipallcountries === 'F')
				{
					if (settings.shiptocountries)
					{
						shipToCountries = {};

						for (i = 0; i < settings.shiptocountries.length; i++)
						{
							shipToCountries[settings.shiptocountries[i]] = true;
						}
					}
				}

				// Get all available countries.
				var allCountries = ModelsInit.session.getCountries();

				if (shipToCountries)
				{
					// Remove countries that are not in the shipping countries
					countries = {};

					for (i = 0; i < allCountries.length; i++)
					{
						if (shipToCountries[allCountries[i].code])
						{
							countries[allCountries[i].code] = allCountries[i];
						}
					}
				}
				else
				{
					countries = {};

					for (i = 0; i < allCountries.length; i++)
					{
						countries[allCountries[i].code] = allCountries[i];
					}
				}

				// Get all the states for countries.
				var allStates = ModelsInit.session.getStates();

				if (allStates)
				{
					for (i = 0; i < allStates.length; i++)
					{
						if (countries[allStates[i].countrycode])
						{
							countries[allStates[i].countrycode].states = allStates[i].states;
						}
					}
				}

				// Adds extra information to the site settings
				settings.countries = countries;
				settings.phoneformat = ModelsInit.context.getPreference('phoneformat');
				settings.minpasswordlength = ModelsInit.context.getPreference('minpasswordlength');
				settings.campaignsubscriptions = ModelsInit.context.getFeature('CAMPAIGNSUBSCRIPTIONS');
				settings.defaultSubscriptionStatus = ModelsInit.context.getPreference('MARKETING_UNSUBSCRIBED_DEFAULT') === 'F';
				settings.analytics.confpagetrackinghtml = _.escape(settings.analytics.confpagetrackinghtml);
				settings.quantitypricing = ModelsInit.context.getFeature('QUANTITYPRICING');

				// Other settings that come in window object
				settings.groupseparator = window.groupseparator;
				settings.decimalseparator = window.decimalseparator;
				settings.negativeprefix = window.negativeprefix;
				settings.negativesuffix = window.negativesuffix;
				settings.dateformat = window.dateformat;
				settings.longdateformat = window.longdateformat;

				settings.isMultiShippingRoutesEnabled = this.isMultiShippingRoutesEnabled();

				settings.isPickupInStoreEnabled = this.isPickupInStoreEnabled();

				settings.isSuiteTaxEnabled = this.isSuiteTaxEnabled();

				settings.isAutoapplyPromotionsEnabled = this.isAutoapplyPromotionsEnabled();

				settings.isSCISIntegrationEnabled = this.isSCISIntegrationEnabled();

				settings.checkoutSupported = Utils.isCheckoutDomain();
				settings.shoppingSupported = Utils.isShoppingDomain();
				settings.isHttpsSupported = Utils.isHttpsSupported();
				settings.isSingleDomain = settings.checkoutSupported && settings.shoppingSupported;

				// delete unused fields
				delete settings.entrypoints;

				settings_cache = settings;
			}

			settings.is_logged_in = ModelsInit.session.isLoggedIn2();
			settings.shopperCurrency = ModelsInit.session.getShopperCurrency();
			settings.touchpoints = this.getTouchPoints();

			return settings;
		}
		// @method isPickupInStoreEnabled. @returns {Boolean}
	,	isPickupInStoreEnabled: function ()
		{
			return Configuration.get('isPickupInStoreEnabled') && ModelsInit.context.getSetting('FEATURE', 'STOREPICKUP') === 'T';
		}
		// @method isSuiteTaxEnabled. @returns {Boolean}
	,	isSuiteTaxEnabled: function ()
		{
			return ModelsInit.context.getSetting('FEATURE', 'tax_overhauling') === 'T';
		}
		// @method isSCISIntegrationEnabled. @returns {Boolean}
	,	isSCISIntegrationEnabled : function ()
		{
			return Configuration.get('isSCISIntegrationEnabled') && Utils.recordTypeHasField('salesorder','custbody_ns_pos_transaction_status');
		}
		// @method isMultiShippingRoutesEnabled. @returns {Boolean}
	,	isMultiShippingRoutesEnabled: function ()
		{
			return Configuration.get('isMultiShippingEnabled') && ModelsInit.context.getSetting('FEATURE', 'MULTISHIPTO') === 'T';
		}
		// @method isAutoapplyPromotionsEnabled. @returns {Boolean}
	,	isAutoapplyPromotionsEnabled: function ()
		{
			return ModelsInit.session.getSiteSettings(['autoapplypromotionsenabled']).autoapplypromotionsenabled==='T';
		}
		// @method getTouchPoints. @returns {Object}
	,	getTouchPoints: function ()
		{
			var settings = ModelsInit.session.getSiteSettings(['touchpoints', 'sitetype', 'id']);

			if (!Utils.isHttpsSupported() && settings.sitetype === 'ADVANCED')
			{
				settings.touchpoints.storelocator = ModelsInit.session.constructDomainBridgingUrl(ModelsInit.session.getAbsoluteUrl2('checkout', '/checkout.ssp?is=storelocator&n=' + settings.id));
			}

			return settings.touchpoints;
		}
	});
});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/


// @module ExternalPayment
define(
	'ExternalPayment.Model'
,	[
		'SC.Model'
	,	'underscore'
	,	'SC.Models.Init'
	,	'SiteSettings.Model'
	,	'Utils'
	]
,	function (
		SCModel
	,	_
	,	ModelsInit
	,	SiteSettings
	,	Utils
	)
{
	'use strict';

	// @class ExternalPayment.Model
	// @extends SCModel
	return SCModel.extend({

		name: 'ExternalPayment'

	,	errorCode: ['externalPaymentValidationStatusFail', 'externalPaymentRequestInvalidParameters', 'externalPaymentMissingImplementation', 'externalPaymentRecordValidationStatusFail']

	,	generateUrl: function (id, record_type)
		{
			this.siteSettings = this.siteSettings || SiteSettings.get();

			var parameters = [
				'nltranid=' + id
			,	'orderId=' + id
			,	'n=' + this.siteSettings.siteid
			,	'recordType=' + record_type
			,	'goToExternalPayment=T'
			];

			return ModelsInit.session.getAbsoluteUrl2('/external_payment.ssp?' + parameters.join('&'));
		}

	,	goToExternalPayment: function (request)
		{
			var record_type = request.getParameter('recordType')
			,	id = request.getParameter('orderId') || request.getParameter('nltranid')
			,	touchpoint = request.getParameter('touchpoint')
			,	result = {parameters: {}}
			,	record = this._loadRecord(record_type, id);

			if (!this._validateRecordStatus(record))
			{
				result.touchpoint = touchpoint;
				result.parameters.errorCode = 'externalPaymentValidationStatusFail';
			}
			else
			{
				ModelsInit.context.setSessionObject('external_nltranid_' + id, id);
				result.url = record.getFieldValue('redirecturl');
			}

			return result;
		}

	,	backFromExternalPayment: function (request)
		{
			var id = request.getParameter('orderId') || request.getParameter('nltranid')
			,	record_type = request.getParameter('recordType')
			,	touchpoint = request.getParameter('touchpoint')
			,	result = {
					touchpoint: touchpoint
				,	parameters: {
						nltranid: id
					,	recordType: record_type
					,	externalPayment: this._isDone(request, record_type) ? 'DONE' : (this._isReject(request, record_type) ? 'FAIL' : '')
					}
				};

			if (!this._preventDefault(request, record_type))
			{
				var record = this._loadRecord(record_type, id);

				if (!this._validateRecordStatus(record))
				{
					result.parameters.errorCode = 'externalPaymentRecordValidationStatusFail';
				}
				else if (!this._validateStatusFromRequest(request, record_type) || !this._validateTransactionId(id))
				{
					result.parameters.errorCode = 'externalPaymentRequestInvalidParameters';
				}
				else
				{
					var method_name = '_updatePaymentMethod' + record_type.toUpperCase();

					if (_.isFunction(this[method_name]))
					{
						this[method_name](record, request);
					}
					else
					{
						result.parameters.errorCode = 'externalPaymentMissingImplementation';
					}
				}
			}

			ModelsInit.context.setSessionObject('external_nltranid_' + id, '');

			return result;
		}

	,	getParametersFromRequest: function (request)
		{
			var nltranid = parseInt(request.getParameter('nltranid') || request.getParameter('orderId'), 10)
			,	record_type = request.getParameter('recordType')
			,	external_payment = request.getParameter('externalPayment')
			,	error_code = request.getParameter('errorCode')
			,	result;


			if ((external_payment === 'DONE' || external_payment === 'FAIL') && !_.isNaN(nltranid) && record_type)
			{
				result = {
					recordType: record_type
				,	nltranid: nltranid
				,	externalPayment: external_payment
				,	errorCode: error_code ? _.contains(this.errorCode, error_code) ? error_code : 'externalPaymentRequestInvalidParameters' : ''
				};
			}

			return result;
		}

	,	_updatePaymentMethodCUSTOMERPAYMENT: function (record, request)
		{
			var record_type = 'customerpayment';

			if (this._isDone(request, record_type))
			{
				record.setFieldValue('datafromredirect', this._getDataFromRedirect(request, record_type));
				record.setFieldValue('chargeit', 'T');

				nlapiSubmitRecord(record);
			}
		}

	,	_updatePaymentMethodSALESORDER: function (record, request)
		{
			var record_type = 'salesorder';

			if (this._isDone(request, record_type))
			{
				record.setFieldValue('datafromredirect', this._getDataFromRedirect(request, record_type));
				record.setFieldValue('getauth', 'T');
				record.setFieldValue('paymentprocessingmode', 'PROCESS');

				nlapiSubmitRecord(record, false, true);
			}

		}

	,	_isDone: function (request, record_type)
		{
			var status = this._getStatusFromRequest(request, record_type)
			,	status_accept_value = this._getConfiguration(record_type, 'statusAcceptValue', 'ACCEPT')
			,	status_hold_value = this._getConfiguration(record_type, 'statusHoldValue', 'HOLD');

			return status === status_accept_value || status === status_hold_value;
		}

	,	_isReject: function (request, record_type)
		{
			var status = this._getStatusFromRequest(request, record_type)
			,	status_reject_value = this._getConfiguration(record_type, 'statusRejectValue', 'REJECT');

			return status === status_reject_value;
		}

	,	_loadRecord: function (record_type, id)
		{
			return nlapiLoadRecord(record_type, id);
		}

	,	_validateRecordStatus: function (record)
		{
			return record.getFieldValue('paymenteventholdreason') === 'FORWARD_REQUESTED';
		}

	,	_getStatusFromRequest: function (request, record_type)
		{
			return request.getParameter(this._getConfiguration(record_type, 'statusParameterName' , 'status'));
		}

	,	_validateStatusFromRequest: function (request, record_type)
		{
			var status = this._getStatusFromRequest(request, record_type)
			,	status_accept_value = this._getConfiguration(record_type, 'statusAcceptValue' , 'ACCEPT')
			,	status_hold_value = this._getConfiguration(record_type, 'statusHoldValue' , 'HOLD')
			,	status_reject_value = this._getConfiguration(record_type, 'statusRejectValue' , 'REJECT');

			return status === status_accept_value || status === status_hold_value || status === status_reject_value;
		}

	,	_validateTransactionId: function (nltranid)
		{
			return ModelsInit.context.getSessionObject('external_nltranid_' + nltranid) === nltranid;
		}

	,	_getDataFromRedirect: function (request, record_type)
		{
			var request_parameters = request.getAllParameters()
			,	configration_parameters = this._getConfiguration(record_type, 'parameters' , ['tranid', 'authcode', 'status'])
			,	data_from_redirect = [];

			_.each(_.keys(request_parameters), function (parameter_name)
			{
				if (_.contains(configration_parameters, parameter_name))
				{
					data_from_redirect.push( parameter_name + '=' + request_parameters[parameter_name] );
				}
			});

			console.log(JSON.stringify(data_from_redirect));

			return data_from_redirect.join('&');
		}

	,	_preventDefault: function (request, record_type)
		{
			var prevent_default_value = this._getConfiguration(record_type, 'preventDefaultValue', 'T')
			,	prevent_default_parameter_name = this._getConfiguration(record_type, 'preventDefaultParameterName', 'preventDefault');

			return request.getParameter(prevent_default_parameter_name) === prevent_default_value;
		}


	,	_getConfiguration: function (record_type, property, default_value)
		{
			this.siteSettings = this.siteSettings || SiteSettings.get();

			var external_payment_configuration = this.siteSettings.externalPayment || {}
			,	record_configuration = external_payment_configuration[record_type.toUpperCase()] || {};

			if (_.isUndefined(record_configuration[property]))
			{
				return default_value;
			}
			else
			{
				return record_configuration[property];
			}
		}
	});
});

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module CustomFields
define(
	'CustomFields.Utils'
,	[
		'Configuration'
	]
,	function (
		Configuration
	)
{

	'use strict';

	// @class CustomFields.Utils Define a set of utilities related with custom fields
	return {
		//@method getCustomFieldsIdToBeExposed Get the list of fields id from configuration that should be exposed
		//return {Array} A array with the custom fields id
		getCustomFieldsIdToBeExposed: function(recordType)
		{
			if (Configuration.get().customFields)
			{
				return Configuration.get().customFields[recordType] || [];
			}

			return [];
		}
	};
});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/* jshint -W053 */
// We HAVE to use "new String"
// So we (disable the warning)[https://groups.google.com/forum/#!msg/jshint/O-vDyhVJgq4/hgttl3ozZscJ]
// @module LiveOrder

define(
	'LiveOrder.Model'
,	[
		'SC.Model'
	,	'Application'
	,	'Profile.Model'
	,	'StoreItem.Model'
	,	'SC.Models.Init'
	,	'SiteSettings.Model'
	,	'Utils'
	,	'ExternalPayment.Model'
	,	'underscore'
	,	'CustomFields.Utils'
	,	'Configuration'
	]
,	function (
		SCModel
	,	Application
	,	Profile
	,	StoreItem
	,	ModelsInit
	,	SiteSettings
	,	Utils
	,	ExternalPayment
	,	_
	,	CustomFieldsUtils
	,	Configuration
	)
{
	'use strict';

	// @class LiveOrder.Model Defines the model used by the LiveOrder.Service.ss service
	// Available methods allow fetching and updating Shopping Cart's data. Works against the
	// Shopping session order, this is, nlapiGetWebContainer().getShoppingSession().getOrder()
	// @extends SCModel
	return SCModel.extend({

		name: 'LiveOrder'
		// @property {Boolean} isSecure
	,	isSecure: Utils.isCheckoutDomain()
		// @property {Boolean} isMultiShippingEnabled
	,	isMultiShippingEnabled: SiteSettings.isMultiShippingRoutesEnabled()
		// @property {Boolean} isPickupInStoreEnabled
	,	isPickupInStoreEnabled: SiteSettings.isPickupInStoreEnabled()
		// @property {Boolean} isSuiteTaxEnabled
	,	isSuiteTaxEnabled: SiteSettings.isSuiteTaxEnabled()

		// @method get
		// @returns {LiveOrder.Model.Data}
	,	get: function get ()
		{
			var order_fields = this.getFieldValues()
			,	result = {};

			// @class LiveOrder.Model.Data object containing high level shopping order object information. Serializeble to JSON and this is the object that the .ss service will serve and so it will poblate front end Model objects
			try
			{
				//@property {Array<LiveOrder.Model.Line>} lines
				result.lines = this.getLines(order_fields);
			}
			catch (e)
			{
				if (e.code === 'ERR_CHK_ITEM_NOT_FOUND')
				{
					return this.get();
				}
				else
				{
					throw e;
				}
			}

			order_fields = this.hidePaymentPageWhenNoBalance(order_fields);

			// @property {Array<String>} lines_sort sorted lines ids
			result.lines_sort = this.getLinesSort();

			// @property {String} latest_addition
			result.latest_addition = ModelsInit.context.getSessionObject('latest_addition');

			// @property {Array<LiveOrder.Model.PromoCode>} promocodes
			result.promocodes = this.getPromoCodes(order_fields);

			if (this.automaticallyRemovedPromocodes)
			{
				result.automaticallyremovedpromocodes = this.automaticallyRemovedPromocodes;
			}

			// @property {Boolean} ismultishipto
			result.ismultishipto = this.getIsMultiShipTo(order_fields);

			// Ship Methods
			if (result.ismultishipto)
			{
				// @property {Array<OrderShipMethod>} multishipmethods
				result.multishipmethods = this.getMultiShipMethods(result.lines);

				// These are set so it is compatible with non multiple shipping.
				result.shipmethods = [];
				result.shipmethod = null;
			}
			else
			{
				// @property {Array<OrderShipMethod>} shipmethods
				result.shipmethods = this.getShipMethods(order_fields);
				// @property {OrderShipMethod} shipmethod
				result.shipmethod = order_fields.shipmethod ? order_fields.shipmethod.shipmethod : null;
			}

			// Addresses
			result.addresses = this.getAddresses(order_fields);
			result.billaddress = order_fields.billaddress ? order_fields.billaddress.internalid : null;
			result.shipaddress = !result.ismultishipto ? order_fields.shipaddress.internalid : null;

			// @property {Array<ShoppingSession.PaymentMethod>} paymentmethods Payments
			result.paymentmethods = this.getPaymentMethods(order_fields);

			// @property {Boolean} isPaypalComplete Paypal complete
			result.isPaypalComplete = ModelsInit.context.getSessionObject('paypal_complete') === 'T';

			// @property {Array<String>} touchpoints Some actions in the live order may change the URL of the checkout so to be sure we re send all the touchpoints
			result.touchpoints = SiteSettings.getTouchPoints();

			// @property {Boolean} agreetermcondition Terms And Conditions
			result.agreetermcondition = order_fields.agreetermcondition === 'T';

			// @property {OrderSummary} Summary
			result.summary = order_fields.summary;
			if (result.summary)
			{
                result.summary.discountrate = Utils.toCurrency(result.summary.discountrate);
			}

			// @property {Object} options Transaction Body Field
			result.options = this.getTransactionBodyField();

			result.purchasenumber = order_fields.purchasenumber;

			// @class LiveOrder.Model
			return result;
		}

		// @method update will update the commerce order object with given data.
		// @param {LiveOrder.Model.Data} data
	,	update: function update (data)
		{

			var current_order = this.get()
			// We use this because we do not want to update certain atributes of the order if they had the same value as the provided as update's input.
			// This is because, through the Extensibility API, an extension may have made some changes to the order and those may be overwritten if the update's input has a different value.
			,	pre_update_order = this.get();

			var executeConditionalSet = _.partial(this._executeConditionalSet, data, current_order, pre_update_order);
			executeConditionalSet = _.bind(executeConditionalSet, this);

			this.storePromosPrevState();

			// Only do this if it's capable of shipping multiple items.
			if (this.isMultiShippingEnabled)
			{
				if (this.isSecure && ModelsInit.session.isLoggedIn2())
				{
					ModelsInit.order.setEnableItemLineShipping(!!data.ismultishipto);
					if (!current_order.ismultishipto && data.ismultishipto)
					{
						this.automaticallyRemovedPromocodes = this.getAutomaticallyRemovedPromocodes(current_order);
					}
				}
				// Do the following only if multishipto is active (if the data received determine that MST is enabled and pass the MST Validation)
				if (data.ismultishipto)
				{
					ModelsInit.order.removeShippingAddress();

					ModelsInit.order.removeShippingMethod();

					this.splitLines(data, current_order);

					this.setShippingAddressAndMethod(data, current_order);
				}
			}

			if (!this.isMultiShippingEnabled || !data.ismultishipto)
			{
				var isDataShipAddressDifferentToCurrentShipAddress = data.shipaddress !== current_order.shipaddress;
				executeConditionalSet('setShippingAddress');
				executeConditionalSet('setShippingMethod');
			}

			executeConditionalSet('setPromoCodes');

			executeConditionalSet('setBillingAddress');

			executeConditionalSet('setPaymentMethods');

			this.setPurchaseNumber(data, current_order);

			this.setTermsAndConditions(data, current_order);

			this.setTransactionBodyField(data, current_order);

			this.manageFreeGifts();

			if(this.isSuiteTaxEnabled && !this.isMultiShippingEnabled && !data.ismultishipto &&  isDataShipAddressDifferentToCurrentShipAddress) {
				ModelsInit.order.recalculateTaxes();
		}
		}

	,	_executeConditionalSet: function _executeConditionalSet(data, current_order, pre_update_order, fn_name)
		{
			var validations = {
				setShippingAddress: function()
				{
					return data.shipaddress !== pre_update_order.shipaddress;
				}
			,	setBillingAddress: function()
				{
					if (data.sameAs)
					{
						data.billaddress = data.shipaddress;
					}

					return data.billaddress !== pre_update_order.billaddress;
				}
			,	setShippingMethod: function()
				{
					return data.shipmethod !== pre_update_order.shipmethod;
				}
			,	setPromoCodes: function()
				{
					var pre_promocodes = _.pluck(pre_update_order.promocodes, 'code')
					,	data_promocodes = _.pluck(data.promocodes, 'code');

					return !_.isEmpty(_.difference(pre_promocodes, data_promocodes)) || !_.isEmpty(_.difference(data_promocodes, pre_promocodes));
				}
			,	setPaymentMethods: function()
				{
					if(data.paymentmethods.length !== pre_update_order.paymentmethods.length)
					{
						return true;
					}

					var data_payments = _.map(data.paymentmethods, function (payment)
					{
						if(payment.type === 'giftcertificate')
						{
							return payment.giftcertificate;
						}
						else if(payment.type === 'creditcard')
						{
							payment.creditcard.type = payment.type;
							return payment.creditcard;
						}

						return payment;
					});

					var pre_payments = _.map(pre_update_order.paymentmethods, function (payment)
					{
						if(payment.type === 'giftcertificate')
						{
							return payment.giftcertificate;
						}
						else if(payment.type === 'creditcard')
						{
							payment.creditcard.type = payment.type;
							return payment.creditcard;
						}

						return payment;
					});

					for(var i = 0; i < data_payments.length; i++)
					{
						var data_payment = data_payments[i]
						,	filter = {type: data_payment.type};

						switch(data_payment.type)
						{
							case 'creditcard':
								filter.ccnumber = data_payment.ccnumber;
								filter.ccsecuritycode = data_payment.ccsecuritycode;
								filter.ccname = data_payment.ccname;
								filter.expmonth = data_payment.expmonth;
								filter.expyear = data_payment.expyear;
								break;
							case 'invoice':
								//Filtering by type is enough because a customer always have the same terms
								break;
							case 'paypal':
								filter.internalid = data_payment.internalid;
								break;
							case 'giftcertificate':
								filter.code = data_payment.code;
								break;
							default:
								//external payment
								filter.internalid = data_payment.internalid;
								break;
						}

						if(!_.findWhere(pre_payments, filter))
						{
							return true;
						}
					}

					return false;
				}
			}
			,	execute_set = validations[fn_name] && validations[fn_name]();

			if(execute_set)
			{
				this[fn_name].apply(this, [data, current_order]);
			}
		}


		// @method submit will call ModelsInit.order.submit() taking in account paypal payment
		// @param {Boolean} threedsecure Received only in 3D Secure second step (from threedsecure.ssp)
		// @return {Object} Result of order submit operation ({status, internalid, confirmationnumber})
		,	submit: function submit (threedsecure)
			{

			    var confirmation
			,   payment = ModelsInit.order.getPayment();

			if (!threedsecure && payment && payment.paymentterms === 'CreditCard' && Configuration.get('isThreeDSecureEnabled'))
				{
				    return this.process3DSecure();
				}
				else
				{
				var paypal_address = _.find(ModelsInit.customer.getAddressBook(), function (address)
					{
						return !address.phone && address.isvalid === 'T';
					});

				confirmation = ModelsInit.order.submit();

				if (this.isMultiShippingEnabled)
				{
				    ModelsInit.order.setEnableItemLineShipping(false); // By default non order should be MST
				}


				//As the commerce API does not remove the purchase number after submitting the order we manually remove it
				this.setPurchaseNumber();

				if (confirmation.statuscode !== 'redirect')
				{
				   confirmation = _.extend(this.getConfirmation(confirmation.internalid), confirmation);
				}
				else
				{
			    	var paypal_complete = ModelsInit.context.getSessionObject('paypal_complete') === 'T';

					if (confirmation.reasoncode === 'ERR_WS_INVALID_PAYMENT' && paypal_complete)
			   		{

						var message = '<a href="' + confirmation.redirecturl + '">Paypal</a> was unable to process the payment. <br>Please select an alternative <a href="#billing">payment method</a> and continue to checkout.';

						throw {
							status: 500
						,	code: confirmation.reasoncode
						,	message: message
						};
		    		}

		     		confirmation.redirecturl = ExternalPayment.generateUrl(confirmation.internalid, 'salesorder');
		  		}

				// We need remove the paypal's address because after order submit the address is invalid for the next time.

		    	this.removePaypalAddress(paypal_address);

		    	ModelsInit.context.setSessionObject('paypal_complete', 'F');

		    }

		    return confirmation;
		}


		// @method addAddress
		// @param {OrderAddress} address
		// @param {Array<OrderAddress>} addresses
		// @returns {String} the given address internal id
	,	addAddress: function addAddress (address, addresses)
		{
			if (!address)
			{
				return null;
			}

			addresses = addresses || {};

			if (!address.fullname)
			{
				address.fullname = address.attention ? address.attention : address.addressee;
			}

			if (!address.company)
			{
				address.company = address.attention ? address.addressee : null;
			}

			delete address.attention;
			delete address.addressee;

			if (!address.internalid)
			{
				address.internalid =	(address.country || '') + '-' +
										(address.state || '') + '-' +
										(address.city || '') + '-' +
										(address.zip || '') + '-' +
										(address.addr1 || '') + '-' +
										(address.addr2 || '') + '-' +
										(address.fullname || '') + '-' +
										address.company;

				address.internalid = address.internalid.replace(/\s/g, '-');
			}

			if (address.internalid !== '-------null')
			{
				addresses[address.internalid] = address;
			}

			return address.internalid;
		}

		// @method hidePaymentPageWhenNoBalance
		// @param {Array<String>} order_fields
	,	hidePaymentPageWhenNoBalance: function hidePaymentPageWhenNoBalance (order_fields)
		{
			if (this.isSecure && ModelsInit.session.isLoggedIn2() && order_fields.payment && ModelsInit.session.getSiteSettings(['checkout']).checkout.hidepaymentpagewhennobalance === 'T' && order_fields.summary.total === 0)
			{
				ModelsInit.order.removePayment();
				order_fields = this.getFieldValues();
			}
			return order_fields;
		}

		// @method redirectToPayPal calls ModelsInit.order.proceedToCheckout() method passing information for paypal third party checkout provider
	,	redirectToPayPal: function redirectToPayPal ()
		{
			var touchpoints = SiteSettings.getTouchPoints()
			,	continue_url = ModelsInit.session.getAbsoluteUrl2('') + (/\/$/.test(ModelsInit.session.getAbsoluteUrl2('')) ? touchpoints.checkout.replace('/', '') : touchpoints.checkout )
			,	joint = ~continue_url.indexOf('?') ? '&' : '?';

			continue_url = continue_url + joint + 'paypal=DONE&fragment=' + request.getParameter('next_step');

			ModelsInit.session.proceedToCheckout({
				cancelurl: touchpoints.viewcart
			,	continueurl: continue_url
			,	createorder: 'F'
			,	type: 'paypalexpress'
			,	shippingaddrfirst: 'T'
			,	showpurchaseorder: 'T'
			});
		}

		// @method redirectToPayPalExpress calls ModelsInit.order.proceedToCheckout() method passing information for paypal-express third party checkout provider
	,	redirectToPayPalExpress: function redirectToPayPalExpress ()
		{
			var touchpoints = SiteSettings.getTouchPoints()
			,	continue_url = ModelsInit.session.getAbsoluteUrl2('') + (/\/$/.test(ModelsInit.session.getAbsoluteUrl2('')) ? touchpoints.checkout.replace('/', '') : touchpoints.checkout )
			,	joint = ~continue_url.indexOf('?') ? '&' : '?';

			continue_url = continue_url + joint + 'paypal=DONE';

			ModelsInit.session.proceedToCheckout({
				cancelurl: touchpoints.viewcart
			,	continueurl: continue_url
			,	createorder: 'F'
			,	type: 'paypalexpress'
			});
		}

		// @method getConfirmation
	,	getConfirmation: function getConfirmation (internalid)
		{
			var confirmation = {internalid: internalid};
			try
			{
				var record = nlapiLoadRecord('salesorder', confirmation.internalid);
				confirmation = this.confirmationCreateResult(record);
			}
			catch (e)
			{
				console.warn('Cart Confirmation could not be loaded, reason: ' + JSON.stringify(e));
			}

			return confirmation;
		}

		// @method confirmationCreateResult
	,	confirmationCreateResult: function confirmationCreateResult (placed_order)
		{

			var self = this
			,	result = {
				internalid: placed_order.getId()
			,	tranid: placed_order.getFieldValue('tranid')
			,	summary: {
					subtotal: Utils.toCurrency(placed_order.getFieldValue('subtotal'))
				,	subtotal_formatted: Utils.formatCurrency(placed_order.getFieldValue('subtotal'))

				,	taxtotal: Utils.toCurrency(placed_order.getFieldValue('taxtotal'))
				,	taxtotal_formatted: Utils.formatCurrency(placed_order.getFieldValue('taxtotal'))

				,	tax2total: Utils.toCurrency(placed_order.getFieldValue('tax2total'))
				,	tax2total_formatted: Utils.formatCurrency(placed_order.getFieldValue('tax2total'))

				,	shippingcost: Utils.toCurrency(placed_order.getFieldValue('shippingcost'))
				,	shippingcost_formatted: Utils.formatCurrency(placed_order.getFieldValue('shippingcost'))

				,	handlingcost: Utils.toCurrency(placed_order.getFieldValue('althandlingcost'))
				,	handlingcost_formatted: Utils.formatCurrency(placed_order.getFieldValue('althandlingcost'))

				,	discounttotal: Utils.toCurrency(placed_order.getFieldValue('discounttotal'))
				,	discounttotal_formatted: Utils.formatCurrency(placed_order.getFieldValue('discounttotal'))

				,	giftcertapplied: Utils.toCurrency(placed_order.getFieldValue('giftcertapplied'))
				,	giftcertapplied_formatted: Utils.formatCurrency(placed_order.getFieldValue('giftcertapplied'))

				,	total: Utils.toCurrency(placed_order.getFieldValue('total'))
				,	total_formatted: Utils.formatCurrency(placed_order.getFieldValue('total'))
				}
			}
			,	i = 0;

			result.promocodes = [];

			var promocode = placed_order.getFieldValue('promocode');

			//If legacy behavior is present & a promocode is applied this IF will be true
			//In case stackable promotions are enable this.record.getFieldValue('promocode') returns null
			if (promocode)
			{
				result.promocodes.push({
					internalid: promocode
				,	code: placed_order.getFieldText('couponcode')
				,	isvalid: true
				,	discountrate_formatted: ''
				});
			}

			for (i = 1; i <= placed_order.getLineItemCount('promotions'); i++)
			{
				if(placed_order.getLineItemValue('promotions', 'applicabilitystatus', i) !== 'NOT_APPLIED')
				{
				result.promocodes.push({
					internalid: placed_order.getLineItemValue('promotions', 'couponcode', i)
				,	code: placed_order.getLineItemValue('promotions', 'couponcode_display', i)
				,	isvalid: placed_order.getLineItemValue('promotions', 'promotionisvalid', i) === 'T'
				,	discountrate_formatted: ''
				});
			}

			}

			result.paymentmethods = [];

			for (i = 1; i <= placed_order.getLineItemCount('giftcertredemption'); i++)
			{
				result.paymentmethods.push({
					type: 'giftcertificate'
				,	giftcertificate: {
							code: placed_order.getLineItemValue('giftcertredemption', 'authcode_display', i)
						,	amountapplied: placed_order.getLineItemValue('giftcertredemption', 'authcodeapplied', i)
						,	amountapplied_formatted: Utils.formatCurrency(placed_order.getLineItemValue('giftcertredemption', 'authcodeapplied', i))
						,	amountremaining: placed_order.getLineItemValue('giftcertredemption', 'authcodeamtremaining', i)
						,	amountremaining_formatted: Utils.formatCurrency(placed_order.getLineItemValue('giftcertredemption', 'authcodeamtremaining', i))
						,	originalamount: placed_order.getLineItemValue('giftcertredemption', 'giftcertavailable', i)
						,	originalamount_formatted:  Utils.formatCurrency(placed_order.getLineItemValue('giftcertredemption', 'giftcertavailable', i))
					}
				});
			}

			result.lines = [];
			for (i = 1; i <= placed_order.getLineItemCount('item'); i++)
			{

				var line_item = {
						item: {
							id: placed_order.getLineItemValue('item', 'item', i)
						,	type: placed_order.getLineItemValue('item', 'itemtype', i)
						}
					,	quantity: parseInt(placed_order.getLineItemValue('item', 'quantity', i), 10)
					,	rate: parseFloat(placed_order.getLineItemValue('item', 'rate', i))
					,	options: self.parseLineOptionsFromSuiteScript(placed_order.getLineItemValue('item', 'options', i))
				};

				if (self.isPickupInStoreEnabled)
				{
					if (placed_order.getLineItemValue('item', 'itemfulfillmentchoice', i) === '1')
					{
						line_item.fulfillmentChoice = 'ship';
					}
					else if (placed_order.getLineItemValue('item', 'itemfulfillmentchoice', i) === '2')
					{
						line_item.fulfillmentChoice = 'pickup';
					}
				}

				result.lines.push(line_item);
			}

			StoreItem.preloadItems(_(result.lines).pluck('item'));

			_.each(result.lines, function (line)
			{
				line.item = StoreItem.get(line.item.id, line.item.type);
			});

			return result;
		}

		// @method backFromPayPal
	,	backFromPayPal: function backFromPayPal ()
		{
			var customer_values = Profile.get()
			,	bill_address = ModelsInit.order.getBillingAddress()
			,	ship_address = ModelsInit.order.getShippingAddress();

			if (customer_values.isGuest === 'T' && ModelsInit.session.getSiteSettings(['registration']).registration.companyfieldmandatory === 'T')
			{
				customer_values.companyname = 'Guest Shopper';
				ModelsInit.customer.updateProfile(customer_values);
			}

			if (ship_address.internalid && ship_address.isvalid === 'T' && !bill_address.internalid)
			{
				ModelsInit.order.setBillingAddress(ship_address.internalid);
			}

			ModelsInit.context.setSessionObject('paypal_complete', 'T');
		}

		// @method removePaypalAddress remove the shipping address or billing address if phone number is null.
		// This is because addresses are not valid created by Paypal.
		// @param {Object} paypal_address
	,	removePaypalAddress: function removePaypalAddress (paypal_address)
		{
			try
			{
				if (Configuration.get('removePaypalAddress') && paypal_address && paypal_address.internalid)
				{
					ModelsInit.customer.removeAddress(paypal_address.internalid);
				}
			}
			catch (e)
			{
				// ignore this exception, it is only for the cases that we can't remove pay-pal's address.
				// This exception will not send to the front-end
				var error = Application.processError(e);
				console.warn('Error ' + error.errorStatusCode + ': ' + error.errorCode + ' - ' + error.errorMessage);
			}
		}

		// @method addLine
		// @param {LiveOrder.Model.Line} line_data
	,	addLine: function addLine (line_data)
		{
			var item = {
				internalid: line_data.item.internalid.toString()
			,	quantity: _.isNumber(line_data.quantity) ? parseInt(line_data.quantity, 10) : 1
			,	options: this.parseLineOptionsToCommerceAPI(line_data.options)
			};

			if (this.isPickupInStoreEnabled && line_data.fulfillmentChoice === 'pickup' && line_data.location)
			{
				item.fulfillmentPreferences = {
					fulfillmentChoice: 'pickup'
				,	pickupLocationId: parseInt(line_data.location, 10)
				};
			}

			// Adds the line to the order
			var line_id = ModelsInit.order.addItem(item);

			if (this.isMultiShippingEnabled && line_data.fulfillmentChoice !== 'pickup')
			{
				// Sets it ship address (if present)
				line_data.shipaddress && ModelsInit.order.setItemShippingAddress(line_id, line_data.shipaddress);

				// Sets it ship method (if present)
				line_data.shipmethod && ModelsInit.order.setItemShippingMethod(line_id, line_data.shipmethod);
			}

			// Stores the latest addition
			ModelsInit.context.setSessionObject('latest_addition', line_id);

			// Stores the current order
			var lines_sort = this.getLinesSort();

			lines_sort.unshift(line_id);

			this.setLinesSort(lines_sort);

			return line_id;
		}

		// @method addLines
		// @param {Array<LiveOrder.Model.Line>} lines_data
	,	addLines: function addLines (lines_data)
		{
			var items = []
			,	self = this;

			this.storePromosPrevState();

			_.each(lines_data, function (line_data)
			{
				var item = {
						internalid: line_data.item.internalid.toString()
					,	quantity:  _.isNumber(line_data.quantity) ? parseInt(line_data.quantity, 10) : 1
					,	options: self.parseLineOptionsToCommerceAPI(line_data.options)
				};

				if (self.isPickupInStoreEnabled && line_data.fulfillmentChoice === 'pickup' && line_data.location)
				{
					item.fulfillmentPreferences = {
						fulfillmentChoice: 'pickup'
					,	pickupLocationId: parseInt(line_data.location, 10)
					};
				}

				items.push(item);
			});

			var lines_ids = ModelsInit.order.addItems(items)
			,	latest_addition = _.last(lines_ids).orderitemid
			// Stores the current order
			,	lines_sort = this.getLinesSort();

			lines_sort.unshift(latest_addition);
			this.setLinesSort(lines_sort);

			ModelsInit.context.setSessionObject('latest_addition', latest_addition);

			this.manageFreeGifts();

			return lines_ids;
		}

		// @method manageFreeGifts
	,	manageFreeGifts: function manageFreeGifts ()
		{
			var promotions = ModelsInit.order.getAppliedPromotionCodes();

			promotions = _.filter(promotions, function(promo){ return promo.promotion_type === 'FREEGIFT';});

			return this.manageFreeGiftsWithPromotions(promotions);
		}

		// @method removeAllFreeGiftByPromotion
	,	removeAllFreeGiftsByPromotion: function (promotion_id)
		{
			var	lines = this.getLines(this.getFieldValues())
			,	found = false
			,	free_gift_line;

			lines = _.filter(lines, function(line){
				return line.free_gift;
			});

			_.each(lines, function(line)
			{
				if(!found && line.free_gift_info && line.free_gift_info.promotion_id === promotion_id)
				{
					free_gift_line = line;
					found = true;

					ModelsInit.order.removeItem(free_gift_line.internalid.toString());
				}
			});
		}

		// @method manageFreeGiftsWithPromotions
	,	manageFreeGiftsWithPromotions: function manageFreeGiftsWithPromotions (promotions)
		{
			if(promotions && promotions.length)
			{
				var elegible_free_gifts = this.getEligibleFreeGifts()
				,	free_gift;

				_.each(elegible_free_gifts, function(free_gift_obj)
				{
					if(free_gift_obj.promotion_id === promotions[0].promocodeid)
					{
						free_gift = free_gift_obj;
					}
				});

				var quantity_to_add = parseInt(free_gift.eligible_quantity - free_gift.rejected_quantity);

				this.removeAllFreeGiftsByPromotion(promotions[0].promocodeid);

				if (free_gift.eligible_items && free_gift.eligible_items.length)
				{
					var	item_stock = free_gift.eligible_items[0].available_quantity
				,	item_isbackorderable = free_gift.eligible_items[0].is_backorderable;

					if (quantity_to_add > 0)
					{
						if(item_stock < quantity_to_add && !item_isbackorderable)
						{
							quantity_to_add = item_stock;
						}

						this.addFreeGift(free_gift.eligible_items[0].item_id, free_gift.promotion_id, quantity_to_add, {});
					}
				}

				promotions = _.reject(promotions, function(promo){
					return promo.promocodeid === free_gift.promotion_id;
				});

				this.manageFreeGiftsWithPromotions(promotions);
			}
		}

		// @method addFreeGift
	,	addFreeGift: function addFreeGift (item_id, promotion_id, quantity, options)
		{
			try {
				return ModelsInit.order.addFreeGiftItem({'item_id': item_id.toString(), 'promotion_id': promotion_id, 'quantity': quantity.toString(), 'options': options});
			}
			catch(e)
			{
				if(e.errorcode === 'YOU_CANNOT_ADD_THIS_ITEM_TO_THE_CART_AS_IT_IS_CURRENTLY_OUT_OF_STOCK'){
					console.log(JSON.stringify(e));
					ModelsInit.order.removePromotionCode(promotion_id);
				}
				throw e;
			}
		}

		// @method removeLine
		// @param {String} line_id
	,	removeLine: function removeLine (line_id)
		{
			this.storePromosPrevState();
			// Removes the line
			ModelsInit.order.removeItem(line_id);

			// Stores the current order
			var lines_sort = this.getLinesSort();
			lines_sort = _.without(lines_sort, line_id);
			this.setLinesSort(lines_sort);

			this.manageFreeGifts();
		}

		// @method updateLine
		// @param {String} line_id
		// @param {LiveOrder.Model.Line} line_data
	,	updateLine: function updateLine (line_id, line_data)
		{
			var lines_sort = this.getLinesSort()
			,	current_position = _.indexOf(lines_sort, line_id);

			if(current_position > -1 || line_data.freeGift === true){
				var	original_line_object = ModelsInit.order.getItem(line_id, [
						'quantity'
					,	'internalid'
					,	'options'
					,	'fulfillmentPreferences'
				]);

				this.storePromosPrevState();

				if(line_data.freeGift === true)
				{

					if (_.isNumber(line_data.quantity) && line_data.quantity > 0 && line_data.quantity !== original_line_object.quantity)
					{
						line_data.orderitemid = line_data.internalid;
						ModelsInit.order.updateItemQuantity(line_data);
					}

					if (this.isPickupInStoreEnabled && line_data.fulfillmentChoice !== original_line_object.fulfillmentPreferences.fulfillmentChoice)
					{
						var fulfillmentPreferences;

						if(line_data.fulfillmentChoice === 'pickup'){
							fulfillmentPreferences = {
								fulfillmentChoice: 'pickup'
							,	location: line_data.location
							};
						}
						else if(line_data.fulfillmentChoice === 'ship'){
							fulfillmentPreferences = {
								fulfillmentChoice: 'ship'
							};
						}

						if (fulfillmentPreferences) {
							ModelsInit.order.updateItemFulfillmentPreferences({orderitemid: line_data.internalid, fulfillmentPreferences: fulfillmentPreferences});
						}
					}
				}
				else
				{
					this.removeLine(line_id);

					var new_line_id;

					try
					{
						new_line_id = this.addLine(line_data);
					}
					catch (e)
					{
						// we try to roll back the item to the original state
						var roll_back_item = {
							item: {
								internalid: parseInt(original_line_object.internalid, 10)
							}
						,	quantity: parseInt(original_line_object.quantity, 10)
						};

						if (original_line_object.options && original_line_object.options.length)
						{
							roll_back_item.options = {};
							_.each(original_line_object.options, function (option)
							{
								roll_back_item.options[option.id.toLowerCase()] = option.value;
							});
						}

						new_line_id = this.addLine(roll_back_item);

						e.errorDetails = {
							status: 'LINE_ROLLBACK'
						,	oldLineId: line_id
						,	newLineId: new_line_id
						};

						throw e;
					}

					lines_sort = _.without(lines_sort, line_id, new_line_id);
					lines_sort.splice(current_position, 0, new_line_id);
					this.setLinesSort(lines_sort);

					this.manageFreeGifts();
				}
			}
		}

		// @method splitLines
		// @param {LiveOrder.Model.Line} data
		// @param current_order
	,	splitLines: function splitLines (data, current_order)
		{
			_.each(data.lines, function (line)
			{
				if (line.splitquantity)
				{
					var splitquantity = typeof line.splitquantity === 'string' ? parseInt(line.splitquantity,10) : line.splitquantity
					,	original_line = _.find(current_order.lines, function (order_line)
						{
							return order_line.internalid === line.internalid;
						})
					,	remaining = original_line ? (original_line.quantity - splitquantity) : -1;

					if (remaining > 0 && splitquantity > 0)
					{
						ModelsInit.order.splitItem({
							'orderitemid' : original_line.internalid
						,	'quantities': [
								splitquantity
							,	remaining
							]
						});
					}
				}
			});
		}

		// @method getFieldValues
		// @param {Array<String>} requested_field_keys To override field_keys got from configuration
		// @returns {Array<String>}
	,	getFieldValues: function (requested_field_keys)
		{
			var order_field_keys = {}
			,	isCheckout = Utils.isInCheckout(request) && ModelsInit.session.isLoggedIn2()
			,	field_keys = isCheckout ? Configuration.get('orderCheckoutFieldKeys') : Configuration.get('orderShoppingFieldKeys');

			if (requested_field_keys)
			{
				field_keys = {
					keys: requested_field_keys.keys || field_keys.keys
				,	items: requested_field_keys.items || field_keys.items
				};
			}

			order_field_keys.items = field_keys.items;

			_.each(field_keys.keys, function (key)
			{
				order_field_keys[key] = null;
			});

			if (this.isMultiShippingEnabled)
			{
				if (!_.contains(order_field_keys.items, 'shipaddress'))
				{
					order_field_keys.items.push('shipaddress');
				}
				if (!_.contains(order_field_keys.items, 'shipmethod'))
				{
					order_field_keys.items.push('shipmethod');
				}
				order_field_keys.ismultishipto = null;
			}

			if (this.isPickupInStoreEnabled)
			{
				if (!_.contains(order_field_keys.items, 'fulfillmentPreferences'))
				{
					order_field_keys.items.push('fulfillmentPreferences');
				}
			}

			return ModelsInit.order.getFieldValues(order_field_keys, false);
		}
		//@method removeAllPromocodes Removes all the promocodes or the ones passed by parameter
		//@param {Array<LiveOrder.Model.PromoCode>} promocodes_to_remove List of promocodes that will removed
		//@return {Void}
	,	removeAllPromocodes: function removeAllPromocodes (promocodes_to_remove)
		{
			if (promocodes_to_remove)
			{
				_.each(promocodes_to_remove, function (promo)
				{
					ModelsInit.order.removePromotionCode(promo.code);
				});
			}
			else
			{
				ModelsInit.order.removeAllPromotionCodes();
			}
		}


		//@method getPromoCodesOnly returns only the promocodes of the order without requesting unnecessary data
		//@return {Array<LiveOrder.Model.PromoCode>}
	,	getPromoCodesOnly: function getPromoCodesOnly()
		{
			var field_values = this.getFieldValues({
				keys: ['promocodes']
			,	items: []
			});
			return this.getPromoCodes(field_values);
		}

		// @method getPromoCodes
		// @param {Object} order_fields
		// @return {Array<LiveOrder.Model.PromoCode>}
	,	getPromoCodes: function getPromoCodes (order_fields)
		{
			var result = []
			,	elegible_free_gifts = this.getEligibleFreeGifts()
			,	self = this;

			if (order_fields.promocodes && order_fields.promocodes.length)
			{
				_.each(order_fields.promocodes, function (promo_code)
				{
					// @class LiveOrder.Model.PromoCode
					var promocode = {
						// @property {String} internalid
						internalid: promo_code.internalid
						// @property {String} internalid
					,	promocodeid: promo_code.promocodeid
						// @property {String} code
					,	code: promo_code.promocode
						// @property {Boolean} isvalid
					,	isvalid: promo_code.isvalid === 'T'
						// @property {String} discountrate_formatted
					,	discountrate_formatted: ''
					,	errormsg : promo_code.errormsg
					,	name: promo_code.discount_name
					,	rate: promo_code.discount_rate
					,	type: promo_code.promotion_type
					};

						// @property {Boolean} isautoapplied
						promocode.isautoapplied = promo_code.is_auto_applied;
						// @property {String} applicabilitystatus
						promocode.applicabilitystatus = (promo_code.applicability_status) ? promo_code.applicability_status : '';
						// @property {String} applicabilityreason
						promocode.applicabilityreason = (promo_code.applicability_reason) ? promo_code.applicability_reason : '';

					if (self.isNotificationFreeGift(promocode))
						{
						var old_gift_info = _.find(self.old_free_gifts, function (old_free_gift){ return old_free_gift.promotion_id === promo_code.promocodeid; })
						,	current_gift_info = _.find(elegible_free_gifts, function (free_gift){ return free_gift.promotion_id === promo_code.promocodeid; })
						,	free_gift_id;

						if ((!!old_gift_info || !!current_gift_info) && !(!!old_gift_info && !!current_gift_info && old_gift_info.added_quantity === current_gift_info.added_quantity))
						{
							free_gift_id = (!!old_gift_info) ? old_gift_info.eligible_items[0] : current_gift_info.eligible_items[0];

							promocode.notification = true;
							promocode.freegiftinfo = [old_gift_info, current_gift_info];

							promocode.freegiftname = ModelsInit.session.getItemFieldValues('typeahead', [free_gift_id.item_id]).items[0].storedisplayname2;
						}
					}
					else if (promo_code.applicability_status !== 'NOT_AVAILABLE' && !!self.old_promocodes)
						{
							var old_promocode = (self.old_promocodes) ? _.find(self.old_promocodes, function (old_promo_code){ return old_promo_code.internalid === promo_code.internalid; }) : '';

							if (!old_promocode || old_promocode.applicability_status !== promo_code.applicability_status || (!promo_code.is_auto_applied && promo_code.applicability_reason !== old_promocode.applicability_reason))
							{
								promocode.notification = true;
							}
						}

					result.push(promocode);
				});

					delete this.old_promocodes;
				delete this.old_free_gifts;
				}

			return result;
			}

	,	isNotificationFreeGift: function isNotificationFreeGift(promocode)
		{
			if(promocode.type === 'FREEGIFT' && !!this.old_free_gifts)
			{
				if(promocode.applicabilitystatus === 'APPLIED')
				{
					return true;
				}
				else if (promocode.applicabilitystatus === 'NOT_APPLIED' && promocode.applicabilityreason === 'NO_FREE_GIFTS_ADDED')
				{
					var old_gift_info = _.find(this.old_free_gifts, function (old_free_gift){ return old_free_gift.promotion_id === promocode.promocodeid; });

					if(!!old_gift_info && old_gift_info.applicability_status === 'APPLIED')
					{
						return true;
					}
				}
			}
			return false;
		}

		// @method getAutomaticallyRemovedPromocodes
		// @param {Object} order_fields
		// @return {Array<LiveOrder.Model.PromoCode>}
	,	getAutomaticallyRemovedPromocodes: function getAutomaticallyRemovedPromocodes(current_order)
		{
			var latest_promocodes = _.pluck(_.where(ModelsInit.order.getFieldValues(['promocodes']).promocodes, {isvalid:'T'}) ,'promocode')
			,	current_promocodes = _.pluck(_.where(current_order.promocodes,{isvalid:true}), 'code')
			,	removed_promocodes = _.difference(current_promocodes, latest_promocodes);

			return _.filter(current_order.promocodes, function (promocode)
			{
				return _.indexOf(removed_promocodes, promocode.code) >= 0;
			});
		}

		// @method setPromoCodes
		// @param {LiveOrder.Model.Data} data Received data from the service
		// @param {LiveOrder.Model.Data} current_order Returned data
		// @param current_order
	,	setPromoCodes: function setPromoCodes (data, current_order)
		{
			var self = this
			,	only_in_current_order = _.filter(current_order.promocodes, function (promocode){
				return !_.findWhere(data.promocodes, {'code': promocode.code});
			})
			,	only_in_data = _.filter(data.promocodes, function (promocode){
				return !_.findWhere(current_order.promocodes, {'code': promocode.code});
			});

			if(!_.isEmpty(only_in_current_order))
			{
				this.removeAllPromocodes(only_in_current_order);
			}

			data.promocodes = data.promocodes || [];

			var valid_promocodes = _.filter(only_in_data, function (promocode)
			{
				return promocode.isvalid !== false;
			});

			if (!Configuration.get('promocodes.allowMultiples', true) && valid_promocodes.length > 1)
			{
				valid_promocodes = [valid_promocodes[0]];
			}
			else
			{
				valid_promocodes = only_in_data;
			}

			_.each(valid_promocodes, function (promo)
			{

				if (!!promo.code)
				{
					promo.code = promo.code.trim();
				}

				try
				{
					self.addPromotion(promo.code);
				}
				catch (e)
				{
					var order_fields = self.getFieldValues()
					,	promos = self.getPromoCodes(order_fields)
					,	is_in_current_order = !!_.find(promos, function (p)
						{
							return promo.code === p.code;
						});

					//The error for this promocode will be in the information of the promocodes on the order with isvalid = F
					//Otherwise, it will be thrown as an exception so that the user knows what is going on
					if (!is_in_current_order)
					{
						throw e;
					}
				}
			});
		}

	,	addPromotion: function addPromotion(promo_code)
		{
			ModelsInit.order.applyPromotionCode(promo_code);
		}

		// @method getMultiShipMethods
		// @param {Array<LiveOrder.Model.Line>} lines
	,	getMultiShipMethods: function getMultiShipMethods (lines)
		{
			// Get multi ship methods
			var multishipmethods = {};

			_.each(lines, function (line)
			{
				if (line.shipaddress)
				{
					multishipmethods[line.shipaddress] = multishipmethods[line.shipaddress] || [];

					multishipmethods[line.shipaddress].push(line.internalid);
				}
			});

			_.each(_.keys(multishipmethods), function (address)
			{
				var methods = ModelsInit.order.getAvailableShippingMethods(multishipmethods[address], address);

				_.each(methods, function (method)
				{
					method.internalid = method.shipmethod;
					method.rate_formatted = Utils.formatCurrency(method.rate);
					delete method.shipmethod;
				});

				multishipmethods[address] = methods;
			});

			return multishipmethods;
		}

		//@method getShipMethodsOnly returns only the ship methods of the order without requesting unnecessary data
		//@return {Array<OrderShipMethod>}
	,	getShipMethodsOnly: function getShipMethodsOnly()
		{
			var field_values = this.getFieldValues({
				keys: ['shipmethods']
			,	items: []
			});
			return this.getShipMethods(field_values);
		}

		// @method getShipMethods
		// @param {Array<String>} order_fields
		// @returns {Array<OrderShipMethod>}
	,	getShipMethods: function getShipMethods (order_fields)
		{
			var shipmethods = _.map(order_fields.shipmethods, function (shipmethod)
			{
				var rate = Utils.toCurrency(shipmethod.rate.replace( /^\D+/g, '')) || 0;

				return {
					internalid: shipmethod.shipmethod
				,	name: shipmethod.name
				,	shipcarrier: shipmethod.shipcarrier
				,	rate: rate
				,	rate_formatted: shipmethod.rate
				};
			});

			return shipmethods;
		}

		// @method getLinesSort
		// @returns {Array<String>}
	,	getLinesSort: function getLinesSort ()
		{
			return ModelsInit.context.getSessionObject('lines_sort') ? ModelsInit.context.getSessionObject('lines_sort').split(',') : [];
		}

		//@method getPaymentMethodsOnly returns only the payment methods of the order without requesting unnecessary data
		//@return {Array<ShoppingSession.PaymentMethod>}
	,	getPaymentMethodsOnly: function getPaymentMethodsOnly()
		{
			var field_values = this.getFieldValues({
				keys: ['payment']
			,	items: []
			});
			return this.getPaymentMethods(field_values);
		}

		// @method getPaymentMethods
		// @param {Array<String>} order_fields
		// @returns {Array<ShoppingSession.PaymentMethod>}
	,	getPaymentMethods: function getPaymentMethods (order_fields)
		{
			var paymentmethods = []
			,	giftcertificates = ModelsInit.order.getAppliedGiftCertificates()
			,	payment = order_fields && order_fields.payment
			,	paypal = payment && _.findWhere(ModelsInit.session.getPaymentMethods(), {ispaypal: 'T'})
			,	credit_card = payment && payment.creditcard;

			if (credit_card && credit_card.paymentmethod && credit_card.paymentmethod.creditcard === 'T')
			{
				// Main
				paymentmethods.push({
					type: 'creditcard'
				,	primary: true
				,	creditcard: {
						internalid: credit_card.internalid || '-temporal-'
					,	ccnumber: credit_card.ccnumber
					,	ccname: credit_card.ccname
					,	ccexpiredate: credit_card.expmonth + '/' + credit_card.expyear
					,	ccsecuritycode: credit_card.ccsecuritycode
					,	expmonth: credit_card.expmonth
					,	expyear: credit_card.expyear
					,	paymentmethod: {
							internalid: credit_card.paymentmethod.internalid
						,	name: credit_card.paymentmethod.name
						,	creditcard: credit_card.paymentmethod.creditcard === 'T'
						,	ispaypal: credit_card.paymentmethod.ispaypal === 'T'
						,	isexternal: credit_card.paymentmethod.isexternal === 'T'
						,	key: credit_card.paymentmethod.key
						}
					}
				});
			}
			else if (paypal && payment.paymentmethod === paypal.internalid)
			{
				paymentmethods.push({
					type: 'paypal'
				,	primary: true
				,	complete: ModelsInit.context.getSessionObject('paypal_complete') === 'T'
				,	internalid: paypal.internalid
				,	name: paypal.name
				,	creditcard: paypal.creditcard === 'T'
				,	ispaypal: paypal.ispaypal === 'T'
				,	isexternal: paypal.isexternal === 'T'
				,	key: paypal.key
				});
			}
			else if (credit_card && credit_card.paymentmethod && credit_card.paymentmethod.isexternal === 'T')
			{
				paymentmethods.push({
					type: 'external_checkout_' + credit_card.paymentmethod.key
				,	primary: true
				,	internalid: credit_card.paymentmethod.internalid
				,	name: credit_card.paymentmethod.name
				,	creditcard: credit_card.paymentmethod.creditcard === 'T'
				,	ispaypal: credit_card.paymentmethod.ispaypal === 'T'
				,	isexternal: credit_card.paymentmethod.isexternal === 'T'
				,	key: credit_card.paymentmethod.key
				,	errorurl: payment.errorurl
				,	thankyouurl: payment.thankyouurl
				});
			}
			else if (order_fields.payment && order_fields.payment.paymentterms === 'Invoice')
			{
				var customer_invoice = ModelsInit.customer.getFieldValues([
					'paymentterms'
				,	'creditlimit'
				,	'balance'
				,	'creditholdoverride'
				]);

				paymentmethods.push({
					type: 'invoice'
				,	primary: true
				,	paymentterms: customer_invoice.paymentterms
				,	creditlimit: parseFloat(customer_invoice.creditlimit || 0)
				,	creditlimit_formatted: Utils.formatCurrency(customer_invoice.creditlimit)
				,	balance: parseFloat(customer_invoice.balance || 0)
				,	balance_formatted: Utils.formatCurrency(customer_invoice.balance)
				,	creditholdoverride: customer_invoice.creditholdoverride
				});
			}

			if (giftcertificates && giftcertificates.length)
			{
				_.forEach(giftcertificates, function (giftcertificate)
				{
					paymentmethods.push({
						type: 'giftcertificate'
					,	giftcertificate: {
							code: giftcertificate.giftcertcode

						,	amountapplied: Utils.toCurrency(giftcertificate.amountapplied || 0)
						,	amountapplied_formatted: Utils.formatCurrency(giftcertificate.amountapplied || 0)

						,	amountremaining: Utils.toCurrency(giftcertificate.amountremaining || 0)
						,	amountremaining_formatted: Utils.formatCurrency(giftcertificate.amountremaining || 0)

						,	originalamount: Utils.toCurrency(giftcertificate.originalamount || 0)
						,	originalamount_formatted: Utils.formatCurrency(giftcertificate.originalamount || 0)
						}
					});
				});
			}

			return paymentmethods;
		}

		// @method getTransactionBodyField
		// @returns {Object}
	,	getTransactionBodyField: function getTransactionBodyField ()
		{
			var options = {};

			if (this.isSecure)
			{
				var fieldsIdToBeExposed = CustomFieldsUtils.getCustomFieldsIdToBeExposed('salesorder');
				_.each(ModelsInit.order.getCustomFieldValues(), function (option)
				{
					//expose the custom field value if was configured in the backend configuration
					if(_.find(fieldsIdToBeExposed, function (fieldIdToBeExposed){ return option.name === fieldIdToBeExposed;}))
					{
						options[option.name] = (option.value.indexOf(String.fromCharCode(5)) !== -1) ?  option.value.split(String.fromCharCode(5)) : option.value;
					}
				});
			}
			return options;
		}

		// @method getAddresses
		// @param {Array<String>} order_fields
		// @returns {Array<OrderAddress>}
	,	getAddresses: function getAddresses (order_fields)
		{
			var self = this
			,	addresses = {}
			,	address_book = ModelsInit.session.isLoggedIn2() && this.isSecure ? ModelsInit.customer.getAddressBook() : [];

			address_book = _.object(_.pluck(address_book, 'internalid'), address_book);
			// General Addresses
			if (order_fields.ismultishipto === 'T')
			{
				_.each(order_fields.items || [], function (line)
				{
					if (line.shipaddress && !addresses[line.shipaddress])
					{
						self.addAddress(address_book[line.shipaddress], addresses);
					}
				});
			}
			else
			{
				this.addAddress(order_fields.shipaddress, addresses);
			}

			this.addAddress(order_fields.billaddress, addresses);

			return _.values(addresses);
		}

		// @method getLines Set Order Lines into the result. Standardizes the result of the lines
		// @param {Object} order_fields
		// @returns {Array<LiveOrder.Model.Line>}
	,	getLines: function getLines (order_fields)
		{
			var lines = [];
			if (order_fields.items && order_fields.items.length)
			{
				var self = this
				,	items_to_preload = []
				,	address_book = ModelsInit.session.isLoggedIn2() && this.isSecure ? ModelsInit.customer.getAddressBook() : []
				,	item_ids_to_clean = []
				,	free_gifts = this.getEligibleFreeGifts();

				address_book = _.object(_.pluck(address_book, 'internalid'), address_book);

				_.each(order_fields.items, function (original_line)
				{
					// Total may be 0
					var	total = (original_line.promotionamount) ? Utils.toCurrency(original_line.promotionamount) : Utils.toCurrency(original_line.amount)
					,	discount = Utils.toCurrency(original_line.promotiondiscount) || 0
					,	line_to_add;

					// @class LiveOrder.Model.Line represents a line in the LiveOrder
					line_to_add = {
						// @property {String} internalid
						internalid: original_line.orderitemid
						// @property {Number} quantity
					,	quantity: original_line.quantity
						// @property {Number} rate
					,	rate: parseFloat(original_line.rate)
						// @property {String} rate_formatted
					,	rate_formatted: original_line.rate_formatted
						// @property {Number} amount
					,	amount: Utils.toCurrency(original_line.amount)
						// @property {String} tax_rate1
					,	tax_rate1: original_line.taxrate1
						// @property {String} tax_type1
					,	tax_type1: original_line.taxtype1
						// @property {String} tax_rate2
					,	tax_rate2: original_line.taxrate2
						// @property {String} tax_type2
					,	tax_type2: original_line.taxtype2
						// @property {Number} tax1_amount
					,	tax1_amount: original_line.tax1amt
						// @property {String} tax1_amount_formatted
					,	tax1_amount_formatted: Utils.formatCurrency(original_line.tax1amt)
						// @property {Number} discount
					,	discount: discount
					,	promotion_discount: original_line.promotionamount
						// @property {Number} total
					,	total: total
						// @property {String} item internal id of the line's item
					,	item: original_line.internalid
						// @property {String} itemtype
					,	itemtype: original_line.itemtype
						// @property {Array<LiveOrder.Model.Line.Option>} options
					,	options: self.parseLineOptionsFromCommerceAPI(original_line.options)
						// @property {OrderAddress} shipaddress
					,	shipaddress: original_line.shipaddress
						// @property {OrderShipMethod} shipmethod
					,	shipmethod: original_line.shipmethod
						// @property {Boolean} free_gift
					,	free_gift: !!original_line.freegiftpromotionid
						// @property {Array<DiscountsImpact>} discounts_impact
					,	discounts_impact: original_line.discounts_impact
					};

					if (self.isPickupInStoreEnabled && original_line.fulfillmentPreferences)
					{
						// @property {Number} location
						line_to_add.location = original_line.fulfillmentPreferences.pickupLocationId;
						// @property {String} fulfillmentChoice
						line_to_add.fulfillmentChoice = original_line.fulfillmentPreferences.fulfillmentChoice;
					}



					if (line_to_add.free_gift === true)
					{
						var gift_info = _.find(free_gifts, function(free_gift) { return free_gift.promotion_id.toString() === line_to_add.discounts_impact.discounts[0].promotion_id.toString(); });
						line_to_add.free_gift_info = gift_info;
					}

					if (line_to_add.shipaddress && !address_book[line_to_add.shipaddress])
					{
						line_to_add.shipaddress = null;
						line_to_add.shipmethod = null;
						item_ids_to_clean.push(line_to_add.internalid);
					}
					else
					{
						items_to_preload.push({
							id: original_line.internalid
						,	type: original_line.itemtype
						});
					}

					lines.push(line_to_add);

				});

				if (item_ids_to_clean.length)
				{
					ModelsInit.order.setItemShippingAddress(item_ids_to_clean, null);
					ModelsInit.order.setItemShippingMethod(item_ids_to_clean, null);
				}

				var	restart = false;

				StoreItem.preloadItems(items_to_preload);

				lines.forEach(function (line)
				{
					line.item = StoreItem.get(line.item, line.itemtype);

					if (!line.item)
					{
						self.removeLine(line.internalid);
						restart = true;
					}
					else
					{
						line.rate_formatted = Utils.formatCurrency(line.rate);
						line.amount_formatted = Utils.formatCurrency(line.amount);
						line.tax_amount_formatted = Utils.formatCurrency(line.tax_amount);
						line.discount_formatted = Utils.formatCurrency(line.discount);
						line.total_formatted = Utils.formatCurrency(line.total);
					}
				});

				if (restart)
				{
					throw {code: 'ERR_CHK_ITEM_NOT_FOUND'};
				}

				// Sort the items in the order they were added, this is because the update operation alters the order
				var lines_sort = this.getLinesSort();

				if (lines_sort.length)
				{
					lines = _.sortBy(lines, function (line)
					{
						return _.indexOf(lines_sort, line.internalid);
					});
				}
				else
				{
					this.setLinesSort(_.pluck(lines, 'internalid'));
				}
			}

			return lines;
		}
		//@method getLinesOnly returns only the lines of the order without requesting unnecessary data
		//@return {Array<LiveOrder.Model.Line>}
	,	getLinesOnly: function getLinesOnly()
		{
			var field_values = this.getFieldValues({
				keys: []
			,	items: null
			});
			return this.getLines(field_values);
		}
		//@method getSummary gives the summary of the order requesting only the needed data
		//@return {Object} An object containing the summary
	,	getSummary: function getSummary()
		{
			var summary = this.getFieldValues({
				keys: ['summary']
			,	items: []
			}).summary;

			return _.clone(summary);
		}
		//@method parseLineOptionsToCommerceAPI Given the list of options from he Front-end it parsed to the particular CommerceAPI format
		//@param {Array<LiveOrder.Model.Line.Option>} options
		//@return {Object} An object used as a dictionary where each key is the cart option id and the values are the option's value internalid
	,	parseLineOptionsToCommerceAPI: function parseLineOptionsToCommerceAPI (options)
		{
			var result = {};
			_.each(options || [], function (option)
			{
				if (option && option.value && option.cartOptionId)
				{
					result[option.cartOptionId] = option.value.internalid;
				}
			});
			return result;
		}
		//@method parseLineOptionsFromCommerceAPI
		//@param {Array<CommerceAPI.LineOption>} options
		//@return {Array<LiveOrder.Model.Line.Option>}
	,	parseLineOptionsFromCommerceAPI: function parseLineOptionsFromCommerceAPI (options)
		{
			//@class CommerceAPI.LineOption
			//@property {String} displayvalue
			//@property {String} id
			//@property {String} name
			//@property {String} value

			return _.map(options, function (option)
			{
				var option_label =  Utils.trim(option.name);

				option_label = Utils.stringEndsWith(option_label, ':') ? option_label.substr(0, option_label.length - 1) : option_label;

				//@class LiveOrder.Model.Line.Option
				return {
					//@property {LiveOrder.Model.Line.Option.Value} value
					//@class LiveOrder.Model.Line.Option.Value
					value:
					{
						//@property {String} label Name of the value selected in case of select or the entered string
						label: option.displayvalue
						//@property {String} internalid
					,	internalid: option.value
					}
					//@class LiveOrder.Model.Line.Option
					//@property {String} cartOptionId
				,	cartOptionId: option.id.toLowerCase()
					//@property {String} label
				,	label: option_label
				};
			});

			//@class LiveOrder.Model
		}

		// @method parseLineOptionsFromSuiteScript
		// @param {String} options
	,	parseLineOptionsFromSuiteScript: function parseLineOptionsFromSuiteScript (options_string)
		{
			var options_object = [];

			if (options_string && options_string !== '- None -')
			{
				var split_char_3 = String.fromCharCode(3)
				,	split_char_4 = String.fromCharCode(4);

				_.each(options_string.split(split_char_4), function (option_line)
				{
					option_line = option_line.split(split_char_3);

					//@class Transaction.Model.Get.Line.Option
					options_object.push({
						//@property {String} cartOptionId
						cartOptionId: option_line[0].toLowerCase()
						//@property {String} label
					,	label: option_line[2]
						//@property {Transaction.Model.Get.Line.Option.Value} value
					,	value: {
							//@class Transaction.Model.Get.Line.Option.Value
							//@property {String} label
							label: option_line[4]
							//@property {String} internalid
						,	internalid: option_line[3]
						}
						//@class Transaction.Model.Get.Line.Option
						//@property {Boolean} mandatory
					,	ismandatory: option_line[1]	=== 'T'
					});
				});
			}
			//@class LiveOrder.Model

			return options_object;
		}

		// @method getIsMultiShipTo @param {Array<String>} order_fields @returns {Boolean}
	,	getIsMultiShipTo: function getIsMultiShipTo (order_fields)
		{
			return this.isMultiShippingEnabled && order_fields.ismultishipto === 'T';
		}

		// @method setLinesSort
		// @param {String} lines_sort
		// @returns {String}
	,	setLinesSort: function setLinesSort (lines_sort)
		{
			return ModelsInit.context.setSessionObject('lines_sort', lines_sort || []);
		}

		//@method setBillingAddressOnly gets only the shipaddress of the order without requesting unnecessary data
	,	setBillingAddressOnly: function setBillingAddressOnly(data)
		{
			var field_values = this.getFieldValues({
				keys: ['billaddress']
			,	items: []
			});
			return this.setBillingAddress(data, field_values);
		}

		// @method setBillingAddress
		// @param data
		// @param {LiveOrder.Model.Data} current_order
	,	setBillingAddress: function setBillingAddress (data, current_order)
		{
			if (data.sameAs)
			{
				data.billaddress = data.shipaddress;
			}

			if (data.billaddress !== current_order.billaddress)
			{
				if (data.billaddress)
				{
					if (data.billaddress && !~data.billaddress.indexOf('null'))
					{
						// Heads Up!: This "new String" is to fix a nasty bug
						ModelsInit.order.setBillingAddress(new String(data.billaddress).toString());
					}
				}
				else if (this.isSecure)
				{
					ModelsInit.order.removeBillingAddress();
				}
			}
		}

		// @method setShippingAddressAndMethod
		// @param {LiveOrder.Model.Data} data
		// @param current_order
	,	setShippingAddressAndMethod: function setShippingAddressAndMethod (data, current_order)
		{
			var current_package
			,	packages = {}
			,	item_ids_to_clean = []
			,	original_line;

			_.each(data.lines, function (line)
			{
				original_line = _.find(current_order.lines, function (order_line)
				{
					return order_line.internalid === line.internalid;
				});

				if (original_line && original_line.item && original_line.item.isfulfillable !== false)
				{
					if (line.shipaddress)
					{
						packages[line.shipaddress] = packages[line.shipaddress] || {
							shipMethodId: null
						,	itemIds: []
						};

						packages[line.shipaddress].itemIds.push(line.internalid);
						if (!packages[line.shipaddress].shipMethodId && line.shipmethod)
						{
							packages[line.shipaddress].shipMethodId = line.shipmethod;
						}
					}
					else
					{
						item_ids_to_clean.push(line.internalid);
					}
				}
			});

			//CLEAR Shipping address and shipping methods
			if (item_ids_to_clean.length)
			{
				ModelsInit.order.setItemShippingAddress(item_ids_to_clean, null);
				ModelsInit.order.setItemShippingMethod(item_ids_to_clean, null);
			}

			//SET Shipping address and shipping methods
			_.each(_.keys(packages), function (address_id)
			{
				current_package = packages[address_id];
				ModelsInit.order.setItemShippingAddress(current_package.itemIds, parseInt(address_id, 10));

				if (current_package.shipMethodId)
				{
					ModelsInit.order.setItemShippingMethod(current_package.itemIds, parseInt(current_package.shipMethodId, 10));
				}
			});
		}

		//@method setShippingAddressOnly gets only the shipaddress of the order without requesting unnecessary data
	,	setShippingAddressOnly: function setShippingAddressOnly(data)
		{
			var field_values = this.getFieldValues({
				keys: ['shipaddress']
			,	items: []
			});
			return this.setShippingAddress(data, field_values);
		}

		// @method setShippingAddress
		// @param {LiveOrder.Model.Data} data
		// @param current_order
	,	setShippingAddress: function setShippingAddress (data, current_order)
		{
			if (data.shipaddress !== current_order.shipaddress)
			{
				if (data.shipaddress)
				{
					if (this.isSecure && !~data.shipaddress.indexOf('null'))
					{
						// Heads Up!: This "new String" is to fix a nasty bug
						ModelsInit.order.setShippingAddress(new String(data.shipaddress).toString());
					}
					else
					{
						this.estimateShippingCost(data);
					}
				}
				else if (this.isSecure)
				{
					ModelsInit.order.removeShippingAddress();
				}
				else
				{
					this.removeEstimateShippingCost();
				}
			}
		}

	,	estimateShippingCost: function estimateShippingCost(data)
		{
			var address = _.find(data.addresses, function (address)
			{
				return address.internalid === data.shipaddress;
			});

			address && ModelsInit.order.estimateShippingCost(address);
		}

	,	removeEstimateShippingCost: function removeEstimateShippingCost()
		{
			ModelsInit.order.estimateShippingCost({
				zip: null
			,	country: null
			});
			ModelsInit.order.removeShippingMethod();
		}

		// @method setPurchaseNumber
		// @param {LiveOrder.Model.Data} data
	,	setPurchaseNumber: function setPurchaseNumber (data)
		{
			if(ModelsInit.session.isLoggedIn2())
			{
				if (data && data.purchasenumber)
				{
					ModelsInit.order.setPurchaseNumber(data.purchasenumber);
				}
				else
				{
					ModelsInit.order.removePurchaseNumber();
				}
			}
		}

		// @method setPaymentMethods
		// @param {LiveOrder.Model.Data} data
	,	setPaymentMethods: function setPaymentMethods (data)
		{
			// Because of an api issue regarding Gift Certificates, we are going to handle them separately
			var gift_certificate_methods = _.where(data.paymentmethods, {type: 'giftcertificate'})
			,	non_certificate_methods = _.difference(data.paymentmethods, gift_certificate_methods);

			// Payment Methods non gift certificate
			if (this.isSecure && non_certificate_methods && non_certificate_methods.length && ModelsInit.session.isLoggedIn2())
			{
				_.each(non_certificate_methods, function (paymentmethod)
				{
					if (paymentmethod.type === 'creditcard' && paymentmethod.creditcard)
					{
						var credit_card = paymentmethod.creditcard
						,	require_cc_security_code = ModelsInit.session.getSiteSettings(['checkout']).checkout.requireccsecuritycode === 'T'
						,	cc_obj = credit_card && {
										ccnumber: credit_card.ccnumber
									,	ccname: credit_card.ccname
									,	ccexpiredate: credit_card.ccexpiredate
									,	expmonth: credit_card.expmonth
									,	expyear:  credit_card.expyear
									,	paymentmethod: {
											internalid: credit_card.paymentmethod.internalid || credit_card.paymentmethod
										,	name: credit_card.paymentmethod.name
										,	creditcard: credit_card.paymentmethod.creditcard ? 'T' : 'F'
										,	ispaypal:  credit_card.paymentmethod.ispaypal ? 'T' : 'F'
										,	key: credit_card.paymentmethod.key
										}
									};

						if (credit_card.internalid !== '-temporal-')
						{
							cc_obj.internalid = credit_card.internalid;
						}
						else
						{
							cc_obj.internalid = null;
							cc_obj.savecard = 'F';
						}

						if (credit_card.ccsecuritycode)
						{
							cc_obj.ccsecuritycode = credit_card.ccsecuritycode;
						}

						if (!require_cc_security_code || require_cc_security_code && credit_card.ccsecuritycode)
						{
							// the user's default credit card may be expired so we detect this using try & catch and if it is we remove the payment methods.
							try
							{
								// if the credit card is not temporal or it is temporal and the number is complete then set payment method.
								if (cc_obj.internalid || (!cc_obj.internalid && !~cc_obj.ccnumber.indexOf('*') ) )
								{
									ModelsInit.order.removePayment();

									var cc_parameter = {
										creditcard: {
											internalid: cc_obj.internalid
										,	ccsecuritycode: cc_obj.ccsecuritycode
										,	paymentmethod: {
												internalid: cc_obj.paymentmethod.internalid
											}
										}
									}
									ModelsInit.order.setPayment(cc_parameter);

									ModelsInit.context.setSessionObject('paypal_complete', 'F');
								}
							}
							catch (e)
							{
								if (e && e.code && e.code === 'ERR_WS_INVALID_PAYMENT')
								{
									ModelsInit.order.removePayment();
								}
								throw e;
							}

						}
						// if the the given credit card don't have a security code and it is required we just remove it from the order
						else if (require_cc_security_code && !credit_card.ccsecuritycode)
						{
							ModelsInit.order.removePayment();
						}
					}
					else if (paymentmethod.type === 'invoice')
					{
						ModelsInit.order.removePayment();

						try
						{
							ModelsInit.order.setPayment({ paymentterms: 'Invoice' });
						}
						catch (e)
						{
							if (e && e.code && e.code === 'ERR_WS_INVALID_PAYMENT')
							{
								ModelsInit.order.removePayment();
							}
							throw e;
						}

						ModelsInit.context.setSessionObject('paypal_complete', 'F');
					}
					else if (paymentmethod.type === 'paypal')
					{
						if (ModelsInit.context.getSessionObject('paypal_complete') !== 'T')
						{
							ModelsInit.order.removePayment();
							var paypal = _.findWhere(ModelsInit.session.getPaymentMethods(), {ispaypal: 'T'});
							paypal && ModelsInit.order.setPayment({paymentterms: '', paymentmethod: paypal.key});
						}

					}
					else if (paymentmethod.type && ~paymentmethod.type.indexOf('external_checkout'))
					{
						ModelsInit.order.removePayment();

						ModelsInit.order.setPayment({
								paymentmethod: paymentmethod.key
							,	thankyouurl: paymentmethod.thankyouurl
							,	errorurl: paymentmethod.errorurl
						});
					}
					else
					{
						ModelsInit.order.removePayment();
					}
				});
			}
			else if (this.isSecure && ModelsInit.session.isLoggedIn2())
			{
				ModelsInit.order.removePayment();
			}

			gift_certificate_methods = _.map(gift_certificate_methods, function (gift_certificate)
			{
				return gift_certificate.giftcertificate;
			});

			this.setGiftCertificates(gift_certificate_methods);
		}

		// @method setGiftCertificates
		// @param {Array<Object>} gift_certificates
	,	setGiftCertificates: function setGiftCertificates (gift_certificates)
		{
			// Remove all gift certificates so we can re-enter them in the appropriate order
			ModelsInit.order.removeAllGiftCertificates();

			_.forEach(gift_certificates, function (gift_certificate)
			{
				ModelsInit.order.applyGiftCertificate(gift_certificate.code);
			});
		}

		//@method setShippingMethodOnly gets only the shipmethod of the order without requesting unnecessary data
	,	setShippingMethodOnly: function setShippingMethodOnly(data)
		{
			var field_values = this.getFieldValues({
				keys: ['shipmethod', 'shipmethods']
			,	items: []
			})
			,	shipping_methods = this.getShipMethods(field_values)
			,	order_fields = {
					shipmethods: shipping_methods
				,	shipmethod: field_values.shipmethod
				};

			return this.setShippingMethod(data, order_fields);
		}

		// @method setShippingMethod
		// @param {LiveOrder.Model.Data} data
		// @param current_order
	,	setShippingMethod: function setShippingMethod (data, current_order)
		{
			if ((!this.isMultiShippingEnabled || !data.ismultishipto) && this.isSecure && data.shipmethod !== current_order.shipmethod)
			{
				var shipmethod = _.findWhere(current_order.shipmethods, {internalid: data.shipmethod});

				if (shipmethod)
				{
					ModelsInit.order.setShippingMethod({
						shipmethod: shipmethod.internalid
					,	shipcarrier: shipmethod.shipcarrier
					});
				}
				else
				{
					ModelsInit.order.removeShippingMethod();
				}
			}
		}

		// @method setTermsAndConditions
		// @param {LiveOrder.Model.Data} data
	,	setTermsAndConditions: function setTermsAndConditions (data)
		{
			var require_terms_and_conditions = ModelsInit.session.getSiteSettings(['checkout']).checkout.requiretermsandconditions;

			if (require_terms_and_conditions.toString() === 'T' && this.isSecure && !_.isUndefined(data.agreetermcondition) && ModelsInit.session.isLoggedIn2())
			{
				ModelsInit.order.setTermsAndConditions(data.agreetermcondition);
			}
		}

		// @method setTransactionBodyField
		// @param {LiveOrder.Model.Data} data
	,	setTransactionBodyField: function setTransactionBodyField (data)
		{
			// Transaction Body Field
			if (this.isSecure && !_.isEmpty(data.options) && ModelsInit.session.isLoggedIn2())
			{
				_.each(data.options, function(value, key)
				{
					if (Array.isArray(value))
					{
						data.options[key] = value.join(String.fromCharCode(5));
					}
				});
				ModelsInit.order.setCustomFieldValues(data.options);
			}
		}

	,	getOptionByCartOptionId: function getOptionByCartOptionId (options, cart_option_id)
		{
			return _.findWhere(options, {cartOptionId: cart_option_id});
		}

		// @method process3DSecure. 3D Secure is a second factor authentication.
		// Can apply to Visa, MasterCard, JCB International and American Express.
		// @return {Object} Result of order submit operation ({status, internalid, confirmationnumber})
	,	process3DSecure: function process3DSecure ()
		{
			var orderHandlerUrl = ModelsInit.session.getAbsoluteUrl2('checkout', '../threedsecure.ssp')
			,	confirmation = ModelsInit.order.submit({
					paymentauthorization: {
						type: 'threedsecure',
						noredirect: 'T',
						termurl: orderHandlerUrl
					}
				});

			if (confirmation.statuscode === 'error')
			{
				// With 3D Secure, we expect the order.submit() operation returning
				// 'ERR_WS_REQ_PAYMENT_AUTHORIZATION' to continue the flow.
				if (confirmation.reasoncode === 'ERR_WS_REQ_PAYMENT_AUTHORIZATION')
				{
					return confirmation;
				}

				throw confirmation;
			}
			else
			{
				confirmation = _.extend(this.getConfirmation(confirmation.internalid), confirmation);
			}
			return confirmation;
		}

	,	getEligibleFreeGifts: function getEligibleFreeGifts()
		{
			return ModelsInit.order.getEligibleFreeGiftItems();
		}

	,	storePromosPrevState: function storePromosPrevState ()
		{
			this.old_promocodes = ModelsInit.order.getAppliedPromotionCodes() || {};

			this.old_free_gifts = this.getEligibleFreeGifts();

		}
	});
});

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Address.js
// ----------
// Handles fetching, creating and updating addresses
// @module Address
define('Address.Model'
	, [
		'SC.Model'
		, 'SC.Models.Init'

		, 'Backbone.Validation'
		, 'underscore'
		,	'Configuration'
	]
	, function (
		SCModel
		, ModelsInit

		, BackboneValidation
		, _
		,	Configuration
	)
	{
		'use strict';

		var countries
			, states = {};

		// @class Address.Model Defines the model used by the Address frontent module.
		// @extends SCModel
		return SCModel.extend(
		{
			name: 'Address'

			// @property validation
			, validation:
			{
				addressee:
				{
					required: true
					, msg: 'Full Name is required'
				}
				, addr1:
				{
					required: true
					, msg: 'Address is required'
				}
				, country:
				{
					required: true
					, msg: 'Country is required'
				}
				, state: function (value, attr, computedState)
				{
					var selected_country = computedState.country;

					if (selected_country)
					{
						if (!states[selected_country])
						{
							states[selected_country] = ModelsInit.session.getStates([selected_country]);
						}

						if (selected_country && states[selected_country] && !value)
						{
							return 'State is required';
						}
					}
					else
					{
						return 'Country is required';
					}
				}
				, city:
				{
					required: true
					, msg: 'City is required'
				}
				, zip: function (value, attr, computedState)
				{
					var selected_country = computedState.country;
					countries = countries || ModelsInit.session.getCountries();

					if (!selected_country && !value || selected_country && countries[selected_country] && countries[selected_country].isziprequired === 'T' && !value)
					{
						return 'State is required';
					}
				}
				, phone: function (value)
				{
					if (Configuration.get('addresses') && Configuration.get('addresses.isPhoneMandatory') && !value)
					{
						return 'Phone Number is required';
					}
				}
			}

			, isValid: function (data)
			{
				data = this.unwrapAddressee(_.clone(data));

				var validator = _.extend(
				{
					validation: this.validation
					, attributes: data
				}, BackboneValidation.mixin);

				validator.validate();
				return validator.isValid();
			}

			// @method wrapAddressee
			// our model has "fullname" and "company" insted of  the fields "addresse" and "attention" used on netsuite.
			// this function prepare the address object for sending it to the frontend
			// @param {Object} address
			// @returns {Object} address
			, wrapAddressee: function (address)
			{
				if (address.attention && address.addressee)
				{
					address.fullname = address.attention;
					address.company = address.addressee;
				}
				else
				{
					address.fullname = address.addressee;
					address.company = null;
				}

				delete address.attention;
				delete address.addressee;

				return address;
			}

			// @method unwrapAddressee
			// @param {Object} address
			// @returns {Object} address
			, unwrapAddressee: function (address)
			{
				if (address.company && address.company.trim().length > 0)
				{
					address.attention = address.fullname;
					address.addressee = address.company;
				}
				else
				{
					address.addressee = address.fullname;
					address.attention = null;
				}

				delete address.fullname;
				delete address.company;
				delete address.check;

				return address;
			}

			// @method get
			// @param {Number} id
			// @returns {Object} address
			, get: function (id)
			{
				// @class Address.Model.Attributes
				//@property {String} company
				//@property {String} fullname
				//@property {String} internalid
				//@property {String} defaultbilling Valid values are 'T' or 'F'
				//@property {String} defaultshipping Valid values are 'T' or 'F'
				//@property {String} isvalid Valid values are 'T' or 'F'
				//@property {String} isresidential Valid values are 'T' or 'F'
				//@property {String?} addr3
				//@property {String} addr2
				//@property {String} addr1
				//@property {String} country
				//@property {String} city
				//@property {String} state
				//@property {String} phone
				//@property {String} zip
				// @class Address.Model
				return this.wrapAddressee(ModelsInit.customer.getAddress(id));
			}

			// @method getDefaultBilling
			// @returns {Object} default billing address
			, getDefaultBilling: function ()
			{
				return _.find(ModelsInit.customer.getAddressBook(), function (address)
				{
					return (address.defaultbilling === 'T');
				});
			}

			// @method getDefaultShipping
			// @returns {Object} default shipping address
			, getDefaultShipping: function ()
			{
				return _.find(ModelsInit.customer.getAddressBook(), function (address)
				{
					return address.defaultshipping === 'T';
				});
			}

			// @method list
			// @returns {Array<Object>} all user addresses
			, list: function ()
			{
				var self = this;

				return _.map(ModelsInit.customer.getAddressBook(), function (address)
				{
					return self.wrapAddressee(address);
				});
			}

			// @method update
			// updates a given address
			// @param {String} id
			// @param {String} data
			// @returns undefined
			, update: function (id, data)
			{
				data = this.unwrapAddressee(data);

				// validate the model
				this.validate(data);
				data.internalid = id;

				return ModelsInit.customer.updateAddress(data);
			}

			// @method create
			// creates a new address
			// @param {Address.Data.Model} data
			// @returns {String} key of the new address
			, create: function (data)
			{
				data = this.unwrapAddressee(data);
				// validate the model
				this.validate(data);

				return ModelsInit.customer.addAddress(data);
			}

			// @method remove
			// removes a given address
			// @param {String} id
			// @returns undefined
			, remove: function (id)
			{
				return ModelsInit.customer.removeAddress(id);
			}
		});
	});

//@class Address.Data.Model This is the model to send address to the backend;
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Account
// ----------
// Handles account creation, login, logout and password reset
// module Account
define(
	'Account.Model'
,	[
		'SC.Model'
	,	'Application'
	,	'SC.Models.Init'
	,	'Profile.Model'
	,	'LiveOrder.Model'
	,	'Address.Model'
	,	'CreditCard.Model'
	,	'SiteSettings.Model'
	,	'underscore'
	]
,	function (
		SCModel
	,	Application
	,	ModelsInit
	,	Profile
	,	LiveOrder
	,	Address
	,	CreditCard
	,	SiteSettings
	,	_
	)
{
	'use strict';

	// @class Account.Model Defines the model used by the all Account related services.
	// @extends SCModel
	return SCModel.extend({

		name: 'Account'

		//@method login
		//@param {String} email
		//@param {String} password
		//@param {Boolean} redirect
		//@returns {Account.Model.Attributes} ret touchpoints and user profile data
	,	login: function (email, password, redirect)
		{
			ModelsInit.session.login({
				email: email
			,	password: password
			});

			var user = Profile.get();
			user.isLoggedIn = ModelsInit.session.isLoggedIn2() ? 'T' : 'F';
			user.isRecognized = ModelsInit.session.isRecognized() ? 'T' : 'F';

			var ret = {
				touchpoints: ModelsInit.session.getSiteSettings(['touchpoints']).touchpoints
			,	user: user
			};

			if (!redirect)
			{
				var Environment = Application.getEnvironment(request)
				,	language = Environment && Environment.currentLanguage || {};
				language.url = language.locale && ModelsInit.session.getAbsoluteUrl('/languages/' + language.locale + '.js') || '';

				_.extend(ret, {
					cart: LiveOrder.get()
				,	address: Address.list()
				,	creditcard: CreditCard.list()
				,	language: language
				,	currency: Environment && Environment.currentCurrency || ''
				});
			}

			// New record to return
			// @class Account.Model.Attributes
				// @property {Array<Object>} touchpoints
				// @property {Profile.Model} user
				// @property {LiveOrder.Model.Data} cart
				// @property {Array<Address.Model.Attributes>} address
				// @property {Array<Address.Model.Attributes>} creditcard
				// @property {Object} language
				// @property {Object} currency
			// @class Account.Model
			return ret;
		}

		//@method forgotPassword
		//@param {String} email
		//@returns {Boolean} success
	,	forgotPassword: function (email)
		{
			try
			{
				// this API method throws an exception if the email doesn't exist
				// 'The supplied email has not been registered as a customer at our Web store.'
				ModelsInit.session.sendPasswordRetrievalEmail2(email);
			}
			catch (e)
			{
				var error = Application.processError(e);
				// if the customer failed to log in previously
				// the password retrieval email is sent but an error is thrown
				if (error.errorCode !== 'ERR_WS_CUSTOMER_LOGIN')
				{
					throw e;
				}
			}

			return  {
				success: true
			};
		}

		//@method resetPassword
		//@param {Object} params
		//@param {String} password
		//@returns {Boolean} success
	,	resetPassword: function (params, password)
		{
			if (!ModelsInit.session.doChangePassword(params, password))
			{
				throw new Error('An error has occurred');
			}
			else
			{
				return {
					success: true
				};
			}
		}

		//@method registerAsGuest
		//@param {Object} user
		//@return {Account.Model.Attributes}
	,	registerAsGuest: function (user)
		{
			var site_settings = SiteSettings.get();

			if (site_settings.registration.companyfieldmandatory === 'T')
			{
				user.companyname = 'Guest Shopper';
			}

			ModelsInit.session.registerGuest(user);

			user = Profile.get();
			user.isLoggedIn = ModelsInit.session.isLoggedIn2() ? 'T' : 'F';
			user.isRecognized = ModelsInit.session.isRecognized() ? 'T' : 'F';

			return {
				touchpoints: ModelsInit.session.getSiteSettings(['touchpoints']).touchpoints
			,	user: user
			,	cart: LiveOrder.get()
			,	address: Address.list()
			,	creditcard: CreditCard.list()
			};
		}

		//@method register
		//@param {UserData} user_data
		//@param {Account.Model.Attributes} user_data
	,	register: function (user_data)
		{
			//var customer = ModelsInit.getCustomer();
			var customfields = {};
			for (var property in user_data) {
				if(property.substring(0,10) == 'custentity') {
					customfields[property] = user_data[property];
				}
			}

			if (ModelsInit.customer.isGuest())
			{
				var guest_data = ModelsInit.customer.getFieldValues();

				ModelsInit.customer.setLoginCredentials({
					internalid: guest_data.internalid
				,	email: user_data.email
				,	password: user_data.password
				});

				ModelsInit.session.login({
					email: user_data.email
				,	password: user_data.password
				});

				if(Object.keys(customfields).length) {
					ModelsInit.customer.updateProfile({
						internalid: guest_data.internalid
					,	firstname: user_data.firstname
					,	lastname: user_data.lastname
					,	companyname: user_data.company
					,	emailsubscribe: (user_data.emailsubscribe && user_data.emailsubscribe !== 'F') ? 'T' : 'F'
					, customfields: customfields	
					});
				} else {
					ModelsInit.customer.updateProfile({
						internalid: guest_data.internalid
					,	firstname: user_data.firstname
					,	lastname: user_data.lastname
					,	companyname: user_data.company
					,	emailsubscribe: (user_data.emailsubscribe && user_data.emailsubscribe !== 'F') ? 'T' : 'F'
					});
				}
				
			}
			else
			{
				user_data.emailsubscribe = (user_data.emailsubscribe && user_data.emailsubscribe !== 'F') ? 'T' : 'F';
					var result = ModelsInit.session.registerCustomer({
						firstname: user_data.firstname
					,	lastname: user_data.lastname
					,	companyname: user_data.company
					,	email:user_data.email
					,	password:user_data.password
					,	password2:user_data.password2
					,	emailsubscribe: (user_data.emailsubscribe && user_data.emailsubscribe !== 'F') ? 'T' : 'F'
					});
				
					if(Object.keys(customfields).length && result.customerid) {					
						ModelsInit.customer.updateProfile({
							internalid: result.customerid
						, customfields: customfields	
						});
					}		
			}

			var user = Profile.get();
			user.isLoggedIn = ModelsInit.session.isLoggedIn2() ? 'T' : 'F';
			user.isRecognized = ModelsInit.session.isRecognized() ? 'T' : 'F';

			return {
				touchpoints: ModelsInit.session.getSiteSettings(['touchpoints']).touchpoints
			,	user: user
			,	cart: LiveOrder.get()
			,	address: Address.list()
			,	creditcard: CreditCard.list()
			};
		}
	});
});


//@class UserData
//@property {String} email
//@property {String} password
//@property {String} password2
//@property {String} firstname
//@property {String} lastname
//@property {String} company
//@property {String} emailsubscribe T or F;
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Account.ForgotPassword.ServiceController.js
// ----------------
// Service to enable the user to recover the password when he forgets it
define(
	'Account.ForgotPassword.ServiceController'
,	[
		'ServiceController'
	,	'Account.Model'
	]
,	function(
		ServiceController
	,	AccountModel
	)
	{
		'use strict';

		// @class Account.ForgotPassword.ServiceController
		// Supports password recovery process
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name:'Account.ForgotPassword.ServiceController'

			// @method post The call to Account.ForgotPassword.Service.ss with http method 'post' is managed by this function
			// @return {Boolean} True if the password retrieval email is successfully sent
		,	post: function ()
			{
				return AccountModel.forgotPassword(this.data.email);
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Account.Login.ServiceController.js
// ----------------
// Service to handle the login of a user into the system
define(
	'Account.Login.ServiceController'
,	[
		'ServiceController'
	,	'Account.Model'
	]
,	function(
		ServiceController
	,	AccountModel
	)
{
	'use strict';

	// @class Account.Login.ServiceController Supports login process
	// @extend ServiceController
	return ServiceController.extend({

		// @property {String} name Mandatory for all ssp-libraries model
		name:'Account.Login.ServiceController'

			// @method post The call to Account.Login.Service.ss with http method 'post' is managed by this function
			// @return {Account.Model.Attributes}
		,	post: function()
			{
				return AccountModel.login(this.data.email, this.data.password, this.data.redirect);
			}
		});
	}
);

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Account.Register.ServiceController.js
// ----------------
// Service to receive a new user registration
define(
	'Account.Register.ServiceController'
,	[
		'ServiceController'
	,	'Account.Model'
	]
,	function(
		ServiceController
	,	AccountModel
	)
	{
		'use strict';

		// @class Account.Register.ServiceController Supports register process
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name:'Account.Register.ServiceController'

			// @method post The call to Account.Register.Service.ss with http method 'post' is managed by this function
			// @return {Account.Model.register.data} Object literal with registration related data
		,	post: function()
			{
				return AccountModel.register(this.data);
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Account.RegisterAsGuest.ServiceController.js
// ----------------
// Service to enable the user to be registered as a guest.
define(
	'Account.RegisterAsGuest.ServiceController'
,	[
		'ServiceController'
	,	'Account.Model'
	]
,	function(
		ServiceController
	,	AccountModel
	)
	{
		'use strict';

		// @class Account.RegisterAsGuest.ServiceController Supports register as guest process
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name:'Account.RegisterAsGuest.ServiceController'

			// @method post The call to Account.RegisterAsGuest.Service.ss with http method 'post' is managed by this function
			// @return {Account.Model.Attributes}
		,	post: function()
			{
				return AccountModel.registerAsGuest(this.data);
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Account.ResetPassword.ServiceController.js
// ----------------
// Service to reset the password of a user
define(
	'Account.ResetPassword.ServiceController'
,	[
		'ServiceController'
	,	'Account.Model'
	]
,	function(
		ServiceController
	,	AccountModel
	)
	{
		'use strict';

		// @class Account.ResetPassword.ServiceController Supports reset password process
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name:'Account.ResetPassword.ServiceController'

			// @method post The call to Account.ResetPassword.Service.ss with http method 'post' is managed by this function
			// @return {Boolean} success
		,	post: function()
			{
				return AccountModel.resetPassword(this.data.params, this.data.password);
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Address.ServiceController.js
// ----------------
// Service to manage addresses requests
define(
	'Address.ServiceController'
,	[
		'ServiceController'
	,	'Application'
	,	'Address.Model'
	]
,	function(
		ServiceController
	,	Application
	,	AddressModel
	)
	{
		'use strict';

		// @class Address.ServiceController Manage addresses requests
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name:'Address.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: {
				common: {
					requireLogin: true
				}
			}

			// @method get The call to Address.Service.ss with http method 'get' is managed by this function
			// @return {Address.Model.Attributes | Array<Address.Model.Attributes>} one or all user addresses
		,	get: function()
			{
				var id = this.request.getParameter('internalid');
				return id ? AddressModel.get(id) : (AddressModel.list() || []);
			}

			// @method post The call to Address.Service.ss with http method 'post' is managed by this function
			// @return {AddressModel.Attributes}
		,	post: function()
			{
				var id = AddressModel.create(this.data);
				//Do not return anything here, we need send content with status 201
				this.sendContent(AddressModel.get(id), {'status': 201});
			}

			// @method update The call to Address.Service.ss with http method 'put' is managed by this function
			// @return {Address.Model.Attributes}
		,	put: function()
			{
				var id = this.request.getParameter('internalid');
				AddressModel.update(id, this.data);
				return AddressModel.get(id);
			}

			// @method delete The call to Address.Service.ss with http method 'delete' is managed by this function
			// @return {StatusObject}
		,	delete: function()
			{
				var id = this.request.getParameter('internalid');
				AddressModel.remove(id);
				// If something goes wrong in the remove, an exception will fire
				return {'status': 'ok'};
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Case
define('Case.Model'
,	[
		'SC.Model'
	,	'Application'
	,	'Utils'
	,	'underscore'
	,	'Configuration'
	]
,	function (
		SCModel
	,	Application
	,	Utils
	,	_
	,	Configuration
	)
{
	'use strict';

	// @class Case.Model Defines the model used by the Case.Service.ss and Case.Fields.Service.ss services.
	// Handles fetching, creating and updating cases. @extends SCModel
	return SCModel.extend({
		name: 'Case'

		// @property configuration general settings
	,	configuration: Configuration.get('cases')

		// @property dummy_date for cases with no messages. Not common, but it could happen.
	,	dummy_date: new Date()

		// @method getNew
		// @returns a new Case record
	,	getNew: function ()
		{
			var case_record = nlapiCreateRecord('supportcase');

			var category_field = case_record.getField('category');
			var category_options = category_field.getSelectOptions();
			var category_option_values = [];

			_(category_options).each(function (category_option) {
				var category_option_value = {
					id: category_option.id
				,	text: category_option.text
				};

				category_option_values.push(category_option_value);
			});

			// Origins
			var origin_field = case_record.getField('origin');
			var origin_options = origin_field.getSelectOptions();
			var origin_option_values = [];

			_(origin_options).each(function (origin_option) {
				var origin_option_value = {
					id: origin_option.id
				,	text: origin_option.text
				};

				origin_option_values.push(origin_option_value);
			});

			// Statuses
			var status_field = case_record.getField('status');
			var status_options = status_field.getSelectOptions();
			var status_option_values = [];

			_(status_options).each(function (status_option) {
				var status_option_value = {
					id: status_option.id
				,	text: status_option.text
				};

				status_option_values.push(status_option_value);
			});

			// Priorities
			var priority_field = case_record.getField('priority');
			var priority_options = priority_field.getSelectOptions();
			var priority_option_values = [];

			_(priority_options).each(function (priority_option) {
				var priority_option_value = {
					id: priority_option.id
				,	text: priority_option.text
				};

				priority_option_values.push(priority_option_value);
			});

			// New record to return
			// @class Case.Fields.Model.Attributes
			var newRecord = {
				// @property {Array<Case.Fields.Model.Attributes.Category>} categories
				// @class Case.Fields.Model.Attributes.Category
					// @property {String} id
					// @property {String} text
				// @class Case.Fields.Model.Attributes
				categories: category_option_values

				// @property {Array<Case.Fields.Model.Attributes.Origin>} origins
				// @class Case.Fields.Model.Attributes.Origin
					// @property {String} id
					// @property {String} text
				// @class Case.Fields.Model.Attributes
			,	origins: origin_option_values

				// @property {Array<Case.Fields.Model.Attributes.Status>} statuses
				// @class Case.Fields.Model.Attributes.Status
					// @property {String} id
					// @property {String} text
				// @class Case.Fields.Model.Attributes
			,	statuses: status_option_values

				// @property {Array<Case.Fields.Model.Attributes.Priority>} priorities
				// @class Case.Fields.Model.Attributes.Priority
					// @property {String} id
					// @property {String} text
				// @class Case.Fields.Model.Attributes
			,	priorities: priority_option_values
			};

			// @class Case.Model
			return newRecord;
		}

		// @method getColumnsArray
		// Helper method for defining search columns.
	,	getColumnsArray: function ()
		{
			return [
				new nlobjSearchColumn('internalid')
			,	new nlobjSearchColumn('casenumber')
			,	new nlobjSearchColumn('title')
			,	new nlobjSearchColumn('status')
			,	new nlobjSearchColumn('origin')
			,	new nlobjSearchColumn('category')
			,	new nlobjSearchColumn('company')
			,	new nlobjSearchColumn('createddate')
			,	new nlobjSearchColumn('lastmessagedate')
			,	new nlobjSearchColumn('priority')
			,	new nlobjSearchColumn('email')
			];
		}

		// @method get
		// @param {String} id
		// @returns {Case.Model.Attributes}
	,	get: function (id)
		{
			var filters = [new nlobjSearchFilter('internalid', null, 'is', id),	new nlobjSearchFilter('isinactive', null, 'is', 'F')]
			,	columns = this.getColumnsArray()
			,	result = this.searchHelper(filters, columns, 1, true);

			if (result.records.length >= 1)
			{
				return result.records[0];
			}
			else
			{
				throw notFoundError;
			}
		}

		// @method get
		// @param {String} customer_id
		// @param {Object} list_header_data
		// @returns {Array<Case.Model.Attributes>}
	,	search: function (customer_id, list_header_data)
		{
			var filters = [new nlobjSearchFilter('isinactive', null, 'is', 'F')]
			,	columns = this.getColumnsArray()
			,	selected_filter = parseInt(list_header_data.filter, 10);

			if (!_.isNaN(selected_filter))
			{
				filters.push(new nlobjSearchFilter('status', null, 'anyof', selected_filter));
			}

			this.setSortOrder(list_header_data.sort, list_header_data.order, columns);

			return this.searchHelper(filters, columns, list_header_data.page, false);
		}

		// @method searchHelper
		// @param {Array<String>} filters
		// @param {Array<String>} columns
		// @param {Number} page
		// @param {Boolean} join_messages
		// @returns {Array<Case.Model.Attributes>}
	,	searchHelper: function (filters, columns, page, join_messages)
		{
			var self = this
			,	result = Application.getPaginatedSearchResults({
					record_type: 'supportcase'
				,	filters: filters
				,	columns: columns
				,	page: page
				});

			result.records = _.map(result.records, function (case_record)
			{
				// @class Case.Model.Attributes
				var current_record_id = case_record.getId()
				,	created_date = nlapiStringToDate(case_record.getValue('createddate'))
				,	last_message_date = nlapiStringToDate(case_record.getValue('lastmessagedate'))
				,	support_case = {
						//@property {String} internalid
						internalid: current_record_id

						//@property {String} caseNumber
					,	caseNumber: case_record.getValue('casenumber')

						//@property {String} title
					,	title: case_record.getValue('title')

						// @property {Array<String, Case.Model.Attributes.Message>} grouped_messages
						// @class Case.Model.Attributes.Message
							// @property {String} author
							// @property {String} text
							// @property {String} messageDate
							// @property {String} initialDate
						// @class Case.Model.Attributes
					,	grouped_messages: []

						// @property {Case.Model.Attributes.Status} status
						// @class Case.Model.Attributes.Status
							// @property {String} id
							// @property {String} text
						// @class Case.Model.Attributes
					,	status: {
							id: case_record.getValue('status')
						,	name: case_record.getText('status')
						}

						// @property {Case.Model.Attributes.Origin} origin
						// @class Case.Model.Attributes.Origin
							// @property {String} id
							// @property {String} text
						// @class Case.Model.Attributes
					,	origin: {
							id: case_record.getValue('origin')
						,	name: case_record.getText('origin')
						}

						// @property {Case.Model.Attributes.Category} category
						// @class Case.Model.Attributes.Category
							// @property {String} id
							// @property {String} text
						// @class Case.Model.Attributes
					,	category: {
							id: case_record.getValue('category')
						,	name: case_record.getText('category')
						}

						// @property {Case.Model.Attributes.Company} company
						// @class Case.Model.Attributes.Company
							// @property {String} id
							// @property {String} text
						// @class Case.Model.Attributes
					,	company: {
							id: case_record.getValue('company')
						,	name: case_record.getText('company')
						}

						// @property {Case.Model.Attributes.Priority} priority
						// @class Case.Model.Attributes.Priority
							// @property {String} id
							// @property {String} text
						// @class Case.Model.Attributes
					,	priority: {
							id: case_record.getValue('priority')
						,	name: case_record.getText('priority')
						}
						//@property {String} createdDate
					,	createdDate: nlapiDateToString(created_date ? created_date : self.dummy_date, 'date')

						//@property {String} lastMessageDate
					,	lastMessageDate: nlapiDateToString(last_message_date ? last_message_date : self.dummy_date, 'date')

						//@property {String} email
					,	email: case_record.getValue('email')
					};

				if (join_messages)
				{
					self.appendMessagesToCase(support_case);
				}

				return support_case;
			});

			// @class Case.Model
			return result;
		}

		// @method stripHtmlFromMessage
		// @param {String} message with HTML
		// @returns {String} message without HTML
	,	stripHtmlFromMessage: function (message)
		{
			return message.replace(/<br\s*[\/]?>/gi, '\n').replace(/<(?:.|\n)*?>/gm, '');
		}

		// @method appendMessagesToCase When requesting a case detail, messages are included in the response.
		// @param {Case.Model.Attributes}
	,	appendMessagesToCase: function (support_case)
		{
			var message_columns = {
						message_col: new nlobjSearchColumn('message', 'messages')
					,	message_date_col: new nlobjSearchColumn('messagedate', 'messages').setSort(true)
					,	author_col: new nlobjSearchColumn('author', 'messages')
					,	message_id: new nlobjSearchColumn('internalid', 'messages')
				}
			,	message_filters = [new nlobjSearchFilter('internalid', null, 'is', support_case.internalid), new nlobjSearchFilter('internalonly', 'messages', 'is', 'F')]
			,	message_records = Application.getAllSearchResults('supportcase', message_filters, _.values(message_columns))
			,	grouped_messages = []
			,	messages_count = 0
			,	self = this;

			_(message_records).each(function (message_record)
			{
				var customer_id = nlapiGetUser() + ''
				,	message_date_tmp = nlapiStringToDate(message_record.getValue('messagedate', 'messages'))
				,	message_date = message_date_tmp ? message_date_tmp : self.dummy_date
				,	message_date_to_group_by = message_date.getFullYear() + '-' + (message_date.getMonth() + 1) + '-' + message_date.getDate()
				,	message = {
						author: message_record.getValue('author', 'messages') === customer_id ? 'You' : message_record.getText('author', 'messages')
					,	text: self.stripHtmlFromMessage(message_record.getValue('message', 'messages'))
					,	messageDate: nlapiDateToString(message_date, 'timeofday')
					,	internalid: message_record.getValue('internalid', 'messages')
					,	initialMessage: false
					};

				if (grouped_messages[message_date_to_group_by])
				{
					grouped_messages[message_date_to_group_by].messages.push(message);
				}
				else
				{
					grouped_messages[message_date_to_group_by] = {
						date: self.getMessageDate(message_date)
					,	messages: [message]
					};
				}

				messages_count ++;

				if (messages_count === message_records.length)
				{
					message.initialMessage = true;
				}
			});

			support_case.grouped_messages = _(grouped_messages).values();
			support_case.messages_count = messages_count;
		}

		// @method getMessageDate
		// @param {Date} validJsDate
		// @returns {String} string date with the correct format
	,	getMessageDate: function (validJsDate)
		{
			var today = new Date()
			,	today_dd = today.getDate()
			,	today_mm = today.getMonth()
			,	today_yyyy = today.getFullYear()
			,	dd = validJsDate.getDate()
			,	mm = validJsDate.getMonth()
			,	yyyy = validJsDate.getFullYear();

			if (today_dd === dd && today_mm === mm && today_yyyy === yyyy)
			{
				return 'Today';
			}

			return nlapiDateToString(validJsDate, 'date');
		}

		// @method create
		// Creates a new case record
		// @param {String} customerId
		// @param {Object} data
	,	create: function (customerId, data)
		{
			customerId = customerId || nlapiGetUser() + '';

			var newCaseRecord = nlapiCreateRecord('supportcase');

			data.title && newCaseRecord.setFieldValue('title', Utils.sanitizeString(data.title));
			data.message && newCaseRecord.setFieldValue('incomingmessage', Utils.sanitizeString(data.message));
			data.category && newCaseRecord.setFieldValue('category', data.category);
			data.email && newCaseRecord.setFieldValue('email', data.email);
			customerId && newCaseRecord.setFieldValue('company', customerId);

			var default_values = this.configuration.defaultValues;

			newCaseRecord.setFieldValue('status', default_values.statusStart.id); // Not Started
			newCaseRecord.setFieldValue('origin', default_values.origin.id); // Web

			return nlapiSubmitRecord(newCaseRecord);
		}

		// @method setSortOrder
		// Adds sort condition to the respective column
		// @param {String} sort column name
		// @param {Number} order
		// @param {Array} columns columns array
	,	setSortOrder: function (sort, order, columns)
		{
			switch (sort)
			{
				case 'createdDate':
					columns[7].setSort(order > 0);
				break;

				case 'lastMessageDate':
					columns[8].setSort(order > 0);
				break;

				default:
					columns[1].setSort(order > 0);
			}
		}

		// @method update
		// Updates a Support Case given its id
		// @param {String} id
		// @param {String} data
	,	update: function (id, data)
		{
			if (data && data.status)
			{
				if (data.reply && data.reply.length > 0)
				{
					nlapiSubmitField('supportcase', id, ['incomingmessage', 'messagenew', 'status'], [Utils.sanitizeString(data.reply), 'T', data.status.id]);
				}
				else
				{
					nlapiSubmitField('supportcase', id, ['status'], data.status.id);
				}
			}
		}
	});
});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Case.Fields.ServiceController.js
// ----------------
// Service to manage support case fields
define(
	'Case.Fields.ServiceController'
,	[
		'ServiceController'
	,	'Case.Model'
	]
,	function(
		ServiceController
	,	CaseModel
	)
	{
		'use strict';
		// @class Case.Fields.ServiceController Manage support case fields
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name:'Case.Fields.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: {
				common: {
					requireLogin: true
				,	requirePermissions: {
						list: [
							'lists.listCase.1'
						]
					}
				}
			}

			// @method get The call to Case.Fields.Service.ss with http method 'get' is managed by this function
			// @return {Case.Model} New Case record
		,	get: function()
			{
				return CaseModel.getNew();
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Case.ServiceController.js
// ----------------
// Service to manage support cases
define(
	'Case.ServiceController'
,	[
		'ServiceController'
	,	'Case.Model'
	]
,	function(
		ServiceController
	,	CaseModel
	)
	{
		'use strict';

		// @class Case.ServiceController Manage support cases
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'Case.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: {
				common: {
					requireLogin: true
				,	requirePermissions: {
						list: [
							'lists.listCase.1'
						]
					}
				}
			}

			// @method get The call to Case.Service.ss with http method 'get' is managed by this function
			// @return {Array<Case.Model.Attributes>}
		,	get: function()
			{
				var id = this.request.getParameter('internalid') || this.data.internalid;
				if(id)
				{
					return CaseModel.get(id);
				}
				else
				{
					var list_header_data = {
						filter: this.request.getParameter('filter')
					,   order: this.request.getParameter('order')
                    ,   sort: this.request.getParameter('sort')
                    ,   from: this.request.getParameter('from')
                    ,   to: this.request.getParameter('to')
                    ,   page: this.request.getParameter('page')
					};
					return CaseModel.search(nlapiGetUser() + '', list_header_data);
				}
			}

			// @method post The call to Case.Service.ss with http method 'post' is managed by this function
			// @return {Case.Model.Attributes}
		,	post: function()
			{
				var new_case_id = CaseModel.create(nlapiGetUser() + '', this.data);
				return CaseModel.get(new_case_id);
			}

			// @method put The call to Case.Service.ss with http method 'put' is managed by this function
			// @return {Case.Model.Attributes}
		,	put: function()
			{
				var id = this.request.getParameter('internalid') || this.data.internalid;
				CaseModel.update(id, this.data);
				return CaseModel.get(id);
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Category.js
// -----------
// Handles the Category tree
define(
	'Categories.Model'
,	[
		'SC.Model'
	,	'SC.Models.Init'
	,	'Application'
	,	'Configuration'
	,	'underscore'
	]
,	function (
		SCModel
	,	ModelsInit
	,	Application
	,	Configuration
	,	_
	)
{
	'use strict';
	return SCModel.extend({
		name: 'Category'

	,	categoryColumns: {
			boolean: [
				'displayinsite'
			,	'isinactive'
			,	'isprimaryurl'
			]

		,	sideMenu: {
				'sortBy': 'sequencenumber'
			,	'fields': [
					'name'
				,	'internalid'
				,	'sequencenumber'
				,	'urlfragment'
				,	'displayinsite'
				]
			}

		,	subCategories: {
				'sortBy': 'sequencenumber'
			,	'fields': [
					'name'
				,	'description'
				,	'internalid'
				,	'sequencenumber'
				,	'urlfragment'
				,	'thumbnailurl'
				,	'displayinsite'
				]
			}

		,	category: {
				'fields': [
					'internalid'
				,	'name'
				,	'description'
				,	'pagetitle'
				,	'pageheading'
				,	'pagebannerurl'
				,	'addtohead'
				,	'metakeywords'
				,	'metadescription'
				,	'displayinsite'
				,	'urlfragment'

				,	'idpath' // needed for breadcrumb
				,	'fullurl' // needed for canonical path
				,	'isprimaryurl' // needed for canonical path
				]
			}

		,	breadcrumb: {
				'fields': [
					'internalid'
				,	'name'
				,	'displayinsite'
				]
			}

		,	menu: {
				'sortBy': 'sequencenumber'
			,	'fields': [
					'internalid'
				,	'name'
				,	'sequencenumber'
				,	'displayinsite'
				]
			}

		,	mapping: {
				'internalid': 'subcatid'
			,	'name': 'subcatnameoverride'
			,	'description': 'subcatdescoverride'
			,	'pagetitle': 'subcatpagetitleoverride'
			,	'pageheading': 'subcatpageheadingoverride'
			,	'pagebannerurl': 'subcatpagebannerurloverride'
			,	'addtohead': 'subcataddtoheadoverride'
			,	'metakeywords': 'subcatmetakeywordsoverride'
			,	'metadescription': 'subcatmetadescoverride'
			,	'displayinsite': 'subcatdisplayinsiteoverride'
			,	'sequencenumber': 'subcatsequencenumber'
			,	'thumbnailurl': 'subcatthumbnailurloverride'
			,	'urlfragment': 'subcaturlfragmentoverride'
			}
		}

	,	getColumns: function (element)
		{
			var config = Configuration.get().categories;

			return _.union(this.categoryColumns[element].fields, config[element].fields || config[element].additionalFields);
		}

	,	getSortBy: function (element)
		{
			var config = Configuration.get().categories;

			return config[element].sortBy || this.categoryColumns[element].sortBy;
		}

	,	get: function (fullurl, effectiveDate)
		{
			var effectiveDateFilters = [];
			if (effectiveDate){
				this.addDateEfectiveFilters(effectiveDateFilters, effectiveDate);
			}
			var cmsRequestT0 = new Date().getTime();

			var self = this;

			var category = {
				parenturl: fullurl.substring(0, fullurl.lastIndexOf('/'))
			,	urlfragment: fullurl.substring(fullurl.lastIndexOf('/') + 1)
			};
			//load siblings
			if (category.parenturl)
			{
				category.siblings = this.getCategories(category.parenturl, null, this.getColumns('sideMenu'), effectiveDateFilters);

				_.each(category.siblings, function(sibling)
				{
					if (sibling.urlfragment === category.urlfragment)
					{
						category.internalid = sibling.internalid;
					}

					self.fixBooleans(sibling);
				});

				this.sortBy(category.siblings, this.getSortBy('sideMenu'));
			}
			//load the category data
			if (category.internalid || (!category.internalid && !category.parenturl))
			{
				var categories = this.getCategories(category.parenturl, { 'internalid': category.internalid, 'fullurl': fullurl }, this.getColumns('category'), effectiveDateFilters);

				if (categories.length)
				{
					_.extend(category, categories[0]);
				}
				else
				{
					throw notFoundError;
				}
			}
			else
			{
				throw notFoundError;
			}
			//load sub-categories
			category.categories = this.getCategories(fullurl, null, this.getColumns('subCategories'), effectiveDateFilters);

			_.each(category.categories, function(subcategory)
			{
				self.fixBooleans(subcategory);
			});

			this.sortBy(category.categories, this.getSortBy('subCategories'));

			category.breadcrumb = this.getBreadcrumb(category.idpath, effectiveDateFilters);
			this.fixBooleans(category);

			var bread = { 'fullurl': category.fullurl };

			_.each(this.getColumns('breadcrumb'), function(column)
			{
				bread[column] = category[column];
			});

			category.breadcrumb.push(bread);

			category._debug_requestTime = (new Date().getTime()) - cmsRequestT0;

			return category;
		}

	,	getCategories: function (parenturl, categoryIds, columns, additionalFilters)
		{
			var categories = [];
			var categoriesData;

			if (parenturl)
			{
				var categoriesOverride = this.getCategoriesOverride(parenturl, categoryIds ? categoryIds.internalid : null, columns, additionalFilters);
				var i = categoriesOverride.length;

				if (i)
				{
					var categoryids = categoryIds ? categoryIds : _.pluck(categoriesOverride, 'internalid');
					categoriesData = this.getCategoriesData(parenturl, categoryids, columns, additionalFilters);

					var processColumn = function (column)
					{
						category[column] = category[column] || categoryData[column];
					};

					while (i--)
					{
						var categoryData = categoriesData[categoriesOverride[i].internalid];

						if (categoryData)
						{
							var category = categoriesOverride[i];

							_.each(columns, processColumn);

							category.fullurl = parenturl + '/' + category.urlfragment;
							category.canonical = categoryData.canonical;

							if (category.displayinsite === 'T')
							{
								categories.push(category);
							}
						}
					}
				}
			}
			else
			{
				categoriesData = _.values(this.getCategoriesData(parenturl, categoryIds, columns, additionalFilters));

				_.each(categoriesData, function(category)
				{
					if (category.displayinsite === 'T')
					{
						category.fullurl = '/' + category.urlfragment;
						categories.push(category);
					}
				});
			}

			return categories;
		}

	,	getCategoriesOverride: function (parenturl, categoryid, columns, additionalFilters)
		{
			var overrides = []
			,	siteId = ModelsInit.session.getSiteSettings(['siteid']).siteid
			,	searchFilters = [
					new nlobjSearchFilter('fullurl', null, 'is', parenturl)
				,	new nlobjSearchFilter('site', null, 'is', siteId)
				]
			,	searchColumns = []
			,	toSubCategory = this.categoryColumns.mapping;

			if (categoryid)
			{
				searchFilters.push(new nlobjSearchFilter('subcatid', null, 'is', categoryid));
			}

			_.each(columns, function(column)
			{
				toSubCategory[column] && searchColumns.push(new nlobjSearchColumn(toSubCategory[column]));
			});
			if(additionalFilters){
				searchFilters = searchFilters.concat(additionalFilters);
			}
			var result = Application.getAllSearchResults('commercecategory', searchFilters, searchColumns);

			_.each(result, function(line)
			{
				if (line.getValue(toSubCategory.internalid))
				{
					var override = {};

					_.each(columns, function(column)
					{
						override[column] = line.getValue(toSubCategory[column]);
					});

					overrides.push(override);
				}
			});

			return overrides;
		}

	,	getCategoriesData: function (parenturl, categoryIds, columns, additionalFilters)
		{
			var categories = {}
			,	siteId = ModelsInit.session.getSiteSettings(['siteid']).siteid
			,	searchFilters = [
					new nlobjSearchFilter('isinactive', null, 'is', 'F')
				,	new nlobjSearchFilter('site', null, 'is', siteId)
				]
			,	searchColumns = [];

			if (_.isArray(categoryIds))
			{
				searchFilters.push(new nlobjSearchFilter('internalid', null, 'anyof', categoryIds));
				searchFilters.push(new nlobjSearchFilter('isprimaryurl', null, 'is', 'T'));
			}
			else
			{
				//get idpath of the current url and the fullurl of the canonical
				//categoryIds starts with '/', is an url
				var fullurlFilter = new nlobjSearchFilter('fullurl', null, 'is', categoryIds.fullurl);

				searchFilters.push(fullurlFilter);

				if (categoryIds.internalid)
				{
					fullurlFilter.setLeftParens(1).setOr(true);
					searchFilters.push(new nlobjSearchFilter('isprimaryurl', null, 'is', 'T').setLeftParens(1));
					searchFilters.push(new nlobjSearchFilter('internalid', null, 'is', categoryIds.internalid).setRightParens(2));
				}
			}
			if(additionalFilters){
				searchFilters = searchFilters.concat(additionalFilters);
			}

			_.each(columns, function(column)
			{
				searchColumns.push(new nlobjSearchColumn(column));
			});

			var result = Application.getAllSearchResults('commercecategory', searchFilters, searchColumns);

			_.each(result, function (line)
			{
				var category = {};

				_.each(columns, function(column)
				{
					category[column] = line.getValue(column);
				});

				var cat = categories[line.getValue('internalid')];

				if (cat)
				{
					if (category.isprimaryurl === 'T')
					{
						cat.canonical = category.fullurl;
					}

					if (categoryIds && categoryIds.fullurl === category.fullurl)
					{
						cat.idpath = category.idpath;
					}
				}
				else
				{
					category.canonical = category.fullurl;
					categories[line.getValue('internalid')] = category;
				}

			});

			return categories;
		}

	,	fixBooleans: function(catObject)
		{
			_.each(this.categoryColumns.boolean, function(column)
			{
				if (catObject[column])
				{
					catObject[column] = catObject[column] ? (catObject[column] === 'T' ? true : false) : '';
				}
			});
		}

	,	getBreadcrumb: function (idpath, additionalFilters)
		{
			var self = this
			,	ids = idpath.split('|')
			,	breadcrumb = []
			,	siteId = ModelsInit.session.getSiteSettings(['siteid']).siteid
			,	filters = [
					new nlobjSearchFilter('site', null, 'is', siteId)
				]
			,	searchColumns = [
					new nlobjSearchColumn('isinactive')
				,	new nlobjSearchColumn('fullurl')
				,	new nlobjSearchColumn('idpath').setSort(false)
				]
			,	columns = this.getColumns('breadcrumb')
			,	toSubCategory = this.categoryColumns.mapping;

			_.each(columns, function(column)
			{
				searchColumns.push(new nlobjSearchColumn(column));
				toSubCategory[column] && searchColumns.push(new nlobjSearchColumn(toSubCategory[column]));
			});

			ids.splice(ids.length - 1, 1);

			for (var i = 1; i < ids.length - 1; i++)
			{
				var current = new nlobjSearchFilter('internalid', null, 'is', ids[i]);

				if (i === 1)
				{
					current.setLeftParens(2);
				}
				else
				{
					current.setLeftParens(1);
				}

				var currentChildren = new nlobjSearchFilter('subcatid', null, 'is', ids[i + 1]);

				if (i === ids.length - 2)
				{
					currentChildren.setRightParens(2);
				}
				else
				{
					currentChildren.setRightParens(1).setOr(true);
				}

				filters.push(current);
				filters.push(new nlobjSearchFilter('idpath', null, 'is', ids.slice(0, i + 1).join('|') + '|'));
				filters.push(currentChildren);
			}

			if (filters.length > 1)
			{
				filters = filters.concat(additionalFilters);
				var result = Application.getAllSearchResults('commercecategory', filters, searchColumns);

				var category = {};

				_.each(result, function(crumb, index)
				{

					if (crumb.getValue('isinactive') === 'T')
					{
						throw notFoundError;
					}

					_.each(columns, function(column)
					{
						category[column] = category[column] || crumb.getValue(column);
					});

					if (category.displayinsite === 'F')
					{
						throw notFoundError;
					}

					category.fullurl = crumb.getValue('fullurl');

					breadcrumb.push(category);

					if (index !== result.length - 1)
					{
						category = {};

						_.each(columns, function(column)
						{
							category[column] = crumb.getValue(toSubCategory[column]);
						});
					}
				});
			}

			_.each(breadcrumb, function(category)
			{
				self.fixBooleans(category);
			});

			return breadcrumb;
		}

	,	getCategoryTree: function (level, effectiveDate)
		{
			var cmsRequestT0 = new Date().getTime();

			var self = this
			,	result = []
			,	siteId = ModelsInit.session.getSiteSettings(['siteid']).siteid
			,	filters = [
					new nlobjSearchFilter('nestlevel', null, 'lessthanorequalto', level)
				,	new nlobjSearchFilter('isinactive', null, 'is', 'F')
				,	new nlobjSearchFilter('site', null, 'is', siteId)
				]
			,	searchColumns = [
					new nlobjSearchColumn('fullurl')
				,	new nlobjSearchColumn('nestlevel')
				,	new nlobjSearchColumn('idpath').setSort(false)
				]
			,	bag = {}
			,	overrides = {}
			,	columns = this.getColumns('menu')
			,	toSubCategory = this.categoryColumns.mapping;

			if (effectiveDate){
				self.addDateEfectiveFilters(filters, effectiveDate);
			}

			_.each(columns, function(column)
			{
				searchColumns.push(new nlobjSearchColumn(column));
				toSubCategory[column] && searchColumns.push(new nlobjSearchColumn(toSubCategory[column]));
			});

			Application.getAllSearchResults('commercecategory', filters, searchColumns).forEach(function (line)
			{
				var idPath = line.getValue('idpath');

				if (!bag[idPath])
				{
					var current = {	categories: [] }
					,	override = overrides[idPath];

					_.each(columns, function(column)
					{
						current[column] = (override && override[column]) ||  line.getValue(column);
					});

					self.fixBooleans(current);

					current.fullurl = line.getValue('fullurl');
					current.level = line.getValue('nestlevel');

					var parentIdPathArr = idPath.split('|');

					if (parentIdPathArr.length > 3)
					{
						parentIdPathArr.splice(parentIdPathArr.length - 2, 1);
					}
					else
					{
						parentIdPathArr = [];
					}

					// Find the idPath of the parent
					current.parentIdPath = parentIdPathArr.join('|');

					if (current.displayinsite)
					{

						if (!current.parentIdPath)
						{
							// Add the roots categories to the result var
							result.push(current);
						}
						else
						{
							// Adding subcategories to parent, by reference is added to result
							bag[current.parentIdPath] && bag[current.parentIdPath].categories.push(current);
						}

						bag[idPath] = current;
					}
				}

				var childId = line.getValue('subcatid');

				if (childId)
				{
					var childIdPath = idPath + childId + '|';

					var child = {};

					_.each(columns, function(column)
					{
						child[column] = line.getValue(toSubCategory[column]);
					});

					overrides[childIdPath] = child;
				}

			});

			this.sortBy(result, this.getSortBy('menu'));

			if (result.length)
			{
				result[0]._debug_requestTime = (new Date().getTime()) - cmsRequestT0;
			}
			return result;
		}

	,	sortBy: function (categories, property)
		{
			if (categories)
			{
				var self = this;
				property = property || 'sequencenumber';

				_.each(categories, function(category)
				{
					self.sortBy(category.categories, property);
				});

				categories.sort(function (a, b)
				{
					//This works with Strings, Numbers, and Numbers as Strings. ie: ['a', 'b', 'c'] OR [1, 3, 20] OR ['1', '3', '20']
					var numberA = Number(a[property])
					,	numberB = Number(b[property]);

					if (!isNaN(numberA) && !isNaN(numberB))
					{
						return numberA - numberB;
					}
					else
					{
						return (a[property] + '').localeCompare(b[property] + '', {}, { numeric: true });
					}
				});
			}
		}
	,	addDateEfectiveFilters: function (filters, effectiveDate){
			effectiveDate = nlapiDateToString(new Date(effectiveDate), 'datetime');
			filters.push(new nlobjSearchFilter('startdate', null, 'notafter', effectiveDate));
			filters.push(new nlobjSearchFilter('enddate', null, 'notbefore', effectiveDate));
		}
	});
});

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Categories.ServiceController.js
// ----------------
// Service to manage categories
define(
	'Categories.ServiceController'
,	[
		'ServiceController'
	,	'Categories.Model'
	]
,	function(
		ServiceController
	,	CategoriesModel
	)
	{
		'use strict';
		return ServiceController.extend({

			name: 'Categories.ServiceController'

		,	options: {
				common: {
					requireLoggedInPPS: true
				}
			}

		,	get: function()
			{
				var fullurl = this.request.getParameter('fullurl');

				if (fullurl)
				{
					return CategoriesModel.get(fullurl);
				}
				else
				{
					var menuLevel =  this.request.getParameter('menuLevel');

					if (menuLevel)
					{
						return CategoriesModel.getCategoryTree(menuLevel);
					}
				}
			}
		});
	}
);

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// DateEffectiveCategory.ServiceController.js
// ----------------
// Service to manage categories within SMT
define(
	'DateEffectiveCategory.ServiceController'
,	[
		'ServiceController'
	,	'Categories.Model'
	,	'Configuration'
	]
,	function(
		ServiceController
	,	CategoriesModel
	,	Configuration
	)
	{
		'use strict';


		return ServiceController.extend({

			name: 'DateEffectiveCategory.ServiceController'
			/**
			 * Mandatory params:domain, date
			 * Optional params: fullurl, menuLevel
			 */
		,	get: function()
			{
				this.controlAccess();
				if(!this.request.getParameter('date')){
					throw invalidParameter;
				}
				Configuration.setConfig({domain: this.request.getParameter('domain')});
				var fullurl = this.request.getParameter('fullurl');
				if (fullurl)
				{
					return CategoriesModel.get(fullurl, this.request.getParameter('date'));
				}
				else
				{
					var menuLevel =  this.request.getParameter('menuLevel');
					if (menuLevel)
					{
						return CategoriesModel.getCategoryTree(menuLevel, this.request.getParameter('date'));
					}
				}
			}
		,	controlAccess: function (){
				var origin = this.request.getHeader('Referer') || this.request.getHeader('referer') || this.request.getHeader('Origin') || ''
				,   domain = this.request.getParameter('domain');

				origin = origin.match(/(https?:\/\/)?([^/^:]*)\/?/i);
				origin = origin && origin[2];

				if(!domain || !origin || origin !== domain)
				{
					throw forbiddenError;
				}
			}
		,	options: function () {
				return {
					get: {
						jsonp_enabled: true
					}
				};
			}
		});
	}
);

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// CheckoutEnvironment.ServiceController.js
// ----------------
define(
	'CheckoutEnvironment.ServiceController'
	, [
		'ServiceController'
		, 'Configuration'
		, 'Application'
		, 'SiteSettings.Model'
		, 'ExternalPayment.Model'
		, 'Profile.Model'
		, 'Utils'
		, 'SC.Models.Init'
		, 'LiveOrder.Model'
	]
	, function (
		ServiceController,
		Configuration,
		Application,
		SiteSettingsModel,
		ExternalPaymentModel,
		ProfileModel,
		Utils,
		SCModelsInit,
		LiveOrderModel
	) {
		'use strict';


		return ServiceController.extend({

			name: 'CheckoutEnvironment.ServiceController'

			, get: function () {

				var Environment;
				var SiteSettings;
				var cart_bootstrap;
				var external_parameters;
				var Profile;
				var siteId;
				var session;
				var productlist_bundle_present;
				var Cart;
				var Content;
				var DefaultPage;
				var Merchandising;
				var ReleaseMetadata;
				var Address;
				var PaymentMethod;
				var Error;
				var googletagmanager_datalayer;


				try {
					Environment = Application.getEnvironment(this.request);
					SiteSettings = SiteSettingsModel.get();
					cart_bootstrap = this.request.getParameter('cart-bootstrap');

					external_parameters = ExternalPaymentModel.getParametersFromRequest(this.request) || {};
					Profile = ProfileModel.get();

					siteId = SiteSettings.siteid;
					session = SCModelsInit.session;

					productlist_bundle_present = Utils.recordTypeExists('customrecord_ns_pl_productlist')

					// GTM START
	                googletagmanager_datalayer = require('GoogleTagManager.ServiceController').getDataLayer(this.request,this.response);
	                // GTM END


					// Check if cart bootstrapping is required
					Cart = cart_bootstrap ? LiveOrderModel.get() : {};

					// Check if confirmation bootstrapping is required
					Cart.confirmation = external_parameters.externalPayment === 'DONE' ? LiveOrderModel.getConfirmation(external_parameters.nltranid) : {};

					// The use of CDS and CMS are mutually exclusive, if you use CMS you can't use CDS, or if you use CDS you can't use CMS
					if (!Configuration.get().cms.useCMS) {
						// Content depends on the instalation and inclusion of the
						// ContentDeliverService provided as a separated boundle
						// If you need to add more tags to the listURL function please consider
						// moving this to the sc.user.environment.ssp (the current file is cached)
						try {
							var locale = Environment && Environment.currentLanguage && Environment.currentLanguage.locale
								, content_tag = 'app:checkout';

							if (locale) {
								content_tag += ',locale:' + locale.toLowerCase();
							}

							var content_model = require('Content.Model');

							Content = content_model.listURL(siteId, content_tag);
							DefaultPage = content_model.getDefault();
						}
						catch (e) {
							console.warn('Content Module not present in Checkout SSP');
						}

						if (typeof psg_dm !== 'undefined') {
							Merchandising = psg_dm.getMerchRule();
						}
						else {
							console.warn('Merchandising Module not present in ShopFlow SSP');
						}
					}

					try {
						ReleaseMetadata = require('ReleaseMetadata').get();
					}
					catch (e) {
						console.warn('Failed to load release metadata.');
					}

					if (session.isLoggedIn2() && Utils.isCheckoutDomain()) {
						Address = require('Address.Model').list();
                        PaymentMethod = require('PaymentMethod.Model').list();
					}
				}
				catch (e) {
					Error = Application.processError(e);
				}

				if (!productlist_bundle_present) {
					console.warn('Product Lists Data not present in Shopping SSP');
				}

				var checkoutEnvironment = {};

				var env = {};

				if (Environment) {
					env = Environment;
				}

				env.jsEnvironment = 'browser';
				env.CART_BOOTSTRAPED = cart_bootstrap ? 'true' : 'false';
				env.CART = Cart;

				if (SiteSettings) {
					var site_settings_json = SiteSettings;//.replace(/<body *[^/]*?>/ig, '').replace(/<\/body*?>/ig, '');
					env.siteSettings = site_settings_json;
					env.siteType = SiteSettings.sitetype;
					env.SCTouchpoint = 'checkout';
				}

				checkoutEnvironment.CONFIGURATION = Configuration.get();

				if (Configuration.get().cases) {
					env.CASES_CONFIG = Configuration.get().cases;
				}

				env.BuildTimeInf = BuildTimeInf || {};
				env.isExtended = isExtended;

				env.embEndpointUrl = (typeof embEndpointUrl !== "undefined") && embEndpointUrl;
				env.themeAssetsPath = themeAssetsPath;

				if (Content) {
					// The Content
					env.CONTENT = Content;

					if (DefaultPage) {
						// The Default Page
						env.DEFAULT_PAGE = DefaultPage;
					}
				}

				if (Profile) {
					// The Profile
					env.PROFILE = _.extend(Profile, {
						isLoggedIn: session.isLoggedIn2() ? 'T' : 'F'
						, isRecognized: session.isRecognized() ? 'T' : 'F'
						, isGuest: session.getCustomer().isGuest() ? 'T' : 'F'
					});
					env.permissions = Application.getPermissions();
				}

				checkoutEnvironment.SESSION = {
					currency: Environment.currentCurrency
					, language: Environment.currentLanguage
					, priceLevel: Environment.currentPriceLevel
					, touchpoints: SiteSettings.touchpoints
				};

				if (Address) {
					// The Address
					env.ADDRESS = Address;
				}

				if (PaymentMethod) {
					// The Credit Card
                    env.PAYMENTMETHOD = PaymentMethod;
				}


				if (Merchandising) {
					// Merchandising
					env.MERCHANDISING = Merchandising;
				}

				env.GTM_DATALAYER = googletagmanager_datalayer || {};

				env.CHECKOUT = {
					skipLogin: Configuration.get().checkoutApp.skipLogin ? 'true' : 'false'
				};

				//External Payment
				if (external_parameters) {
					env.EXTERNALPAYMENT = {
						parameters: external_parameters
					}
				}

				env.RELEASE_METADATA = ReleaseMetadata || {};

				//ProductList
				env.PRODUCTLIST_ENABLED = productlist_bundle_present;

				// Sensors
				env.SENSORS_ENABLED = Utils.isFeatureEnabled('rum');

				if (Error) {

					env.contextError = Error;

					if (!env.baseUrl) {
						env.baseUrl = session.getAbsoluteUrl2('/{{file}}');
					}

				}

				env.published = {};
				_.each(Configuration.get().publish, function (i) {
					var res = require(i.model)[i.call]();

					env.published[i.key] = res;
				});

				checkoutEnvironment.ENVIRONMENT = env;


				return checkoutEnvironment;
			}
		});
	}
);

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// ShoppingUserEnvironment.ServiceController.js
// ----------------
define(
    'ShoppingUserEnvironment.ServiceController'
    , [
        'ServiceController',
        'Configuration',
		    'Application',
        'SiteSettings.Model',
		    'ExternalPayment.Model',
		    'Profile.Model',
        'Utils',
        'underscore',
    ]
    , function (
        ServiceController,
        Configuration,
		    Application,
        SiteSettingsModel,
		    ExternalPaymentModel,
		    ProfileModel,
        Utils,
        _
    ) {
        'use strict';

        return ServiceController.extend({

            name: 'ShoppingUserEnvironment.ServiceController',

            get: function () {

                var Environment
                ,   SiteSettings
                ,   Profile
                ,   productlist_bundle_present
                ,   googletagmanager_datalayer;

                productlist_bundle_present = Utils.recordTypeExists('customrecord_ns_pl_productlist');

                Environment = Application.getEnvironment(this.request);
                SiteSettings = SiteSettingsModel.get();
                Profile = ProfileModel.get();

                // GTM START
                googletagmanager_datalayer = require('GoogleTagManager.ServiceController').getDataLayer(this.request,this.response);
                // GTM END

                if (!productlist_bundle_present) {
                    console.warn('Product Lists Data not present in Shopping SSP');
                }

                var userEnvironment = {
                    ENVIRONMENT: {
                        PROFILE: Profile,
                        permissions: Application.getPermissions(),
                        PRODUCTLIST_ENABLED: productlist_bundle_present,
                        published: {}
                    },
                    SESSION: {
                        currency: Environment.currentCurrency
                    ,   language: Environment.currentLanguage
                    ,   priceLevel: Environment.currentPriceLevel
                    ,   touchpoints: SiteSettings.touchpoints
                    }
                };

                if (Configuration.get().cases) {
                    userEnvironment.ENVIRONMENT.CASES_CONFIG = Configuration.get().cases;
                }

                userEnvironment.published = {};
                _.each(Configuration.get().publish, function(i)
                {
                    var res = require(i.model)[i.call]();

                    userEnvironment.published[i.key] = res;
                });

                userEnvironment.ENVIRONMENT.GTM_DATALAYER = googletagmanager_datalayer || {};

                userEnvironment.date = new Date().getTime();

                return userEnvironment;
            }

        });
    }
);

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// MyAccountEnvironment.ServiceController.js
// ----------------
define(
    'MyAccountEnvironment.ServiceController'
    , [
        'ServiceController'
        , 'Configuration'
        , 'Application'
        , 'SiteSettings.Model'
        , 'ExternalPayment.Model'
        , 'Profile.Model'
        , 'Utils'
        , 'SC.Models.Init'
        , 'LiveOrder.Model'
    ]
    , function (
        ServiceController
        , Configuration
        , Application,
        SiteSettingsModel,
        ExternalPaymentModel,
        ProfileModel,
        Utils,
        SCModelsInit,
        LiveOrderModel
    ) {
        'use strict';


        return ServiceController.extend({

            name: 'MyAccountEnvironment.ServiceController',

            get: function () {
                var SiteSettings
                    , LivePayment
                    , Profile
                    , Address
                    , PaymentMethod
                    , Environment
                    , Content
                    , DefaultPage
                    , Merchandising
                    , siteId
                    , Error
                    , productlist_bundle_present
                    , customerId
                    , ReleaseMetadata
                    , external_parameters
                    , session
                    , googletagmanager_datalayer
                    ;

                try {

                    SiteSettings = SiteSettingsModel.get();
                    Profile = ProfileModel.get();
                    Environment = Application.getEnvironment(this.request);
                    siteId = SiteSettings.siteid;
                    productlist_bundle_present = Utils.recordTypeExists('customrecord_ns_pl_productlist');
                    session = SCModelsInit.session;

                    // GTM START
                    googletagmanager_datalayer = require('GoogleTagManager.ServiceController').getDataLayer(this.request,this.response);
                    // GTM END

                    // The use of CDS and CMS are mutually exclusive, if you use CMS you can't use CDS, or if you use CDS you can't use CMS
                    if (!Configuration.get().cms.useCMS) {
                        // Content depends on the instalation and inclusion of the
                        // ContentDeliverService provided as a separated boundle
                        // If you need to add more tags to the listURL function please consider
                        // moving this to the sc.user.environment.ssp (the current file is cached)
                        try {
                            var locale = Environment && Environment.currentLanguage && Environment.currentLanguage.locale
                                , content_tag = 'app:myaccount';

                            if (locale) {
                                content_tag += ',locale:' + locale.toLowerCase();
                            }

                            var content_model = require('Content.Model');

                            Content = content_model.listURL(siteId, content_tag);
                            DefaultPage = content_model.getDefault();
                        }
                        catch (e) {
                            console.warn('Content Module not present in MyAccount SSP');
                        }

                        if (typeof psg_dm !== 'undefined') {
                            Merchandising = psg_dm.getMerchRule();
                        }
                        else {
                            console.warn('Merchandising Module not present in ShopFlow SSP');
                        }
                    }

                    try {
                        ReleaseMetadata = require('ReleaseMetadata').get();
                    }
                    catch (e) {
                        console.warn('Failed to load release metadata.');
                    }


                    if (session.isLoggedIn2()) {
                        Address = require('Address.Model').list();
                        PaymentMethod = require('PaymentMethod.Model').list();
                        try {
                            external_parameters = ExternalPaymentModel.getParametersFromRequest(this.request) || {};

                            if (external_parameters) {
                                if (external_parameters.externalPayment === 'DONE') {
                                    LivePayment = require('LivePayment.Model').get();
                                    LivePayment.confirmation = require('CustomerPayment.Model').get(external_parameters.recordType, external_parameters.nltranid);
                                }
                                else {
                                    LivePayment = require('LivePayment.Model').get(external_parameters.nltranid);
                                }
                            }
                            else {
                                LivePayment = require('LivePayment.Model').get();
                            }
                        }
                        catch (e) {
                            LivePayment = null;
                        }
                    }
                }
                catch (e) {
                    Error = Application.processError(e);
                }

                if (!productlist_bundle_present) {
                    console.warn('Product Lists Data not present in Shopping SSP');
                }

                this.response.setContentType('JSON');

                var env = {};
                var myAccountEnv = {};

                if (Environment) {
                    env = Environment;
                }

                if (SiteSettings) {
                    // Site Settings Info
                    env.siteSettings = SiteSettings;

                    // SCTouchpoint indicates the touchpoint the user is effectively in. We can only know with certain this in the proper ssp
                    // because there is still code that depends on the touchpoint
                    // myaccount value is added just in case someone needs it
                    // when in single ssp check if this it's necessary
                    env.SCTouchpoint = 'myaccount';

                    // Site site (ADVANCED or STANDARD)
                    env.siteType = SiteSettings.sitetype;
                }

                myAccountEnv.CONFIGURATION = Configuration.get();

                if (Content) {
                    // The Content
                    env.CONTENT = Content;

                    if (DefaultPage) {
                        // The Default Page
                        env.DEFAULT_PAGE = DefaultPage;
                    }
                }

                // Local Environment info
                env.jsEnvironment = 'browser';

                if (Profile) {
                    // The Profile
                    env.PROFILE = _.extend(Profile, { isLoggedIn: 'T' });
                    env.permissions = Application.getPermissions();
                }

                myAccountEnv.SESSION = {
                    currency: Environment.currentCurrency
                    , language: Environment.currentLanguage
                    , priceLevel: Environment.currentPriceLevel
                    , touchpoints: SiteSettings.touchpoints
                };

                myAccountEnv.getSessionInfo = function (key) {
                    var session = myAccountEnv.SESSION || myAccountEnv.DEFAULT_SESSION || {};
                    return (key) ? session[key] : session;
                }

                if (Address) {
                    // The Address
                    env.ADDRESS = Address;
                }

                if (PaymentMethod) {
                    // The Credit Card
                    env.PAYMENTMETHOD = PaymentMethod;
                }

                if (LivePayment) {
                    env.LIVEPAYMENT = LivePayment;
                }

                if (Merchandising) {
                    // Merchandising
                    env.MERCHANDISING = Merchandising;
                }

                env.GTM_DATALAYER = googletagmanager_datalayer || {};

                //Cases configuration
                if (Configuration.get().cases) {
                    env.CASES_CONFIG = Configuration.get().cases;
                }

                //Information generated at compilation time
                env.BuildTimeInf = BuildTimeInf || {};
                env.isExtended = isExtended;
                // the only way it works to test for undefined.
                // This was added for backward compatiblity with customers that already had activated in 17.2
                env.embEndpointUrl = (typeof embEndpointUrl !== "undefined") && JSON.stringify(embEndpointUrl);
                env.themeAssetsPath = themeAssetsPath;

                //External Payment
                if (external_parameters) {
                    env.EXTERNALPAYMENT = {
                        parameters: external_parameters
                    }
                }

                // Release Metadata
                env.RELEASE_METADATA = ReleaseMetadata || {};

                // ProductList
                env.PRODUCTLIST_ENABLED = productlist_bundle_present;

                // Sensors
                env.SENSORS_ENABLED = Utils.isFeatureEnabled('rum');

                if (Error) {

                    env.contextError = Error;

                    if (!env.baseUrl) {
                        env.baseUrl = session.getAbsoluteUrl2('/{{file}}');
                    }

                }
				env.published = {};
                _.each(Configuration.get().publish, function (i) {
                    var res = require(i.model)[i.call]();

                    env.published[i.key] = res
                });

                myAccountEnv.ENVIRONMENT = env;


                return myAccountEnv;
            }

        });
    }
);

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// CreditCard.ServiceController.js
// ----------------
// Service to manage credit cards requests
define(
	'CreditCard.ServiceController'
,	[
		'ServiceController'
	,	'CreditCard.Model'
	]
,	function(
		ServiceController
	,	CreditCardModel
	)
	{
		'use strict';

		// @class CreditCard.ServiceController Manage credit cards requests
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'CreditCard.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: {
				common: {
					requireLogin: true
				}
			}

			// @method get The call to CreditCard.Service.ss with http method 'get' is managed by this function
			// @return {CreditCard.Model.Attributes || Array<CreditCard.Model.Attributes>} One or a list of credit cards
		,	get: function()
			{
				var id = this.request.getParameter('internalid');
				return id ? CreditCardModel.get(id) : (CreditCardModel.list() || []);
			}

			// @method post The call to CreditCard.Service.ss with http method 'post' is managed by this function
			// @return {StatusObject}
		,	post: function()
			{
				var id = CreditCardModel.create(this.data);
				this.sendContent(CreditCardModel.get(id), {'status': 201});
				// Do not return here as we need to output the status 201
			}

			// @method put The call to CreditCard.Service.ss with http method 'put' is managed by this function
			// @return {CreditCard.Model.Attributes} The updated credit card
		,	put: function()
			{
				var id = this.request.getParameter('internalid');
				CreditCardModel.update(id, this.data);
				return CreditCardModel.get(id);
			}

			// @method delete The call to CreditCard.Service.ss with http method 'delete' is managed by this function
			// @return {StatusObject}
		,	delete: function()
			{
				var id = this.request.getParameter('internalid');
				CreditCardModel.remove(id);

				return {'status':'ok'};
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Transaction

define(
	'Transaction.Model'
,	[
		'SC.Model'
	,	'SC.Models.Init'
	,	'Application'
	,	'Utils'
	,	'underscore'
	,	'CustomFields.Utils'
	,	'Configuration'
	]
,	function (
		SCModel
	,	ModelsInit
	,	Application
	,	Utils
	,	_
	,	CustomFieldsUtils
	,	Configuration
	)
{
	'use strict';

	var StoreItem
	,	AddressModel;

	try
	{
		StoreItem = require('StoreItem.Model');
	}
	catch(e)
	{
	}

	try
	{
		AddressModel = require('Address.Model');
	}
	catch(e)
	{
	}

	// @class Transaction.Model Defines the base model used by all transactions providing a base implementation with common features
	// @extends SCModel
	return SCModel.extend({
		//@property {String} name
		name: 'Transaction'

		//@property {StoreItem.Model} storeItem
	,	storeItem: StoreItem

		//@property {Boolean} isMultiCurrency
	,	isMultiCurrency: ModelsInit.context.getFeature('MULTICURRENCY')

		//@property {Boolean} isMultiSite
	,	isMultiSite: ModelsInit.context.getFeature('MULTISITE')

		//@property {Boolean} paymentInstrumentsEnabled
	,	paymentInstrumentsEnabled: ModelsInit.context.getSetting('FEATURE', 'PAYMENTINSTRUMENTS') === 'T'

		//@property {Number} now Now in milliseconds
	,	now: new Date().getTime()

		//@method list Allow search among transactions
		//@param {Transaction.Model.List.Parameters} data
		//@return {Transaction.Model.List.Result}
	,	list: function (data)
		{
			this.preList();

			var self = this;

			this.data = data;

			this.amountField = this.isMultiCurrency ? 'fxamount' : 'amount';

			this.filters = {
					'entity': ['entity', 'is', nlapiGetUser()]
				,	'mainline_operator': 'and'
				,	'mainline': ['mainline','is', 'T']
			};

			this.columns = {
					'trandate': new nlobjSearchColumn('trandate')
				,	'internalid': new nlobjSearchColumn('internalid')
				,	'tranid': new nlobjSearchColumn('tranid')
				,	'status': new nlobjSearchColumn('status')
				,	'amount': new nlobjSearchColumn(this.amountField)
				};

			if (this.isMultiCurrency)
			{
				this.columns.currency = new nlobjSearchColumn('currency');
			}

			if (this.data.from && this.data.to)
			{
				this.filters.date_operator = 'and';

				this.data.from = this.data.from.split('-');
				this.data.to = this.data.to.split('-');

				this.filters.date = [
					'trandate', 'within'
				,	new Date(
						this.data.from[0]
					,	this.data.from[1]-1
					,	this.data.from[2]
					)
				,	new Date(
						this.data.to[0]
					,	this.data.to[1]-1
					,	this.data.to[2]
					)
				];
			}
			else if (this.data.from)
			{
				this.filters.date_from_operator = 'and';

				this.data.from = this.data.from.split('-');

				this.filters.date_from = [
					'trandate'
				,	'onOrAfter'
				,	new Date(
						this.data.from[0]
					,	this.data.from[1]-1
					,	this.data.from[2]
					)
				];
			}
			else if (this.data.to)
			{
				this.filters.date_to_operator = 'and';

				this.data.to = this.data.to.split('-');

				this.filters.date_to = [
					'trandate'
				,	'onOrBefore'
				,	new Date(
						this.data.to[0]
					,	this.data.to[1]-1
					,	this.data.to[2]
					)
				];
			}

			if (this.data.internalid)
			{
				this.data.internalid  = _.isArray(this.data.internalid) ? this.data.internalid : this.data.internalid.split(',');
				this.filters.internalid_operator = 'and';
				this.filters.internalid  =  ['internalid', 'anyof', this.data.internalid];
			}

			if (this.data.createdfrom)
			{
				this.filters.createdfrom_operator = 'and';
				this.filters.createdfrom = ['createdfrom', 'is', this.data.createdfrom];
			}

	 		if (this.data.types)
	 		{
	 			this.filters.types_operator = 'and';
	 			this.filters.types = ['type', 'anyof', this.data.types.split(',')];
	 		}

	 		if (this.isMultiSite)
			{

				var site_id = ModelsInit.session.getSiteSettings(['siteid']).siteid
				,	filter_site = Configuration.get('filterSite') || Configuration.get('filter_site')
				,	search_filter_array = null;

				if (_.isString(filter_site) && filter_site === 'current')
				{
					search_filter_array = [site_id, '@NONE@'];
				}
				else if (_.isString(filter_site) && filter_site === 'all')
				{
					search_filter_array = [];
				}
				else if (_.isArray(filter_site))
				{
					search_filter_array = filter_site;
					search_filter_array.push('@NONE@');
				}
				else if (_.isObject(filter_site) && filter_site.option)
				{
					switch (filter_site.option)
					{
						case 'all' :
							search_filter_array = [];
							break;
						case 'siteIds' :
							search_filter_array = filter_site.ids;
							break;
						default : //case 'current' (current site) is configuration default
							search_filter_array = [site_id, '@NONE@'];
							break;
					}
				}

				if (search_filter_array && search_filter_array.length)
				{
					this.filters.site_operator = 'and';
					this.filters.site = ['website', 'anyof', _.uniq(search_filter_array)];
				}
			}

			this.setExtraListFilters();

			if (this.isCustomColumnsEnabled())
			{
				this.setCustomColumns();
			}

			this.setExtraListColumns();

			if (this.data.sort)
			{
				_.each(this.data.sort.split(','), function (column_name)
				{
					if (self.columns[column_name])
					{
						self.columns[column_name].setSort(self.data.order >= 0);
					}
				});
			}

			if (this.data.page === 'all')
			{
				this.search_results = Application.getAllSearchResults('transaction', _.values(this.filters), _.values(this.columns));
			}
			else
			{
				this.search_results = Application.getPaginatedSearchResults({
					record_type: 'transaction'
				,	filters: _.values(this.filters)
				,	columns: _.values(this.columns)
				,	page: this.data.page || 1
				,	results_per_page : this.data.results_per_page
				});
			}

			var records = _.map((this.data.page === 'all' ? this.search_results : this.search_results.records) || [], function (record)
			{
				var selected_currency = Utils.getCurrencyById(record.getValue('currency'))
				,	selected_currency_symbol = selected_currency ? selected_currency.symbol : selected_currency;

				//@class Transaction.Model.List.Result.Record
				var result = {
					//@property {String} recordtype
					recordtype: record.getRecordType()
					//@property {String} internalid
				,	internalid: record.getValue('internalid')
					//@property {String} tranid
				,	tranid: record.getValue('tranid')
					//@property {String} trandate
				,	trandate: record.getValue('trandate')
					//@property {Transaction.Status} status
				,	status: {
						//@class Transaction.Status
						//@property {String} internalid
						internalid: record.getValue('status')
						//@property {String} name
					,	name: record.getText('status')
					}
					//@class Transaction.Model.List.Result.Record
					//@property {Number} amount
				,	amount: Utils.toCurrency(record.getValue(self.amountField))
					//@property {Currency?} currency
				,	currency: self.isMultiCurrency ?
					//@class Currency
					{
						//@property {String} internalid
						internalid: record.getValue('currency')
						//@property {String} name
					,	name: record.getText('currency')
					} : null
					//@property {String} amount_formatted
				,	amount_formatted: Utils.formatCurrency(record.getValue(self.amountField), selected_currency_symbol)
				};

				return self.mapListResult(result, record);
			});

			if (this.data.page === 'all')
			{
				this.results = records;
			}
			else
			{
				this.results = this.search_results;
				this.results.records = records;
			}

			this.postList();

			return this.results;
			// @class Transaction.Model
		}
		//@method setExtraListColumns Abstract method used to be overridden by child classes.
		// The aim of this method is set extra column called by the list method. The list of all column is in the 'columns' property of 'this'
		// @return {Void}
	,	setExtraListColumns: function ()
		{ }

	, isCustomColumnsEnabled: function(configName)
		{
			if(!configName)
			{
				configName = 'enable' + this.name;
			}
			return Configuration.get().transactionListColumns[configName];
		}
		//@method setConfigurationColumns method used to get columns from the backend configuration
		//@return {Void}
	, setCustomColumns: function (configName)
		{
			var self = this;

			if(!configName) {
				configName = this.name[0].toLowerCase() + this.name.substring(1);
			}

			_.each(Configuration.get().transactionListColumns[configName], function (column)
			{
				if (self.columns[column.id] === undefined)
				{
					self.columns[column.id] = new nlobjSearchColumn(column.id);
				}
			});
		}
		//@method mapCustomColumns method used to map columns from the backend configuration
		//@return {Void}
		, mapCustomColumns: function (result, record, configName)
		{
				if(!configName) {
					configName = this.name[0].toLowerCase() + this.name.substring(1);
				}
				_.each(Configuration.get().transactionListColumns[configName], function (column)
				{
					if(result[column.id] === undefined) {
						result[column.id] = record.getValue(column.id);
					}
				});
		}

		//@method setExtraListFilters Abstract method used to be overridden by child classes.
		// The aim of this method is set extra filters called by the list method. The list of all column is in the 'filters' property of 'this'
		// @return {Void}
	,	setExtraListFilters: function ()
		{ }

		//@method mapListResult Abstract method used to be overridden by child classes.
		// The aim of this method is apply any custom extension over each record to be returned by the list method
		// @param {Transaction.Model.List.Result.Record} result Base result to be extended
		// @param {nlobjSearchResult} record Instance of the record returned by NetSuite search
		// @return {Transaction.Model.List.Result.Record}
	,	mapListResult: function (result)
		{
			return result;
		}

		//@method getTransactionRecord Load a NetSuite record (transaction)
		//@param {String} record_type
		//@param {String} id
		//@return {nlobjRecord}
	,	getTransactionRecord: function (record_type, id)
		{
			if (this.record)
			{
				return this.record;
			}
			return nlapiLoadRecord(record_type, id);
		}

		//@method get Return one single transaction
		//@param {String} record_type
		//@param {String} id
		//@return {Transaction.Model.Get.Result}
	,	get: function (record_type, id)
		{
			this.preGet();

			this.recordId = id;
			this.recordType = record_type;

			//@class Transaction.Model.Get.Result
			this.result = {};

			if (record_type && id)
			{
				this.record = this.getTransactionRecord(record_type, id);

				this.getRecordFields();

				if (this.result.currency)
					this.result.selected_currency = Utils.getCurrencyById(this.result.currency.internalid);

				this.getRecordSummary();

				this.getRecordPromocodes();

				this.getRecordPaymentMethod();

				this.getPurchaseOrderNumber();

				this.getRecordAddresses();

				this.getRecordShippingMethods();

				this.getLines();

				this.getExtraRecordFields();

				this.getTransactionBodyCustomFields();
			}

			this.postGet();

			// convert the objects to arrays
			this.result.addresses = _.values(this.result.addresses || {});
			this.result.shipmethods = _.values(this.result.shipmethods || {});
			this.result.lines = _.values(this.result.lines || {});

			return this.result;

			// @class Transaction.Model
		}

		//@method getRecordFields Get the main (and simple) field of the transaction
		//@return {Void} This method does not return anything as it works with the value of this.result and this.record
	,	getRecordFields: function ()
		{
			//@class Transaction.Model.Get.Result
			//@property {String} internalid
			this.result.internalid = this.recordId;
			//@property {String} recordtype
			this.result.recordtype = this.recordType;

			//@property {String} tranid
			this.result.tranid = this.record.getFieldValue('tranid');
			//@property {String} memo
			this.result.memo = this.record.getFieldValue('memo');
			//@property {String} trandate
			this.result.trandate = this.record.getFieldValue('trandate');

			if (this.isMultiCurrency)
			{
				//@property {Currency?} currency
				this.result.currency = {
					internalid: this.record.getFieldValue('currency')
				,	name: this.record.getFieldValue('currencyname')
				};
			}

			this.getCreatedFrom();
			this.getStatus();
		}

		//@method getCreatedFrom Get the created from field for a single retrieved record
		//@return {Void} This method does not return anything as it works with the value of this.result and this.record
	,	getCreatedFrom: function ()
		{
			// The createdfrom is being loaded using a Lookup field operation instead of loading it from the current record (this.record)
			// This is done like this to solve an issue
			var created_from_internalid = this.record.getFieldValue('createdfrom')
			,	record_type = '';

			if (created_from_internalid)
			{
				record_type = Utils.getTransactionType(created_from_internalid);
			}

			//@class Transaction.Model.Get.Result
			//@property {CreatedFrom} createdfrom
			this.result.createdfrom =
			//@class CreatedFrom
			{
				//@property {String} internalid
				internalid: created_from_internalid
				//@property {String} name
			,	name: this.record.getFieldText('createdfrom')
				//@property {String} recordtype
			,	recordtype: record_type || ''
			};
			//@class Transaction.Model
		}

		//@method getStatus Get the status field for a single retrieved record
		//@return {Void} This method does not return anything as it works with the value of this.result and this.record
	,	getStatus: function ()
		{
			// The status is being loaded using a Lookup field operation instead of loading it from the current record (this.record)
			// This is done like this to solve an issue

			//@class Transaction.Model.Get.Result
			//@property {Transaction.Model.Get.Status} Status
			this.result.status =
			//@class Transaction.Model.Get.Status
			{
				//@property {String} internalid
				internalid: this.record.getFieldValue('status')
				//@property {String} name
			,	name: this.record.getFieldText('status')
			};
			// @class Transaction.Model
		}

		//@method getExtraRecordFields Overridable method used to add extra field in the final result of the get method
		//@return {Void} This method does not return anything as it works with the value of this.result and this.record
	,	getExtraRecordFields: function () { }

		//@method setTransactionBodyCustomFields Set in the model the value of options (custom fields)
		//@return {Void}
	,	setTransactionBodyCustomFields: function()
		{
			var self = this;
			var customFieldsId = CustomFieldsUtils.getCustomFieldsIdToBeExposed(this.recordType);

			_.each(this.data.options, function(value, id)
			{
				//only set a custom field to the model if was exposed in the configuration
				if(_.find(customFieldsId, function (configFieldId) { return id === configFieldId;}))
				{
					self.record.setFieldValue(id, value);
				}
			});
		}
		//@method getTransactionBodyCustomFields Set in the result object the value of custom fields
		//@return {Void}
	,	getTransactionBodyCustomFields: function ()
		{
			var options = {};
			var self = this;
			var customFieldsId = CustomFieldsUtils.getCustomFieldsIdToBeExposed(this.recordType);
			_.each(customFieldsId, function(id)
			{
				options[id] = self.record.getFieldValue(id);
			});

			this.result.options = options;
		}

		//@method getRecordPromocodes Get the promocodes information into the get result
		//@return {Void} This method does not return anything as it works with the value of this.result and this.record
	,	getRecordPromocodes: function ()
		{
			//@class Transaction.Model.Get.Result
			//@property {Array<Transaction.Model.Get.Promocode>} promocodes
			this.result.promocodes = [];

			var promocode = this.record.getFieldValue('promocode');

			//If legacy behavior is present & a promocode is applied this IF will be true
			//In case stackable promotions are enable this.record.getFieldValue('promocode') returns null
			if (promocode)
			{
				this.result.promocodes.push({
					internalid: promocode
				,	code: this.record.getFieldText('couponcode')
				,	isvalid: true
				,	discountrate_formatted: ''
				});
			}
			//otherwise we change for the list of stackable promotions. If it is the legacy (not stackable promotions) code, the
			//this.record.getLineItemCount('promotions') will return 0
			for (var i = 1; i <= this.record.getLineItemCount('promotions'); i++)
			{
				if(this.record.getLineItemValue('promotions', 'applicabilitystatus', i) !== 'NOT_APPLIED'){
				this.result.promocodes.push({
				//@class Transaction.Model.Get.Promocode
					//@property {String} internalid
					internalid: this.record.getLineItemValue('promotions', 'couponcode', i)
					//@property {String} code
				,	code: this.record.getLineItemValue('promotions', 'couponcode_display', i)
					//@property {Boolean} isvalid
				,	isvalid: this.record.getLineItemValue('promotions', 'promotionisvalid', i) === 'T'
					//@property {String} discountrate_formatted
				,	discountrate_formatted: ''
				});
			}
			}

			// @class Transaction.Model
		}

		//@method getTerms Get the terms in the current Transaction
		//@return {Transaction.Model.Get.PaymentMethod.Terms?}
	,	getTerms: function ()
		{
			if (this.record.getFieldValue('terms'))
			{
				//@class Transaction.Model.Get.PaymentMethod.Terms
				return {
					//@property {String} internalid
					internalid: this.record.getFieldValue('terms')
					//@property {String} name
				,	name: this.record.getFieldText('terms')
				};
			}

			return null;
			// @class Transaction.Model
		}

	,	getPurchaseOrderNumber: function()
		{
			//@property {String?} purchasenumber This value is present only of the type is invoice
			this.result.purchasenumber = (this.record.getFieldValue('otherrefnum') === 'undefined' ? undefined : this.record.getFieldValue('otherrefnum'));

		}

		//@method getRecordPaymentMethod Get the payment methods used in the current Transaction
		//@return {Void} This method does not return anything as it works with the value of this.result and this.record
	,	getRecordPaymentMethod: function ()
		{
			//@class Transaction.Model.Get.PaymentMethod
			var paymentmethod = {
					//@property {String} type Possible values: 'creditcard', 'invoice', 'paypal'
					type: this.record.getFieldValue('paymethtype')
					//@property {Boolean} primary
				,	primary: true
					//@property {String} name
				,	name: this.record.getFieldText('paymentmethod')

				}

			,	terms = this.getTerms()

			,	ccnumber = this.record.getFieldValue('ccnumber');

			if (ccnumber)
			{
				paymentmethod.type = 'creditcard';
				//@property {Transaction.Model.Get.PaymentMethod.CreditCard?} creditcard This value is present only if the type is creditcard
				paymentmethod.creditcard =
				//@class Transaction.Model.Get.PaymentMethod.CreditCard
				{
					//@property {String} ccnumber
					ccnumber: ccnumber
					//@property {String} ccexpiredate
				,	ccexpiredate: this.record.getFieldValue('ccexpiredate')
					//@property {String} ccname
				,	ccname: this.record.getFieldValue('ccname')
					//@property {String} internalid
				,	internalid:  this.record.getFieldValue('creditcard')
					//@property {Transaction.Model.Get.PaymentMethod.CreditCard.Details} paymentmethod
				,	paymentmethod: {
					//@class Transaction.Model.Get.PaymentMethod.CreditCard.Details
						//@property {String} ispaypal
						ispaypal: 'F'
						//@property {String} name
					,	name: this.record.getFieldText('paymentmethod')
						//@property {String} creditcard Value: 'T'
					,	creditcard: 'T'
						//@property {String} internalid
					,	internalid: this.record.getFieldValue('paymentmethod')
					}
				};
			}
			else if(this.record.getFieldValue('paymentoption'))
			{
				paymentmethod.type = 'creditcardtoken';
				paymentmethod.creditcard = {
					internalid: this.record.getFieldValue('paymentoption')
				,	paymentmethod: {
						ispaypal: 'F'
						//@property {String} name
					,	name: this.record.getFieldText('paymentmethod')
						//@property {String} creditcard Value: 'T'
					,	creditcardtoken: 'T'
						//@property {String} internalid
					,	internalid: this.record.getFieldValue('paymentmethod')
					}
				}
			}

			if (terms)
			{
				paymentmethod.type = 'invoice';

				//@property {Transaction.Model.Get.PaymentMethod.Terms} paymentterms This value is present only of the type is invoice
				paymentmethod.paymentterms = terms;
			}

			//@class Transaction.Model.Get.Result
			//@property {Array<Transaction.Model.Get.PaymentMethod>} paymentmethods
			if (paymentmethod.type)
			{
				this.result.paymentmethods = [paymentmethod];
			}
			else
			{
				this.result.paymentmethods = [];
			}

			// @class Transaction.Model
		}

		//@method getRecordSummary Get the summary of the current transaction model
		//@return {Void} This method does not return anything as it works with the value of this.result and this.record
	,	getRecordSummary: function ()
		{
			var selected_currency_symbol = this.result.selected_currency ? this.result.selected_currency.symbol : this.result.selected_currency;

			//@class Transaction.Model.Get.Result
			//@property {Transaction.Model.Get.Summary} summary
			this.result.summary =
			//@class Transaction.Model.Get.Summary
			{
				//@property {Number} subtotal
				subtotal: Utils.toCurrency(this.record.getFieldValue('subtotal'))
				//@property {String} subtotal_formatted
			,	subtotal_formatted: Utils.formatCurrency(this.record.getFieldValue('subtotal'), selected_currency_symbol)

				//@property {Number} taxtotal
			,	taxtotal: Utils.toCurrency(this.record.getFieldValue('taxtotal'))
				//@property {String} taxtotal_formatted
			,	taxtotal_formatted: Utils.formatCurrency(this.record.getFieldValue('taxtotal'), selected_currency_symbol)

				//@property {Number} tax2total
			,	tax2total: Utils.toCurrency(this.record.getFieldValue('tax2total'))
				//@property {String} tax2total_formatted
			,	tax2total_formatted: Utils.formatCurrency(this.record.getFieldValue('tax2total'), selected_currency_symbol)

				//@property {Number} shippingcost
			,	shippingcost: Utils.toCurrency(this.record.getFieldValue('shippingcost'))
				//@property {String} shippingcost_formatted
			,	shippingcost_formatted: Utils.formatCurrency(this.record.getFieldValue('shippingcost'), selected_currency_symbol)

				//@property {Number} handlingcost
			,	handlingcost: Utils.toCurrency(this.record.getFieldValue('althandlingcost'))
				//@property {String} handlingcost_formatted
			,	handlingcost_formatted: Utils.formatCurrency(this.record.getFieldValue('althandlingcost'), selected_currency_symbol)

				//@property {Number} estimatedshipping
			,	estimatedshipping: 0
				//@property {String} estimatedshipping_formatted
			,	estimatedshipping_formatted: Utils.formatCurrency(0, selected_currency_symbol)

				//@property {Number} taxonshipping
			,	taxonshipping: Utils.toCurrency(0)
				//@property {String} taxonshipping_formatted
			,	taxonshipping_formatted: Utils.formatCurrency(0, selected_currency_symbol)

				//@property {Number} discounttotal
			,	discounttotal: Utils.toCurrency(this.record.getFieldValue('discounttotal'))
				//@property {String} discounttotal_formatted
			,	discounttotal_formatted: Utils.formatCurrency(this.record.getFieldValue('discounttotal'), selected_currency_symbol)

				//@property {Number} taxondiscount
			,	taxondiscount: Utils.toCurrency(0)
				//@property {String} taxondiscount_formatted
			,	taxondiscount_formatted: Utils.formatCurrency(0, selected_currency_symbol)

				//@property {Number} discountrate
			,	discountrate: Utils.toCurrency(this.record.getFieldValue('discountrate'))
				//@property {String} discountrate_formatted
			,	discountrate_formatted: Utils.formatCurrency(this.record.getFieldValue('discountrate'), selected_currency_symbol)

				//@property {Number} discountedsubtotal
			,	discountedsubtotal: Utils.toCurrency(0)
				//@property {String} discountedsubtotal_formatted
			,	discountedsubtotal_formatted: Utils.formatCurrency(0, selected_currency_symbol)

				//@property {Number} giftcertapplied
			,	giftcertapplied: Utils.toCurrency(this.record.getFieldValue('giftcertapplied'))
				//@property {String} giftcertapplied_formatted
			,	giftcertapplied_formatted: Utils.formatCurrency(this.record.getFieldValue('giftcertapplied'), selected_currency_symbol)

				//@property {Number} total
			,	total: Utils.toCurrency(this.record.getFieldValue('total'))
				//@property {String} total_formatted
			,	total_formatted: Utils.formatCurrency(this.record.getFieldValue('total'), selected_currency_symbol)
			};

			// @class Transaction.Model
		}


		//@method add the transaction column fields to the options array, only avaible on orderhistory at the moment
		//@param  {Transaction.Model.Get.Line} Line
		//@return {Void}
		//@private
	,	_addTransactionColumnFieldsToOptions: function () {}

		//@method getLines Get the lines (and its item) to the current transaction
		//@return {Void} This method does not return anything as it works with the value of this.result and this.record
	,	getLines: function ()
		{
			//@class Transaction.Model.Get.Result
			//@property {Array<Transaction.Model.Get.Line>} lines
			this.result.lines = {};

			var items_to_preload = []
			,	amount
			,	self = this
			,	line_id;

			for (var i = 1; i <= this.record.getLineItemCount('item'); i++)
			{
				if (this.record.getLineItemValue('item', 'itemtype', i) === 'Discount' && this.record.getLineItemValue('item', 'discline', i))
				{
					var discline = this.record.getLineItemValue('item', 'discline', i);

					line_id = self.result.internalid + '_' + discline;
					amount = Math.abs(parseFloat(this.record.getLineItemValue('item', 'amount', i)));

					this.result.lines[line_id].discount = (this.result.lines[line_id].discount) ? this.result.lines[line_id].discount + amount : amount;
					this.result.lines[line_id].total = this.result.lines[line_id].amount + this.result.lines[line_id].tax_amount - this.result.lines[line_id].discount;
					this.result.lines[line_id].discount_name = this.record.getLineItemValue('item', 'item_display', i);
				}
				else
				{
					var rate = Utils.toCurrency(this.record.getLineItemValue('item', 'rate', i))
					,	item_id = this.record.getLineItemValue('item', 'item', i)
					,	item_type = this.record.getLineItemValue('item', 'itemtype', i);

					amount = Utils.toCurrency(this.record.getLineItemValue('item', 'amount', i));

					var	tax_amount = Utils.toCurrency(this.record.getLineItemValue('item', 'tax1amt', i)) || 0
					,	total = amount + tax_amount;

					line_id = this.record.getLineItemValue('item', 'id', i);

					//@class Transaction.Model.Get.Line
					this.result.lines[line_id] = {
						//@property {String} internalid
						internalid: line_id
						//@property {Number} quantity
					,	quantity: parseInt(this.record.getLineItemValue('item', 'quantity', i), 10)
						//@property {Number} rate
					,	rate: rate
						//@property {Number} amount
					,	amount: amount
						//@property {Number} tax_amount
					,	tax_amount: tax_amount
						//@property {Number} tax_rate
					,	tax_rate: this.record.getLineItemValue('item', 'taxrate1', i)
						//@property {String} tax_code
					,	tax_code: this.record.getLineItemValue('item', 'taxcode_display', i)
						//@property {Boolean} isfulfillable
					,	isfulfillable: this.record.getLineItemValue('item', 'fulfillable', i) === 'T'
						//@property {String} location
					,	location: this.record.getLineItemValue('item', 'location', i)
						//@property {Number} discount
					,	discount: 0
						//@property {Number} total
					,	total: total
						//@property {Item} item
					,	item: item_id
						//@property {String} type
					,	type: item_type
						//@property {Object} options
					,	options: self.parseLineOptions(this.record.getLineItemValue('item', 'options', i))
						//@property {String} shipaddress
					,	shipaddress: this.record.getLineItemValue('item', 'shipaddress', i) ? this.result.listAddresseByIdTmp[this.record.getLineItemValue('item', 'shipaddress', i)] : null
						//@property {String} shipmethod
					,	shipmethod:  this.record.getLineItemValue('item', 'shipmethod', i) || null
						//@property {Number} index
					,	index: i
						//@property {Boolean} isfulfillable
					,	free_gift: !!this.record.getLineItemValue('item', 'freegiftpromotion', i)
					};

					//@class Transaction.Model.PreLoadItemData
					items_to_preload[item_id] = {
						//@property {String} id
						id: item_id
						//@property {String} type
					,	type: item_type
					};
					//@class Transaction.Model

					self.getExtraLineFields(this.result.lines[line_id], this.record, i);
				}
			}

			var preloaded_items = this.preLoadItems(_.values(items_to_preload))
			,	selected_currency_symbol = self.result.selected_currency ? self.result.selected_currency.symbol : self.result.selected_currency;

			_.each(this.result.lines, function (line)
			{
				line.rate_formatted = Utils.formatCurrency(line.rate, selected_currency_symbol);
				line.amount_formatted = Utils.formatCurrency(line.amount, selected_currency_symbol);
				line.tax_amount_formatted = Utils.formatCurrency(line.tax_amount, selected_currency_symbol);
				line.discount_formatted = Utils.formatCurrency(line.discount, selected_currency_symbol);
				line.total_formatted = Utils.formatCurrency(line.total, selected_currency_symbol);

				line.item = preloaded_items[line.item] || { itemid: line.item };

				self._addTransactionColumnFieldsToOptions(line);
			});

			// remove the temporary address list by id
			delete this.result.listAddresseByIdTmp;

			// @class Transaction.Model
		}

		//@method parseLineOptions Parse an item string options into objects
		//@param {String} options_string
		//@return {Array<Transaction.Model.Get.Line.Option>}
	,	parseLineOptions: function parseLineOptions (options_string)
		{
			var self = this;
			var options_object = [];

			if (options_string && options_string !== '- None -')
			{
				var split_char_3 = String.fromCharCode(3)
				,	split_char_4 = String.fromCharCode(4);

				_.each(options_string.split(split_char_4), function (option_line)
				{
					option_line = option_line.split(split_char_3);
					options_object.push(
						self.transactionModelGetLineOptionBuilder(
							option_line[0]
						,	option_line[2]
						,	self.transactionModelGetLineOptionValueBuilder(option_line[4], option_line[3])
						,	option_line[1]	=== 'T'
						)
					);
				});
			}
			//@class Transaction.Model

			return options_object;
		}
		//@method transactionModelGetLineOptionBuilder Build a Transaction.Model.Get.Line.Option object
		//@private
		//@param {String} internalId
		//@param {String} label
		//@param {Transaction.Model.Get.Line.Option.Value} value
		//@param {Boolean} mandatory
		//@return {Transaction.Model.Get.Line.Option}
	,	transactionModelGetLineOptionBuilder: function(internalId, label, value, mandatory)
		{
			//@class Transaction.Model.Get.Line.Option
			return {
				//@property {String} internalid
				cartOptionId: internalId.toLowerCase()
				//@property {String} label
			,	label: label
				//@property {Transaction.Model.Get.Line.Option.Value} value
			,	value: value
				//@property {Boolean} mandatory
			,	ismandatory: mandatory || false
			};
		}
		//@method transactionModelGetLineOptionValueBuilder Build a Transaction.Model.Get.Line.Option.Value
		//@private
		//@param {String} label
		//@param {String} internalId
		//@return {Transaction.Model.Get.Line.Option.Value}
	,	transactionModelGetLineOptionValueBuilder: function(label, internalId)
		{
			//@class Transaction.Model.Get.Line.Option.Value
			return {
				//@property {String} label
				label: label
				//@property {String} internalid
			,	internalid: internalId
			};
		}
		//@method preLoadItems Preload Items
		//@param {Array<Transaction.Model.PreLoadItemData>} items_to_preload
		//@return {PreloadedItems}
	,	preLoadItems: function (items_to_preload)
		{
			//@class PreloadedItems
			//In this class each property is the id of an item and each property's value if the item itself

			//@class Transaction.Model

			return this.storeItem ?
				this.loadItemsWithStoreItem(items_to_preload) :
				this.loadItemsWithSuiteScript(items_to_preload);
		}

		//@method loadItemsWithStoreItem Preload a group of items the StoreItem (Commerce API)
		//@param {Array<Transaction.Model.PreLoadItemData>} items_to_preload
		//@return {PreloadedItems}
	,	loadItemsWithStoreItem: function (items_to_preload)
		{
			var result = {}
			,	self = this
			,	items_to_query = []
			,	inactive_item = {};

			// Preloads info about the item
			this.storeItem.preloadItems(items_to_preload);

			// The API wont bring disabled items so we need to query them directly
			_.each(this.result.lines, function (line)
			{
				if (line.item)
				{
					var item = self.storeItem.get(line.item, line.type);

					if (!item || _.isUndefined(item.itemid))
					{
						items_to_query.push({id: line.item});
					}
					else
					{
						result[line.item] = item;
					}
				}
			});

			inactive_item = this.loadItemsWithSuiteScript(items_to_query);
			_.each(inactive_item, function (value, key)
			{
				result[key] = value;
			});

			return result;
		}

		//@method loadItemsWithSuiteScript Preload a group of items using SuiteScript
		//@param {Array<Transaction.Model.PreLoadItemData>} items_to_query
		//@return {PreloadedItems}
	,	loadItemsWithSuiteScript: function (items_to_query)
		{
			var result = {};

			if (items_to_query.length > 0)
			{
				items_to_query = _.pluck(items_to_query, 'id');

				var filters = [
						new nlobjSearchFilter('entity', null, 'is', nlapiGetUser())
					,	new nlobjSearchFilter('internalid', null, 'is', this.result.internalid)
					,	new nlobjSearchFilter('internalid', 'item', 'anyof', items_to_query)
					]

				,	columns = [
						new nlobjSearchColumn('internalid', 'item')
					,	new nlobjSearchColumn('type', 'item')
					,	new nlobjSearchColumn('parent', 'item')
					,	new nlobjSearchColumn('displayname', 'item')
					,	new nlobjSearchColumn('storedisplayname', 'item')
					,	new nlobjSearchColumn('itemid', 'item')
					]

				,	inactive_items_search = Application.getAllSearchResults('transaction', filters, columns)
				,	loaded_item;

				_.each(inactive_items_search, function (item)
				{
					loaded_item = {
						internalid: item.getValue('internalid', 'item')
					,	itemtype: item.getValue('type', 'item')
					,	displayname: item.getValue('displayname', 'item')
					,	storedisplayname: item.getValue('storedisplayname', 'item')
					,	itemid: item.getValue('itemid', 'item')
					};

					result[item.getValue('internalid', 'item')] = loaded_item;
				});
			}
			return result;
		}

		//@method getExtraLineFields Set extra projected field on items when retrieving a single record's lines
		//@param {Transaction.Model.Get.Line} result Result being generated
		//@param {nlobjRecord} record Record to extract fields from
		//@param {Number} i Index of the item in the current record being retrieved
		//@return {Void} This method does not return anything as it works with the parameters passed in
	,	getExtraLineFields: function ()
		{
		}

		//@method getRecordShippingMethods Get the shipping methods of the current transaction
		//@return {Void} This method does not return anything as it works with the value of this.result and this.record
	,	getRecordShippingMethods: function ()
		{
			var self = this;

			if (this.record.getLineItemCount('shipgroup') <= 0)
			{
				//@class Transaction.Model.Get.ShipMethod
				self.addShippingMethod({
					//@property {String} internalid
					internalid: this.record.getFieldValue('shipmethod')
					//@property {String} name
				,	name: this.record.getFieldText('shipmethod')
					//@property {Number} rate
				,	rate: Utils.toCurrency(this.record.getFieldValue('shipping_rate'))
					//@property {String} rate_formatted
				,	rate_formatted: Utils.formatCurrency(this.record.getFieldValue('shipping_rate'), self.result.selected_currency ? self.result.selected_currency.symbol : undefined)
					//@property {String} shipcarrier
				,	shipcarrier: this.record.getFieldValue('carrier')
				});
			}

			for (var i = 1; i <= this.record.getLineItemCount('shipgroup') ; i++)
			{
				self.addShippingMethod({
					internalid: this.record.getLineItemValue('shipgroup', 'shippingmethodref', i)
		 		,   name: this.record.getLineItemValue('shipgroup', 'shippingmethod', i)
				,   rate: Utils.toCurrency(this.record.getLineItemValue('shipgroup', 'shippingrate', i))
				,   rate_formatted: Utils.formatCurrency(this.record.getLineItemValue('shipgroup', 'shippingrate', i), self.result.selected_currency ? self.result.selected_currency.symbol : undefined)
				,   shipcarrier: this.record.getLineItemValue('shipgroup', 'shippingcarrier', i)
				});
			}

			//@class Transaction.Model.Get.Result
			//@property {String} shipmethod Id of the selected shipping method
			this.result.shipmethod = this.record.getFieldValue('shipmethod');

			// @class Transaction.Model
		}

		//@method getTransactionType
		//@param {Array} ids
		// @return {Transaction.Model.List.Result.Record}
	,	getTransactionType: function (ids)
		{
			ids = _.isArray(ids) ? ids : [ids];

			var results = {}
			,	filters = [new nlobjSearchFilter('internalid', null,  'anyof', ids)]
			,	columns = [new nlobjSearchColumn('recordtype')];

			if (ids && ids.length)
			{
				_.each(Application.getAllSearchResults('transaction', filters, columns) || [], function (record)
				{
					results[record.getId()] = record.getValue('recordtype');
				});
			}

			return results;
		}

		//@method getRecordAddresses Get the list of address of the current transaction
		//@return {Void} This method does not return anything as it works with the value of this.result and this.record
	,	getRecordAddresses: function ()
		{
			//@class Transaction.Model.Get.Result
			//@property {Array<Address.Model.Attributes>} addresses
			this.result.addresses = {};
			this.result.listAddresseByIdTmp ={};

			for (var i = 1; i <= this.record.getLineItemCount('iladdrbook') ; i++)
			{
				// Adds all the addresses in the address book
				this.result.listAddresseByIdTmp[this.record.getLineItemValue('iladdrbook', 'iladdrinternalid', i)] = this.addAddress({
					internalid: this.record.getLineItemValue('iladdrbook', 'iladdrshipaddr', i)
				,	country: this.record.getLineItemValue('iladdrbook', 'iladdrshipcountry', i)
				,	state: this.record.getLineItemValue('iladdrbook', 'iladdrshipstate', i)
				,	city: this.record.getLineItemValue('iladdrbook', 'iladdrshipcity', i)
				,	zip: this.record.getLineItemValue('iladdrbook', 'iladdrshipzip', i)
				,	addr1: this.record.getLineItemValue('iladdrbook', 'iladdrshipaddr1', i)
				,	addr2: this.record.getLineItemValue('iladdrbook', 'iladdrshipaddr2', i)
				,	attention: this.record.getLineItemValue('iladdrbook', 'iladdrshipattention', i)
				,	addressee: this.record.getLineItemValue('iladdrbook', 'iladdrshipaddressee', i)
				,	phone: this.record.getLineItemValue('iladdrbook', 'iladdrshipphone', i)
				});
			}

			// Adds Shipping Address
			// @property {String} shipaddress Id of the shipping address
			this.result.shipaddress = this.record.getFieldValue('shipaddress') ? this.addAddress({
				internalid: this.record.getFieldValue('shipaddress')
			,	country: this.record.getFieldValue('shipcountry')
			,	state: this.record.getFieldValue('shipstate')
			,	city: this.record.getFieldValue('shipcity')
			,	zip: this.record.getFieldValue('shipzip')
			,	addr1: this.record.getFieldValue('shipaddr1')
			,	addr2: this.record.getFieldValue('shipaddr2')
			,	attention: this.record.getFieldValue('shipattention')
			,	addressee: this.record.getFieldValue('shipaddressee')
			,	phone:  this.record.getFieldValue('shipphone')
			}) : null;

			// Adds Bill Address
			// @property {String} billaddress Id of the billing address
			this.result.billaddress = this.record.getFieldValue('billaddress') ? this.addAddress({
				internalid: this.record.getFieldValue('billaddress')
			,	country: this.record.getFieldValue('billcountry')
			,	state: this.record.getFieldValue('billstate')
			,	city: this.record.getFieldValue('billcity')
			,	zip: this.record.getFieldValue('billzip')
			,	addr1: this.record.getFieldValue('billaddr1')
			,	addr2: this.record.getFieldValue('billaddr2')
			,	attention: this.record.getFieldValue('billattention')
			,	addressee: this.record.getFieldValue('billaddressee')
			,	phone: this.record.getFieldValue('billphone')
			}) : null;

			//@class Transaction.Model
		}

		//@method addShippingMethod Concatenated the parameter shipping method into the list of the current result's property shipmethods
		//@param {Transaction.Model.Get.ShipMethod} shipping_method
		//@return {Number} The internal id of the added internal id
	,	addShippingMethod: function (shipping_method)
		{
			//@class Transaction.Model.Get.Result
			//@property {Array<Transaction.Model.Get.ShipMethod>} shipmethods
			this.result.shipmethods = this.result.shipmethods || {};

			if (!this.result.shipmethods[shipping_method.internalid])
			{
				this.result.shipmethods[shipping_method.internalid] = shipping_method;
			}
			return shipping_method.internalid;
			// @class Transaction.Model
		}

		//@method addAddress Auxiliary method to generate address ids from its properties
		//@param {Address.Model.Attributes} address
		//@return {String} address id
	,	addAddress: function (address)
		{
			this.result.addresses = this.result.addresses || {};

			address.fullname = (address.attention) ? address.attention : address.addressee;
			address.company = (address.attention) ? address.addressee : null;

			delete address.attention;
			delete address.addressee;

			address.internalid = this.getAddressInternalId(address);

			if (AddressModel && AddressModel.isValid)
			{
				address.isvalid = AddressModel.isValid(address) ? 'T' : 'F';
			}

			if (!this.result.addresses[address.internalid])
			{
				this.result.addresses[address.internalid] = address;
			}

			return address.internalid;
		}

		//@method getAddressInternalId Internal method used to generate the internal id of an address
		//@param {Address.Model.Attributes} address
		//@return {String}
	,	getAddressInternalId: function (address)
		{
			var address_internalid =	(address.country || '')  + '-' +
										(address.state || '') + '-' +
										(address.city || '') + '-' +
										(address.zip || '') + '-' +
										(address.addr1 || '') + '-' +
										(address.addr2 || '') + '-' +
										(address.fullname || '') + '-' +
										(address.company || '');

			return address_internalid.replace(/\s/g, '-');
		}

		//@method update Updates a transaction
		//@param {String} record_type
		//@param {Number} id
		//@param {Transaction.Model.UpdateAttributes} data_model
		//@return {Void}
	,	update: function (record_type, id, data_model)
		{
			if (record_type && id)
			{
				this.recordId = id;
				this.data = data_model;

				this.record = this.getTransactionRecord(record_type, id);
				//@property {Transaction.Model.Get.Result} currentRecord This property is used so when performing any update
				//operation you can know what is the current state
				//This property is only present when performing an update operation
				this.currentRecord = this.get(record_type, id);
				this.setPaymentMethod();
				this.setAddress('ship', this.data.shipaddress, 'billaddress');
				this.setAddress('bill', this.data.billaddress, 'shipaddress');
				this.setLines();
				this.setMemo();
				this.setTransactionBodyCustomFields();
			}
		}

		//@method setMemo Sets the memo attribute into the current transaction
		//This method does not use any parameters as it use this.data and this.record
		//@return {Void}
	,	setMemo: function ()
		{
			this.record.setFieldValue('memo', null);

			if (this.data.memo)
			{
				this.record.setFieldValue('memo', this.data.memo);
			}
		}

		//@method setPaymentMethod Update in the current record the set payment method
		//This method does not use any parameters as it use this.data and this.record
		//@return {Void}
	,	setPaymentMethod: function ()
		{
			var self = this
			,	method_name = '';

			this.removePaymentMethod();

			if (this.data.paymentmethods)
			{
				//@class Transaction.Model.UpdateAttributes
				//@property {Array<Transaction.Model.Get.PaymentMethod>} paymentmethods
				_.each(this.data.paymentmethods, function (payment_method)
				{
					method_name = 'setPaymentMethod' + payment_method.type.toUpperCase();
					if (_.isFunction(self[method_name]))
					{
						self[method_name](payment_method);
					}
				});
			}

			// @class Transaction.Model
		}

		//@method setAddress Set the shipping address for the current transaction when performing an update
		//This method does not accept any parameter as it used this.data and this.record
		//@param {String} prefix Possible values are 'bill' or 'ship' depending on the address, if it is removing billing address or shipping address
		//@param {String} address_id
		//@param {String} other_address_name Name of the other address to compare in case of address creation and
		//@return {Void}
	,	setAddress: function (prefix, address_id, other_address_name)
		{
			this.removeAddress(prefix);

			if (address_id)
			{
				if (!this.hasCurrentCustomerAddress(address_id))
				{
					var old_address_model = _.find(this.data.addresses, {internalid: address_id})
					,	old_address_id = address_id;
					address_id = this.createAddress(old_address_model);
					this.data.addresses = _.reject(this.data.addresses, function (address)
					{
						return address.internalid === old_address_id;
					});
					old_address_model.internalid = address_id;
					this.data.addresses.push(old_address_model);
					if (other_address_name && this.data[other_address_name] === old_address_id)
					{
						this.data[other_address_name] = address_id;
					}
				}

				this.record.setFieldValue(prefix + 'addresslist', address_id);
			}
		}

		//@method hasCurrentCustomerAddress Indicate if certain address id exist in the current user or not
		//@param {String} address_id
		//@return {Boolean}
	,	hasCurrentCustomerAddress: function (address_id)
		{
			try
			{
				return AddressModel ? !!AddressModel.get(address_id) : true;
			}
			catch (e)
			{
				return false;
			}
		}

		//@method createAddress Creates an address for the current user
		//@param {Address.Data.Model} address_model
		//@return {String} internal id of the new created address
	,	createAddress: function (address_model)
		{
			return AddressModel && AddressModel.create(_.clone(address_model));
		}

		//@method removeAddress Auxiliary method used when updated a transaction to remove selected address
		//This method does not accept any parameter as it used this.data and this.record
		//@param {String} prefix Possible values are 'bill' or 'ship' depending on the address, if it is removing billing address or shipping address
		//@return {Void}
	,	removeAddress: function (prefix)
		{
			var empty_value = '';
			this.record.setFieldValue(prefix + 'country', empty_value);
//			this.record.setFieldValue(prefix + 'addresslist', empty_value);
			this.record.setFieldValue(prefix + 'address', empty_value);
			this.record.setFieldValue(prefix + 'state', empty_value);
			this.record.setFieldValue(prefix + 'city', empty_value);
			this.record.setFieldValue(prefix + 'zip', empty_value);
			this.record.setFieldValue(prefix + 'addr1', empty_value);
			this.record.setFieldValue(prefix + 'addr2', empty_value);
			this.record.setFieldValue(prefix + 'attention', empty_value);
			this.record.setFieldValue(prefix + 'addressee', empty_value);
			this.record.setFieldValue(prefix + 'phone', empty_value);
		}

		//@method setLines Set the line of a transaction when performing an update
		//This method does not accept any parameter as it used this.data and this.record
		//@return {Void}
	,	setLines: function ()
		{
			this.removeAllItemLines();

			if (this.data.lines)
			{
				var self = this;

				//@class Transaction.Model.UpdateAttributes
				//@property {Array<Transaction.Model.set.Line>} lines
				_.each(this.data.lines, function (line)
				{
					self.record.selectNewLineItem('item');
					self.record.setCurrentLineItemValue('item', 'item', line.item.internalid);
					self.record.setCurrentLineItemValue('item', 'quantity', line.quantity);
					self.record.setCurrentLineItemValue('item', 'itemtype', line.item.type);
					self.record.setCurrentLineItemValue('item', 'id', line.internalid);
					self._addTransactionColumnFieldsToOptions(line);

					//Set Line Options
					_.each(line.options, function (option)
					{
						if(option.cartOptionId && option.value && option.value.internalId)
						{
							self.record.setCurrentLineItemValue('item', option.cartOptionId, option.value.internalid);
						}
					});

					self.setLinesAddUpdateLine(line, self.record);

					self.record.commitLineItem('item');
				});
			}

			//@class Transaction.Model
		}

		//@method setLinesRemoveLines Extension method used to apply extra logic when removing lines from the current transaction
		//@param {nlobjRecord} current_transaction
		//@return {Void}
	,	setLinesRemoveLines: function ()
		{
		}

		//@method setLinesUpdateLines Extension method used to set extra values into line when they are being added/updated into the current transaction
		//@param {Transaction.Model.set.Line} line
		//@param {nlobjRecord} current_transaction
		//@return {Void}
	,	setLinesAddUpdateLine: function ()
		{
		}

		//@method removeAllItemLines Auxiliary method used to remove all lines of the current transaction
		//This method does not accept any parameter as it used this.data and this.record
		//@return {Void}
	,	removeAllItemLines: function ()
		{
			var items_count = this.record.getLineItemCount('item');

			this.setLinesRemoveLines(this.record);

			for (var i = 1; i <= items_count; i++)
			{
				this.record.removeLineItem('item', i);
			}
		}

		//@method setPaymentMethodINVOICE Internal method to set an invoice payment method into the current record.
		//Used to update the current record
		//@param {Transaction.Model.Get.PaymentMethod} payment_method
		//@return {Void}
	,	setPaymentMethodINVOICE: function (payment_method)
		{
			this.record.setFieldValue('terms', payment_method.terms.internalid);
			this.record.setFieldValue('otherrefnum', payment_method.purchasenumber);
		}

		//@method setPaymentMethodCREDITCARD Internal method to set a credit card payment method into the current record.
		//Used to update the current record
		//@param {Transaction.Model.Get.PaymentMethod} payment_method
		//@return {Void}
	,	setPaymentMethodCREDITCARD: function (payment_method)
		{
			var credit_card = payment_method.creditcard;

			if(this.paymentInstrumentsEnabled)
			{
				this.record.setFieldValue('paymentoption', credit_card.internalid);
			}
			else
			{
				this.record.setFieldValue('creditcard', credit_card.internalid);
				this.record.setFieldValue('paymentmethod', credit_card.paymentmethod.internalid);
				this.record.setFieldValue('creditcardprocessor', credit_card.paymentmethod.merchantid);
			}

			if (credit_card.ccsecuritycode)
			{
				this.record.setFieldValue('ccsecuritycode', credit_card.ccsecuritycode);
			}
		}

		//@method setPaymentMethodCREDITCARD Internal method to set a external payment method into the current record.
		//Used to update the current record
		//@param {Transaction.Model.Get.PaymentMethod} payment_method
		//@return {Void}
	,	setPaymentMethodEXTERNAL: function (payment_method)
		{
			this.record.setFieldValue('paymentmethod', payment_method.internalid);
			this.record.setFieldValue('creditcardprocessor', payment_method.merchantid);
			this.record.setFieldValue('returnurl', payment_method.returnurl);
			this.record.setFieldValue('getauth', 'T');
		}

		//@method removePaymentMethod Removes the specified payment method from the current record
		//@return {Void}
	,	removePaymentMethod: function ()
		{
			this.record.setFieldValue('paymentterms', null);
		 	this.record.setFieldValue('paymentmethod', null);
			this.record.setFieldValue('thankyouurl', null);
			this.record.setFieldValue('errorurl', null);
			this.record.setFieldValue('returnurl', null);
			this.record.setFieldValue('terms', null);
			this.record.setFieldValue('otherrefnum', null);
			this.record.setFieldValue('creditcard', null);
		}

		//@method preSubmitRecord Overridable method used to execute any logic before submit a transaction record
		//@return {Void} This method does not return anything as it works with the value of this.record
	,	preSubmitRecord: function () { }

		//@method postSubmitRecord Overridable method used to execute any logic before submit a transaction record
		//@param {Transaction.Model.Confirmation} confirmation_result
		//@return {Transaction.Model.Confirmation}
	,	postSubmitRecord: function (confirmation_result)
		{
			return confirmation_result;
		}

		//@method submit Saves the current record
		//@return {Transaction.Model.Confirmation}
	,	submit: function ()
		{
			if (!this.record)
			{
				throw SC.ERROR_IDENTIFIERS.loadBeforeSubmit;
			}

			this.preSubmitRecord();

			var new_record_id = nlapiSubmitRecord(this.record)
			//@class Transaction.Model.Confirmation
			,	result = {
					//@property {String} internalid
					internalid: new_record_id
				};

			return this.postSubmitRecord(result);
			// @class Transaction.Model
		}

		//@method preList Overridable method used to execute any logic before list() executes
		//@return {Void}
	,	preList: function () {}

		//@method postList Overridable method used to execute any logic after list() executes
		//@return {Void}
	,	postList: function () {}

		//@method preGet Overridable method used to execute any logic before get() executes
		//@return {Void}
	,	preGet: function () {}

		//@method postGet Overridable method used to execute any logic after get() executes
		//@return {Void}
	,	postGet: function () {}

	});
});

//@class Transaction.Model.List.Result
//@property {Number} totalRecordsFound
//@property {Number} page
//@property {Arra<Transaction.Model.List.Result.Record>} records

//@class Transaction.Model.List.Parameters
//@property {Number?} from Date in number of milliseconds
//@property {Number?} to Date in number of milliseconds
//@property {String?} createdfrom Value used to filter the list record created from
//@property {String?} internalid Value used to filter the list record, this string contains a list of transaction internal id joined by ','
//@property {String?} types In case of being specified, this string contains a list of transaction types joined by ','
//@property {String?} sort In case of being specified, this string contains a list of column names joined by ',' used to sort the final result
//@property {String?} filter Generic filter value

//@class Transaction.Model.set.Line
//@property {Number} quantity
//@property {String} internalid
//@property {Object} options This object is used like a dictionary where each property indicate the option name and the value of the property is the property value
//@property {Item} item When updated or creating a transaction only the type and id are mandatory the rest of the field of this class are optional
;
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module CreditMemo
define('CreditMemo.Model'
,	[	'Transaction.Model'
	,	'StoreItem.Model'
	,	'Application'
	,	'underscore'
	,	'Utils'
	]
,	function (
		TransactionModel
	,	StoreItem
	,	Application
	,	_
	,	Utils
	)
{
	'use strict';

	//@class CreditMemo.Model @extend TransactionModel
	return TransactionModel.extend({
		name: 'CreditMemo'

	,	getInvoices: function()
		{
			this.result.invoices = [];

			for (var i = 1; i <= this.record.getLineItemCount('apply'); i++)
			{
				var invoice = {
						line: i
					,	internalid: this.record.getLineItemValue('apply', 'internalid', i)
					,	type: this.record.getLineItemValue('apply', 'type', i)
					,	total: Utils.toCurrency(this.record.getLineItemValue('apply', 'total', i))
					,	total_formatted: Utils.formatCurrency(this.record.getLineItemValue('apply', 'total', i), this.currencySymbol)
					,	apply: this.record.getLineItemValue('apply', 'apply', i) === 'T'
					,	applydate: this.record.getLineItemValue('apply', 'applydate', i)
					,	currency: this.record.getLineItemValue('apply', 'currency', i)
					,	amount: Utils.toCurrency(this.record.getLineItemValue('apply', 'amount', i))
					,	amount_formatted: Utils.formatCurrency(this.record.getLineItemValue('apply', 'amount', i), this.currencySymbol)
					,	due: Utils.toCurrency(this.record.getLineItemValue('apply', 'due', i))
					,	due_formatted: Utils.formatCurrency(this.record.getLineItemValue('apply', 'due', i), this.currencySymbol)
					,	refnum: this.record.getLineItemValue('apply', 'refnum', i)
				};

				this.result.invoices.push(invoice);
			}
		}

	,	getExtraRecordFields: function ()
		{
			if (this.result && this.result.selected_currency) 
			{
				this.currencySymbol = this.result.selected_currency.symbol;
			}	

			this.result.amountpaid = Utils.toCurrency(this.record.getFieldValue('amountpaid'));
			this.result.amountpaid_formatted = Utils.formatCurrency(this.record.getFieldValue('amountpaid'), this.currencySymbol);
			this.result.amountremaining = Utils.toCurrency(this.record.getFieldValue('amountremaining'));
			this.result.amountremaining_formatted = Utils.formatCurrency(this.record.getFieldValue('amountremaining'), this.currencySymbol);

			this.getInvoices();
		}
	});
});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// CreditMemo.ServiceController.js
// ----------------
// Service to manage CreditMemo requests
define(
	'CreditMemo.ServiceController'
,	[
		'ServiceController'
	,	'CreditMemo.Model'
	]
,	function(
		ServiceController
	,	CreditMemoModel
	)
	{
		'use strict';

		// @class CreditMemo.ServiceController Manage credit memo requests
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'CreditMemo.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: {
				common: {
					requireLogin: true
				}
			}

			// @method get The call to CreditMemo.Service.ss with http method 'get' is managed by this function
			// @return {CreditMemo.Model}
		,	get: function()
			{
				var id = this.request.getParameter('internalid');
				return CreditMemoModel.get('creditmemo', id);
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// CustomerPayment.Model.js
define(
	'CustomerPayment.Model'
,	[
		'Transaction.Model'
	,	'ExternalPayment.Model'
	,	'Utils'
	]
,	function (
		TransactionModel
	,	ExternalPayment
	,	Utils
	)
{
	'use strict';

	// @class CustomerPayment.Model
	// Defines the model used by the CustomerPayment.Service.ss service
	// @extends Transaction.Model
	return TransactionModel.extend({

		name: 'CustomerPayment'

		// @method setPaymentMethod
		// Binds customer payment method to customer payment object to return.
	,	getPaymentMethod: function ()
		{
			this.result.paymentmethods = [];

			Utils.setPaymentMethodToResult(this.record, this.result);
		}	

		// @method setInvoices
		// Binds invoices to customer payment object to return
		// @returns invoices {Object}
	,	getInvoices: function ()
		{
			this.result.invoices = [];		

			for (var i = 1; i <= this.record.getLineItemCount('apply') ; i++)
			{
				var apply = this.record.getLineItemValue('apply', 'apply', i) === 'T';

				if (apply)
				{
					var invoice = {
						internalid: this.record.getLineItemValue('apply', 'internalid', i)
					,	type: this.record.getLineItemValue('apply', 'type', i)
					,	total: Utils.toCurrency(this.record.getLineItemValue('apply', 'total', i))
					,	total_formatted: Utils.formatCurrency(this.record.getLineItemValue('apply', 'total', i), this.currencySymbol)
					,	apply: apply
					,	applydate: this.record.getLineItemValue('apply', 'applydate', i)
					,	currency: this.record.getLineItemValue('apply', 'currency', i)
					,	disc: Utils.toCurrency(this.record.getLineItemValue('apply', 'disc', i))
					,	disc_formatted: Utils.formatCurrency(this.record.getLineItemValue('apply', 'disc', i), this.currencySymbol)
					,	amount: Utils.toCurrency(this.record.getLineItemValue('apply', 'amount', i))
					,	amount_formatted: Utils.formatCurrency(this.record.getLineItemValue('apply', 'amount', i), this.currencySymbol)
					,	due: Utils.toCurrency(this.record.getLineItemValue('apply', 'due', i))
					,	due_formatted: Utils.formatCurrency(this.record.getLineItemValue('apply', 'due', i), this.currencySymbol)
					,	refnum: this.record.getLineItemValue('apply', 'refnum', i)
					};
										
					this.result.invoices.push(invoice);
				}
			}
		}

	,	getExtraRecordFields: function ()
		{
			//@property {Number} balance
			this.result.balance = Utils.toCurrency(this.record.getFieldValue('balance'));

			if (this.result && this.result.selected_currency) 
			{
				this.currencySymbol = this.result.selected_currency.symbol;
			}		
		
			//@property {Number} balance_formatted
			this.result.balance_formatted = Utils.formatCurrency(this.record.getFieldValue('balance'), this.currencySymbol);

			//@property {Number} payment_formatted
			this.result.payment_formatted = Utils.formatCurrency(this.record.getFieldValue('payment'), this.currencySymbol);
				
			//@property {String} autoapply
			this.result.autoapply = this.record.getFieldValue('autoapply');

   			//@property {Number} payment
			this.result.payment = Utils.toCurrency(this.record.getFieldValue('payment'));

			//@property {String} lastmodifieddate
			this.result.lastmodifieddate = this.record.getFieldValue('lastmodifieddate');

			// @property {Array<Object>} paymentMethods
			this.getPaymentMethod();

			// @property {Array<Object>} invoices
			this.getInvoices();

			if (this.record.getFieldValue('paymethtype') === 'external_checkout')
			{
				// @property {String} redirecturl
				this.result.redirecturl = ExternalPayment.generateUrl(this.result.internalid, this.result.recordtype);

				// @property {String} paymenteventholdreason
				this.result.paymenteventholdreason = this.record.getFieldValue('paymenteventholdreason');

				// @property {String} statuscode
				this.result.statuscode = this.result.paymenteventholdreason  === 'FORWARD_REQUESTED'  ? 'redirect' : '';
			}

			this.result.invoices_total = Utils.toCurrency(this.record.getFieldValue('applied')); 		
			this.result.invoices_total_formatted = Utils.formatCurrency(this.record.getFieldValue('applied'), this.currencySymbol);	
		}
	});
});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// CustomerPayment.ServiceController.js
// ----------------
// Service to manage credit memo requests
define(
	'CustomerPayment.ServiceController'
,	[
		'ServiceController'
	,	'CustomerPayment.Model'
	]
,	function(
		ServiceController
	,	CustomerPayment
	)
	{
		'use strict';

		// @class CustomerPayment.ServiceController Manage credit memo requests
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'CustomerPayment.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: {
				common: {
					requireLogin: true
				}
			,	requirePermissions: {
					list: [
						'transactions.tranCustPymt.1'
					]
				}
			}


			// @method get The call to CustomerPayment.Service.ss with http method 'get' is managed by this function
			// @return {CustomerPayment.Model}
		,	get: function()
			{
				var id = this.request.getParameter('internalid');
				return CustomerPayment.get('customerpayment', id);
			}
		});
	}
);

;(function (globalObject) {
  'use strict';

/*
 *      bignumber.js v7.2.1
 *      A JavaScript library for arbitrary-precision arithmetic.
 *      https://github.com/MikeMcl/bignumber.js
 *      Copyright (c) 2018 Michael Mclaughlin <M8ch88l@gmail.com>
 *      MIT Licensed.
 *
 *      BigNumber.prototype methods     |  BigNumber methods
 *                                      |
 *      absoluteValue            abs    |  clone
 *      comparedTo                      |  config               set
 *      decimalPlaces            dp     |      DECIMAL_PLACES
 *      dividedBy                div    |      ROUNDING_MODE
 *      dividedToIntegerBy       idiv   |      EXPONENTIAL_AT
 *      exponentiatedBy          pow    |      RANGE
 *      integerValue                    |      CRYPTO
 *      isEqualTo                eq     |      MODULO_MODE
 *      isFinite                        |      POW_PRECISION
 *      isGreaterThan            gt     |      FORMAT
 *      isGreaterThanOrEqualTo   gte    |      ALPHABET
 *      isInteger                       |  isBigNumber
 *      isLessThan               lt     |  maximum              max
 *      isLessThanOrEqualTo      lte    |  minimum              min
 *      isNaN                           |  random
 *      isNegative                      |
 *      isPositive                      |
 *      isZero                          |
 *      minus                           |
 *      modulo                   mod    |
 *      multipliedBy             times  |
 *      negated                         |
 *      plus                            |
 *      precision                sd     |
 *      shiftedBy                       |
 *      squareRoot               sqrt   |
 *      toExponential                   |
 *      toFixed                         |
 *      toFormat                        |
 *      toFraction                      |
 *      toJSON                          |
 *      toNumber                        |
 *      toPrecision                     |
 *      toString                        |
 *      valueOf                         |
 *
 */


  var BigNumber,
    isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,

    mathceil = Math.ceil,
    mathfloor = Math.floor,

    bignumberError = '[BigNumber Error] ',
    tooManyDigits = bignumberError + 'Number primitive has more than 15 significant digits: ',

    BASE = 1e14,
    LOG_BASE = 14,
    MAX_SAFE_INTEGER = 0x1fffffffffffff,         // 2^53 - 1
    // MAX_INT32 = 0x7fffffff,                   // 2^31 - 1
    POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13],
    SQRT_BASE = 1e7,

    // EDITABLE
    // The limit on the value of DECIMAL_PLACES, TO_EXP_NEG, TO_EXP_POS, MIN_EXP, MAX_EXP, and
    // the arguments to toExponential, toFixed, toFormat, and toPrecision.
    MAX = 1E9;                                   // 0 to MAX_INT32


  /*
   * Create and return a BigNumber constructor.
   */
  function clone(configObject) {
    var div, convertBase, parseNumeric,
      P = BigNumber.prototype = { constructor: BigNumber, toString: null, valueOf: null },
      ONE = new BigNumber(1),


      //----------------------------- EDITABLE CONFIG DEFAULTS -------------------------------


      // The default values below must be integers within the inclusive ranges stated.
      // The values can also be changed at run-time using BigNumber.set.

      // The maximum number of decimal places for operations involving division.
      DECIMAL_PLACES = 20,                     // 0 to MAX

      // The rounding mode used when rounding to the above decimal places, and when using
      // toExponential, toFixed, toFormat and toPrecision, and round (default value).
      // UP         0 Away from zero.
      // DOWN       1 Towards zero.
      // CEIL       2 Towards +Infinity.
      // FLOOR      3 Towards -Infinity.
      // HALF_UP    4 Towards nearest neighbour. If equidistant, up.
      // HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
      // HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
      // HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
      // HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
      ROUNDING_MODE = 4,                       // 0 to 8

      // EXPONENTIAL_AT : [TO_EXP_NEG , TO_EXP_POS]

      // The exponent value at and beneath which toString returns exponential notation.
      // Number type: -7
      TO_EXP_NEG = -7,                         // 0 to -MAX

      // The exponent value at and above which toString returns exponential notation.
      // Number type: 21
      TO_EXP_POS = 21,                         // 0 to MAX

      // RANGE : [MIN_EXP, MAX_EXP]

      // The minimum exponent value, beneath which underflow to zero occurs.
      // Number type: -324  (5e-324)
      MIN_EXP = -1e7,                          // -1 to -MAX

      // The maximum exponent value, above which overflow to Infinity occurs.
      // Number type:  308  (1.7976931348623157e+308)
      // For MAX_EXP > 1e7, e.g. new BigNumber('1e100000000').plus(1) may be slow.
      MAX_EXP = 1e7,                           // 1 to MAX

      // Whether to use cryptographically-secure random number generation, if available.
      CRYPTO = false,                          // true or false

      // The modulo mode used when calculating the modulus: a mod n.
      // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
      // The remainder (r) is calculated as: r = a - n * q.
      //
      // UP        0 The remainder is positive if the dividend is negative, else is negative.
      // DOWN      1 The remainder has the same sign as the dividend.
      //             This modulo mode is commonly known as 'truncated division' and is
      //             equivalent to (a % n) in JavaScript.
      // FLOOR     3 The remainder has the same sign as the divisor (Python %).
      // HALF_EVEN 6 This modulo mode implements the IEEE 754 remainder function.
      // EUCLID    9 Euclidian division. q = sign(n) * floor(a / abs(n)).
      //             The remainder is always positive.
      //
      // The truncated division, floored division, Euclidian division and IEEE 754 remainder
      // modes are commonly used for the modulus operation.
      // Although the other rounding modes can also be used, they may not give useful results.
      MODULO_MODE = 1,                         // 0 to 9

      // The maximum number of significant digits of the result of the exponentiatedBy operation.
      // If POW_PRECISION is 0, there will be unlimited significant digits.
      POW_PRECISION = 0,                    // 0 to MAX

      // The format specification used by the BigNumber.prototype.toFormat method.
      FORMAT = {
        decimalSeparator: '.',
        groupSeparator: ',',
        groupSize: 3,
        secondaryGroupSize: 0,
        fractionGroupSeparator: '\xA0',      // non-breaking space
        fractionGroupSize: 0
      },

      // The alphabet used for base conversion.
      // It must be at least 2 characters long, with no '.' or repeated character.
      // '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_'
      ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';


    //------------------------------------------------------------------------------------------


    // CONSTRUCTOR


    /*
     * The BigNumber constructor and exported function.
     * Create and return a new instance of a BigNumber object.
     *
     * n {number|string|BigNumber} A numeric value.
     * [b] {number} The base of n. Integer, 2 to ALPHABET.length inclusive.
     */
    function BigNumber(n, b) {
      var alphabet, c, caseChanged, e, i, isNum, len, str,
        x = this;

      // Enable constructor usage without new.
      if (!(x instanceof BigNumber)) {

        // Don't throw on constructor call without new (#81).
        // '[BigNumber Error] Constructor call without new: {n}'
        //throw Error(bignumberError + ' Constructor call without new: ' + n);
        return new BigNumber(n, b);
      }

      if (b == null) {

        // Duplicate.
        if (n instanceof BigNumber) {
          x.s = n.s;
          x.e = n.e;
          x.c = (n = n.c) ? n.slice() : n;
          return;
        }

        isNum = typeof n == 'number';

        if (isNum && n * 0 == 0) {

          // Use `1 / n` to handle minus zero also.
          x.s = 1 / n < 0 ? (n = -n, -1) : 1;

          // Faster path for integers.
          if (n === ~~n) {
            for (e = 0, i = n; i >= 10; i /= 10, e++);
            x.e = e;
            x.c = [n];
            return;
          }

          str = n + '';
        } else {
          if (!isNumeric.test(str = n + '')) return parseNumeric(x, str, isNum);
          x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
        }

        // Decimal point?
        if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');

        // Exponential form?
        if ((i = str.search(/e/i)) > 0) {

          // Determine exponent.
          if (e < 0) e = i;
          e += +str.slice(i + 1);
          str = str.substring(0, i);
        } else if (e < 0) {

          // Integer.
          e = str.length;
        }

      } else {

        // '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
        intCheck(b, 2, ALPHABET.length, 'Base');
        str = n + '';

        // Allow exponential notation to be used with base 10 argument, while
        // also rounding to DECIMAL_PLACES as with other bases.
        if (b == 10) {
          x = new BigNumber(n instanceof BigNumber ? n : str);
          return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
        }

        isNum = typeof n == 'number';

        if (isNum) {

          // Avoid potential interpretation of Infinity and NaN as base 44+ values.
          if (n * 0 != 0) return parseNumeric(x, str, isNum, b);

          x.s = 1 / n < 0 ? (str = str.slice(1), -1) : 1;

          // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
          if (BigNumber.DEBUG && str.replace(/^0\.0*|\./, '').length > 15) {
            throw Error
             (tooManyDigits + n);
          }

          // Prevent later check for length on converted number.
          isNum = false;
        } else {
          x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
        }

        alphabet = ALPHABET.slice(0, b);
        e = i = 0;

        // Check that str is a valid base b number.
        // Don't use RegExp so alphabet can contain special characters.
        for (len = str.length; i < len; i++) {
          if (alphabet.indexOf(c = str.charAt(i)) < 0) {
            if (c == '.') {

              // If '.' is not the first character and it has not be found before.
              if (i > e) {
                e = len;
                continue;
              }
            } else if (!caseChanged) {

              // Allow e.g. hexadecimal 'FF' as well as 'ff'.
              if (str == str.toUpperCase() && (str = str.toLowerCase()) ||
                  str == str.toLowerCase() && (str = str.toUpperCase())) {
                caseChanged = true;
                i = -1;
                e = 0;
                continue;
              }
            }

            return parseNumeric(x, n + '', isNum, b);
          }
        }

        str = convertBase(str, b, 10, x.s);

        // Decimal point?
        if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');
        else e = str.length;
      }

      // Determine leading zeros.
      for (i = 0; str.charCodeAt(i) === 48; i++);

      // Determine trailing zeros.
      for (len = str.length; str.charCodeAt(--len) === 48;);

      str = str.slice(i, ++len);

      if (str) {
        len -= i;

        // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
        if (isNum && BigNumber.DEBUG &&
          len > 15 && (n > MAX_SAFE_INTEGER || n !== mathfloor(n))) {
            throw Error
             (tooManyDigits + (x.s * n));
        }

        e = e - i - 1;

         // Overflow?
        if (e > MAX_EXP) {

          // Infinity.
          x.c = x.e = null;

        // Underflow?
        } else if (e < MIN_EXP) {

          // Zero.
          x.c = [x.e = 0];
        } else {
          x.e = e;
          x.c = [];

          // Transform base

          // e is the base 10 exponent.
          // i is where to slice str to get the first element of the coefficient array.
          i = (e + 1) % LOG_BASE;
          if (e < 0) i += LOG_BASE;

          if (i < len) {
            if (i) x.c.push(+str.slice(0, i));

            for (len -= LOG_BASE; i < len;) {
              x.c.push(+str.slice(i, i += LOG_BASE));
            }

            str = str.slice(i);
            i = LOG_BASE - str.length;
          } else {
            i -= len;
          }

          for (; i--; str += '0');
          x.c.push(+str);
        }
      } else {

        // Zero.
        x.c = [x.e = 0];
      }
    }


    // CONSTRUCTOR PROPERTIES


    BigNumber.clone = clone;

    BigNumber.ROUND_UP = 0;
    BigNumber.ROUND_DOWN = 1;
    BigNumber.ROUND_CEIL = 2;
    BigNumber.ROUND_FLOOR = 3;
    BigNumber.ROUND_HALF_UP = 4;
    BigNumber.ROUND_HALF_DOWN = 5;
    BigNumber.ROUND_HALF_EVEN = 6;
    BigNumber.ROUND_HALF_CEIL = 7;
    BigNumber.ROUND_HALF_FLOOR = 8;
    BigNumber.EUCLID = 9;


    /*
     * Configure infrequently-changing library-wide settings.
     *
     * Accept an object with the following optional properties (if the value of a property is
     * a number, it must be an integer within the inclusive range stated):
     *
     *   DECIMAL_PLACES   {number}           0 to MAX
     *   ROUNDING_MODE    {number}           0 to 8
     *   EXPONENTIAL_AT   {number|number[]}  -MAX to MAX  or  [-MAX to 0, 0 to MAX]
     *   RANGE            {number|number[]}  -MAX to MAX (not zero)  or  [-MAX to -1, 1 to MAX]
     *   CRYPTO           {boolean}          true or false
     *   MODULO_MODE      {number}           0 to 9
     *   POW_PRECISION       {number}           0 to MAX
     *   ALPHABET         {string}           A string of two or more unique characters which does
     *                                       not contain '.'.
     *   FORMAT           {object}           An object with some of the following properties:
     *      decimalSeparator       {string}
     *      groupSeparator         {string}
     *      groupSize              {number}
     *      secondaryGroupSize     {number}
     *      fractionGroupSeparator {string}
     *      fractionGroupSize      {number}
     *
     * (The values assigned to the above FORMAT object properties are not checked for validity.)
     *
     * E.g.
     * BigNumber.config({ DECIMAL_PLACES : 20, ROUNDING_MODE : 4 })
     *
     * Ignore properties/parameters set to null or undefined, except for ALPHABET.
     *
     * Return an object with the properties current values.
     */
    BigNumber.config = BigNumber.set = function (obj) {
      var p, v;

      if (obj != null) {

        if (typeof obj == 'object') {

          // DECIMAL_PLACES {number} Integer, 0 to MAX inclusive.
          // '[BigNumber Error] DECIMAL_PLACES {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'DECIMAL_PLACES')) {
            v = obj[p];
            intCheck(v, 0, MAX, p);
            DECIMAL_PLACES = v;
          }

          // ROUNDING_MODE {number} Integer, 0 to 8 inclusive.
          // '[BigNumber Error] ROUNDING_MODE {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'ROUNDING_MODE')) {
            v = obj[p];
            intCheck(v, 0, 8, p);
            ROUNDING_MODE = v;
          }

          // EXPONENTIAL_AT {number|number[]}
          // Integer, -MAX to MAX inclusive or
          // [integer -MAX to 0 inclusive, 0 to MAX inclusive].
          // '[BigNumber Error] EXPONENTIAL_AT {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'EXPONENTIAL_AT')) {
            v = obj[p];
            if (isArray(v)) {
              intCheck(v[0], -MAX, 0, p);
              intCheck(v[1], 0, MAX, p);
              TO_EXP_NEG = v[0];
              TO_EXP_POS = v[1];
            } else {
              intCheck(v, -MAX, MAX, p);
              TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
            }
          }

          // RANGE {number|number[]} Non-zero integer, -MAX to MAX inclusive or
          // [integer -MAX to -1 inclusive, integer 1 to MAX inclusive].
          // '[BigNumber Error] RANGE {not a primitive number|not an integer|out of range|cannot be zero}: {v}'
          if (obj.hasOwnProperty(p = 'RANGE')) {
            v = obj[p];
            if (isArray(v)) {
              intCheck(v[0], -MAX, -1, p);
              intCheck(v[1], 1, MAX, p);
              MIN_EXP = v[0];
              MAX_EXP = v[1];
            } else {
              intCheck(v, -MAX, MAX, p);
              if (v) {
                MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
              } else {
                throw Error
                 (bignumberError + p + ' cannot be zero: ' + v);
              }
            }
          }

          // CRYPTO {boolean} true or false.
          // '[BigNumber Error] CRYPTO not true or false: {v}'
          // '[BigNumber Error] crypto unavailable'
          if (obj.hasOwnProperty(p = 'CRYPTO')) {
            v = obj[p];
            if (v === !!v) {
              if (v) {
                if (typeof crypto != 'undefined' && crypto &&
                 (crypto.getRandomValues || crypto.randomBytes)) {
                  CRYPTO = v;
                } else {
                  CRYPTO = !v;
                  throw Error
                   (bignumberError + 'crypto unavailable');
                }
              } else {
                CRYPTO = v;
              }
            } else {
              throw Error
               (bignumberError + p + ' not true or false: ' + v);
            }
          }

          // MODULO_MODE {number} Integer, 0 to 9 inclusive.
          // '[BigNumber Error] MODULO_MODE {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'MODULO_MODE')) {
            v = obj[p];
            intCheck(v, 0, 9, p);
            MODULO_MODE = v;
          }

          // POW_PRECISION {number} Integer, 0 to MAX inclusive.
          // '[BigNumber Error] POW_PRECISION {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'POW_PRECISION')) {
            v = obj[p];
            intCheck(v, 0, MAX, p);
            POW_PRECISION = v;
          }

          // FORMAT {object}
          // '[BigNumber Error] FORMAT not an object: {v}'
          if (obj.hasOwnProperty(p = 'FORMAT')) {
            v = obj[p];
            if (typeof v == 'object') FORMAT = v;
            else throw Error
             (bignumberError + p + ' not an object: ' + v);
          }

          // ALPHABET {string}
          // '[BigNumber Error] ALPHABET invalid: {v}'
          if (obj.hasOwnProperty(p = 'ALPHABET')) {
            v = obj[p];

            // Disallow if only one character, or contains '.' or a repeated character.
            if (typeof v == 'string' && !/^.$|\.|(.).*\1/.test(v)) {
              ALPHABET = v;
            } else {
              throw Error
               (bignumberError + p + ' invalid: ' + v);
            }
          }

        } else {

          // '[BigNumber Error] Object expected: {v}'
          throw Error
           (bignumberError + 'Object expected: ' + obj);
        }
      }

      return {
        DECIMAL_PLACES: DECIMAL_PLACES,
        ROUNDING_MODE: ROUNDING_MODE,
        EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
        RANGE: [MIN_EXP, MAX_EXP],
        CRYPTO: CRYPTO,
        MODULO_MODE: MODULO_MODE,
        POW_PRECISION: POW_PRECISION,
        FORMAT: FORMAT,
        ALPHABET: ALPHABET
      };
    };


    /*
     * Return true if v is a BigNumber instance, otherwise return false.
     *
     * v {any}
     */
    BigNumber.isBigNumber = function (v) {
      return v instanceof BigNumber || v && v._isBigNumber === true || false;
    };


    /*
     * Return a new BigNumber whose value is the maximum of the arguments.
     *
     * arguments {number|string|BigNumber}
     */
    BigNumber.maximum = BigNumber.max = function () {
      return maxOrMin(arguments, P.lt);
    };


    /*
     * Return a new BigNumber whose value is the minimum of the arguments.
     *
     * arguments {number|string|BigNumber}
     */
    BigNumber.minimum = BigNumber.min = function () {
      return maxOrMin(arguments, P.gt);
    };


    /*
     * Return a new BigNumber with a random value equal to or greater than 0 and less than 1,
     * and with dp, or DECIMAL_PLACES if dp is omitted, decimal places (or less if trailing
     * zeros are produced).
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp}'
     * '[BigNumber Error] crypto unavailable'
     */
    BigNumber.random = (function () {
      var pow2_53 = 0x20000000000000;

      // Return a 53 bit integer n, where 0 <= n < 9007199254740992.
      // Check if Math.random() produces more than 32 bits of randomness.
      // If it does, assume at least 53 bits are produced, otherwise assume at least 30 bits.
      // 0x40000000 is 2^30, 0x800000 is 2^23, 0x1fffff is 2^21 - 1.
      var random53bitInt = (Math.random() * pow2_53) & 0x1fffff
       ? function () { return mathfloor(Math.random() * pow2_53); }
       : function () { return ((Math.random() * 0x40000000 | 0) * 0x800000) +
         (Math.random() * 0x800000 | 0); };

      return function (dp) {
        var a, b, e, k, v,
          i = 0,
          c = [],
          rand = new BigNumber(ONE);

        if (dp == null) dp = DECIMAL_PLACES;
        else intCheck(dp, 0, MAX);

        k = mathceil(dp / LOG_BASE);

        if (CRYPTO) {

          // Browsers supporting crypto.getRandomValues.
          if (crypto.getRandomValues) {

            a = crypto.getRandomValues(new Uint32Array(k *= 2));

            for (; i < k;) {

              // 53 bits:
              // ((Math.pow(2, 32) - 1) * Math.pow(2, 21)).toString(2)
              // 11111 11111111 11111111 11111111 11100000 00000000 00000000
              // ((Math.pow(2, 32) - 1) >>> 11).toString(2)
              //                                     11111 11111111 11111111
              // 0x20000 is 2^21.
              v = a[i] * 0x20000 + (a[i + 1] >>> 11);

              // Rejection sampling:
              // 0 <= v < 9007199254740992
              // Probability that v >= 9e15, is
              // 7199254740992 / 9007199254740992 ~= 0.0008, i.e. 1 in 1251
              if (v >= 9e15) {
                b = crypto.getRandomValues(new Uint32Array(2));
                a[i] = b[0];
                a[i + 1] = b[1];
              } else {

                // 0 <= v <= 8999999999999999
                // 0 <= (v % 1e14) <= 99999999999999
                c.push(v % 1e14);
                i += 2;
              }
            }
            i = k / 2;

          // Node.js supporting crypto.randomBytes.
          } else if (crypto.randomBytes) {

            // buffer
            a = crypto.randomBytes(k *= 7);

            for (; i < k;) {

              // 0x1000000000000 is 2^48, 0x10000000000 is 2^40
              // 0x100000000 is 2^32, 0x1000000 is 2^24
              // 11111 11111111 11111111 11111111 11111111 11111111 11111111
              // 0 <= v < 9007199254740992
              v = ((a[i] & 31) * 0x1000000000000) + (a[i + 1] * 0x10000000000) +
                 (a[i + 2] * 0x100000000) + (a[i + 3] * 0x1000000) +
                 (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];

              if (v >= 9e15) {
                crypto.randomBytes(7).copy(a, i);
              } else {

                // 0 <= (v % 1e14) <= 99999999999999
                c.push(v % 1e14);
                i += 7;
              }
            }
            i = k / 7;
          } else {
            CRYPTO = false;
            throw Error
             (bignumberError + 'crypto unavailable');
          }
        }

        // Use Math.random.
        if (!CRYPTO) {

          for (; i < k;) {
            v = random53bitInt();
            if (v < 9e15) c[i++] = v % 1e14;
          }
        }

        k = c[--i];
        dp %= LOG_BASE;

        // Convert trailing digits to zeros according to dp.
        if (k && dp) {
          v = POWS_TEN[LOG_BASE - dp];
          c[i] = mathfloor(k / v) * v;
        }

        // Remove trailing elements which are zero.
        for (; c[i] === 0; c.pop(), i--);

        // Zero?
        if (i < 0) {
          c = [e = 0];
        } else {

          // Remove leading elements which are zero and adjust exponent accordingly.
          for (e = -1 ; c[0] === 0; c.splice(0, 1), e -= LOG_BASE);

          // Count the digits of the first element of c to determine leading zeros, and...
          for (i = 1, v = c[0]; v >= 10; v /= 10, i++);

          // adjust the exponent accordingly.
          if (i < LOG_BASE) e -= LOG_BASE - i;
        }

        rand.e = e;
        rand.c = c;
        return rand;
      };
    })();


    // PRIVATE FUNCTIONS


    // Called by BigNumber and BigNumber.prototype.toString.
    convertBase = (function () {
      var decimal = '0123456789';

      /*
       * Convert string of baseIn to an array of numbers of baseOut.
       * Eg. toBaseOut('255', 10, 16) returns [15, 15].
       * Eg. toBaseOut('ff', 16, 10) returns [2, 5, 5].
       */
      function toBaseOut(str, baseIn, baseOut, alphabet) {
        var j,
          arr = [0],
          arrL,
          i = 0,
          len = str.length;

        for (; i < len;) {
          for (arrL = arr.length; arrL--; arr[arrL] *= baseIn);

          arr[0] += alphabet.indexOf(str.charAt(i++));

          for (j = 0; j < arr.length; j++) {

            if (arr[j] > baseOut - 1) {
              if (arr[j + 1] == null) arr[j + 1] = 0;
              arr[j + 1] += arr[j] / baseOut | 0;
              arr[j] %= baseOut;
            }
          }
        }

        return arr.reverse();
      }

      // Convert a numeric string of baseIn to a numeric string of baseOut.
      // If the caller is toString, we are converting from base 10 to baseOut.
      // If the caller is BigNumber, we are converting from baseIn to base 10.
      return function (str, baseIn, baseOut, sign, callerIsToString) {
        var alphabet, d, e, k, r, x, xc, y,
          i = str.indexOf('.'),
          dp = DECIMAL_PLACES,
          rm = ROUNDING_MODE;

        // Non-integer.
        if (i >= 0) {
          k = POW_PRECISION;

          // Unlimited precision.
          POW_PRECISION = 0;
          str = str.replace('.', '');
          y = new BigNumber(baseIn);
          x = y.pow(str.length - i);
          POW_PRECISION = k;

          // Convert str as if an integer, then restore the fraction part by dividing the
          // result by its base raised to a power.

          y.c = toBaseOut(toFixedPoint(coeffToString(x.c), x.e, '0'),
           10, baseOut, decimal);
          y.e = y.c.length;
        }

        // Convert the number as integer.

        xc = toBaseOut(str, baseIn, baseOut, callerIsToString
         ? (alphabet = ALPHABET, decimal)
         : (alphabet = decimal, ALPHABET));

        // xc now represents str as an integer and converted to baseOut. e is the exponent.
        e = k = xc.length;

        // Remove trailing zeros.
        for (; xc[--k] == 0; xc.pop());

        // Zero?
        if (!xc[0]) return alphabet.charAt(0);

        // Does str represent an integer? If so, no need for the division.
        if (i < 0) {
          --e;
        } else {
          x.c = xc;
          x.e = e;

          // The sign is needed for correct rounding.
          x.s = sign;
          x = div(x, y, dp, rm, baseOut);
          xc = x.c;
          r = x.r;
          e = x.e;
        }

        // xc now represents str converted to baseOut.

        // THe index of the rounding digit.
        d = e + dp + 1;

        // The rounding digit: the digit to the right of the digit that may be rounded up.
        i = xc[d];

        // Look at the rounding digits and mode to determine whether to round up.

        k = baseOut / 2;
        r = r || d < 0 || xc[d + 1] != null;

        r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
              : i > k || i == k &&(rm == 4 || r || rm == 6 && xc[d - 1] & 1 ||
               rm == (x.s < 0 ? 8 : 7));

        // If the index of the rounding digit is not greater than zero, or xc represents
        // zero, then the result of the base conversion is zero or, if rounding up, a value
        // such as 0.00001.
        if (d < 1 || !xc[0]) {

          // 1^-dp or 0
          str = r ? toFixedPoint(alphabet.charAt(1), -dp, alphabet.charAt(0))
              : alphabet.charAt(0);
        } else {

          // Truncate xc to the required number of decimal places.
          xc.length = d;

          // Round up?
          if (r) {

            // Rounding up may mean the previous digit has to be rounded up and so on.
            for (--baseOut; ++xc[--d] > baseOut;) {
              xc[d] = 0;

              if (!d) {
                ++e;
                xc = [1].concat(xc);
              }
            }
          }

          // Determine trailing zeros.
          for (k = xc.length; !xc[--k];);

          // E.g. [4, 11, 15] becomes 4bf.
          for (i = 0, str = ''; i <= k; str += alphabet.charAt(xc[i++]));

          // Add leading zeros, decimal point and trailing zeros as required.
          str = toFixedPoint(str, e, alphabet.charAt(0));
        }

        // The caller will add the sign.
        return str;
      };
    })();


    // Perform division in the specified base. Called by div and convertBase.
    div = (function () {

      // Assume non-zero x and k.
      function multiply(x, k, base) {
        var m, temp, xlo, xhi,
          carry = 0,
          i = x.length,
          klo = k % SQRT_BASE,
          khi = k / SQRT_BASE | 0;

        for (x = x.slice(); i--;) {
          xlo = x[i] % SQRT_BASE;
          xhi = x[i] / SQRT_BASE | 0;
          m = khi * xlo + xhi * klo;
          temp = klo * xlo + ((m % SQRT_BASE) * SQRT_BASE) + carry;
          carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
          x[i] = temp % base;
        }

        if (carry) x = [carry].concat(x);

        return x;
      }

      function compare(a, b, aL, bL) {
        var i, cmp;

        if (aL != bL) {
          cmp = aL > bL ? 1 : -1;
        } else {

          for (i = cmp = 0; i < aL; i++) {

            if (a[i] != b[i]) {
              cmp = a[i] > b[i] ? 1 : -1;
              break;
            }
          }
        }

        return cmp;
      }

      function subtract(a, b, aL, base) {
        var i = 0;

        // Subtract b from a.
        for (; aL--;) {
          a[aL] -= i;
          i = a[aL] < b[aL] ? 1 : 0;
          a[aL] = i * base + a[aL] - b[aL];
        }

        // Remove leading zeros.
        for (; !a[0] && a.length > 1; a.splice(0, 1));
      }

      // x: dividend, y: divisor.
      return function (x, y, dp, rm, base) {
        var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0,
          yL, yz,
          s = x.s == y.s ? 1 : -1,
          xc = x.c,
          yc = y.c;

        // Either NaN, Infinity or 0?
        if (!xc || !xc[0] || !yc || !yc[0]) {

          return new BigNumber(

           // Return NaN if either NaN, or both Infinity or 0.
           !x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN :

            // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
            xc && xc[0] == 0 || !yc ? s * 0 : s / 0
         );
        }

        q = new BigNumber(s);
        qc = q.c = [];
        e = x.e - y.e;
        s = dp + e + 1;

        if (!base) {
          base = BASE;
          e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
          s = s / LOG_BASE | 0;
        }

        // Result exponent may be one less then the current value of e.
        // The coefficients of the BigNumbers from convertBase may have trailing zeros.
        for (i = 0; yc[i] == (xc[i] || 0); i++);

        if (yc[i] > (xc[i] || 0)) e--;

        if (s < 0) {
          qc.push(1);
          more = true;
        } else {
          xL = xc.length;
          yL = yc.length;
          i = 0;
          s += 2;

          // Normalise xc and yc so highest order digit of yc is >= base / 2.

          n = mathfloor(base / (yc[0] + 1));

          // Not necessary, but to handle odd bases where yc[0] == (base / 2) - 1.
          // if (n > 1 || n++ == 1 && yc[0] < base / 2) {
          if (n > 1) {
            yc = multiply(yc, n, base);
            xc = multiply(xc, n, base);
            yL = yc.length;
            xL = xc.length;
          }

          xi = yL;
          rem = xc.slice(0, yL);
          remL = rem.length;

          // Add zeros to make remainder as long as divisor.
          for (; remL < yL; rem[remL++] = 0);
          yz = yc.slice();
          yz = [0].concat(yz);
          yc0 = yc[0];
          if (yc[1] >= base / 2) yc0++;
          // Not necessary, but to prevent trial digit n > base, when using base 3.
          // else if (base == 3 && yc0 == 1) yc0 = 1 + 1e-15;

          do {
            n = 0;

            // Compare divisor and remainder.
            cmp = compare(yc, rem, yL, remL);

            // If divisor < remainder.
            if (cmp < 0) {

              // Calculate trial digit, n.

              rem0 = rem[0];
              if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);

              // n is how many times the divisor goes into the current remainder.
              n = mathfloor(rem0 / yc0);

              //  Algorithm:
              //  product = divisor multiplied by trial digit (n).
              //  Compare product and remainder.
              //  If product is greater than remainder:
              //    Subtract divisor from product, decrement trial digit.
              //  Subtract product from remainder.
              //  If product was less than remainder at the last compare:
              //    Compare new remainder and divisor.
              //    If remainder is greater than divisor:
              //      Subtract divisor from remainder, increment trial digit.

              if (n > 1) {

                // n may be > base only when base is 3.
                if (n >= base) n = base - 1;

                // product = divisor * trial digit.
                prod = multiply(yc, n, base);
                prodL = prod.length;
                remL = rem.length;

                // Compare product and remainder.
                // If product > remainder then trial digit n too high.
                // n is 1 too high about 5% of the time, and is not known to have
                // ever been more than 1 too high.
                while (compare(prod, rem, prodL, remL) == 1) {
                  n--;

                  // Subtract divisor from product.
                  subtract(prod, yL < prodL ? yz : yc, prodL, base);
                  prodL = prod.length;
                  cmp = 1;
                }
              } else {

                // n is 0 or 1, cmp is -1.
                // If n is 0, there is no need to compare yc and rem again below,
                // so change cmp to 1 to avoid it.
                // If n is 1, leave cmp as -1, so yc and rem are compared again.
                if (n == 0) {

                  // divisor < remainder, so n must be at least 1.
                  cmp = n = 1;
                }

                // product = divisor
                prod = yc.slice();
                prodL = prod.length;
              }

              if (prodL < remL) prod = [0].concat(prod);

              // Subtract product from remainder.
              subtract(rem, prod, remL, base);
              remL = rem.length;

               // If product was < remainder.
              if (cmp == -1) {

                // Compare divisor and new remainder.
                // If divisor < new remainder, subtract divisor from remainder.
                // Trial digit n too low.
                // n is 1 too low about 5% of the time, and very rarely 2 too low.
                while (compare(yc, rem, yL, remL) < 1) {
                  n++;

                  // Subtract divisor from remainder.
                  subtract(rem, yL < remL ? yz : yc, remL, base);
                  remL = rem.length;
                }
              }
            } else if (cmp === 0) {
              n++;
              rem = [0];
            } // else cmp === 1 and n will be 0

            // Add the next digit, n, to the result array.
            qc[i++] = n;

            // Update the remainder.
            if (rem[0]) {
              rem[remL++] = xc[xi] || 0;
            } else {
              rem = [xc[xi]];
              remL = 1;
            }
          } while ((xi++ < xL || rem[0] != null) && s--);

          more = rem[0] != null;

          // Leading zero?
          if (!qc[0]) qc.splice(0, 1);
        }

        if (base == BASE) {

          // To calculate q.e, first get the number of digits of qc[0].
          for (i = 1, s = qc[0]; s >= 10; s /= 10, i++);

          round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more);

        // Caller is convertBase.
        } else {
          q.e = e;
          q.r = +more;
        }

        return q;
      };
    })();


    /*
     * Return a string representing the value of BigNumber n in fixed-point or exponential
     * notation rounded to the specified decimal places or significant digits.
     *
     * n: a BigNumber.
     * i: the index of the last digit required (i.e. the digit that may be rounded up).
     * rm: the rounding mode.
     * id: 1 (toExponential) or 2 (toPrecision).
     */
    function format(n, i, rm, id) {
      var c0, e, ne, len, str;

      if (rm == null) rm = ROUNDING_MODE;
      else intCheck(rm, 0, 8);

      if (!n.c) return n.toString();

      c0 = n.c[0];
      ne = n.e;

      if (i == null) {
        str = coeffToString(n.c);
        str = id == 1 || id == 2 && ne <= TO_EXP_NEG
         ? toExponential(str, ne)
         : toFixedPoint(str, ne, '0');
      } else {
        n = round(new BigNumber(n), i, rm);

        // n.e may have changed if the value was rounded up.
        e = n.e;

        str = coeffToString(n.c);
        len = str.length;

        // toPrecision returns exponential notation if the number of significant digits
        // specified is less than the number of digits necessary to represent the integer
        // part of the value in fixed-point notation.

        // Exponential notation.
        if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {

          // Append zeros?
          for (; len < i; str += '0', len++);
          str = toExponential(str, e);

        // Fixed-point notation.
        } else {
          i -= ne;
          str = toFixedPoint(str, e, '0');

          // Append zeros?
          if (e + 1 > len) {
            if (--i > 0) for (str += '.'; i--; str += '0');
          } else {
            i += e - len;
            if (i > 0) {
              if (e + 1 == len) str += '.';
              for (; i--; str += '0');
            }
          }
        }
      }

      return n.s < 0 && c0 ? '-' + str : str;
    }


    // Handle BigNumber.max and BigNumber.min.
    function maxOrMin(args, method) {
      var m, n,
        i = 0;

      if (isArray(args[0])) args = args[0];
      m = new BigNumber(args[0]);

      for (; ++i < args.length;) {
        n = new BigNumber(args[i]);

        // If any number is NaN, return NaN.
        if (!n.s) {
          m = n;
          break;
        } else if (method.call(m, n)) {
          m = n;
        }
      }

      return m;
    }


    /*
     * Strip trailing zeros, calculate base 10 exponent and check against MIN_EXP and MAX_EXP.
     * Called by minus, plus and times.
     */
    function normalise(n, c, e) {
      var i = 1,
        j = c.length;

       // Remove trailing zeros.
      for (; !c[--j]; c.pop());

      // Calculate the base 10 exponent. First get the number of digits of c[0].
      for (j = c[0]; j >= 10; j /= 10, i++);

      // Overflow?
      if ((e = i + e * LOG_BASE - 1) > MAX_EXP) {

        // Infinity.
        n.c = n.e = null;

      // Underflow?
      } else if (e < MIN_EXP) {

        // Zero.
        n.c = [n.e = 0];
      } else {
        n.e = e;
        n.c = c;
      }

      return n;
    }


    // Handle values that fail the validity test in BigNumber.
    parseNumeric = (function () {
      var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i,
        dotAfter = /^([^.]+)\.$/,
        dotBefore = /^\.([^.]+)$/,
        isInfinityOrNaN = /^-?(Infinity|NaN)$/,
        whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;

      return function (x, str, isNum, b) {
        var base,
          s = isNum ? str : str.replace(whitespaceOrPlus, '');

        // No exception on ±Infinity or NaN.
        if (isInfinityOrNaN.test(s)) {
          x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
          x.c = x.e = null;
        } else {
          if (!isNum) {

            // basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i
            s = s.replace(basePrefix, function (m, p1, p2) {
              base = (p2 = p2.toLowerCase()) == 'x' ? 16 : p2 == 'b' ? 2 : 8;
              return !b || b == base ? p1 : m;
            });

            if (b) {
              base = b;

              // E.g. '1.' to '1', '.1' to '0.1'
              s = s.replace(dotAfter, '$1').replace(dotBefore, '0.$1');
            }

            if (str != s) return new BigNumber(s, base);
          }

          // '[BigNumber Error] Not a number: {n}'
          // '[BigNumber Error] Not a base {b} number: {n}'
          if (BigNumber.DEBUG) {
            throw Error
              (bignumberError + 'Not a' + (b ? ' base ' + b : '') + ' number: ' + str);
          }

          // NaN
          x.c = x.e = x.s = null;
        }
      }
    })();


    /*
     * Round x to sd significant digits using rounding mode rm. Check for over/under-flow.
     * If r is truthy, it is known that there are more digits after the rounding digit.
     */
    function round(x, sd, rm, r) {
      var d, i, j, k, n, ni, rd,
        xc = x.c,
        pows10 = POWS_TEN;

      // if x is not Infinity or NaN...
      if (xc) {

        // rd is the rounding digit, i.e. the digit after the digit that may be rounded up.
        // n is a base 1e14 number, the value of the element of array x.c containing rd.
        // ni is the index of n within x.c.
        // d is the number of digits of n.
        // i is the index of rd within n including leading zeros.
        // j is the actual index of rd within n (if < 0, rd is a leading zero).
        out: {

          // Get the number of digits of the first element of xc.
          for (d = 1, k = xc[0]; k >= 10; k /= 10, d++);
          i = sd - d;

          // If the rounding digit is in the first element of xc...
          if (i < 0) {
            i += LOG_BASE;
            j = sd;
            n = xc[ni = 0];

            // Get the rounding digit at index j of n.
            rd = n / pows10[d - j - 1] % 10 | 0;
          } else {
            ni = mathceil((i + 1) / LOG_BASE);

            if (ni >= xc.length) {

              if (r) {

                // Needed by sqrt.
                for (; xc.length <= ni; xc.push(0));
                n = rd = 0;
                d = 1;
                i %= LOG_BASE;
                j = i - LOG_BASE + 1;
              } else {
                break out;
              }
            } else {
              n = k = xc[ni];

              // Get the number of digits of n.
              for (d = 1; k >= 10; k /= 10, d++);

              // Get the index of rd within n.
              i %= LOG_BASE;

              // Get the index of rd within n, adjusted for leading zeros.
              // The number of leading zeros of n is given by LOG_BASE - d.
              j = i - LOG_BASE + d;

              // Get the rounding digit at index j of n.
              rd = j < 0 ? 0 : n / pows10[d - j - 1] % 10 | 0;
            }
          }

          r = r || sd < 0 ||

          // Are there any non-zero digits after the rounding digit?
          // The expression  n % pows10[d - j - 1]  returns all digits of n to the right
          // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
           xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);

          r = rm < 4
           ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
           : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 &&

            // Check whether the digit to the left of the rounding digit is odd.
            ((i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10) & 1 ||
             rm == (x.s < 0 ? 8 : 7));

          if (sd < 1 || !xc[0]) {
            xc.length = 0;

            if (r) {

              // Convert sd to decimal places.
              sd -= x.e + 1;

              // 1, 0.1, 0.01, 0.001, 0.0001 etc.
              xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
              x.e = -sd || 0;
            } else {

              // Zero.
              xc[0] = x.e = 0;
            }

            return x;
          }

          // Remove excess digits.
          if (i == 0) {
            xc.length = ni;
            k = 1;
            ni--;
          } else {
            xc.length = ni + 1;
            k = pows10[LOG_BASE - i];

            // E.g. 56700 becomes 56000 if 7 is the rounding digit.
            // j > 0 means i > number of leading zeros of n.
            xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
          }

          // Round up?
          if (r) {

            for (; ;) {

              // If the digit to be rounded up is in the first element of xc...
              if (ni == 0) {

                // i will be the length of xc[0] before k is added.
                for (i = 1, j = xc[0]; j >= 10; j /= 10, i++);
                j = xc[0] += k;
                for (k = 1; j >= 10; j /= 10, k++);

                // if i != k the length has increased.
                if (i != k) {
                  x.e++;
                  if (xc[0] == BASE) xc[0] = 1;
                }

                break;
              } else {
                xc[ni] += k;
                if (xc[ni] != BASE) break;
                xc[ni--] = 0;
                k = 1;
              }
            }
          }

          // Remove trailing zeros.
          for (i = xc.length; xc[--i] === 0; xc.pop());
        }

        // Overflow? Infinity.
        if (x.e > MAX_EXP) {
          x.c = x.e = null;

        // Underflow? Zero.
        } else if (x.e < MIN_EXP) {
          x.c = [x.e = 0];
        }
      }

      return x;
    }


    // PROTOTYPE/INSTANCE METHODS


    /*
     * Return a new BigNumber whose value is the absolute value of this BigNumber.
     */
    P.absoluteValue = P.abs = function () {
      var x = new BigNumber(this);
      if (x.s < 0) x.s = 1;
      return x;
    };


    /*
     * Return
     *   1 if the value of this BigNumber is greater than the value of BigNumber(y, b),
     *   -1 if the value of this BigNumber is less than the value of BigNumber(y, b),
     *   0 if they have the same value,
     *   or null if the value of either is NaN.
     */
    P.comparedTo = function (y, b) {
      return compare(this, new BigNumber(y, b));
    };


    /*
     * If dp is undefined or null or true or false, return the number of decimal places of the
     * value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
     *
     * Otherwise, if dp is a number, return a new BigNumber whose value is the value of this
     * BigNumber rounded to a maximum of dp decimal places using rounding mode rm, or
     * ROUNDING_MODE if rm is omitted.
     *
     * [dp] {number} Decimal places: integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     */
    P.decimalPlaces = P.dp = function (dp, rm) {
      var c, n, v,
        x = this;

      if (dp != null) {
        intCheck(dp, 0, MAX);
        if (rm == null) rm = ROUNDING_MODE;
        else intCheck(rm, 0, 8);

        return round(new BigNumber(x), dp + x.e + 1, rm);
      }

      if (!(c = x.c)) return null;
      n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;

      // Subtract the number of trailing zeros of the last number.
      if (v = c[v]) for (; v % 10 == 0; v /= 10, n--);
      if (n < 0) n = 0;

      return n;
    };


    /*
     *  n / 0 = I
     *  n / N = N
     *  n / I = 0
     *  0 / n = 0
     *  0 / 0 = N
     *  0 / N = N
     *  0 / I = 0
     *  N / n = N
     *  N / 0 = N
     *  N / N = N
     *  N / I = N
     *  I / n = I
     *  I / 0 = I
     *  I / N = N
     *  I / I = N
     *
     * Return a new BigNumber whose value is the value of this BigNumber divided by the value of
     * BigNumber(y, b), rounded according to DECIMAL_PLACES and ROUNDING_MODE.
     */
    P.dividedBy = P.div = function (y, b) {
      return div(this, new BigNumber(y, b), DECIMAL_PLACES, ROUNDING_MODE);
    };


    /*
     * Return a new BigNumber whose value is the integer part of dividing the value of this
     * BigNumber by the value of BigNumber(y, b).
     */
    P.dividedToIntegerBy = P.idiv = function (y, b) {
      return div(this, new BigNumber(y, b), 0, 1);
    };


    /*
     * Return a BigNumber whose value is the value of this BigNumber exponentiated by n.
     *
     * If m is present, return the result modulo m.
     * If n is negative round according to DECIMAL_PLACES and ROUNDING_MODE.
     * If POW_PRECISION is non-zero and m is not present, round to POW_PRECISION using ROUNDING_MODE.
     *
     * The modular power operation works efficiently when x, n, and m are integers, otherwise it
     * is equivalent to calculating x.exponentiatedBy(n).modulo(m) with a POW_PRECISION of 0.
     *
     * n {number|string|BigNumber} The exponent. An integer.
     * [m] {number|string|BigNumber} The modulus.
     *
     * '[BigNumber Error] Exponent not an integer: {n}'
     */
    P.exponentiatedBy = P.pow = function (n, m) {
      var half, isModExp, k, more, nIsBig, nIsNeg, nIsOdd, y,
        x = this;

      n = new BigNumber(n);

      // Allow NaN and ±Infinity, but not other non-integers.
      if (n.c && !n.isInteger()) {
        throw Error
          (bignumberError + 'Exponent not an integer: ' + n);
      }

      if (m != null) m = new BigNumber(m);

      // Exponent of MAX_SAFE_INTEGER is 15.
      nIsBig = n.e > 14;

      // If x is NaN, ±Infinity, ±0 or ±1, or n is ±Infinity, NaN or ±0.
      if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {

        // The sign of the result of pow when x is negative depends on the evenness of n.
        // If +n overflows to ±Infinity, the evenness of n would be not be known.
        y = new BigNumber(Math.pow(+x.valueOf(), nIsBig ? 2 - isOdd(n) : +n));
        return m ? y.mod(m) : y;
      }

      nIsNeg = n.s < 0;

      if (m) {

        // x % m returns NaN if abs(m) is zero, or m is NaN.
        if (m.c ? !m.c[0] : !m.s) return new BigNumber(NaN);

        isModExp = !nIsNeg && x.isInteger() && m.isInteger();

        if (isModExp) x = x.mod(m);

      // Overflow to ±Infinity: >=2**1e10 or >=1.0000024**1e15.
      // Underflow to ±0: <=0.79**1e10 or <=0.9999975**1e15.
      } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0
        // [1, 240000000]
        ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7
        // [80000000000000]  [99999750000000]
        : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {

        // If x is negative and n is odd, k = -0, else k = 0.
        k = x.s < 0 && isOdd(n) ? -0 : 0;

        // If x >= 1, k = ±Infinity.
        if (x.e > -1) k = 1 / k;

        // If n is negative return ±0, else return ±Infinity.
        return new BigNumber(nIsNeg ? 1 / k : k);

      } else if (POW_PRECISION) {

        // Truncating each coefficient array to a length of k after each multiplication
        // equates to truncating significant digits to POW_PRECISION + [28, 41],
        // i.e. there will be a minimum of 28 guard digits retained.
        k = mathceil(POW_PRECISION / LOG_BASE + 2);
      }

      if (nIsBig) {
        half = new BigNumber(0.5);
        nIsOdd = isOdd(n);
      } else {
        nIsOdd = n % 2;
      }

      if (nIsNeg) n.s = 1;

      y = new BigNumber(ONE);

      // Performs 54 loop iterations for n of 9007199254740991.
      for (; ;) {

        if (nIsOdd) {
          y = y.times(x);
          if (!y.c) break;

          if (k) {
            if (y.c.length > k) y.c.length = k;
          } else if (isModExp) {
            y = y.mod(m);    //y = y.minus(div(y, m, 0, MODULO_MODE).times(m));
          }
        }

        if (nIsBig) {
          n = n.times(half);
          round(n, n.e + 1, 1);
          if (!n.c[0]) break;
          nIsBig = n.e > 14;
          nIsOdd = isOdd(n);
        } else {
          n = mathfloor(n / 2);
          if (!n) break;
          nIsOdd = n % 2;
        }

        x = x.times(x);

        if (k) {
          if (x.c && x.c.length > k) x.c.length = k;
        } else if (isModExp) {
          x = x.mod(m);    //x = x.minus(div(x, m, 0, MODULO_MODE).times(m));
        }
      }

      if (isModExp) return y;
      if (nIsNeg) y = ONE.div(y);

      return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber rounded to an integer
     * using rounding mode rm, or ROUNDING_MODE if rm is omitted.
     *
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {rm}'
     */
    P.integerValue = function (rm) {
      var n = new BigNumber(this);
      if (rm == null) rm = ROUNDING_MODE;
      else intCheck(rm, 0, 8);
      return round(n, n.e + 1, rm);
    };


    /*
     * Return true if the value of this BigNumber is equal to the value of BigNumber(y, b),
     * otherwise return false.
     */
    P.isEqualTo = P.eq = function (y, b) {
      return compare(this, new BigNumber(y, b)) === 0;
    };


    /*
     * Return true if the value of this BigNumber is a finite number, otherwise return false.
     */
    P.isFinite = function () {
      return !!this.c;
    };


    /*
     * Return true if the value of this BigNumber is greater than the value of BigNumber(y, b),
     * otherwise return false.
     */
    P.isGreaterThan = P.gt = function (y, b) {
      return compare(this, new BigNumber(y, b)) > 0;
    };


    /*
     * Return true if the value of this BigNumber is greater than or equal to the value of
     * BigNumber(y, b), otherwise return false.
     */
    P.isGreaterThanOrEqualTo = P.gte = function (y, b) {
      return (b = compare(this, new BigNumber(y, b))) === 1 || b === 0;

    };


    /*
     * Return true if the value of this BigNumber is an integer, otherwise return false.
     */
    P.isInteger = function () {
      return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
    };


    /*
     * Return true if the value of this BigNumber is less than the value of BigNumber(y, b),
     * otherwise return false.
     */
    P.isLessThan = P.lt = function (y, b) {
      return compare(this, new BigNumber(y, b)) < 0;
    };


    /*
     * Return true if the value of this BigNumber is less than or equal to the value of
     * BigNumber(y, b), otherwise return false.
     */
    P.isLessThanOrEqualTo = P.lte = function (y, b) {
      return (b = compare(this, new BigNumber(y, b))) === -1 || b === 0;
    };


    /*
     * Return true if the value of this BigNumber is NaN, otherwise return false.
     */
    P.isNaN = function () {
      return !this.s;
    };


    /*
     * Return true if the value of this BigNumber is negative, otherwise return false.
     */
    P.isNegative = function () {
      return this.s < 0;
    };


    /*
     * Return true if the value of this BigNumber is positive, otherwise return false.
     */
    P.isPositive = function () {
      return this.s > 0;
    };


    /*
     * Return true if the value of this BigNumber is 0 or -0, otherwise return false.
     */
    P.isZero = function () {
      return !!this.c && this.c[0] == 0;
    };


    /*
     *  n - 0 = n
     *  n - N = N
     *  n - I = -I
     *  0 - n = -n
     *  0 - 0 = 0
     *  0 - N = N
     *  0 - I = -I
     *  N - n = N
     *  N - 0 = N
     *  N - N = N
     *  N - I = N
     *  I - n = I
     *  I - 0 = I
     *  I - N = N
     *  I - I = N
     *
     * Return a new BigNumber whose value is the value of this BigNumber minus the value of
     * BigNumber(y, b).
     */
    P.minus = function (y, b) {
      var i, j, t, xLTy,
        x = this,
        a = x.s;

      y = new BigNumber(y, b);
      b = y.s;

      // Either NaN?
      if (!a || !b) return new BigNumber(NaN);

      // Signs differ?
      if (a != b) {
        y.s = -b;
        return x.plus(y);
      }

      var xe = x.e / LOG_BASE,
        ye = y.e / LOG_BASE,
        xc = x.c,
        yc = y.c;

      if (!xe || !ye) {

        // Either Infinity?
        if (!xc || !yc) return xc ? (y.s = -b, y) : new BigNumber(yc ? x : NaN);

        // Either zero?
        if (!xc[0] || !yc[0]) {

          // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
          return yc[0] ? (y.s = -b, y) : new BigNumber(xc[0] ? x :

           // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
           ROUNDING_MODE == 3 ? -0 : 0);
        }
      }

      xe = bitFloor(xe);
      ye = bitFloor(ye);
      xc = xc.slice();

      // Determine which is the bigger number.
      if (a = xe - ye) {

        if (xLTy = a < 0) {
          a = -a;
          t = xc;
        } else {
          ye = xe;
          t = yc;
        }

        t.reverse();

        // Prepend zeros to equalise exponents.
        for (b = a; b--; t.push(0));
        t.reverse();
      } else {

        // Exponents equal. Check digit by digit.
        j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;

        for (a = b = 0; b < j; b++) {

          if (xc[b] != yc[b]) {
            xLTy = xc[b] < yc[b];
            break;
          }
        }
      }

      // x < y? Point xc to the array of the bigger number.
      if (xLTy) t = xc, xc = yc, yc = t, y.s = -y.s;

      b = (j = yc.length) - (i = xc.length);

      // Append zeros to xc if shorter.
      // No need to add zeros to yc if shorter as subtract only needs to start at yc.length.
      if (b > 0) for (; b--; xc[i++] = 0);
      b = BASE - 1;

      // Subtract yc from xc.
      for (; j > a;) {

        if (xc[--j] < yc[j]) {
          for (i = j; i && !xc[--i]; xc[i] = b);
          --xc[i];
          xc[j] += BASE;
        }

        xc[j] -= yc[j];
      }

      // Remove leading zeros and adjust exponent accordingly.
      for (; xc[0] == 0; xc.splice(0, 1), --ye);

      // Zero?
      if (!xc[0]) {

        // Following IEEE 754 (2008) 6.3,
        // n - n = +0  but  n - n = -0  when rounding towards -Infinity.
        y.s = ROUNDING_MODE == 3 ? -1 : 1;
        y.c = [y.e = 0];
        return y;
      }

      // No need to check for Infinity as +x - +y != Infinity && -x - -y != Infinity
      // for finite x and y.
      return normalise(y, xc, ye);
    };


    /*
     *   n % 0 =  N
     *   n % N =  N
     *   n % I =  n
     *   0 % n =  0
     *  -0 % n = -0
     *   0 % 0 =  N
     *   0 % N =  N
     *   0 % I =  0
     *   N % n =  N
     *   N % 0 =  N
     *   N % N =  N
     *   N % I =  N
     *   I % n =  N
     *   I % 0 =  N
     *   I % N =  N
     *   I % I =  N
     *
     * Return a new BigNumber whose value is the value of this BigNumber modulo the value of
     * BigNumber(y, b). The result depends on the value of MODULO_MODE.
     */
    P.modulo = P.mod = function (y, b) {
      var q, s,
        x = this;

      y = new BigNumber(y, b);

      // Return NaN if x is Infinity or NaN, or y is NaN or zero.
      if (!x.c || !y.s || y.c && !y.c[0]) {
        return new BigNumber(NaN);

      // Return x if y is Infinity or x is zero.
      } else if (!y.c || x.c && !x.c[0]) {
        return new BigNumber(x);
      }

      if (MODULO_MODE == 9) {

        // Euclidian division: q = sign(y) * floor(x / abs(y))
        // r = x - qy    where  0 <= r < abs(y)
        s = y.s;
        y.s = 1;
        q = div(x, y, 0, 3);
        y.s = s;
        q.s *= s;
      } else {
        q = div(x, y, 0, MODULO_MODE);
      }

      y = x.minus(q.times(y));

      // To match JavaScript %, ensure sign of zero is sign of dividend.
      if (!y.c[0] && MODULO_MODE == 1) y.s = x.s;

      return y;
    };


    /*
     *  n * 0 = 0
     *  n * N = N
     *  n * I = I
     *  0 * n = 0
     *  0 * 0 = 0
     *  0 * N = N
     *  0 * I = N
     *  N * n = N
     *  N * 0 = N
     *  N * N = N
     *  N * I = N
     *  I * n = I
     *  I * 0 = N
     *  I * N = N
     *  I * I = I
     *
     * Return a new BigNumber whose value is the value of this BigNumber multiplied by the value
     * of BigNumber(y, b).
     */
    P.multipliedBy = P.times = function (y, b) {
      var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc,
        base, sqrtBase,
        x = this,
        xc = x.c,
        yc = (y = new BigNumber(y, b)).c;

      // Either NaN, ±Infinity or ±0?
      if (!xc || !yc || !xc[0] || !yc[0]) {

        // Return NaN if either is NaN, or one is 0 and the other is Infinity.
        if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
          y.c = y.e = y.s = null;
        } else {
          y.s *= x.s;

          // Return ±Infinity if either is ±Infinity.
          if (!xc || !yc) {
            y.c = y.e = null;

          // Return ±0 if either is ±0.
          } else {
            y.c = [0];
            y.e = 0;
          }
        }

        return y;
      }

      e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
      y.s *= x.s;
      xcL = xc.length;
      ycL = yc.length;

      // Ensure xc points to longer array and xcL to its length.
      if (xcL < ycL) zc = xc, xc = yc, yc = zc, i = xcL, xcL = ycL, ycL = i;

      // Initialise the result array with zeros.
      for (i = xcL + ycL, zc = []; i--; zc.push(0));

      base = BASE;
      sqrtBase = SQRT_BASE;

      for (i = ycL; --i >= 0;) {
        c = 0;
        ylo = yc[i] % sqrtBase;
        yhi = yc[i] / sqrtBase | 0;

        for (k = xcL, j = i + k; j > i;) {
          xlo = xc[--k] % sqrtBase;
          xhi = xc[k] / sqrtBase | 0;
          m = yhi * xlo + xhi * ylo;
          xlo = ylo * xlo + ((m % sqrtBase) * sqrtBase) + zc[j] + c;
          c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
          zc[j--] = xlo % base;
        }

        zc[j] = c;
      }

      if (c) {
        ++e;
      } else {
        zc.splice(0, 1);
      }

      return normalise(y, zc, e);
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber negated,
     * i.e. multiplied by -1.
     */
    P.negated = function () {
      var x = new BigNumber(this);
      x.s = -x.s || null;
      return x;
    };


    /*
     *  n + 0 = n
     *  n + N = N
     *  n + I = I
     *  0 + n = n
     *  0 + 0 = 0
     *  0 + N = N
     *  0 + I = I
     *  N + n = N
     *  N + 0 = N
     *  N + N = N
     *  N + I = N
     *  I + n = I
     *  I + 0 = I
     *  I + N = N
     *  I + I = I
     *
     * Return a new BigNumber whose value is the value of this BigNumber plus the value of
     * BigNumber(y, b).
     */
    P.plus = function (y, b) {
      var t,
        x = this,
        a = x.s;

      y = new BigNumber(y, b);
      b = y.s;

      // Either NaN?
      if (!a || !b) return new BigNumber(NaN);

      // Signs differ?
       if (a != b) {
        y.s = -b;
        return x.minus(y);
      }

      var xe = x.e / LOG_BASE,
        ye = y.e / LOG_BASE,
        xc = x.c,
        yc = y.c;

      if (!xe || !ye) {

        // Return ±Infinity if either ±Infinity.
        if (!xc || !yc) return new BigNumber(a / 0);

        // Either zero?
        // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
        if (!xc[0] || !yc[0]) return yc[0] ? y : new BigNumber(xc[0] ? x : a * 0);
      }

      xe = bitFloor(xe);
      ye = bitFloor(ye);
      xc = xc.slice();

      // Prepend zeros to equalise exponents. Faster to use reverse then do unshifts.
      if (a = xe - ye) {
        if (a > 0) {
          ye = xe;
          t = yc;
        } else {
          a = -a;
          t = xc;
        }

        t.reverse();
        for (; a--; t.push(0));
        t.reverse();
      }

      a = xc.length;
      b = yc.length;

      // Point xc to the longer array, and b to the shorter length.
      if (a - b < 0) t = yc, yc = xc, xc = t, b = a;

      // Only start adding at yc.length - 1 as the further digits of xc can be ignored.
      for (a = 0; b;) {
        a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
        xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
      }

      if (a) {
        xc = [a].concat(xc);
        ++ye;
      }

      // No need to check for zero, as +x + +y != 0 && -x + -y != 0
      // ye = MAX_EXP + 1 possible
      return normalise(y, xc, ye);
    };


    /*
     * If sd is undefined or null or true or false, return the number of significant digits of
     * the value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
     * If sd is true include integer-part trailing zeros in the count.
     *
     * Otherwise, if sd is a number, return a new BigNumber whose value is the value of this
     * BigNumber rounded to a maximum of sd significant digits using rounding mode rm, or
     * ROUNDING_MODE if rm is omitted.
     *
     * sd {number|boolean} number: significant digits: integer, 1 to MAX inclusive.
     *                     boolean: whether to count integer-part trailing zeros: true or false.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
     */
    P.precision = P.sd = function (sd, rm) {
      var c, n, v,
        x = this;

      if (sd != null && sd !== !!sd) {
        intCheck(sd, 1, MAX);
        if (rm == null) rm = ROUNDING_MODE;
        else intCheck(rm, 0, 8);

        return round(new BigNumber(x), sd, rm);
      }

      if (!(c = x.c)) return null;
      v = c.length - 1;
      n = v * LOG_BASE + 1;

      if (v = c[v]) {

        // Subtract the number of trailing zeros of the last element.
        for (; v % 10 == 0; v /= 10, n--);

        // Add the number of digits of the first element.
        for (v = c[0]; v >= 10; v /= 10, n++);
      }

      if (sd && x.e + 1 > n) n = x.e + 1;

      return n;
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber shifted by k places
     * (powers of 10). Shift to the right if n > 0, and to the left if n < 0.
     *
     * k {number} Integer, -MAX_SAFE_INTEGER to MAX_SAFE_INTEGER inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {k}'
     */
    P.shiftedBy = function (k) {
      intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
      return this.times('1e' + k);
    };


    /*
     *  sqrt(-n) =  N
     *  sqrt(N) =  N
     *  sqrt(-I) =  N
     *  sqrt(I) =  I
     *  sqrt(0) =  0
     *  sqrt(-0) = -0
     *
     * Return a new BigNumber whose value is the square root of the value of this BigNumber,
     * rounded according to DECIMAL_PLACES and ROUNDING_MODE.
     */
    P.squareRoot = P.sqrt = function () {
      var m, n, r, rep, t,
        x = this,
        c = x.c,
        s = x.s,
        e = x.e,
        dp = DECIMAL_PLACES + 4,
        half = new BigNumber('0.5');

      // Negative/NaN/Infinity/zero?
      if (s !== 1 || !c || !c[0]) {
        return new BigNumber(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0);
      }

      // Initial estimate.
      s = Math.sqrt(+x);

      // Math.sqrt underflow/overflow?
      // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
      if (s == 0 || s == 1 / 0) {
        n = coeffToString(c);
        if ((n.length + e) % 2 == 0) n += '0';
        s = Math.sqrt(n);
        e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);

        if (s == 1 / 0) {
          n = '1e' + e;
        } else {
          n = s.toExponential();
          n = n.slice(0, n.indexOf('e') + 1) + e;
        }

        r = new BigNumber(n);
      } else {
        r = new BigNumber(s + '');
      }

      // Check for zero.
      // r could be zero if MIN_EXP is changed after the this value was created.
      // This would cause a division by zero (x/t) and hence Infinity below, which would cause
      // coeffToString to throw.
      if (r.c[0]) {
        e = r.e;
        s = e + dp;
        if (s < 3) s = 0;

        // Newton-Raphson iteration.
        for (; ;) {
          t = r;
          r = half.times(t.plus(div(x, t, dp, 1)));

          if (coeffToString(t.c  ).slice(0, s) === (n =
             coeffToString(r.c)).slice(0, s)) {

            // The exponent of r may here be one less than the final result exponent,
            // e.g 0.0009999 (e-4) --> 0.001 (e-3), so adjust s so the rounding digits
            // are indexed correctly.
            if (r.e < e) --s;
            n = n.slice(s - 3, s + 1);

            // The 4th rounding digit may be in error by -1 so if the 4 rounding digits
            // are 9999 or 4999 (i.e. approaching a rounding boundary) continue the
            // iteration.
            if (n == '9999' || !rep && n == '4999') {

              // On the first iteration only, check to see if rounding up gives the
              // exact result as the nines may infinitely repeat.
              if (!rep) {
                round(t, t.e + DECIMAL_PLACES + 2, 0);

                if (t.times(t).eq(x)) {
                  r = t;
                  break;
                }
              }

              dp += 4;
              s += 4;
              rep = 1;
            } else {

              // If rounding digits are null, 0{0,4} or 50{0,3}, check for exact
              // result. If not, then there are further digits and m will be truthy.
              if (!+n || !+n.slice(1) && n.charAt(0) == '5') {

                // Truncate to the first rounding digit.
                round(r, r.e + DECIMAL_PLACES + 2, 1);
                m = !r.times(r).eq(x);
              }

              break;
            }
          }
        }
      }

      return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
    };


    /*
     * Return a string representing the value of this BigNumber in exponential notation and
     * rounded using ROUNDING_MODE to dp fixed decimal places.
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     */
    P.toExponential = function (dp, rm) {
      if (dp != null) {
        intCheck(dp, 0, MAX);
        dp++;
      }
      return format(this, dp, rm, 1);
    };


    /*
     * Return a string representing the value of this BigNumber in fixed-point notation rounding
     * to dp fixed decimal places using rounding mode rm, or ROUNDING_MODE if rm is omitted.
     *
     * Note: as with JavaScript's number type, (-0).toFixed(0) is '0',
     * but e.g. (-0.00001).toFixed(0) is '-0'.
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     */
    P.toFixed = function (dp, rm) {
      if (dp != null) {
        intCheck(dp, 0, MAX);
        dp = dp + this.e + 1;
      }
      return format(this, dp, rm);
    };


    /*
     * Return a string representing the value of this BigNumber in fixed-point notation rounded
     * using rm or ROUNDING_MODE to dp decimal places, and formatted according to the properties
     * of the FORMAT object (see BigNumber.set).
     *
     * FORMAT = {
     *      decimalSeparator : '.',
     *      groupSeparator : ',',
     *      groupSize : 3,
     *      secondaryGroupSize : 0,
     *      fractionGroupSeparator : '\xA0',    // non-breaking space
     *      fractionGroupSize : 0
     * };
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     */
    P.toFormat = function (dp, rm) {
      var str = this.toFixed(dp, rm);

      if (this.c) {
        var i,
          arr = str.split('.'),
          g1 = +FORMAT.groupSize,
          g2 = +FORMAT.secondaryGroupSize,
          groupSeparator = FORMAT.groupSeparator,
          intPart = arr[0],
          fractionPart = arr[1],
          isNeg = this.s < 0,
          intDigits = isNeg ? intPart.slice(1) : intPart,
          len = intDigits.length;

        if (g2) i = g1, g1 = g2, g2 = i, len -= i;

        if (g1 > 0 && len > 0) {
          i = len % g1 || g1;
          intPart = intDigits.substr(0, i);

          for (; i < len; i += g1) {
            intPart += groupSeparator + intDigits.substr(i, g1);
          }

          if (g2 > 0) intPart += groupSeparator + intDigits.slice(i);
          if (isNeg) intPart = '-' + intPart;
        }

        str = fractionPart
         ? intPart + FORMAT.decimalSeparator + ((g2 = +FORMAT.fractionGroupSize)
          ? fractionPart.replace(new RegExp('\\d{' + g2 + '}\\B', 'g'),
           '$&' + FORMAT.fractionGroupSeparator)
          : fractionPart)
         : intPart;
      }

      return str;
    };


    /*
     * Return a string array representing the value of this BigNumber as a simple fraction with
     * an integer numerator and an integer denominator. The denominator will be a positive
     * non-zero value less than or equal to the specified maximum denominator. If a maximum
     * denominator is not specified, the denominator will be the lowest value necessary to
     * represent the number exactly.
     *
     * [md] {number|string|BigNumber} Integer >= 1, or Infinity. The maximum denominator.
     *
     * '[BigNumber Error] Argument {not an integer|out of range} : {md}'
     */
    P.toFraction = function (md) {
      var arr, d, d0, d1, d2, e, exp, n, n0, n1, q, s,
        x = this,
        xc = x.c;

      if (md != null) {
        n = new BigNumber(md);

        // Throw if md is less than one or is not an integer, unless it is Infinity.
        if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
          throw Error
            (bignumberError + 'Argument ' +
              (n.isInteger() ? 'out of range: ' : 'not an integer: ') + md);
        }
      }

      if (!xc) return x.toString();

      d = new BigNumber(ONE);
      n1 = d0 = new BigNumber(ONE);
      d1 = n0 = new BigNumber(ONE);
      s = coeffToString(xc);

      // Determine initial denominator.
      // d is a power of 10 and the minimum max denominator that specifies the value exactly.
      e = d.e = s.length - x.e - 1;
      d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
      md = !md || n.comparedTo(d) > 0 ? (e > 0 ? d : n1) : n;

      exp = MAX_EXP;
      MAX_EXP = 1 / 0;
      n = new BigNumber(s);

      // n0 = d1 = 0
      n0.c[0] = 0;

      for (; ;)  {
        q = div(n, d, 0, 1);
        d2 = d0.plus(q.times(d1));
        if (d2.comparedTo(md) == 1) break;
        d0 = d1;
        d1 = d2;
        n1 = n0.plus(q.times(d2 = n1));
        n0 = d2;
        d = n.minus(q.times(d2 = d));
        n = d2;
      }

      d2 = div(md.minus(d0), d1, 0, 1);
      n0 = n0.plus(d2.times(n1));
      d0 = d0.plus(d2.times(d1));
      n0.s = n1.s = x.s;
      e *= 2;

      // Determine which fraction is closer to x, n0/d0 or n1/d1
      arr = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(
         div(n0, d0, e, ROUNDING_MODE).minus(x).abs()) < 1
          ? [n1.toString(), d1.toString()]
          : [n0.toString(), d0.toString()];

      MAX_EXP = exp;
      return arr;
    };


    /*
     * Return the value of this BigNumber converted to a number primitive.
     */
    P.toNumber = function () {
      return +this;
    };


    /*
     * Return a string representing the value of this BigNumber rounded to sd significant digits
     * using rounding mode rm or ROUNDING_MODE. If sd is less than the number of digits
     * necessary to represent the integer part of the value in fixed-point notation, then use
     * exponential notation.
     *
     * [sd] {number} Significant digits. Integer, 1 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
     */
    P.toPrecision = function (sd, rm) {
      if (sd != null) intCheck(sd, 1, MAX);
      return format(this, sd, rm, 2);
    };


    /*
     * Return a string representing the value of this BigNumber in base b, or base 10 if b is
     * omitted. If a base is specified, including base 10, round according to DECIMAL_PLACES and
     * ROUNDING_MODE. If a base is not specified, and this BigNumber has a positive exponent
     * that is equal to or greater than TO_EXP_POS, or a negative exponent equal to or less than
     * TO_EXP_NEG, return exponential notation.
     *
     * [b] {number} Integer, 2 to ALPHABET.length inclusive.
     *
     * '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
     */
    P.toString = function (b) {
      var str,
        n = this,
        s = n.s,
        e = n.e;

      // Infinity or NaN?
      if (e === null) {

        if (s) {
          str = 'Infinity';
          if (s < 0) str = '-' + str;
        } else {
          str = 'NaN';
        }
      } else {
        str = coeffToString(n.c);

        if (b == null) {
          str = e <= TO_EXP_NEG || e >= TO_EXP_POS
           ? toExponential(str, e)
           : toFixedPoint(str, e, '0');
        } else {
          intCheck(b, 2, ALPHABET.length, 'Base');
          str = convertBase(toFixedPoint(str, e, '0'), 10, b, s, true);
        }

        if (s < 0 && n.c[0]) str = '-' + str;
      }

      return str;
    };


    /*
     * Return as toString, but do not accept a base argument, and include the minus sign for
     * negative zero.
     */
    P.valueOf = P.toJSON = function () {
      var str,
        n = this,
        e = n.e;

      if (e === null) return n.toString();

      str = coeffToString(n.c);

      str = e <= TO_EXP_NEG || e >= TO_EXP_POS
        ? toExponential(str, e)
        : toFixedPoint(str, e, '0');

      return n.s < 0 ? '-' + str : str;
    };


    P._isBigNumber = true;

    if (configObject != null) BigNumber.set(configObject);

    return BigNumber;
  }


  // PRIVATE HELPER FUNCTIONS


  function bitFloor(n) {
    var i = n | 0;
    return n > 0 || n === i ? i : i - 1;
  }


  // Return a coefficient array as a string of base 10 digits.
  function coeffToString(a) {
    var s, z,
      i = 1,
      j = a.length,
      r = a[0] + '';

    for (; i < j;) {
      s = a[i++] + '';
      z = LOG_BASE - s.length;
      for (; z--; s = '0' + s);
      r += s;
    }

    // Determine trailing zeros.
    for (j = r.length; r.charCodeAt(--j) === 48;);
    return r.slice(0, j + 1 || 1);
  }


  // Compare the value of BigNumbers x and y.
  function compare(x, y) {
    var a, b,
      xc = x.c,
      yc = y.c,
      i = x.s,
      j = y.s,
      k = x.e,
      l = y.e;

    // Either NaN?
    if (!i || !j) return null;

    a = xc && !xc[0];
    b = yc && !yc[0];

    // Either zero?
    if (a || b) return a ? b ? 0 : -j : i;

    // Signs differ?
    if (i != j) return i;

    a = i < 0;
    b = k == l;

    // Either Infinity?
    if (!xc || !yc) return b ? 0 : !xc ^ a ? 1 : -1;

    // Compare exponents.
    if (!b) return k > l ^ a ? 1 : -1;

    j = (k = xc.length) < (l = yc.length) ? k : l;

    // Compare digit by digit.
    for (i = 0; i < j; i++) if (xc[i] != yc[i]) return xc[i] > yc[i] ^ a ? 1 : -1;

    // Compare lengths.
    return k == l ? 0 : k > l ^ a ? 1 : -1;
  }


  /*
   * Check that n is a primitive number, an integer, and in range, otherwise throw.
   */
  function intCheck(n, min, max, name) {
    if (n < min || n > max || n !== (n < 0 ? mathceil(n) : mathfloor(n))) {
      throw Error
       (bignumberError + (name || 'Argument') + (typeof n == 'number'
         ? n < min || n > max ? ' out of range: ' : ' not an integer: '
         : ' not a primitive number: ') + n);
    }
  }


  function isArray(obj) {
    return Object.prototype.toString.call(obj) == '[object Array]';
  }


  // Assumes finite n.
  function isOdd(n) {
    var k = n.c.length - 1;
    return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
  }


  function toExponential(str, e) {
    return (str.length > 1 ? str.charAt(0) + '.' + str.slice(1) : str) +
     (e < 0 ? 'e' : 'e+') + e;
  }


  function toFixedPoint(str, e, z) {
    var len, zs;

    // Negative exponent?
    if (e < 0) {

      // Prepend zeros.
      for (zs = z + '.'; ++e; zs += z);
      str = zs + str;

    // Positive exponent
    } else {
      len = str.length;

      // Append zeros.
      if (++e > len) {
        for (zs = z, e -= len; --e; zs += z);
        str += zs;
      } else if (e < len) {
        str = str.slice(0, e) + '.' + str.slice(e);
      }
    }

    return str;
  }


  // EXPORT


  BigNumber = clone();
  BigNumber['default'] = BigNumber.BigNumber = BigNumber;

  // AMD.
  if (typeof define == 'function' && define.amd) {
    define('bignumber',[],function () { return BigNumber; });

  // Node.js and other environments that support module.exports.
  } else if (typeof module != 'undefined' && module.exports) {
    module.exports = BigNumber;

  // Browser.
  } else {
    if (!globalObject) {
      globalObject = typeof self != 'undefined' && self ? self : window;
    }

    globalObject.BigNumber = BigNumber;
  }
})(this);

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Deposit
define(
	'Deposit.Model'
,	[
		'Transaction.Model'
	,	'bignumber'
	,	'Utils'
	]
,	function (
		TransactionModel
	,	BigNumber
	,	Utils
	)
{
	'use strict';

	//@class Deposit.Model
	return TransactionModel.extend({

		name: 'Deposit'

	,	getInvoices: function ()
		{
			var invoicesTotal = 0;

			this.result.invoices = [];

			for (var i = 1; i <= this.record.getLineItemCount('apply'); i++)
			{
				var invoice = {
						line: i
					,	invoice_id: this.record.getLineItemValue('apply', 'id2', i)
					,	deposit_id: this.record.getLineItemValue('apply', 'id', i)

					,	type: this.record.getLineItemValue('apply', 'type', i)
					,	total: Utils.toCurrency(this.record.getLineItemValue('apply', 'total', i))
					,	total_formatted: Utils.formatCurrency(this.record.getLineItemValue('apply', 'total', i), this.currencySymbol)

					,	invoicedate: this.record.getLineItemValue('apply', 'applydate', i)
					,	depositdate: this.record.getLineItemValue('apply', 'depositdate', i)

					,	currency: this.record.getLineItemValue('apply', 'currency', i)
					,	amount: Utils.toCurrency(this.record.getLineItemValue('apply', 'amount', i))
					,	amount_formatted: Utils.formatCurrency(this.record.getLineItemValue('apply', 'amount', i), this.currencySymbol)
					,	due: Utils.toCurrency(this.record.getLineItemValue('apply', 'due', i))
					,	due_formatted: Utils.formatCurrency(this.record.getLineItemValue('apply', 'due', i), this.currencySymbol)
					,	refnum: this.record.getLineItemValue('apply', 'refnum', i)
				};

				invoicesTotal += invoice.amount;

				this.result.invoices.push(invoice);
			}

			this.result.paid = Utils.toCurrency(invoicesTotal);
			this.result.paid_formatted = Utils.formatCurrency(invoicesTotal, this.currencySymbol);
			this.result.remaining = new BigNumber(this.result.payment).minus(this.result.paid).toNumber();
			this.result.remaining_formatted = Utils.formatCurrency(this.result.remaining, this.currencySymbol);
		}

	,	getPaymentMethod: function getPaymentMethod ()
		{
			var paymentmethod = {
				type: this.record.getFieldValue('paymethtype')
			,	primary: true
			};

			if (paymentmethod.type === 'creditcard')
			{
				paymentmethod.creditcard = {
					ccnumber: this.record.getFieldValue('ccnumber')
				,	ccexpiredate: this.record.getFieldValue('ccexpiredate')
				,	ccname: this.record.getFieldValue('ccname')
				,	paymentmethod: {
						ispaypal: 'F'
					,	name: this.record.getFieldText('paymentmethod')
					,	creditcard: 'T'
					,	internalid: this.record.getFieldValue('paymentmethod')
					}
				};
			}

			if (this.record.getFieldValue('ccstreet'))
			{
				paymentmethod.ccstreet = this.record.getFieldValue('ccstreet');
			}

			if (this.record.getFieldValue('cczipcode'))
			{
				paymentmethod.cczipcode = this.record.getFieldValue('cczipcode');
			}

			if (this.record.getFieldValue('terms'))
			{
				paymentmethod.type = 'invoice';

				paymentmethod.purchasenumber = this.record.getFieldValue('otherrefnum');

				paymentmethod.paymentterms = {
					internalid: this.record.getFieldValue('terms')
				,	name: this.record.getFieldText('terms')
				};
			}

			this.result.paymentmethods = [paymentmethod];
		}

	,	getExtraRecordFields: function ()
		{
			if (this.result && this.result.selected_currency) 
			{
				this.currencySymbol = this.result.selected_currency.symbol;
			}

			this.result.payment = Utils.toCurrency(this.record.getFieldValue('payment'));
			this.result.payment_formatted = Utils.formatCurrency(this.record.getFieldValue('payment'), this.currencySymbol);

			this.getInvoices();
			this.getPaymentMethod();
		}
	});
});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Deposit.ServiceController.js
// ----------------
// Service to manage deposit requests
define(
	'Deposit.ServiceController'
,	[
		'ServiceController'
	,	'Deposit.Model'
	]
,	function(
		ServiceController
	,	DepositModel
	)
	{
		'use strict';

		// @class Deposit.ServiceController Manage deposit requests
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'Deposit.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: {
				common: {
					requireLogin: true
				}
			}

			// @method get The call to Deposit.Service.ss with http method 'get' is managed by this function
			// @return {Deposit.Model}
		,	get: function()
			{
				var id = this.request.getParameter('internalid');
				return DepositModel.get('customerdeposit', id);
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Deposit.Model.js
// ----------------
//
define(
	'DepositApplication.Model'
,	['Transaction.Model', 'Utils']
,	function (TransactionModel, Utils)
{
	'use strict';

	return TransactionModel.extend({

		name: 'DepositApplication'

	,	getInvoices: function ()
		{
			this.result.invoices = [];

			for (var i = 1; i <= this.record.getLineItemCount('apply'); i++)
			{
				var invoice = {
						line: i
					,	internalid: this.record.getLineItemValue('apply', 'internalid', i)
					,	type: this.record.getLineItemValue('apply', 'type', i)
					,	total: Utils.toCurrency(this.record.getLineItemValue('apply', 'total', i))
					,	total_formatted: Utils.formatCurrency(this.record.getLineItemValue('apply', 'total', i))
					,	apply: this.record.getLineItemValue('apply', 'apply', i) === 'T'
					,	applydate: this.record.getLineItemValue('apply', 'applydate', i)
					,	currency: this.record.getLineItemValue('apply', 'currency', i)
					,	amount: Utils.toCurrency(this.record.getLineItemValue('apply', 'amount', i))
					,	amount_formatted: Utils.formatCurrency(this.record.getLineItemValue('apply', 'amount', i))
					,	due: Utils.toCurrency(this.record.getLineItemValue('apply', 'due', i))
					,	due_formatted: Utils.formatCurrency(this.record.getLineItemValue('apply', 'due', i))
					,	refnum: this.record.getLineItemValue('apply', 'refnum', i)
				};

				this.result.invoices.push(invoice);
			}
		}

	,	getExtraRecordFields: function ()
		{
			this.result.deposit =
			{
				internalid: this.record.getFieldValue('deposit')
			,	name: this.record.getFieldText('deposit')
			};

			this.result.depositdate = this.record.getFieldValue('depositdate');
			this.getInvoices();
		}
	});
});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// DepositApplication.ServiceController.js
// ----------------
// Service to manage credit cards requests
define(
	'DepositApplication.ServiceController'
,	[
		'ServiceController'
	,	'DepositApplication.Model'
	]
,	function(
		ServiceController
	,	DepositApplicationModel
	)
	{
		'use strict';

		// @class DepositApplication.ServiceController Supports login process
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'DepositApplication.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: {
				common: {
					requireLogin: true
				}
			}

			// @method get The call to DepositApplication.Service.ss with http method 'get' is managed by this function
			// @return {DepositApplication.Model}
		,	get: function()
			{
				var id = this.request.getParameter('internalid');
				return DepositApplicationModel.get('depositapplication', id);
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// GoogleTagManager.Model.js
// jshint laxcomma:true
// ----------------
// Handles creating, fetching and updating Product Lists
define(
	'GoogleTagManager.Model'
,	[
		'SC.Model'
	,	'Application'
	,	'underscore'
	]
,	function(
		SCModel
	,	Application
	,	_
	)
{
	'use strict';

	return SCModel.extend({
		name: 'GoogleTagManager'

		// Returns a product list based on a given userId and id
	,	save: function (id, events)
		{
			if(!id) return;

			var filters = [new nlobjSearchFilter('custrecord_ns_gtm_gid', null, 'is', id)]
			,	columns = {
					internalid: new nlobjSearchColumn('internalid')
				,	gid: new nlobjSearchColumn('custrecord_ns_gtm_gid')
				,	events: new nlobjSearchColumn('custrecord_ns_gtm_events')
			}
			,	gtm_datalayer = this.search(filters, columns);

			if (!gtm_datalayer) return this.create(id, events);

			var current_events = gtm_datalayer.getFieldValue('custrecord_ns_gtm_events');

            try{
            	current_events = current_events.length ? JSON.parse( current_events ) : [];
            }
            catch(e)
            {
               console.error('ERROR GTM parsing '+id);
            }

            var extended_events = current_events.concat(events || []);

			gtm_datalayer.setFieldValue('custrecord_ns_gtm_events',  JSON.stringify(extended_events));

			return {
					internalid: nlapiSubmitRecord(gtm_datalayer)
				,	gtm_gid: gtm_datalayer.getFieldValue('custrecord_ns_gtm_gid')
				,	events: extended_events
			};

		}

	,	search: function(filters, columns)
		{
			// Makes the request and format the response
			var gtm_datalayer = Application.getAllSearchResults('customrecord_ns_gtm_datalayer', filters, _.values(columns));

			if(gtm_datalayer && gtm_datalayer[0])
			{
				return nlapiLoadRecord('customrecord_ns_gtm_datalayer',gtm_datalayer[0].getId());
			}


		}

		// Creates a new GTM dataLayer record
	,	create: function (id, events)
		{
			var gtm_datalayer = nlapiCreateRecord('customrecord_ns_gtm_datalayer');

			gtm_datalayer.setFieldValue('custrecord_ns_gtm_gid', id);

			gtm_datalayer.setFieldValue('custrecord_ns_gtm_events', JSON.stringify(events || []));

			return {
					internalid: nlapiSubmitRecord(gtm_datalayer)
				,	gtm_gid: gtm_datalayer.getFieldValue('custrecord_ns_gtm_gid')
				,	events: events || []
			};
		}
	});
});

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// GoogleTagManager.ServiceController.js
// jshint laxcomma: true
// ----------------
// Service to manage credit cards requests
define(
	'GoogleTagManager.ServiceController'
,	[
		'ServiceController'
	,	'GoogleTagManager.Model'
	,	'Utils'
	,	'Configuration'
	,	'SC.Models.Init'
	]
,	function(
		ServiceController
	,	GoogleTagManagerModel
	,	Utils
	,	Configuration
	,	ModelsInit
	)
	{
		'use strict';

		function save()
		{

			var id = this.data.id;
			var events = this.data.events || [];

			if(Configuration.get().tracking.googleTagManager.isMultiDomain) {

				if(Utils.recordTypeExists('customrecord_ns_gtm_datalayer') && Utils.recordTypeHasField('customrecord_ns_gtm_datalayer', 'custrecord_ns_gtm_gid') && Utils.recordTypeHasField('customrecord_ns_gtm_datalayer', 'custrecord_ns_gtm_events')) {
					return GoogleTagManagerModel.save(id, events);
				} else {
					nlapiLogExecution('DEBUG', '[Only for multi-domain sites] Please check if the customrecord_ns_gtm_datalayer\'s custom record and its required fields has been created.-');
					return {
							internalid: 1
						,	gtm_gid: 1
						,	events:  []
				};
				}

			} else {

				var ctx = ModelsInit.context;
				var session_obj = ctx.getSessionObject('gtmDataLayer');
				var dataLayerSession;

				if(!session_obj)
				{
					dataLayerSession = {internalid:1, gtm_id:id, events:events};
				}
				else{
					dataLayerSession = JSON.parse(session_obj);
					dataLayerSession.events = (dataLayerSession.events || []).concat(events);
				}

				ctx.setSessionObject('gtmDataLayer', JSON.stringify(dataLayerSession));

				return dataLayerSession;
			}
		}

		// @class GoogleTagManager.ServiceController  Manage product list request
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'GoogleTagManager.ServiceController'

			// @method get The call to GoogleTagManager.Service.ss with http method 'get' is managed by this function
			// @return {GoogleTagManager.Model.Get.Result}
		,	post: save
		,	put: save

		,	getDataLayer: function(request,response)
			{
				var googletagmanager_cookie = request.getParameter('_ga') || '';
                if(googletagmanager_cookie)
                {
                    googletagmanager_cookie = (googletagmanager_cookie.split('.').slice(2,4).join('.')).split('-')[0];
                }
                else
                {
                    googletagmanager_cookie = request.getHeader('cookie');
                    if(googletagmanager_cookie && googletagmanager_cookie.match(/.*?_gid=.*?\.(\d+\.\d+);.*/))
                    {
                        googletagmanager_cookie = googletagmanager_cookie.replace(/.*?_gid=.*?\.(\d+\.\d+);.*/,'$1');
                    }
                    else
                    {
                        googletagmanager_cookie = '';
                    }
                }

                if(googletagmanager_cookie)
                {
                    this.response = response;
                    this.request = request;
                    this.data = {id: googletagmanager_cookie};
                    return this.post();
                }
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// LiveOrder.GiftCertificate.ServiceController.js
// ----------------
// Service to manage gift certificates in the live order
define(
	'LiveOrder.GiftCertificate.ServiceController'
,	[
		'ServiceController'
	,	'LiveOrder.Model'
	]
,	function(
		ServiceController
	,	LiveOrderModel
	)
	{
		'use strict';

		// @class LiveOrder.GiftCertificate.ServiceController Manage gift certificates in the live order
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'LiveOrder.GiftCertificate.ServiceController'

			// @method post The call to LiveOrder.GiftCertificate.Service.ss with http method 'post' is managed by this function
			// @return {LiveOrder.Model.Data || EmptyObject} Returns the live order or an empty object
		,	post: function()
			{
				LiveOrderModel.setGiftCertificates(this.data.giftcertificates);
				return LiveOrderModel.get() || {};
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// LiveOrder.Line.ServiceController.js
// ----------------
// Service to manage lines in the live order
define(
	'LiveOrder.Line.ServiceController'
,	[
		'ServiceController'
	,	'SC.Models.Init'
	,	'LiveOrder.Model'
	,	'underscore'
	]
,	function(
		ServiceController
	,	ModelsInit
	,	LiveOrderModel
	,	_
	)
	{
		'use strict';

		// @class LiveOrder.Line.ServiceController Manage lines in the live order
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'LiveOrder.Line.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: {
				common: {
					checkLoggedInCheckout : true
				}
			}

			// @method post The call to LiveOrder.Line.Service.ss with http method 'post' is managed by this function
			// @return {LiveOrder.Model.Data || Object} Returns a LiveOrder object or an empty object
		,	post: function()
			{
				LiveOrderModel.addLines(_.isArray(this.data) ? this.data : [this.data]);
				return LiveOrderModel.get() || {};
			}

			// @method put The call to LiveOrder.Line.Service.ss with http method 'put' is managed by this function
			// @return {LiveOrder.Model.Data || Object} Returns a LiveOrder object or an empty object
		,	put: function()
			{
				var id = this.request.getParameter('internalid');

				// Pass the data to the Cart's update method and send it response
				if (this.data.options && this.data.options.void)
				{
					LiveOrderModel.voidLine(id);
				}
				else if (this.data.options && this.data.options['return'])
				{
					LiveOrderModel.returnLine(id);
				}
				else
				{
					LiveOrderModel.updateLine(id, this.data);
				}
				return LiveOrderModel.get() || {};
			}

			// @method delete The call to LiveOrder.Line.Service.ss with http method 'delete' is managed by this function
			// @return {LiveOrder.Model.Data || Object} Returns a LiveOrder object or an empty object
		,	delete: function()
			{
				var id = this.request.getParameter('internalid');
				LiveOrderModel.removeLine(id);
				return LiveOrderModel.get() || {};
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// LiveOrder.ServiceController.js
// ----------------
// Service to manage cart items requests
define(
	'LiveOrder.ServiceController'
,	[
		'ServiceController'
	,	'LiveOrder.Model'
	,	'SiteSettings.Model'
	,	'SC.Models.Init'
	]
,	function(
		ServiceController
	,	LiveOrderModel
	,	SiteSettings
	,	ModelsInit
	)
	{
		'use strict';

		// @class LiveOrder.ServiceController Manage cart items requests
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'LiveOrder.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: {
				put: {
					checkLoggedInCheckout : true
				}
			,	post: {
					checkLoggedInCheckout : true
				}
			}

			// @method get The call to LiveOrder.Service.ss with http method 'get' is managed by this function
			// @return {LiveOrder.Model.Data}
		,	get: function()
			{
				this.setShopperCurrency();

				return LiveOrderModel.get();
			}

			// @method post The call to LiveOrder.Service.ss with http method 'post' is managed by this function
			// @return {LiveOrder.Model.Data}
		,	post: function()
			{
				this.setShopperCurrency();

				// Updates the order with the passed in data
				LiveOrderModel.update(this.data);

				// Submit the order
				var confirmation = LiveOrderModel.submit()
				// Get the new order
				,	order_info = LiveOrderModel.get();

				// Set the confirmation
				order_info.confirmation = confirmation;

				// Update touchpoints after submit order
				order_info.touchpoints = SiteSettings.getTouchPoints();

				return order_info;
			}

			// @method put The call to LiveOrder.Service.ss with http method 'put' is managed by this function
			// @return {LiveOrder.Model.Data}
		,	put: function()
			{
				this.setShopperCurrency();

				LiveOrderModel.update(this.data);
				return LiveOrderModel.get();
			}

			// @method setShopperCurrency
			// @return {Void}
		,	setShopperCurrency: function()
			{
				var currency = this.request.getParameter('cur');
				if (currency)
					ModelsInit.session.setShopperCurrency(currency);
			}
		});
	}
);

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Transaction
define(
	'Transaction.Model.Extensions'
,	[
		'Application'
	,	'Utils'

	,	'underscore'
	]
,	function (
		Application
	,	Utils

	,	_
	)
{
	'use strict';

	//@class Transaction.Model.Extensions
	return {

		getAdjustments: function (options)
		{
			options = options || {};

			var applied_to_transaction = options.appliedToTransaction || [this.result.internalid]
			,	types = options.types || ['CustCred', 'DepAppl', 'CustPymt']
			,	ids = []
			,	adjustments = {}
			,	amount_field = this.isMultiCurrency ? 'appliedtoforeignamount' : 'appliedtolinkamount'
			,	filters = [
					new nlobjSearchFilter('appliedtotransaction', null, 'anyof', applied_to_transaction )
				,	new nlobjSearchFilter(amount_field, null, 'isnotempty')
				,	new nlobjSearchFilter('type', null, 'anyof', types)
				]
			,	columns = [
					new nlobjSearchColumn('total')
				,	new nlobjSearchColumn('tranid')
				,	new nlobjSearchColumn('trandate').setSort(true)
				,	new nlobjSearchColumn('type')
				,	new nlobjSearchColumn(amount_field)
				]
			,	search_results = Application.getAllSearchResults('transaction', filters, columns);


			_.each(search_results || [], function (payout)
			{
				var internal_id = payout.getId()
				,	duplicated_adjustment = adjustments[internal_id];

				if (options.paymentMethodInformation)
				{
					ids.push(internal_id);
				}

				if (!duplicated_adjustment)
				{
					adjustments[internal_id] = {
							internalid: internal_id
						,	tranid: payout.getValue('tranid')
						,	recordtype: payout.getRecordType()
						,	amount : Utils.toCurrency(payout.getValue(amount_field))
						,	amount_formatted : Utils.formatCurrency(payout.getValue(amount_field))
						,	trandate: payout.getValue('trandate')
					};
				}
				else
				{
					duplicated_adjustment.amount += Utils.toCurrency(payout.getValue(amount_field));
					duplicated_adjustment.amount_formatted = Utils.formatCurrency(duplicated_adjustment.amount);
				}
			});

			if (options.paymentMethodInformation && ids.length)
			{
				filters = [
						new nlobjSearchFilter('mainline', null, 'is', 'T')
					,	new nlobjSearchFilter('internalid', null, 'anyof', ids)
					,	new nlobjSearchFilter('type', null, 'anyof', types)
				];
				columns = [
						new nlobjSearchColumn('internalid')
					,	new nlobjSearchColumn('type')
					,	new nlobjSearchColumn('ccexpdate')
					,	new nlobjSearchColumn('ccholdername')
					,	new nlobjSearchColumn('ccnumber')
					,	new nlobjSearchColumn('paymentmethod')
					,	new nlobjSearchColumn('tranid')
				];

				search_results = Application.getAllSearchResults('transaction', filters, columns);

				_.each(search_results || [], function (payout)
				{
					var internal_id = payout.getId()
					,	adjustment = adjustments[internal_id]
					,	paymentmethod = {
							name: payout.getText('paymentmethod')
						,	internalid: payout.getValue('tranid')
						}
					,	ccnumber = payout.getValue('ccnumber');

					if (ccnumber)
					{
						paymentmethod.type = 'creditcard';
						//@property {Transaction.Model.Get.PaymentMethod.CreditCard?} creditcard This value is present only if the type is creditcard
						paymentmethod.creditcard =
						//@class Transaction.Model.Get.PaymentMethod.CreditCard
						{
							//@property {String} ccnumber
							ccnumber: ccnumber
							//@property {String} ccexpiredate
						,	ccexpiredate: payout.getValue('ccexpdate')
							//@property {String} ccname
						,	ccname: payout.getValue('ccholdername')
							//@property {Transaction.Model.Get.PaymentMethod.CreditCard.Details} paymentmethod
						,	paymentmethod: {
							//@class Transaction.Model.Get.PaymentMethod.CreditCard.Details
								//@property {String} ispaypal
								ispaypal: 'F'
								//@property {String} name
							,	name: paymentmethod.name
								//@property {String} creditcard Value: 'T'
							,	creditcard: 'T'
								//@property {String} internalid
							,	internalid: payout.getValue('tranid')
							}
						};
					}

					if (adjustment)
					{
						adjustment.paymentmethod = paymentmethod;
					}
				});
			}

			this.result.adjustments =  _.values(adjustments);
			// @class Transaction.Extensions.Model
		}

		//@method getSalesRep Gets the sales representative information into the current transaction
		//@return {Void} This method does not return anything as it works with the value of this.result and this.record
	,	getSalesRep: function ()
		{
			var salesrep_id = this.record.getFieldValue('salesrep')
			,	salesrep_name = this.record.getFieldText('salesrep');

			if (salesrep_id)
			{
				//@class Transaction.Model.Get.Result
				//@property {Transaction.Model.Get.SalesRepresentative}
				this.result.salesrep =
				//@class Transaction.Model.Get.SalesRepresentative
				{
					//@property {String} name
					name: salesrep_name
					//@property {String} internalid
				,	internalid: salesrep_id
				};

				var search_result = nlapiLookupField(
					this.result.recordtype,
					this.result.internalid,
					['salesrep.phone', 'salesrep.email', 'salesrep.entityid', 'salesrep.mobilephone', 'salesrep.fax']
				);

				if (search_result)
				{
					//@property {String?} phone
					this.result.salesrep.phone = search_result['salesrep.phone'];
					//@property {String} email
					this.result.salesrep.email = search_result['salesrep.email'];
					//@property {String} fullname
					this.result.salesrep.fullname = search_result['salesrep.entityid'];
					//@property {String?} mobilephone
					this.result.salesrep.mobilephone = search_result['salesrep.mobilephone'];
					//@property {String} fax
					this.result.salesrep.fax = search_result['salesrep.fax'];
				}
			}
			// @class Transaction.Model.Extensions
		}
	};
});

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Invoice.Model.js
// ----------
// Handles fetching invoices
define(
	'Invoice.Model'
,	[	'Application'
	,	'Utils'
	,	'Transaction.Model'
	,	'Transaction.Model.Extensions'

	,	'underscore'
	]
,	function (
		Application
	,	Utils
	,	TransactionModel
	,	TransactionModelExtensions

	,	_
	)
{
	'use strict';

	return TransactionModel.extend({
	
		name: 'Invoice'

	,	setExtraListColumns: function ()
		{
			if (this.isMultiCurrency)
			{
				this.columns.amount_remaining = new nlobjSearchColumn('formulanumeric').setFormula('{amountremaining} / {exchangerate}');
			}
			else
			{
				this.columns.amount_remaining = new nlobjSearchColumn('amountremaining');
			}

			this.columns.originalamountremaining = new nlobjSearchColumn('amountremaining');
			this.columns.originalamount = new nlobjSearchColumn('amount');
			this.columns.closedate = new nlobjSearchColumn('closedate');
			this.columns.duedate = new nlobjSearchColumn('duedate');
		
			if (this.isCustomColumnsEnabled()) 
			{
				this.setCustomColumns('invoiceOpen');
				this.setCustomColumns('invoicePaid');
		}
		}

	,	setExtraListFilters: function ()
		{
			var status = this.data.status;
			
			if (status)
			{
				var value = null;

				switch (status)
				{
					case 'open':
						value = 'CustInvc:A';
					break;

					case 'paid':
						value = 'CustInvc:B';
					break;
				}

				if (value)
				{
					this.filters.status_operator = 'and';
					this.filters.status = ['status', 'anyof', value];
				}				
			}
		}

		// @method mapListResult Overrides the namesake method of Transaction.Model. It maps the received result with proper information
		// @param {Transaction.Model.List.Result.Record} result Base result to be extended
		// @param {nlobjSearchResult} record Instance of the record returned by NetSuite search
		// @return {Transaction.Model.List.Result.Record}
	,	mapListResult: function (result, record)
		{	
			var due_date = record.getValue('duedate')
			,	close_date = record.getValue('closedate')
			,	transaction_date = record.getValue('trandate')
			,	due_date_millisenconds = !!due_date ? nlapiStringToDate(due_date).getTime() : (new Date()).getTime()
			,	due_in_milliseconds = due_date_millisenconds - this.now
			,	currencySymbol;
			
			if (this.result && this.result.selected_currency) 
			{
				currencySymbol = this.result.selected_currency.symbol;
			}
		
			result.originalamount = record.getValue(this.columns.originalamount);
			result.original_amount_remaining = record.getValue(this.columns.originalamountremaining);

			result.amountremaining = Utils.toCurrency(record.getValue(this.columns.amount_remaining));
			result.amountremaining_formatted = Utils.formatCurrency(record.getValue(this.columns.amount_remaining), currencySymbol);
			
			result.closedate = close_date;

			result.closedateInMilliseconds = close_date ? nlapiStringToDate(close_date).getTime() : 0;
			result.tranDateInMilliseconds = transaction_date ? nlapiStringToDate(transaction_date).getTime() : 0;

			result.duedate = due_date;
			result.dueinmilliseconds = due_in_milliseconds;
			result.isOverdue = due_in_milliseconds <= 0 && ((-1 * due_in_milliseconds) / 1000 / 60 / 60 / 24) >= 1;
			result.isPartiallyPaid = record.getValue('amount') - record.getValue('amountremaining');
			
			if (this.isCustomColumnsEnabled()) 
			{
				this.mapCustomColumns(result, record, 'invoiceOpen');
				this.mapCustomColumns(result, record, 'invoicePaid');
			}
			return result;
		}

	,	getExtraRecordFields: function ()
		{
			this.getAdjustments();
			this.getSalesRep();

			this.result.purchasenumber = this.record.getFieldValue('otherrefnum');
			this.result.dueDate = this.record.getFieldValue('duedate');
			this.result.amountDue = Utils.toCurrency(this.record.getFieldValue('amountremainingtotalbox'));
			
			var currencySymbol;
			if (this.result && this.result.selected_currency) 
			{
				currencySymbol = this.result.selected_currency.symbol;
			} 

			this.result.amountDue_formatted = Utils.formatCurrency(this.record.getFieldValue('amountremainingtotalbox'), currencySymbol)
		}

	,	postGet: function ()
		{
			this.result.lines = _.reject(this.result.lines, function (line)
			{
				return line.quantity === 0;
			});
		}

	,	getStatus: function ()
		{
			this.result.status =
			{
				internalid: nlapiLookupField(this.result.recordtype, this.result.internalid, 'status')
			,	name: nlapiLookupField(this.result.recordtype, this.result.internalid, 'status', true)
			};
		}
	,	getCreatedFrom: function()
		{
			var created_from_internalid = nlapiLookupField(this.result.recordtype, this.result.internalid, 'createdfrom')
			,	recordtype = created_from_internalid ? Utils.getTransactionType(created_from_internalid) : ''
			,	tranid = recordtype ? nlapiLookupField(recordtype, created_from_internalid, 'tranid') : '';

			this.result.createdfrom =
			{
					internalid: created_from_internalid
				,	name: nlapiLookupField(this.result.recordtype, this.result.internalid, 'createdfrom', true) || ''
				,	recordtype: recordtype
				,	tranid: tranid
			};
		}
	,	getAdjustments: TransactionModelExtensions.getAdjustments

	,	getSalesRep: TransactionModelExtensions.getSalesRep
	});

});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/* global stringtodate */
// LivePayment.js
// -------
// Defines the model used by the LivePayment.Service.ss service
define(
	'LivePayment.Model'
,	[
		'SC.Model'
	,	'CustomerPayment.Model'
	,	'Invoice.Model'
	,	'SC.Models.Init'

	,	'Application'
	,	'bignumber'
	,	'Utils'
	,	'underscore'
	]
,	function (
		SCModel
	,	CustomerPayment
	,	InvoiceModel
	,	ModelsInit
	,	Application
	,	BigNumber
	,	Utils
	,	_
	)
{
	'use strict';

	return SCModel.extend({
		name: 'LivePayment'
		//@property {Boolean} paymentInstrumentsEnabled
	,	paymentInstrumentsEnabled: ModelsInit.context.getSetting('FEATURE', 'PAYMENTINSTRUMENTS') === 'T'

	,	create: function (currencyid)
		{
			var customer_payment = nlapiCreateRecord('customerpayment', {recordmode: 'dynamic'});
			customer_payment.setFieldValue('customer', nlapiGetUser());
			customer_payment.setFieldValue('autoapply', 'F');

			if (currencyid)
			{
				customer_payment.setFieldValue('currency', currencyid);
			}

			return customer_payment;
		}

	,	loadRecord: function (internalid)
		{
			return nlapiLoadRecord('customerpayment', internalid, {recordmode: 'dynamic'});
		}

	,	get: function (internalid, currencyid)
		{
			try
			{
				var	selected_currency = Utils.getCurrencyById(currencyid)
				,	customer_payment;

				this.selected_currency_symbol = selected_currency ? selected_currency.symbol : selected_currency;

				if (internalid && internalid !== 'null')
				{
					customer_payment = this.loadRecord(internalid);
				}
				else
				{
					customer_payment = this.create(currencyid);
				}

				return this.createResult(customer_payment);
			}
			catch (e)
			{
				if (e instanceof nlobjError && e.getCode() === 'INSUFFICIENT_PERMISSION')
				{
					return {};
				}
				else
				{
					throw e;
				}
			}
		}

	,	setPaymentMethod: function (customer_payment, result)
		{
			result.paymentmethods = [];

			return Utils.setPaymentMethodToResult(customer_payment, result);
		}

	,	createResult: function (customer_payment)
		{
			var result = {};

			result.internalid = customer_payment.getId();
			result.type =  customer_payment.getRecordType();
			result.tranid = customer_payment.getFieldValue('tranid');
			result.autoapply = customer_payment.getFieldValue('autoapply');
			result.trandate = customer_payment.getFieldValue('trandate');
			result.status = customer_payment.getFieldValue('status');
			result.payment = Utils.toCurrency(customer_payment.getFieldValue('payment'));
			result.payment_formatted = Utils.formatCurrency(customer_payment.getFieldValue('payment'), this.selected_currency_symbol);
			result.lastmodifieddate = customer_payment.getFieldValue('lastmodifieddate');
			result.balance = Utils.toCurrency(customer_payment.getFieldValue('balance'));
			result.balance_formatted = Utils.formatCurrency(customer_payment.getFieldValue('balance'), this.selected_currency_symbol);

			this.setPaymentMethod(customer_payment, result);
			this.setInvoices(customer_payment, result);
			this.setCredits(customer_payment, result);
			this.setDeposits(customer_payment, result);

			return result;
		}

	,	setInvoices: function(customer_payment, result)
		{
			result.invoices = [];

			for (var i = 1; i <= customer_payment.getLineItemCount('apply'); i++)
			{
				result.invoices.push({
						internalid: customer_payment.getLineItemValue('apply', 'internalid', i)
					,	total: Utils.toCurrency(customer_payment.getLineItemValue('apply', 'total', i))
					,	total_formatted: Utils.formatCurrency(customer_payment.getLineItemValue('apply', 'total', i), this.selected_currency_symbol)
					,	apply: customer_payment.getLineItemValue('apply', 'apply', i) === 'T'
					,	applydate: customer_payment.getLineItemValue('apply', 'applydate', i)
					,	currency: customer_payment.getLineItemValue('apply', 'currency', i)
					,	discamt: Utils.toCurrency(customer_payment.getLineItemValue('apply', 'discamt', i))
					,	discamt_formatted: Utils.formatCurrency(customer_payment.getLineItemValue('apply', 'discamt', i), this.selected_currency_symbol)
					,	disc: Utils.toCurrency(customer_payment.getLineItemValue('apply', 'disc', i))
					,	disc_formatted: Utils.formatCurrency(customer_payment.getLineItemValue('apply', 'disc', i), this.selected_currency_symbol)
					,	discdate: customer_payment.getLineItemValue('apply', 'discdate', i)
					,	due: Utils.toCurrency(customer_payment.getLineItemValue('apply', 'due', i))
					,	due_formatted: Utils.formatCurrency(customer_payment.getLineItemValue('apply', 'due', i), this.selected_currency_symbol)
					,	tranid: customer_payment.getLineItemValue('apply', 'refnum', i)
				});
			}

			// We need to extend our invoices with complementary properties
			if (result.invoices.length)
			{
				var invoices_expanded = InvoiceModel.list({
					internalid: _.pluck(result.invoices, 'internalid')
				,	page: 'all'
				});

				//We'll use just the invoices that match those coming from InvoiceModel.list method
				result.invoices = _.filter(result.invoices, function (invoice)
				{
					return _.find(invoices_expanded, {internalid : invoice.internalid});
				}, this);

				_.each(result.invoices, function (invoice)
				{
					var invoice_expanded = _.find(invoices_expanded, {internalid : invoice.internalid});

					invoice.amount = invoice_expanded.amount;
					invoice.amount_formatted = invoice_expanded.amount_formatted;
					invoice.trandate = invoice_expanded.trandate;
					invoice.duedate = invoice_expanded.duedate;
					invoice.dueinmilliseconds = invoice_expanded.dueinmilliseconds;
					invoice.isOverdue = invoice_expanded.isOverdue;

					invoice.discountapplies = (invoice.discdate && stringtodate(invoice.discdate) >= new Date());
					invoice.duewithdiscount = new BigNumber(invoice.due).minus(invoice.discountapplies ? invoice.discamt : 0).toNumber();
					invoice.duewithdiscount_formatted = Utils.formatCurrency(invoice.duewithdiscount, this.selected_currency_symbol);
					invoice.discount =  invoice.discamt && invoice.total ?  new BigNumber(invoice.discamt).div(invoice.due).times(100).toFixed(2) : 0;
					invoice.discount_formatted = invoice.discount + '%';
				}, this);
			}

			return result;
		}

	,	setCredits: function(customer_payment, result)
		{
			result.credits = [];
			result.creditmemosremaining = 0;

			for (var i = 1; i <= customer_payment.getLineItemCount('credit') ; i++)
			{
				var creditmemo = {
						internalid: customer_payment.getLineItemValue('credit', 'internalid', i)
					,	type: customer_payment.getLineItemValue('credit', 'type', i)
					,	total: Utils.toCurrency(customer_payment.getLineItemValue('credit', 'total', i))
					,	total_formatted: Utils.formatCurrency(customer_payment.getLineItemValue('credit', 'total', i), this.selected_currency_symbol)
					,	apply: customer_payment.getLineItemValue('credit', 'apply', i) === 'T'
					,	currency: customer_payment.getLineItemValue('apply', 'currency', i)
					,	remaining: Utils.toCurrency(customer_payment.getLineItemValue('credit', 'due', i))
					,	remaining_formatted: Utils.formatCurrency(customer_payment.getLineItemValue('credit', 'due', i), this.selected_currency_symbol)
					,	amount: Utils.toCurrency(customer_payment.getLineItemValue('credit', 'amount', i))
					,	amount_formatted: Utils.formatCurrency(customer_payment.getLineItemValue('credit', 'amount', i), this.selected_currency_symbol)
					,	refnum: customer_payment.getLineItemValue('credit', 'refnum', i)
				};

				result.creditmemosremaining = new BigNumber(creditmemo.remaining).plus(result.creditmemosremaining).toNumber();
				result.credits.push(creditmemo);
			}

			result.creditmemosremaining_formatted = Utils.formatCurrency(result.creditmemosremaining, this.selected_currency_symbol);

			return result;
		}

	,	setDeposits: function(customer_payment, result)
		{
			result.deposits = [];

			result.depositsremaining = 0;

			for (var i = 1; i <= customer_payment.getLineItemCount('deposit') ; i++)
			{
				var deposit = {
						internalid: customer_payment.getLineItemValue('deposit', 'doc', i)
					,	total: Utils.toCurrency(customer_payment.getLineItemValue('deposit', 'total', i))
					,	total_formatted: Utils.formatCurrency(customer_payment.getLineItemValue('deposit', 'total', i), this.selected_currency_symbol)
					,	apply: customer_payment.getLineItemValue('deposit', 'apply', i) === 'T'
					,	currency: customer_payment.getLineItemValue('deposit', 'currency', i)
					,	depositdate: customer_payment.getLineItemValue('deposit', 'depositdate', i)
					,	remaining: Utils.toCurrency(customer_payment.getLineItemValue('deposit', 'remaining', i))
					,	remaining_formatted: Utils.formatCurrency(customer_payment.getLineItemValue('deposit', 'remaining', i), this.selected_currency_symbol)
					,	amount: Utils.toCurrency(customer_payment.getLineItemValue('deposit', 'amount', i))
					,	amount_formatted: Utils.formatCurrency(customer_payment.getLineItemValue('deposit', 'amount', i), this.selected_currency_symbol)
					,	refnum: customer_payment.getLineItemValue('deposit', 'refnum', i)
					};

				result.depositsremaining = new BigNumber(deposit.remaining).plus(result.depositsremaining).toNumber();
				result.deposits.push(deposit);
			}

			result.depositsremaining_formatted = Utils.formatCurrency(result.depositsremaining, this.selected_currency_symbol);

			return result;
		}

	,	update: function (payment_record, data)
		{
			var self = this
			,	invoices = data.invoices
			,	credits = data.credits
			,	deposits = data.deposits;

			// invoices

			for (var i = 1; i <= payment_record.getLineItemCount('apply'); i++)
			{
				var invoice = _.findWhere(invoices, {
					internalid: payment_record.getLineItemValue('apply', 'internalid', i)
				});

				if (invoice && invoice.apply)
				{
					payment_record.setLineItemValue('apply', 'apply', i, 'T');
					payment_record.setLineItemValue('apply', 'amount', i, invoice.amount);

					invoice.due = payment_record.getLineItemValue('apply', 'due', i);
					invoice.total = payment_record.getLineItemValue('apply', 'total', i);
					invoice.discdate = payment_record.getLineItemValue('apply', 'discdate', i);
					invoice.discamt = payment_record.getLineItemValue('apply', 'discamt', i);
					invoice.discountapplies = (invoice.due === invoice.total) && (invoice.discdate && stringtodate(invoice.discdate) >= new Date());
					invoice.duewithdiscount = new BigNumber(invoice.due).minus(invoice.discountapplies ? invoice.discamt : 0).toNumber();

					if (self._isPayFull(invoice) && invoice.discountapplies && invoice.discamt)
					{
						payment_record.setLineItemValue('apply', 'disc', i, invoice.discamt);
					}
				}
			}

			// deposits

			for (i = 1; i <= payment_record.getLineItemCount('deposit'); i++)
			{
				var deposit = _.findWhere(deposits, {
					internalid: payment_record.getLineItemValue('deposit', 'doc', i)
				});

				if (deposit && deposit.apply)
				{
					payment_record.setLineItemValue('deposit', 'apply', i, 'T');
					payment_record.setLineItemValue('deposit', 'amount', i, deposit.amount);
				}
			}

			// credits

			for (i = 1; i <= payment_record.getLineItemCount('credit'); i++)
			{
				var credit = _.findWhere(credits, {
					internalid: payment_record.getLineItemValue('credit', 'internalid', i)
				});

				if (credit && credit.apply)
				{
					payment_record.setLineItemValue('credit', 'apply', i, 'T');
					payment_record.setLineItemValue('credit', 'amount', i, credit.amount);
				}
			}

			var	payment_method = data.paymentmethods && data.paymentmethods[0];

			if (data.payment && payment_method && payment_method.type)
			{
				// remove current payment method.
				payment_record.setFieldValue('returnurl', null);
				payment_record.setFieldValue('creditcard', null);
				payment_record.setFieldValue('ccexpiredate', null);
				payment_record.setFieldValue('ccname', null);
				payment_record.setFieldValue('ccnumber', null);
				payment_record.setFieldValue('paymentmethod', null);
				payment_record.setFieldValue('creditcardprocessor', null);
				payment_record.setFieldValue('paymenteventholdreason', null);

				if (payment_method.type === 'creditcard')
				{
					var credit_card = payment_method.creditcard;

					if(this.paymentInstrumentsEnabled)
					{
						payment_record.setFieldValue('paymentoption', credit_card.internalid);
					}
					else
					{
						payment_record.setFieldValue('creditcard', credit_card.internalid);
						payment_record.setFieldValue('paymentmethod', credit_card.paymentmethod.internalid);

						if (credit_card.paymentmethod.merchantid)
						{
							payment_record.setFieldValue('creditcardprocessor', credit_card.paymentmethod.merchantid);
						}
					}

					if (credit_card.ccsecuritycode)
					{
						payment_record.setFieldValue('ccsecuritycode', credit_card.ccsecuritycode);
					}
					payment_record.setFieldValue('chargeit', 'T');
				}
				else if (~payment_method.type.indexOf('external_checkout'))
				{

					payment_record.setFieldValue('paymentmethod', payment_method.internalid);
					payment_record.setFieldValue('creditcardprocessor', payment_method.merchantid);
					payment_record.setFieldValue('returnurl', payment_method.returnurl);
					payment_record.setFieldValue('chargeit', 'T');
				}

			}

			payment_record.setFieldValue('payment', data.payment);

			return payment_record;
		}

	,	_isPayFull: function (invoice)
		{
			if (invoice.discountapplies)
			{
				return invoice.amount === invoice.duewithdiscount;
			}
			else
			{
				return invoice.amount === invoice.due;
			}
		}

	,	submit: function (data)
		{
			// update record
			var payment_record = this.update(data.internalid ? this.loadRecord(data.internalid) : this.create(data.currency_id), data)
			// save record.
			,	payment_record_id = nlapiSubmitRecord(payment_record)
			// create new record to next payment.
			,	new_payment_record = this.get();

			if (payment_record_id !== '0')
			{
				// send confirmation
				new_payment_record.confirmation = _.extend(data, CustomerPayment.get('customerpayment', payment_record_id));
			}
			else
			{
				data.internalid = '0';
				new_payment_record.confirmation = data;
			}

			return new_payment_record;
		}
	});
});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// LivePayment.ServiceController.js
// ----------------
// Service to manage cart items requests
define(
	'LivePayment.ServiceController'
,	[
		'ServiceController'
	,	'LivePayment.Model'
	]
,	function(
		ServiceController
	,	LivePaymentModel
	)
	{
		'use strict';

		// @class LivePayment.ServiceController Manage cart items requests
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'LivePayment.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: {
				common: {
					requireLogin: true
				,	requirePermissions: {
						list: [
							'transactions.tranCustPymt.2'
						,	'transactions.tranCustInvc.1'
						]
					}
				}
			}

			// @method get The call to LivePayment.Service.ss with http method 'get' is managed by this function
			// @return {LivePayment.Model}
		,	get: function()
			{
				return LivePaymentModel.get('null', this.request.getParameter('cur'));
			}

			// @method post The call to LivePayment.Service.ss with http method 'post' is managed by this function
			// @return {LivePayment.Model}
		,	post: function()
			{
				return LivePaymentModel.submit(this.data);
			}

			// @method put The call to LivePayment.Service.ss with http method 'put' is managed by this function
			// @return {LivePayment.Model}
		,	put: function ()
			{
				return LivePaymentModel.submit(this.data);
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Newsletter
// ----------
// Handles newsletter subscription through 'lead' or 'customer' record creation/set up.
define(
	'Newsletter.Model'
,	[
		'SC.Model'
	,	'SC.Models.Init'
	,	'Configuration'
	,	'underscore'
	,	'Utils'
	]

,	function (
		SCModel
	,	ModelsInit
	,	Configuration
	,	_
	)
{
	'use strict';

	// @class Newsletter.Model Defines the model used by the Newsletter subscription service.
	// @extends SCModel
	return SCModel.extend({

		// @property {String} name Mandatory for all ssp-libraries models
		name: 'Newsletter'

		// @property {String} validation Includes the validation criteria
	,	validation: {
			email: {
				required: true
			,	pattern: 'email'
			,	msg: 'Valid email is required'
			}
		}

		// @method subscribe Processes the registration of the incoming mail as a newsletter subscriber
		// Please note that a newsletter subscriber has the following value in the 'customer' or lead' records:
		// globalsubscriptionstatus == 1 : (Soft Opt-In, the value we are setting up for new subscribers)
		// globalsubscriptionstatus == 2 : lead NOT subscribed (Soft Opt-Out)
		// globalsubscriptionstatus == 3 : lead already subscribed (Confirmed Opt-In)
		// globalsubscriptionstatus == 4 : lead NOT subscribed (Confirmed Opt-Out)
		// @param {String} email
		// @returns {Newsletter.Model.SuccessfulAnswer} Customer/lead subscription operation result
	,	subscribe: function subscribe (email)
		{

			this.validate({'email': email});

			var searchFilter = new nlobjSearchFilter('email', null, 'is', email)
			,	searchColumnSubscriptionStatus = new nlobjSearchColumn('globalsubscriptionstatus')
			,	customers = nlapiSearchRecord('customer', null, [searchFilter], [searchColumnSubscriptionStatus])

			//Searching by 'customer' returns 'customer' and 'lead' records alltogether,
			//so we group the records by recordtype: i.e.: 'customer' and 'lead' groups.
			,	records = _.groupBy(customers, function (customer)
				{
					return customer.getRecordType();
				});

			//If there's NOT any customer or lead with this email, we set up a lead with globalsubscriptionstatus = 1
			if (!records.customer && !records.lead)
			{
				return this.createSubscription(email);
			}
			else
			{
				return records.customer ? this.updateSubscription(records.customer) : this.updateSubscription(records.lead);
			}
		}

		// @method createSubscription Create a new 'lead' record with globalsubscriptionstatus = 1 (Soft Opt-In)
		// @parameter {String} email
		// @returns {subscriptionDone} Custom object with confirmation of lead record creation
	,	createSubscription: function createSubscription (email)
		{
			var record = nlapiCreateRecord('lead');
			record.setFieldValue('entityid', email);
			record.setFieldValue('firstname', Configuration.get('newsletter.genericFirstName'));
			record.setFieldValue('lastname', Configuration.get('newsletter.genericLastName'));
			record.setFieldValue('email', email);
			record.setFieldValue('subsidiary', ModelsInit.session.getShopperSubsidiary());
			record.setFieldValue('companyname', Configuration.get('newsletter.companyName'));
			record.setFieldValue('globalsubscriptionstatus', 1);
			nlapiSubmitRecord(record);
			return this.subscriptionDone;
		}

		// @method updateSubscription Update globalsubscriptionstatus of the records received
		// @parameter {Array<nlObjSearchObject>} subscribers Array of customer or leads.
		// @returns {Newsletter.Model.SubscriptionDone} Customer/lead subscription operation result
	,	updateSubscription: function updateSubscription (subscribers)
		{
			var subscribers_data = _.map(subscribers, function (subscriber)
				{
					return {
						'id': subscriber.getId()
					,	'status': subscriber.getValue('globalsubscriptionstatus')
					};
				})

				// We count the subscribers by its statuses
			,	subscribers_count = _.countBy(subscribers_data, function (subscriber)
				{
					return subscriber.status;
				});

			// Set up the quantity of the subscribers statuses. If it is NaN, is converted to number zero.
			subscribers_count['1'] = subscribers_count['1'] || 0;
			subscribers_count['2'] = subscribers_count['2'] || 0;
			subscribers_count['3'] = subscribers_count['3'] || 0;
			subscribers_count['4'] = subscribers_count['4'] || 0;

			// If every customer is in 'Confirmed Opt-Out' status ('4'), we cannot subscribe them.
			if ((subscribers_count['4']) === subscribers.length)
			{
				throw this.buildErrorAnswer('ERR_USER_STATUS_DISABLED');
			}
			// If everyone is among 'Soft Opt-In' ('1'), 'Confirmed Opt-In' ('3') or 'Confirmed Opt-Out' ('4'),
			// we cannot subscribe them, and we answer with an 'already subscribed' message.
			else if (subscribers_count['1'] + subscribers_count['3'] + subscribers_count['4'] === subscribers.length)
			{
				throw this.buildErrorAnswer('ERR_USER_STATUS_ALREADY_SUBSCRIBED');
			}
			// If some subscribers are in 'Soft Opt-Out' change every customer with status 'Soft Opt-Out' (2) to 'Soft Opt-In' (1)
			else if (subscribers_count['2'])
			{

				// Get the customers able to be subscribed
				var customers_to_subscribe = _.filter(subscribers_data, function (subscriber)
				{
					return subscriber.status === '2';
				});

				//Updating all subscribers to 'Soft Opt-In' status.
				//Potentially demanding operation on large amount
				//of subscribers; documentation points using nlapiSubmitField
				//as the cheaper way to update lines.
				_.each(customers_to_subscribe,  function (subscriber)
				{
					nlapiSubmitField('customer', subscriber.id, 'globalsubscriptionstatus', 1, false);
				});

				return this.subscriptionDone;
			}
			else
			{
				throw this.buildErrorAnswer('ERROR');
			}
		}

		//@property {Newsletter.Model.SuccessfulAnswer} subscriptionDone
	,	subscriptionDone: {
			code: 'OK'
		,	message: 'Subscription successful!'
		}

		//@method buildErrorAnswer Build the error answer
		//@param {String} String with error code
		//@return {Newsletter.Model.ErrorAnswer} Subscription fail object.
	,	buildErrorAnswer: function buildErrorAnswer (code)
		{
			return {
				status: 500
			,	code: code
			,	message: 'Error trying to set up subscription.'
			};
		}
	});
});

//@class Newsletter.Model.SuccessfulAnswer Subscription successful object.
//@property {String} code
//@property {String} message

//@class Newsletter.Model.ErrorAnswer Subscription failed object.
//@property {String} status Http error status.
//@property {String} code String with response code.
//@property {String} message;
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Newsletter.ServiceController.js
// ----------------
// Service to register an email as a newsletter subscriptor
define(
	'Newsletter.ServiceController'
,	[
		'ServiceController'
	,	'Newsletter.Model'
	]
,	function(
		ServiceController
	,	NewsletterModel
	)
	{
		'use strict';

		// @class Newsletter.ServiceController
		// Supports newsletter subscription process
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name:'Newsletter.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: {
				common: {
					requirePermissions: {
						list: [
							'lists.listCustJob.3'
						]
					}
				}
			}

			// @method post Callling to Newsletter.Service.ss with http method 'post' is managed by this function
			// @return {NewsletterSuscriptionResult} Object with the result of the lead subscribing operation
		,	post: function ()
			{
				return NewsletterModel.subscribe(this.data.email);
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// ReorderItems.Model.js
// ----------
// Handles fetching of ordered items
define(
	'ReorderItems.Model'
,	[	
		'SC.Model'
	,	'SC.Models.Init'
	,	'Application'
	,	'StoreItem.Model'
	,	'SiteSettings.Model'
	,	'Utils'
	,	'underscore'
	,	'Transaction.Model'
	,	'Configuration'
	]
,	function (
		SCModel
	,	ModelsInit
	,	Application
	,	StoreItem
	,	SiteSettings
	,	Utils
	,	_
	,	Transaction
	,	Configuration
	)
{
	'use strict';

	// @class ReorderItems.Model Defines the model used by the ReorderItems.Service.ss service
	// @extends SCModel
	return SCModel.extend({

		//@property {String} name
		name: 'OrderItem'

		//@property {Boolean} isMultiSite
	,	isMultiSite: ModelsInit.context.getFeature('MULTISITE')

		//@method search
		//@param {String} order_id
		//@param {Object} query_filters
		//@return {Array<ReorderItems.Model.Attributes>}
	,	search: function (order_id, query_filters)
		{

			var filters = {
					'entity': ['entity', 'is', nlapiGetUser()]
				,	'entity_operator': 'and'
				,	'quantity': [ 'quantity', 'greaterthan', 0 ]
				,	'quantity_operator': 'and'
				,	'mainline': ['mainline','is', 'F']
				,	'mainline_operator': 'and'
				,	'cogs': ['cogs', 'is', 'F']
				,	'cogs_operator': 'and'
				,	'taxline': ['taxline', 'is', 'F']
				,	'taxline_operator': 'and'
				,	'shipping': ['shipping', 'is', 'F']
				,	'shipping_operator': 'and'
				,	'transactiondiscount': ['transactiondiscount', 'is', 'F']
				,	'transactiondiscount_operator': 'and'
				,	'item_is_active': ['item.isinactive', 'is', 'F']
				,	'item_is_active_operator': 'and'
				,	'item_type': [ 'item.type', 'noneof', 'GiftCert' ]
			}
			,	columns = [
						new nlobjSearchColumn('internalid', 'item', 'group')
					,	new nlobjSearchColumn('type', 'item', 'group')
					,	new nlobjSearchColumn('parent', 'item', 'group')
					,	new nlobjSearchColumn('options', null, 'group')
					// to sort by price we fetch the max onlinecustomerprice
					,	new nlobjSearchColumn('onlinecustomerprice', 'item', 'max')
					// to sort by recently purchased we grab the last date the item was purchased
					,	new nlobjSearchColumn('trandate', null, 'max')
					// to sort by frequently purchased we count the number of orders which contains an item
					,	new nlobjSearchColumn('internalid', null, 'count')
				]

				,	item_name =  new nlobjSearchColumn('formulatext','item', 'group');

			// when sorting by name, if the item has displayname we sort by that field, if not we sort by itemid
			item_name.setFormula('case when LENGTH({item.storedisplayname}) > 0 then {item.storedisplayname} else (case when LENGTH({item.displayname}) > 0 then {item.displayname} else {item.itemid} end) end');

			columns.push(item_name);

			var site_settings = SiteSettings.get();

			if (site_settings.isSCISIntegrationEnabled)
			{
				filters.scisrecords_operator = 'and';
				filters.scisrecords = [
					[
						['type', 'anyof', ['CashSale','CustInvc']] 
					,	'and'
					,	[ 'createdfrom', 'is', '@NONE@' ]
					,	'and'
					,	[ 'location.locationtype', 'is', Configuration.get('locationTypeMapping.store.internalid') ]
					,	'and'
					,	[ 'source', 'is', '@NONE@' ]
					] 
				,	'or'
				,	[
						['type', 'anyof', ['SalesOrd']]
					]
				];
			}
			else
			{
				filters.type_operator = 'and';
				filters.type = ['type', 'anyof', ['SalesOrd']];
			}

	 		if (this.isMultiSite)
			{
				var site_id = ModelsInit.session.getSiteSettings(['siteid']).siteid
				,	filter_site_option = Configuration.get('filterSite.option')
				,	filter_site_ids = Configuration.get('filterSite.ids')
				,	search_filter_array = null;

				if (filter_site_option === 'current')
				{
					search_filter_array = [site_id, '@NONE@'];
				}
				else if (filter_site_option === 'siteIds')
				{
					search_filter_array = filter_site_ids;
					search_filter_array.push('@NONE@');
				}
			
				if (search_filter_array && search_filter_array.length)
				{
					filters.site_operator = 'and';
					filters.site = ['website', 'anyof', _.uniq(search_filter_array)];

					filters.item_website_operator = 'and';
					filters.item_website = ['item.website', 'anyof',  _.uniq(search_filter_array)];
				}
			}


			// show only items from one order
			if (order_id)
			{
				filters.order_operator = 'and';
				filters.order_id = ['internalid', 'is', order_id];

				columns.push(new nlobjSearchColumn('tranid', null, 'group'));
			}

			if (query_filters.date.from && query_filters.date.to)
			{
				filters.date_operator = 'and';
				
				query_filters.date.from = query_filters.date.from.split('-');
				query_filters.date.to = query_filters.date.to.split('-');
				
				filters.date = [
					'trandate'
				,	'within'
				,	new Date(
						query_filters.date.from[0]
					,	query_filters.date.from[1]-1
					,	query_filters.date.from[2]
					)
				,	new Date(
						query_filters.date.to[0]
					,	query_filters.date.to[1]-1
					,	query_filters.date.to[2]
					)
				];
			}

			// select field to sort by
			switch (query_filters.sort)
			{
				// sort by name
				case 'name':
					item_name.setSort(query_filters.order > 0);
				break;

				// sort by price
				case 'price':
					columns[4].setSort(query_filters.order > 0);
				break;

				// sort by recently purchased
				case 'date':
					columns[5].setSort(query_filters.order > 0);
				break;

				// sort by frequenlty purchased
				case 'quantity':
					columns[6].setSort(query_filters.order > 0);
				break;

				default:
					columns[6].setSort(true);
				break;
			}

			// fetch items
			var result = Application.getPaginatedSearchResults({
					record_type: 'transaction'
				,	filters: _.values(filters)
				,	columns: columns
				,	page: query_filters.page
				,	column_count: new nlobjSearchColumn('formulatext', null, 'count').setFormula('CONCAT({item}, {options})')
				})
			// prepare an item collection, this will be used to preload item's details
			,	items_info = _.map(result.records, function (line)
				{
					return {
						id: line.getValue('internalid', 'item', 'group')
					,	type: line.getValue('type', 'item', 'group')
					};
				});

			if (items_info.length)
			{
				// preload order's items information
				StoreItem.preloadItems(items_info);

				result.records = _.map(result.records, function (line)
				{
					// prepare the collection for the frontend
					//@class ReorderItems.Model.Attributes
					return {
							//@property {StoreItem} item
							item: StoreItem.get( line.getValue('internalid', 'item', 'group'), line.getValue('type', 'item', 'group') )
							//@property {String} tranid
						,	tranid: line.getValue('tranid', null, 'group') ||  null
							//@property {Array<Utils.ItemOptionsObject>} options 
						,	options: Transaction.parseLineOptions( line.getValue('options', null, 'group') )
							//@property {String} trandate
						,	trandate: line.getValue('trandate', null, 'max')
					};
					//@class ReorderItems.Model
				});
			}

			return result;
		}
	});
});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// ReorderItems.ServiceController.js
// ----------------
// Service to manage reorder items requests
define(
	'ReorderItems.ServiceController'
,	[
		'ServiceController'
	,	'ReorderItems.Model'
	,	'SiteSettings.Model'
	]
,	function(
		ServiceController
	,	ReorderItemsModel
	,	SiteSettingsModel
	)
	{
		'use strict';

		// @class ReorderItems.ServiceController Manage reorder items requests
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'ReorderItems.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: function() {
				return {
					common: {
						requireLogin: true
						, requirePermissions: {
							list: [
								SiteSettingsModel.get().isSCISIntegrationEnabled ? 'transactions.tranPurchases.1' : 'transactions.tranSalesOrd.1'
								, 'transactions.tranFind.1'
							]
						}
					}
				}
			}

			// @method get The call to ReorderItems.Service.ss with http method 'get' is managed by this function
			// @return {Array<ReorderItems.Model.Attributes>}
		,	get: function()
			{
				//Call the search function defined on ssp_libraries/models/ReorderItems.js and send the response
				return ReorderItemsModel.search(
					this.request.getParameter('order_id')
				,	{
						date : {
							from: this.request.getParameter('from')
						,	to: this.request.getParameter('to')
						}
					,	page: this.request.getParameter('page') || 1
					,	sort : this.request.getParameter('sort')
					,	order: this.request.getParameter('order')
					}
				);
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// ReturnAuthorization.Model.js
// ----------------
//
define(
	'ReturnAuthorization.Model'
,	[	'Transaction.Model'
	,	'Utils'
	,	'Application'
	,	'StoreItem.Model'
	,	'SiteSettings.Model'
	,	'Configuration'
	,	'underscore'
	]
,	function (
		Transaction
	,	Utils
	,	Application
	,	StoreItem
	,	SiteSettings
	,	Configuration
	,	_
	)
{
	'use strict';

	// @class ReturnAuthorization.Model Defines the model used by the ReturnAuthorization.Service.ss service
	// @extends Transaction
	return Transaction.extend({

		//@property {String} name
		name: 'ReturnAuthorization'

		//@property {Object} validation
	,	validation: {}

	,	isSCISIntegrationEnabled: SiteSettings.isSCISIntegrationEnabled()

	,	getExtraRecordFields: function ()
		{
			this.result.isCancelable = this.isCancelable();
			
			if (this.isSCISIntegrationEnabled && this.result.recordtype === 'creditmemo')
			{

				this.result.amountpaid = Utils.toCurrency(this.record.getFieldValue('amountpaid'));
				this.result.amountpaid_formatted = Utils.formatCurrency(this.record.getFieldValue('amountpaid'), this.currencySymbol);
				this.result.amountremaining = Utils.toCurrency(this.record.getFieldValue('amountremaining'));
				this.result.amountremaining_formatted = Utils.formatCurrency(this.record.getFieldValue('amountremaining'), this.currencySymbol);

				this.getApply();
			}
		}

		//@method isCancelable
		//@return {Boolean}
	,	isCancelable: function ()
		{
			return this.result.recordtype === 'returnauthorization' && this.result.status.internalid === 'pendingApproval';
		}
	,	getExtraLineFields: function (result, record, i)
		{
			result.reason = this.result.recordtype === 'creditmemo' ? '' : record.getLineItemValue('item', 'description', i);
		}
	,	getApply: function()
		{
			var self = this
			,	ids = [];

			this.result.applies = {};

			for (var i = 1; i <= this.record.getLineItemCount('apply'); i++)
			{
				if (self.record.getLineItemValue('apply', 'apply', i) === 'T')
				{
					var internalid = self.record.getLineItemValue('apply', 'internalid', i);

					ids.push(internalid);

					self.result.applies[internalid] = {
							line: i
						,	internalid: internalid
						,	tranid: self.record.getLineItemValue('apply', 'refnum', i)
						,	applydate: self.record.getLineItemValue('apply', 'applydate', i)
						,	recordtype: self.record.getLineItemValue('apply', 'type', i)
						,	currency: self.record.getLineItemValue('apply', 'currency', i)
						,	amount: Utils.toCurrency(self.record.getLineItemValue('apply', 'amount', i))
						,	amount_formatted: Utils.formatCurrency(self.record.getLineItemValue('apply', 'amount', i), self.currencySymbol)
					};
				}
			}

			if (ids && ids.length)
			{
				_.each(this.getTransactionType(ids) || {}, function (recordtype, internalid)
				{
					self.result.applies[internalid].recordtype = recordtype;
				});	
			}
			this.result.applies = _.values(this.result.applies);
		}

	,	update: function (id, data, headers)
		{
			if (data.status === 'cancelled')
			{
				var url = 'https://' + Application.getHost() + '/app/accounting/transactions/returnauthmanager.nl?type=cancel&id=' + id;
				nlapiRequestURL(url, null, headers);
			}
		}

		//@method create
		//@param data
		//@return {Number}
	,	create: function (data)
        {
        	var return_authorization = nlapiTransformRecord(data.type, data.id, 'returnauthorization')
        	,   transaction_lines = this.getTransactionLines(data.id);

        	this.setLines(return_authorization, data.lines, transaction_lines);
        	return_authorization.setFieldValue('memo', data.comments);
			
			return nlapiSubmitRecord(return_authorization);
        }
        
	,	getTransactionLines: function (transaction_internalid)
		{
			var filters = {
				mainline: ['mainline', 'is', 'F']
			,   mainline_operator: 'and'
			,   internalid: ['internalid', 'is', transaction_internalid]
			}
			
			,   columns = [
				new nlobjSearchColumn('line')
			,   new nlobjSearchColumn('rate')
			];

			var search_results = Application.getAllSearchResults('transaction', _.values(filters), columns)
			,	item_lines = [];            

			_.each(search_results, function (search_result) 
			{
				var item_line = {
					line: transaction_internalid + '_' + search_result.getValue('line')
				,   rate: search_result.getValue('rate')
				};

				item_lines.push(item_line);
			});
			
			return item_lines;
		}

		//@method findLine
		//@param line_id
		//@param lines
	,	getCreatedFrom: function()
		{
			var created_from_internalid
			,	created_from_name
			,	recordtype
			,	tranid;

			if (this.isSCISIntegrationEnabled && this.result.recordtype === 'creditmemo')
			{
				created_from_internalid = this.record.getFieldValue('custbody_ns_pos_created_from');
				created_from_name = this.record.getFieldText('custbody_ns_pos_created_from');
			}
			else
			{
				created_from_internalid = nlapiLookupField(this.result.recordtype, this.result.internalid, 'createdfrom');
				created_from_name = created_from_internalid && nlapiLookupField(this.result.recordtype, this.result.internalid, 'createdfrom', true);
			}
			
			recordtype = created_from_internalid ? Utils.getTransactionType(created_from_internalid) : '';
			tranid = recordtype ? nlapiLookupField(recordtype, created_from_internalid, 'tranid') : '';

			this.result.createdfrom =
			{
					internalid: created_from_internalid
				,	name: created_from_name
				,	recordtype: recordtype
				,	tranid: tranid
			};
		}
	,	getStatus: function ()
		{
			this.result.status =
			{
				internalid: nlapiLookupField(this.result.recordtype, this.result.internalid, 'status')
			,	name: nlapiLookupField(this.result.recordtype, this.result.internalid, 'status', true)
			};
		}

	,	findLine: function (line_id, lines)
		{
			return _.findWhere(lines, {
				id: line_id
			});
		}

		//@method setLines
		//@param return_authorization
		//@param lines
		//@return {ReturnAuthorization.Model}
 	,	setLines: function (return_authorization, lines, transaction_lines)
 		{
 			var line_count = return_authorization.getLineItemCount('item')
 			,   add_line = true
 			,   i = 1;

			while (i <= line_count)
			{
				var line_item_value = return_authorization.getLineItemValue('item', 'id', i);

				add_line = this.findLine(line_item_value, lines);
				if (add_line)
				{
					var transaction_line = _.findWhere(transaction_lines, { line: line_item_value });

					if (transaction_line)
					{
						return_authorization.setLineItemValue('item', 'rate', i, transaction_line.rate);
					}

					return_authorization.setLineItemValue('item', 'quantity', i, add_line.quantity);
					return_authorization.setLineItemValue('item', 'description', i, add_line.reason);

					i++;
				}
				else
				{					
					var item_type = return_authorization.getLineItemValue('item', 'itemtype', i);
					if (item_type == 'GiftCert') {
						return_authorization.removeLineItem('item', i);
						line_count--;
					} else {
						return_authorization.setLineItemValue('item', 'quantity', i, 0);

						i++;
					}
				}
			}
        }

		//@method list
		//@param {Object} data
		//@return {Object}
	,	setExtraListFilters: function ()
		{
			if (this.data.getLines && this.data.page === 'all')
			{
				delete this.filters.mainline;
				delete this.filters.mainline_operator;

				this.filters.shipping_operator = 'and';
				this.filters.shipping = ['shipping','is', 'F'];

				this.filters.taxline_operator = 'and';
				this.filters.taxline = ['taxline', 'is', 'F'];

				this.filters.quantity_operator = 'and';
				this.filters.quantity = ['quantity', 'notequalto', 0];

				this.filters.cogs_operator = 'and';
				this.filters.cogs = ['cogs', 'is', 'F'];

				this.filters.transactiondiscount_operator = 'and';
				this.filters.transactiondiscount = ['transactiondiscount', 'is', 'F'];

			}

			if (this.isSCISIntegrationEnabled)
			{
				this.filters.scisrecords_operator = 'and';
				this.filters.scisrecords = [
						[
							['type', 'anyof', ['CustCred']]
						,	'and'
						,	[ 'location.locationtype', 'is', Configuration.get('locationTypeMapping.store.internalid') ]
						,	'and'
						,	[ 'source', 'is', '@NONE@' ]
						] 
					,	'or'
					,	[
							['type', 'anyof', ['RtnAuth']]
						]
				];	
				
			}
			else
			{
				this.filters.type_operator = 'and';
				this.filters.type = ['type', 'anyof', ['RtnAuth']];
			}

			if (this.data.createdfrom)
			{
				delete this.filters.createdfrom;
				delete this.filters.createdfrom_operator;
				
				this.data.createdfrom = _.isArray(this.data.createdfrom) ? this.data.createdfrom : this.data.createdfrom.split(',');

				var internal_ids = []
				,	filters = [
						[
							['createdfrom', 'anyof', this.data.createdfrom]
						,	'and'
						,	['type', 'anyof', ['RtnAuth']]
						]
					]
				,	columns = nlobjSearchColumn('internalid');


				if (this.isSCISIntegrationEnabled)
				{
					
					filters.push('or');
					filters.push([
						['custbody_ns_pos_created_from', 'anyof', this.data.createdfrom]
					,	'and'
					,	[
								['type', 'anyof', ['CustCred']]
							,	'and'
							,	[ 'location.locationtype', 'is', Configuration.get('locationTypeMapping.store.internalid') ]
							,	'and'
							,	[ 'source', 'is', '@NONE@' ]
						]
					]);

				}

				internal_ids = _(Application.getAllSearchResults('transaction', _.values(filters), columns) || []).pluck('id');

				if (this.data.internalid && this.data.internalid.length)
				{
					internal_ids = _.intersection(internal_ids, this.data.internalid);
				}

				internal_ids = internal_ids.length ? internal_ids : [0];

				this.filters.internalid_operator = 'and';
				this.filters.internalid  =  ['internalid', 'anyof', internal_ids];
			}

		}
	,	setExtraListColumns: function ()
		{
			if (this.data.getLines && this.data.page === 'all')
			{
				this.columns.mainline = new nlobjSearchColumn('mainline');
				this.columns.internalid_item = new nlobjSearchColumn('internalid', 'item');
				this.columns.type_item = new nlobjSearchColumn('type', 'item');
				this.columns.parent_item = new nlobjSearchColumn('parent', 'item');
				this.columns.displayname_item = new nlobjSearchColumn('displayname', 'item');
				this.columns.storedisplayname_item = new nlobjSearchColumn('storedisplayname', 'item');
				this.columns.rate = new nlobjSearchColumn('rate');
				this.columns.total = new nlobjSearchColumn('total');
				this.columns.options = new nlobjSearchColumn('options');
				this.columns.line = new nlobjSearchColumn('line').setSort();
				this.columns.quantity = new nlobjSearchColumn('quantity');
			}
		}
	,	mapListResult : function (result, record)
		{
			if (result && result.currency) 
			{
				this.currencySymbol = Utils.getCurrencyById(result.currency.internalid).symbol;
			}

			result.amount = Math.abs(result.amount || 0);
			result.amount_formatted =  Utils.formatCurrency(result.amount, this.currencySymbol);

			result.lines = record.getValue(this.columns.lines);
		
			if (this.data.getLines)
			{
				result.mainline = record.getValue('mainline');
			}

			if(this.isCustomColumnsEnabled()) 
			{
				this.mapCustomColumns(result, record);
			}

			return result;
		}
	,	postList: function ()
		{
			if (this.data.getLines && this.data.page === 'all')
			{
				this.results = _.where(this.results, {mainline: '*'});

				var items_to_preload = {}
				,	self = this;

				_.each(this.search_results || [], function (record)
				{
					if (record.getValue('mainline') !== '*')
					{
						var record_id = record.getId()
						,	result = _.findWhere(self.results, {internalid: record_id});

						if (result)
						{
							result.lines = result.lines || [];

							var item_id = record.getValue('internalid', 'item')
							,	item_type = record.getValue('type', 'item');

							if (item_type !== 'Discount')
							{
							result.lines.push({
								internalid: record_id + '_' + record.getValue('line')
							,	quantity: Math.abs(record.getValue('quantity'))
							,	rate: Utils.toCurrency(record.getValue('rate'))
							,	rate_formatted: Utils.formatCurrency(record.getValue('rate'), self.currencySymbol)
							,	tax_amount: Utils.toCurrency(Math.abs(record.getValue('taxtotal')))
							,	tax_amount_formatted: Utils.formatCurrency(Math.abs(record.getValue('taxtotal')), self.currencySymbol)
							,	amount: Utils.toCurrency(Math.abs(record.getValue(self.amountField)))
							,	amount_formatted: Utils.formatCurrency(Math.abs(record.getValue(self.amountField)), self.currencySymbol)
							,	options: self.parseLineOptions(record.getValue('options'))

							,	item: {
										internalid: item_id
									,	type: item_type
									,	parent: record.getValue('parent', 'item')
									,	displayname: record.getValue('displayname', 'item')
									,	storedisplayname: record.getValue('storedisplayname', 'item')
									,	itemid: record.getValue('itemid', 'item')
								}
							});

							items_to_preload[item_id] = {
								id: item_id
							,	type: item_type
							};
						}
			
						}
					}
				});
				
				this.store_item = StoreItem;

				this.store_item.preloadItems( _.values(items_to_preload));

				_.each(this.results, function (result)
				{
					_.each(result.lines, function (line)
					{
						var item_details = self.store_item.get(line.item.internalid, line.item.type);

						if (item_details && !_.isUndefined(item_details.itemid))
						{
							line.item = item_details;
						}
					});
				});
			}
			else if (this.results.records && this.results.records.length)
			{
				var filters = {}
				,	columns = [
						new nlobjSearchColumn('internalid', null, 'group')
					,	new nlobjSearchColumn('quantity', null, 'sum')
					]
				,	quantities = {};

				filters.internalid  =  ['internalid', 'anyof', _(this.results.records || []).pluck('internalid')];
				filters.mainline_operator = 'and';	
				filters.mainline = ['mainline','is', 'F'];
				filters.cogs_operator = 'and';
				filters.cogs = ['cogs', 'is', 'F'];
				filters.taxline_operator = 'and';
				filters.taxline = ['taxline', 'is', 'F'];
				filters.shipping_operator = 'and';
				filters.shipping = ['shipping','is', 'F'];

				Application.getAllSearchResults('transaction', _.values(filters), columns).forEach(function (record) {
				 	quantities[record.getValue('internalid', null, 'group')] = record.getValue('quantity', null, 'sum');
				});

				_.each(this.results.records, function (record) {
					record.quantity = Math.abs(quantities[record.internalid] || 0);	
				});
			}
		}

	,	postGet: function () 
		{
			var filters = {}
			,	columns = [
				new nlobjSearchColumn('createdfrom')
			,	new nlobjSearchColumn('tranid', 'createdfrom')
			]
			,	self = this
			,	isCreditMemo = this.result.recordtype === 'creditmemo'
			,	record_type = ''
			,	created_from_internalid = ''
			,	created_from_name = ''
			,	cretaed_from_tranid = '';

			filters.internalid  =  ['internalid', 'is', this.result.internalid];
				
			if (isCreditMemo)
			{
				columns.push(new nlobjSearchColumn('line'));
				columns.push(new nlobjSearchColumn('custcol_ns_pos_returnreason'));

				filters.mainline_operator = 'and';	
				filters.mainline = ['mainline','is', 'F'];
				filters.cogs_operator = 'and';
				filters.cogs = ['cogs', 'is', 'F'];
				filters.taxline_operator = 'and';
				filters.taxline = ['taxline', 'is', 'F'];
				filters.shipping_operator = 'and';
				filters.shipping = ['shipping','is', 'F'];
			}
			else
			{
				filters.createdfrom_operator = 'and';
				filters.createdfrom = ['createdfrom', 'noneof', '@NONE@'];
			}


			Application.getAllSearchResults('transaction', _.values(filters), columns).forEach(function (record) 
			{
				created_from_internalid = record.getValue('createdfrom');
				created_from_name = record.getText('createdfrom');
				cretaed_from_tranid = record.getValue('tranid', 'createdfrom');

				if (isCreditMemo)
				{
					var line = self.result.lines[self.result.internalid + '_' + record.getValue('line')];
					
					if (line)
					{
				 		line.reason = record.getText('custcol_ns_pos_returnreason');
					}
				}

			});

			if (created_from_internalid)
			{
				record_type = Utils.getTransactionType(created_from_internalid);
			}

			this.result.createdfrom =
			//@class CreatedFrom
			{
				//@property {String} internalid
				internalid: created_from_internalid
				//@property {String} name
			,	name: created_from_name
				//@property {String} recordtype
			,	recordtype: record_type || ''
				//@property {String} tranid
			,	tranid: cretaed_from_tranid
			};
			
			this.result.lines = _.reject(this.result.lines, function (line)
			{
				return line.quantity === 0;
			});
		}

	});
});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Init.js
// -------
// Global variables to be used accross models
// This is the head of combined file Model.js
/* exported container, session, settings, customer, context, order */

function log (level, title, details)
{
	'use strict';
	var console = require('Console')
	,	levels = {
			'DEBUG' : 'log'
		,	'AUDIT' : 'info'
		,	'EMERGENCY': 'error'
		,	'ERROR' :'warn'
	};

	console[levels[level]](title, details);

}

var wrapped_objects = {};

function wrapObject (object, class_name)
{
	'use strict';

	if (!wrapped_objects[class_name])
	{
		wrapped_objects[class_name] = {};

		for (var method_name in object)
		{
			if (method_name !== 'prototype')
			{
				wrapped_objects[class_name][method_name] = wrap(object, method_name, class_name);
			}
		}
	}

	return wrapped_objects[class_name];
}

function wrap (object, method_name, class_name, original_function)
{
	'use strict';

	return function ()
	{
		var result
		,	is_secure = ~request.getURL().indexOf('https:')
		,	function_name = class_name + '.' + method_name + '()'
		,	file = '/' + request.getParameter('sitepath').replace(session.getAbsoluteUrl2(is_secure ? 'checkout' :'shopping', '/'), '')
		,	start = Date.now();

		try
		{
			if (original_function)
			{
				result = original_function.apply(object, arguments);
			}
			else
			{
				result = object[method_name].apply(object, arguments);
			}
		}
		catch (e)
		{
			if (!SC.debuggingSilent)
			{
			log('ERROR', file + ' | ' +  function_name, ' | Arguments: ' + JSON.stringify(arguments) + ' | Exception: ' + JSON.stringify(e));
			}

			throw e;
		}

		if (!SC.debuggingSilent)
		{
		log('DEBUG', file + ' | ' +  function_name, 'Time: ' + (Date.now() - start) + 'ms | Remaining Usage: ' +  nlapiGetContext().getRemainingUsage() + ' | Arguments: ' + JSON.stringify(arguments));
		}

		return result;
	};
}

var container = null
,	session = null
,	customer = null
,	context = null
,	order = null;
// only initialize vars when the context actually have the functions
switch(nlapiGetContext().getExecutionContext())
{
	case 'suitelet':
		context = nlapiGetContext();
		break;
	case 'webstore':
	case 'webservices':
	case 'webapplication':
		//nlapiLogExecution('DEBUG', 'Initializing global vars', nlapiGetContext().getExecutionContext());
		container = nlapiGetWebContainer();
		session = container.getShoppingSession();
		customer = session.getCustomer();
		context = nlapiGetContext();
		order = session.getOrder();
		break;
	default:
		//nlapiLogExecution('DEBUG', 'Omitting initialization of global vars', nlapiGetContext().getExecutionContext());
		break;
}

/*
*	Returns the location id for the employee.
*		if SCIS => the selecetd scis location
*		else => the employee location field.
*/
define('Models.Init', ['underscore'], function (_)
{
	'use strict';

	if (SC.debuggingMode)
	{
		var suite_script_functions_to_wrap = ['nlapiLoadRecord', 'nlapiSearchRecord', 'nlapiSubmitRecord', 'nlapiCreateRecord', 'nlapiLookupField'];

		_.each(suite_script_functions_to_wrap, function (method_name)
		{
			this[method_name] = wrap(this, method_name, 'SuiteScript', this[method_name]);
		}, this);


		return {
			container: wrapObject(container, 'WebContainer')
		,	session: wrapObject(session, 'ShoppingSession')
		,	customer: wrapObject(customer, 'Customer')
		,	context: wrapObject(context, 'Context')
		,	order: wrapObject(order, 'Order')
		};
	}
	else
	{

		return {
			container: container
		,	session: session
		,	customer: customer
		,	context: context
		,	order: order
		};
	}
});

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// OrderHistory.Model.js
// ----------
// Handles fetching orders
define(
	'OrderHistory.Model'
,	[
		'Application'
	,	'Utils'
	,	'StoreItem.Model'
	,	'Transaction.Model'
	,	'Transaction.Model.Extensions'
	,	'SiteSettings.Model'
	,	'SC.Model'
	,	'ReturnAuthorization.Model'
	,	'ExternalPayment.Model'
	,	'Models.Init'
	,	'Configuration'
	,	'bignumber'
	,	'underscore'
	]
,	function (
		Application
	,	Utils
	,	StoreItem
	,	Transaction
	,	TransactionModelExtensions
	,	SiteSettings
	,	SCModel
	,	ReturnAuthorization
	,	ExternalPayment
	,	ModelsInit
	,	Configuration
	,	BigNumber
	,	_
	)
{
	'use strict';

	return Transaction.extend({

		name: 'OrderHistory'

	,	isPickupInStoreEnabled: SiteSettings.isPickupInStoreEnabled()

	,	isSCISIntegrationEnabled: SiteSettings.isSCISIntegrationEnabled()

	,	setExtraListColumns: function ()
		{
			this.columns.trackingnumbers = new nlobjSearchColumn('trackingnumbers');

			if (this.isSCISIntegrationEnabled)
			{
				this.columns.origin = new nlobjSearchColumn('formulatext');
				this.columns.origin.setFormula('case when LENGTH({source})>0 then 2 else (case when {location.locationtype.id} = \'' + Configuration.get('locationTypeMapping.store.internalid') + '\' then 1 else 0 end) end');
			}
		}
	,	setExtraListFilters: function ()
		{
			if (this.data.filter === 'status:open') // Status is open and this is only valid for Sales Orders.
			{
				this.filters.type_operator = 'and';
				this.filters.type = ['type', 'anyof', ['SalesOrd']];
				this.filters.status_operator = 'and';
				this.filters.status = ['status', 'anyof', ['SalesOrd:A', 'SalesOrd:B', 'SalesOrd:D', 'SalesOrd:E', 'SalesOrd:F']];
			}
			else if (this.isSCISIntegrationEnabled)
			{
				if (this.data.filter === 'origin:instore') // SCIS Integration enabled, only In Store records (Including Sales Orders from SCIS)
				{
					this.filters.scisrecords_operator = 'and';
					this.filters.scisrecords = [
						['type', 'anyof', ['CashSale','CustInvc', 'SalesOrd']]
					,	'and'
					,	['createdfrom.type', 'noneof', ['SalesOrd']]
					,	'and'
					,	[ 'location.locationtype', 'is', Configuration.get('locationTypeMapping.store.internalid') ]
					,	'and'
					,	['source', 'is', '@NONE@']
					];
				}
				else // SCIS Integration enabled, all records
				{
					this.filters.scisrecords_operator = 'and';
					this.filters.scisrecords = [
						[
							['type', 'anyof', ['CashSale','CustInvc']]
						,	'and'
						,	['createdfrom.type', 'noneof', ['SalesOrd']]
						,	'and'
						,	[ 'location.locationtype', 'is', Configuration.get('locationTypeMapping.store.internalid') ]
						,	'and'
						,	['source', 'is', '@NONE@']
						]
					,	'or'
					,	[
							['type', 'anyof', ['SalesOrd']]
						]
					];
				}
			}
			else // SCIS Integration is disabled, show all the Sales Orders
			{
				this.filters.type_operator = 'and';
				this.filters.type = ['type', 'anyof', ['SalesOrd']];
			}

			var is_contact= ModelsInit.session.getCustomer().getFieldValues().contactloginid !== '0';
			if(!_.isEmpty(ModelsInit.session.getSiteSettings().cartsharingmode) && ModelsInit.session.getSiteSettings().cartsharingmode === 'PER_CONTACT' && is_contact) {
				var contactId = parseInt(ModelsInit.session.getCustomer().getFieldValues().contactloginid),
					email =  nlapiLookupField('contact', contactId , 'email');
				this.filters.email_opeartor = 'and';
				this.filters.email = ['email', 'is', email];
			}
		}
	,	mapListResult: function (result, record)
		{
			result = result || {};
			result.trackingnumbers = record.getValue('trackingnumbers') ? record.getValue('trackingnumbers').split('<BR>') : null;

			if (this.isSCISIntegrationEnabled)
			{
				result.origin = parseInt(record.getValue(this.columns.origin), 10);
			}

			if(this.isCustomColumnsEnabled())
			{
				this.mapCustomColumns(result, record);
			}

			return result;
		}
	,	getExtraRecordFields: function ()
		{
			this.getReceipts();

			this.getReturnAuthorizations();

			var origin = 0
			,	applied_to_transaction;


			if (this.isSCISIntegrationEnabled &&
				!this.record.getFieldValue('source') &&
				this.record.getFieldValue('location') &&
				nlapiLookupField(this.result.recordtype, this.result.internalid, 'location.locationtype') === Configuration.get('locationTypeMapping.store.internalid'))
			{
				origin = 1; //store
			}
			else if (this.record.getFieldValue('source'))
			{
				origin = 2; //online
			}

			this.result.origin = origin;

			if (this.result.recordtype === 'salesorder')
			{
				applied_to_transaction = _(_.where(this.result.receipts || [], {recordtype: 'invoice'})).pluck('internalid');
			}
			else if (this.result.recordtype === 'invoice')
			{
				applied_to_transaction = [this.result.internalid];
			}

			this.getFulfillments();

			if (applied_to_transaction && applied_to_transaction.length)
			{
				this.getAdjustments({paymentMethodInformation: true, appliedToTransaction: applied_to_transaction});
			}

			this.result.ismultishipto = this.record.getFieldValue('ismultishipto') === 'T';

			this.getLinesGroups();

			this.result.receipts = _.values(this.result.receipts);

			//@property {Boolean} isReturnable
			this.result.isReturnable = this.isReturnable();

			this.getPaymentEvent();

			//@property {Boolean} isCancelable
			this.result.isCancelable = this.isCancelable();
		}

	,	getTerms: function ()
		{
			var terms = nlapiLookupField(this.result.recordtype, this.result.internalid, 'terms');

			if (terms)
			{
				return {
					//@property {String} internalid
					internalid: terms
					//@property {String} name
				,	name: nlapiLookupField(this.result.recordtype, this.result.internalid, 'terms', true)
				};
			}

			return null;
		}

	,	getStatus: function ()
		{
			this.result.status =
			{
				internalid: nlapiLookupField(this.result.recordtype, this.result.internalid, 'status')
			,	name: nlapiLookupField(this.result.recordtype, this.result.internalid, 'status', true)
			};
		}
	,	getLinesGroups: function ()
		{
			var self = this;

			_.each(this.result.lines, function (line)
			{
				var line_group_id = '';

				if (self.result.recordtype === 'salesorder')
				{
					if ( (self.isPickupInStoreEnabled && line.fulfillmentChoice === 'pickup') || (!self.result.ismultishipto && (!line.isfulfillable || !self.result.shipaddress)) || (self.result.ismultishipto && (!line.shipaddress || !line.shipmethod)))
					{

						if ( (self.isSCISIntegrationEnabled && self.result.origin === 1) || (self.isPickupInStoreEnabled && line.fulfillmentChoice === 'pickup') )
						{
							line_group_id = 'instore';
						}
						else
						{
							line_group_id = 'nonshippable';
						}
					}
					else
					{
						line_group_id = 'shippable';
					}
				}
				else
				{
					line_group_id = 'instore';
				}

				line.linegroup = line_group_id;
			});

		}
	,	getFulfillments: function ()
		{
			if (this.result.recordtype !== 'salesorder')
			{
				var location = this.record.getFieldValue('location');

				_.each(this.result.lines, function (line)
				{
					line.quantityfulfilled = line.quantity;
					line.location = location;
				});

				return;
			}


			this.result.fulfillments = {};

			var self = this
			,	filters = [
					new nlobjSearchFilter('internalid', null, 'is', this.result.internalid)
				,	new nlobjSearchFilter('mainline', null, 'is', 'F')
				,	new nlobjSearchFilter('shipping', null, 'is', 'F')
				,	new nlobjSearchFilter('taxline', null, 'is', 'F')
				]
			,	columns = [
					new nlobjSearchColumn('line')
				,	new nlobjSearchColumn('fulfillingtransaction')
				,	new nlobjSearchColumn('quantityshiprecv')

				,	new nlobjSearchColumn('actualshipdate')
				,	new nlobjSearchColumn('quantity')
				,	new nlobjSearchColumn('item','fulfillingtransaction')
				,	new nlobjSearchColumn('shipmethod','fulfillingtransaction')
				,	new nlobjSearchColumn('shipto','fulfillingtransaction')
				,	new nlobjSearchColumn('trackingnumbers','fulfillingtransaction')
				,	new nlobjSearchColumn('trandate','fulfillingtransaction')
				,	new nlobjSearchColumn('status','fulfillingtransaction')

					// Ship Address
				,	new nlobjSearchColumn('shipaddress','fulfillingtransaction')
				,	new nlobjSearchColumn('shipaddress1','fulfillingtransaction')
				,	new nlobjSearchColumn('shipaddress2','fulfillingtransaction')
				,	new nlobjSearchColumn('shipaddressee','fulfillingtransaction')
				,	new nlobjSearchColumn('shipattention','fulfillingtransaction')
				,	new nlobjSearchColumn('shipcity','fulfillingtransaction')
				,	new nlobjSearchColumn('shipcountry','fulfillingtransaction')
				,	new nlobjSearchColumn('shipstate','fulfillingtransaction')
				,	new nlobjSearchColumn('shipzip','fulfillingtransaction')
				];

			var pick_pack_ship_is_enabled = !!Utils.isFeatureEnabled('PICKPACKSHIP');
			var is_uom_enabled = ModelsInit.context.getSetting('FEATURE', 'UNITSOFMEASURE') === 'T'

			if (pick_pack_ship_is_enabled)
			{
				columns.push(new nlobjSearchColumn('quantitypicked'));
				columns.push(new nlobjSearchColumn('quantitypacked'));
			}

			if(is_uom_enabled)
			{
				columns.push(new nlobjSearchColumn('quantityuom'));
			}

			Application.getAllSearchResults('salesorder', filters, columns).forEach(function (ffline)
			{
				var fulfillment_id = ffline.getValue('fulfillingtransaction')
				,	line_internalid = self.result.internalid + '_' + ffline.getValue('line')
				,	line = _.findWhere(self.result.lines, {internalid: line_internalid})
				,	quantity = new BigNumber(ffline.getValue('quantity'))
				,	quantity_uom = !!ffline.getValue('quantityuom') ? new BigNumber(ffline.getValue('quantityuom')) :  new BigNumber(1)
				,	quantity_fulfilled = new BigNumber(ffline.getValue('quantityshiprecv'))
				,	quantity_picked = new BigNumber(ffline.getValue('quantitypicked'))
				,	quantity_packed = new BigNumber(ffline.getValue('quantitypacked'))
				,	zero = new BigNumber(0);

				if (fulfillment_id)
				{
					var shipaddress = self.addAddress({
							internalid: ffline.getValue('shipaddress', 'fulfillingtransaction')
						,	country: ffline.getValue('shipcountry', 'fulfillingtransaction')
						,	state: ffline.getValue('shipstate', 'fulfillingtransaction')
						,	city: ffline.getValue('shipcity', 'fulfillingtransaction')
						,	zip: ffline.getValue('shipzip', 'fulfillingtransaction')
						,	addr1: ffline.getValue('shipaddress1', 'fulfillingtransaction')
						,	addr2: ffline.getValue('shipaddress2', 'fulfillingtransaction')
						,	attention: ffline.getValue('shipattention', 'fulfillingtransaction')
						,	addressee: ffline.getValue('shipaddressee', 'fulfillingtransaction')
					}, self.result);

					self.result.fulfillments[fulfillment_id] = self.result.fulfillments[fulfillment_id] || {
						internalid: fulfillment_id
					,	shipaddress: shipaddress
					,	shipmethod: self.addShippingMethod({
							internalid : ffline.getValue('shipmethod','fulfillingtransaction')
						,	name : ffline.getText('shipmethod','fulfillingtransaction')
						})
					,	date: ffline.getValue('actualshipdate')
					,	trackingnumbers: ffline.getValue('trackingnumbers','fulfillingtransaction') ? ffline.getValue('trackingnumbers','fulfillingtransaction').split('<BR>') : null
					,	lines: []
					,	status: {
								internalid: ffline.getValue('status','fulfillingtransaction')
							,	name: ffline.getText('status','fulfillingtransaction')
						}
					,
					};

					self.result.fulfillments[fulfillment_id].lines.push({
						internalid: line_internalid
					,	quantity: quantity.toNumber()
					});
				}

				if (line)
				{
					var conversion_units =  quantity.gt(zero) && quantity_uom.gt(zero) ? quantity.dividedBy(quantity_uom) : new BigNumber(1);
					line.quantityfulfilled = quantity_fulfilled;

					if (line.fulfillmentChoice && line.fulfillmentChoice === 'pickup')
					{
						line.quantitypicked = pick_pack_ship_is_enabled ? quantity_picked.minus(line.quantityfulfilled) : zero;
						line.quantitybackordered = quantity.minus(line.quantityfulfilled).minus(line.quantitypicked);
					}
					else
					{
						line.quantitypacked = pick_pack_ship_is_enabled ? quantity_packed.minus(line.quantityfulfilled) : zero;
						line.quantitypicked = pick_pack_ship_is_enabled ? quantity_picked.minus(line.quantitypacked).minus(line.quantityfulfilled) : zero;
						line.quantitybackordered = quantity.minus(line.quantityfulfilled).minus(line.quantitypacked).minus(line.quantitypicked);
						line.quantitypacked = line.quantitypacked.dividedBy(conversion_units).toNumber();
					}

					line.quantityfulfilled = line.quantityfulfilled.dividedBy(conversion_units).toNumber();
                    line.quantitypicked = line.quantitypicked.dividedBy(conversion_units).toNumber();
                    line.quantitybackordered = line.quantitybackordered.dividedBy(conversion_units).toNumber();
				}
			});

			this.result.fulfillments = _.values(this.result.fulfillments);
		}

		//@method isReturnable Indicate if the current loaded transaction is returnable or not
		//@return {Boolean}
	,	isReturnable: function ()
		{
			if (this.result.recordtype === 'salesorder')
			{
				var status_id = this.record.getFieldValue('statusRef');

				return status_id !== 'pendingFulfillment' && status_id !== 'pendingApproval' && status_id !== 'closed' && status_id !== 'canceled';
			}
			else
			{
				return true;
			}
		}
	,	getReceipts: function ()
		{
			this.result.receipts = Transaction.list({
				createdfrom: this.result.internalid
			,	types: 'CustInvc,CashSale'
			,	page: 'all'
			});


		}
	,	getReturnAuthorizations: function ()
		{
			var created_from = _(this.result.receipts || []).pluck('internalid');

			created_from.push(this.result.internalid);

			this.result.returnauthorizations = ReturnAuthorization.list({
					createdfrom: created_from
				,	page: 'all'
				,	getLines: true
			});
		}

	,	postGet: function ()
		{
			this.result.lines = _.reject(this.result.lines, function (line)
			{
				return line.quantity === 0;
			});
		}

	,	getPaymentEvent: function ()
		{
			if (this.record.getFieldValue('paymethtype') === 'external_checkout')
			{
			this.result.paymentevent = {
				holdreason: this.record.getFieldValue('paymenteventholdreason')
				,	redirecturl: ExternalPayment.generateUrl(this.result.internalid, this.result.recordtype)
			};
		}
			else
			{
				this.result.paymentevent = { };
			}

		}

	,	update: function (id, data, headers)
		{
			var result = 'OK';

			if (data.status ==='cancelled')
			{

				var url = 'https://' + Application.getHost() + '/app/accounting/transactions/salesordermanager.nl?type=cancel&xml=T&id=' + id
    		   	,	cancel_response = nlapiRequestURL(url, null, headers);

				if (cancel_response.getCode() === 206)
				{
					if (nlapiLookupField('salesorder', id, 'statusRef') !== 'cancelled')
					{
						result = 'ERR_ALREADY_APPROVED_STATUS';
					}
					else
					{
						result = 'ERR_ALREADY_CANCELLED_STATUS';
					}
				}
			}

			return result;
		}

		//@method isCancelable
		//@return {Boolean}
	,	isCancelable: function ()
		{
			return this.result.recordtype === 'salesorder' && this.result.status.internalid === 'pendingApproval';
		}

		//@method getCreatedFrom
		//return {Void}
	,	getCreatedFrom: function ()
		{
			var	fields = ['createdfrom.tranid', 'createdfrom.internalid', 'createdfrom.type']
			,	result = nlapiLookupField(this.recordType, this.recordId, fields);

			if (result)
			{
				//@class Transaction.Model.Get.Result
				//@property {CreatedFrom} createdfrom
				this.result.createdfrom =
				//@class CreatedFrom
				{
					//@property {String} internalid
					internalid: result['createdfrom.internalid']
					//@property {String} name
				,	name: result['createdfrom.tranid']
					//@property {String} recordtype
				,	recordtype: result['createdfrom.type']
				};
			}

		}

	,	getAdjustments: TransactionModelExtensions.getAdjustments

	,	getLines: function ()
		{
			Transaction.getLines.apply(this, arguments);

			if (this.isPickupInStoreEnabled)
			{
				var self = this;

				_.each(this.result.lines, function (line)
				{
					line.location = self.record.getLineItemValue('item', 'location', line.index);

					var item_fulfillment_choice = self.record.getLineItemValue('item', 'itemfulfillmentchoice', line.index);

					if (item_fulfillment_choice === '1')
					{
						line.fulfillmentChoice = 'ship';
					}
					else if (item_fulfillment_choice === '2')
					{
						line.fulfillmentChoice = 'pickup';
					}
				});
			}
		}

	,	getTransactionRecord: function (record_type, id)
		{
			if (this.isPickupInStoreEnabled && record_type === 'salesorder' && Configuration.get('pickupInStoreSalesOrderCustomFormId'))
			{
				return nlapiLoadRecord(record_type, id, {customform: Configuration.get('pickupInStoreSalesOrderCustomFormId')});
			}
			else
			{
				return Transaction.getTransactionRecord.apply(this, arguments);
			}
		}
	,	_addTransactionColumnFieldsToOptions: function (line)
		{
			var self = this;
			var lineFieldsId = self.record.getAllLineItemFields('item');
			_.each(lineFieldsId, function(field){
				if(field.indexOf('custcol') === 0)
				{
					var lineId = line.index;
					var fieldValue = self.record.getLineItemValue('item', field, lineId);
					if(fieldValue !== null)
					{
						var fieldInf = self.record.getLineItemField('item', field, lineId);
						if(fieldInf !== null){
							line.options.push(
								self.transactionModelGetLineOptionBuilder(
									field
								,	fieldInf.label
								,	self.transactionModelGetLineOptionValueBuilder(undefined, fieldValue)
								,	fieldInf.mandatory
								)
							);
						}
					}
				}
			});
		}
	});
});

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// OrderHistory.ServiceController.js
// ----------------
// Service to manage placed orders requests
define(
	'OrderHistory.ServiceController'
,	[
		'ServiceController'
	,	'OrderHistory.Model'
	]
,	function(
		ServiceController
	,	OrderHistoryModel
	)
	{
		'use strict';

		// @class OrderHistory.ServiceController Manage placed orders requests
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'OrderHistory.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: function() {
				return {
					common: {
						requireLogin: true
						, requirePermissions: {
							list: [
								'transactions.tranFind.1'
								, OrderHistoryModel.isSCISIntegrationEnabled ? 'transactions.tranPurchases.1' : 'transactions.tranSalesOrd.1'
							]
						}
					}
				}
			}

			// @method get The call to OrderHistory.Service.ss with http method 'get' is managed by this function
			// @return {Transaction.Model.Get.Result || Transaction.Model.List.Result}
		,	get: function ()
			{
				var recordtype = this.request.getParameter('recordtype')
				,	id = this.request.getParameter('internalid');
				//If the id exist, sends the response of Order.get(id), else sends the response of (Order.list(options) || [])
				if (recordtype && id)
				{
					return OrderHistoryModel.get(recordtype, id);
				}
				else
				{
					return OrderHistoryModel.list({
						filter: this.request.getParameter('filter')
					,	order: this.request.getParameter('order')
					,	sort: this.request.getParameter('sort')
					,	from: this.request.getParameter('from')
					,	to: this.request.getParameter('to')
					,	origin: this.request.getParameter('origin')
					,	page: this.request.getParameter('page') || 1
					,	results_per_page: this.request.getParameter('results_per_page')
					});
				}
			}

			// @method put The call to OrderHistory.Service.ss with http method 'put' is managed by this function
			// @return {Transaction.Model.Get.Result}
		,	put: function()
			{
				var id = this.request.getParameter('internalid')
				,	cancel_result = OrderHistoryModel.update(id, this.data, this.request.getAllHeaders())
				,	record = OrderHistoryModel.get(this.data.recordtype, id);
				
				record.cancel_response = cancel_result;
				return record;
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// PaymentMethod.ServiceController.js
// ----------------
// Service to manage credit cards requests
define(
	'PaymentMethod.ServiceController'
,	[
		'ServiceController'
	,	'PaymentMethod.Model'
	]
,	function(
		ServiceController
	,	PaymentMethodModel
	)
	{
		'use strict';

		// @class PaymentMethod.ServiceController Manage credit cards requests
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'PaymentMethod.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: {
				common: {
					requireLogin: true
				}
			}

			// @method get The call to PaymentMethod.Service.ss with http method 'get' is managed by this function
			// @return {PaymentMethod.Model.Attributes || Array<PaymentMethod.Model.Attributes>} One or a list of credit cards
		,	get: function()
			{
				var id = this.request.getParameter('internalid');
				return id ? PaymentMethodModel.get(id) : (PaymentMethodModel.list() || []);
			}

			// @method post The call to PaymentMethod.Service.ss with http method 'post' is managed by this function
			// @return {StatusObject}
		,	post: function()
			{
				var id = PaymentMethodModel.create(this.data);
				this.sendContent(PaymentMethodModel.get(id), {'status': 201});
				// Do not return here as we need to output the status 201
			}

			// @method put The call to PaymentMethod.Service.ss with http method 'put' is managed by this function
			// @return {PaymentMethod.Model.Attributes} The updated credit card
		,	put: function()
			{
				var id = this.request.getParameter('internalid');
				PaymentMethodModel.update(id, this.data);
				return PaymentMethodModel.get(id);
			}

			// @method delete The call to PaymentMethod.Service.ss with http method 'delete' is managed by this function
			// @return {StatusObject}
		,	delete: function()
			{
				var id = this.request.getParameter('internalid');
				PaymentMethodModel.remove(id);

				return {'status':'ok'};
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/* global customer */

// PrintStatement.Model.js
// ----------
define(
	'PrintStatement.Model'
,	['SC.Model']
,	function (SCModel)
{
	'use strict';

	return SCModel.extend({

		name: 'PrintStatement'

	,	getUrl: function(data)
		{			
			var customerId = customer.getFieldValues(['internalid']).internalid
			,	offset = new Date().getTimezoneOffset() * 60 * 1000
			,	statementDate = null
			,	startDate = null
			,	openOnly = data.openOnly ? 'T' : 'F'
			,	inCustomerLocale = data.inCustomerLocale ? 'T' : 'F'
			,	consolidatedStatement = data.consolidatedStatement ? 'T' : 'F'
			,	statementTimestamp = parseInt(data.statementDate,10)
			,	startDateParam = data.startDate
			,	startTimestamp = parseInt(startDateParam,10)
			,	email = data.email
			,	baseUrl = email ? '/app/accounting/transactions/email.nl' : '/app/accounting/print/NLSPrintForm.nl'
			,	url = baseUrl + '?submitted=T&printtype=statement&currencyprecision=2&formdisplayview=NONE&type=statement';

			if(isNaN(statementTimestamp) || (startDateParam && isNaN(startTimestamp))){
				throw {
					status: 500
				,	code: 'ERR_INVALID_DATE_FORMAT'
				,	message: 'Invalid date format'
				};
			}

			statementDate = nlapiDateToString(new Date(statementTimestamp + offset));
			startDate = startDateParam ? nlapiDateToString(new Date(startTimestamp + offset)) : null;

			url += '&customer=' + customerId;
			url += startDate ? ('&start_date=' + startDate) : '';
			url += '&statement_date=' +  statementDate;
			url += '&consolstatement=' + consolidatedStatement;
			url += '&openonly=' + openOnly;
			url += '&incustlocale=' + inCustomerLocale;

			return url;
		}
	});
});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// PrintStatement.ServiceController.js
// ----------------
// Service to manage print requests
define(
	'PrintStatement.ServiceController'
,	[
		'ServiceController'
	,	'PrintStatement.Model'
	]
,	function(
		ServiceController
	,	PrintStatementModel
	)
	{
		'use strict';

		// @class PrintStatement.ServiceController Manage print requests
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'PrintStatement.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: {
				common: {
					requireLogin: true
				}
			,	post : {
					requirePermissions: {
						extraList: [
							'transactions.tranStatement.2'
						]
					}
				}
			}

			// @method post The call to PrintStatement.Service.ss with http method 'post' is managed by this function
			// @return {PrintStatementModel.UrlObject}
		,	post: function()
			{
				return {'url': PrintStatementModel.getUrl(this.data)};
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

define('ProductList.Item.Search'
,	[
		'Application'
	,	'SC.Models.Init'
	,	'Utils'
	,	'Configuration'

	,	'underscore'
	]
,	function (
		Application
	,	ModelsInit
	,	Utils
	,	Configuration

	,	_
	)
{
	'use strict';

	var StoreItem;

	try {
		StoreItem = require('StoreItem.Model');
	}
	catch(e)
	{
	}

	return {

		configuration: Configuration.get().productList

	,	verifySession: function()
		{
			if (this.configuration.loginRequired && !ModelsInit.session.isLoggedIn2())
			{
				throw unauthorizedError;
			}
		}

	,	getProductName: function (item)
		{
			if (!item)
			{
				return '';
			}

			// If its a matrix child it will use the name of the parent
			if (item && item.matrix_parent && item.matrix_parent.internalid)
			{
				return item.matrix_parent.storedisplayname2 || item.matrix_parent.displayname;
			}

			// Other ways return its own name
			return item.storedisplayname2 || item.displayname;
		}

		// Retrieves all Product List Items related to the given Product List Id
	,	search: function (user, product_list_id, include_store_item, sort_and_paging_data)
		{
			this.verifySession();

			if (!product_list_id)
			{
				return []; //it may happens when target list is a template and don't have a record yet.
			}

			var filters = [
				new nlobjSearchFilter('custrecord_ns_pl_pli_productlist', null, 'is', product_list_id)
			,	new nlobjSearchFilter('isinactive', null, 'is', 'F')
			,	new nlobjSearchFilter('custrecord_ns_pl_pl_owner', 'custrecord_ns_pl_pli_productlist', 'is', user)]
			,	sort_column = sort_and_paging_data.sort
			,	sort_direction = sort_and_paging_data.order;

			if (!sort_column)
			{
				sort_column = 'created';
			}

			if (sort_column === 'priority')
			{
				sort_column = 'priority_value';
			}

			if (!sort_direction)
			{
				sort_direction = '-1';
			}

			var search_lines = this.searchHelper(filters, sort_column, sort_direction === '-1' ? 'DESC' : 'ASC', include_store_item);


			if (include_store_item && sort_column === 'price')
			{
				//-1 for descending, 1 for ascending
				search_lines = this.sortLinesByPrice(search_lines, sort_direction === '-1' ? -1 : 1);
			}

			return search_lines;
		}

		//UX expect the list to be sorted by price considering discounts and bulk pricing
		//this price is not present on data-store, so in memory rules and sorting are required.
	,	sortLinesByPrice: function (lines, sort_direction)
		{
			return _.sortBy(lines, function (line)
			{
				//defaults to price level 1
				var price_detail = line.item.onlinecustomerprice_detail || {}
				,	price = price_detail.onlinecustomerprice || line.item.pricelevel1 || 0
				,	quantity = line.quantity;

				if (quantity && price_detail.priceschedule && price_detail.priceschedule.length)
				{
					var price_schedule = _.find(price_detail.priceschedule, function(price_schedule)
					{
						return	(price_schedule.minimumquantity <= quantity && quantity < price_schedule.maximumquantity) ||
								(price_schedule.minimumquantity <= quantity && !price_schedule.maximumquantity);
					});

					price = price_schedule.price;
				}

				return price * sort_direction;
			});
		}

	,	parseLineOptionsFromProductList: function (options_object)
		{
			var result = [];
			_.each(options_object, function (value, key)
			{
				result.push({
					cartOptionId: key
				,	value: {
						internalid: value.value
					,	label: value.displayvalue
					}
					//new values
				,	itemOptionId: value.itemOptionId
				,	label: value.label
				,	type: value.type
				,	values: value.values
				});
			});

			return result;
		}

	,	searchHelper: function (filters, sort_column, sort_direction, include_store_item)
		{
			// Selects the columns
			var productListItemColumns = {
				internalid: new nlobjSearchColumn('internalid')
			,	name:  new nlobjSearchColumn('formulatext', 'custrecord_ns_pl_pli_item').setFormula('case when LENGTH({custrecord_ns_pl_pli_item.displayname}) > 0 then {custrecord_ns_pl_pli_item.displayname} else {custrecord_ns_pl_pli_item.itemid} end')
			,	sku:  new nlobjSearchColumn('formulatext', 'custrecord_ns_pl_pli_item').setFormula('{custrecord_ns_pl_pli_item.itemid}')
			,	description: new nlobjSearchColumn('custrecord_ns_pl_pli_description')
			,	options: new nlobjSearchColumn('custrecord_ns_pl_pli_options')
			,	quantity: new nlobjSearchColumn('custrecord_ns_pl_pli_quantity')
			,	price: new nlobjSearchColumn('price', 'custrecord_ns_pl_pli_item')
			,	created: new nlobjSearchColumn('created')
			,	item_id: new nlobjSearchColumn('custrecord_ns_pl_pli_item')
			,	item_type: new nlobjSearchColumn('type', 'custrecord_ns_pl_pli_item')
			,	item_matrix_parent: new nlobjSearchColumn('parent', 'custrecord_ns_pl_pli_item')
			,	priority: new nlobjSearchColumn('custrecord_ns_pl_pli_priority')
			,	priority_value: new nlobjSearchColumn('custrecord_ns_pl_plip_value', 'custrecord_ns_pl_pli_priority')
			,	lastmodified: new nlobjSearchColumn('lastmodified')
			};

			productListItemColumns[sort_column] && productListItemColumns[sort_column].setSort(sort_direction === 'DESC');

			// Makes the request and format the response
			var records = Application.getAllSearchResults('customrecord_ns_pl_productlistitem', filters, _.values(productListItemColumns))
			,	productlist_items = []
			,	self = this;

			_(records).each(function (productListItemSearchRecord)
			{
				var itemInternalId = productListItemSearchRecord.getValue('custrecord_ns_pl_pli_item')
				,	itemId = productListItemSearchRecord.getText('custrecord_ns_pl_pli_item')
				,	itemMatrixParent = productListItemSearchRecord.getValue('parent', 'custrecord_ns_pl_pli_item')
				,	created_date = nlapiStringToDate(productListItemSearchRecord.getValue('created'), window.dateformat)
				,	created_date_str = nlapiDateToString(created_date, window.dateformat)
				,	itemType = productListItemSearchRecord.getValue('type', 'custrecord_ns_pl_pli_item')
				,	productListItem = {
						internalid: productListItemSearchRecord.getId()
					,	description: productListItemSearchRecord.getValue('custrecord_ns_pl_pli_description')
					,	options: self.parseLineOptionsFromProductList(JSON.parse(productListItemSearchRecord.getValue('custrecord_ns_pl_pli_options') || '{}'))
					,	quantity: parseInt(productListItemSearchRecord.getValue('custrecord_ns_pl_pli_quantity'), 10)
					,	created: productListItemSearchRecord.getValue('created')
					,	createddate: created_date_str
					,	lastmodified: productListItemSearchRecord.getValue('lastmodified')
					// we temporary store the item reference, after this loop we use StoreItem.preloadItems instead doing multiple StoreItem.get()
					,	store_item_reference: {
							id: itemInternalId
						,	internalid: itemInternalId
						,	type: itemType
						,	matrix_parent: itemMatrixParent
						,	itemid: itemId
						}
					,	priority: {
							id: productListItemSearchRecord.getValue('custrecord_ns_pl_pli_priority')
						,	name: productListItemSearchRecord.getText('custrecord_ns_pl_pli_priority')
						}
					};
				productlist_items.push(productListItem);
			});

			var store_item_references = _(productlist_items).pluck('store_item_reference')
			,	results = [];

			// preload all the store items at once for performance
			StoreItem && StoreItem.preloadItems(store_item_references);

			_(productlist_items).each(function (productlist_item)
			{
				var store_item_reference = productlist_item.store_item_reference
				// get the item - fast because it was preloaded before. Can be null!
				,	store_item = StoreItem ? StoreItem.get(store_item_reference.id, store_item_reference.type) : store_item_reference;

				delete productlist_item.store_item_reference;

				if (!store_item)
				{
					return;
				}

				if (include_store_item || !StoreItem)
				{
					productlist_item.item = store_item;
					//Parse the internalid to number to be SearchAPI complaint
					productlist_item.item.internalid = parseInt(productlist_item.item.internalid,10);
				}
				else
				{
					// only include basic store item data - fix the name to support matrix item names.
					productlist_item.item = {
						internalid: parseInt(store_item_reference.id, 10)
					,	displayname: self.getProductName(store_item)
					,	ispurchasable: store_item.ispurchasable
					,	itemoptions_detail: store_item.itemoptions_detail
					,	minimumquantity: store_item.minimumquantity
					};
				}

				if (!include_store_item && store_item && store_item.matrix_parent)
				{
					productlist_item.item.matrix_parent = store_item.matrix_parent;
				}

				results.push(productlist_item);
			});

			return results;
		}
	};
});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// ProductList.Model.js
// ----------------
// Handles creating, fetching and updating Product Lists
define(
	'ProductList.Model'
,	[
		'SC.Model'
	,	'Application'
	,	'SC.Models.Init'
	,	'ProductList.Item.Search'
	,	'Utils'
	,	'Configuration'
	,	'underscore']
,	function(
		SCModel
	,	Application
	,	ModelsInit
	,	ProductListItemSearch
	,	Utils
	,	Configuration
	,	_)
{
	'use strict';

	return SCModel.extend({
		name: 'ProductList'
		// ## General settings
	,	configuration: Configuration.get('productList')
	,	later_type_id: '2'
	,	quote_type_id: '4'

	,	verifySession: function()
		{
			if (!!_.result(this.configuration, 'loginRequired') && !ModelsInit.session.isLoggedIn2())
			{
				throw unauthorizedError;
			}
		}

	,	getColumns: function ()
		{
			return {
				internalid: new nlobjSearchColumn('internalid')
			,	templateid: new nlobjSearchColumn('custrecord_ns_pl_pl_templateid')
			,	name: new nlobjSearchColumn('name')
			,	description: new nlobjSearchColumn('custrecord_ns_pl_pl_description')
			,	owner: new nlobjSearchColumn('custrecord_ns_pl_pl_owner')
			,	scope: new nlobjSearchColumn('custrecord_ns_pl_pl_scope')
			,	type: new nlobjSearchColumn('custrecord_ns_pl_pl_type')
			,	created: new nlobjSearchColumn('created')
			,	lastmodified: new nlobjSearchColumn('lastmodified')
			};
		}

		// Returns a product list based on a given userId and id
	,	get: function (user, id)
		{
			this.verifySession();

			var filters = [new nlobjSearchFilter('internalid', null, 'is', id)
				,	new nlobjSearchFilter('isinactive', null, 'is', 'F')
				,	new nlobjSearchFilter('custrecord_ns_pl_pl_owner', null, 'is', user)
				]
			,	product_lists = this.searchHelper(filters, this.getColumns(), true);

			if (product_lists.length >= 1)
			{
				return product_lists[0];
			}
			else
			{
				throw notFoundError;
			}
		}

		// Returns the user's saved for later product list
	,	getSavedForLaterProductList: function (user)
		{
			return this.getSpecialTypeProductList(user, this.later_type_id);
		}

	,	getRequestAQuoteProductList: function (user)
		{
			return this.getSpecialTypeProductList(user, this.quote_type_id);
		}

	,	getSpecialTypeProductList: function (user, type_id)
		{

			this.verifySession();

			var filters = [new nlobjSearchFilter('custrecord_ns_pl_pl_type', null, 'is', type_id)
				,	new nlobjSearchFilter('custrecord_ns_pl_pl_owner', null, 'is', user)
				,	new nlobjSearchFilter('isinactive', null, 'is', 'F')]
			,	product_lists = this.searchHelper(filters, this.getColumns(), true);

			if (product_lists.length >= 1)
			{
				return product_lists[0];
			}
			else
			{
				var sfl_template = _(_(this.configuration.listTemplates).filter(function (pl)
				{
					return pl.typeId && pl.typeId === type_id;
				})).first();
				if (sfl_template)
				{
					if (!sfl_template.scope)
					{
						sfl_template.scope = { id: type_id, name: 'private' };
					}

					if (!sfl_template.description)
					{
						sfl_template.description = '';
					}

					return sfl_template;
				}
				throw notFoundError;
			}
		}

		// Sanitize html input
	,	sanitize: function (text)
		{
			return text ? text.replace(/<br>/g, '\n').replace(/</g, '&lt;').replace(/\>/g, '&gt;') : '';
		}

	,	searchHelper: function(filters, columns, include_store_items, order, template_ids)
		{
			// Sets the sort order
			var order_tokens = order && order.split(':') || []
			,	sort_column = order_tokens[0] || 'name'
			,	sort_direction = order_tokens[1] || 'ASC'
			,	productLists = [];

			columns[sort_column] && columns[sort_column].setSort(sort_direction === 'DESC');

			// Makes the request and format the response
			var records = Application.getAllSearchResults('customrecord_ns_pl_productlist', filters, _.values(columns));

			_.each(records, function (productListSearchRecord)
			{

				var product_list_type_text = productListSearchRecord.getText('custrecord_ns_pl_pl_type')
				,	last_modified_date = nlapiStringToDate(productListSearchRecord.getValue('lastmodified'), window.dateformat)
				,	last_modified_date_str = nlapiDateToString(last_modified_date, window.dateformat)
				,	productList = {
						internalid: productListSearchRecord.getId()
					,	templateId: productListSearchRecord.getValue('custrecord_ns_pl_pl_templateid')
					,	name: productListSearchRecord.getValue('name')
					,	description: productListSearchRecord.getValue('custrecord_ns_pl_pl_description') ? productListSearchRecord.getValue('custrecord_ns_pl_pl_description').replace(/\n/g, '<br>') : ''
					,	owner: {
							id: productListSearchRecord.getValue('custrecord_ns_pl_pl_owner')
						,	name: productListSearchRecord.getText('custrecord_ns_pl_pl_owner')
						}
					,	scopeId: productListSearchRecord.getValue('custrecord_ns_pl_pl_scope')
					,	scopeName: productListSearchRecord.getText('custrecord_ns_pl_pl_scope')
					,	typeId: productListSearchRecord.getValue('custrecord_ns_pl_pl_type')
					,	typeName: product_list_type_text
					,	created: productListSearchRecord.getValue('created')
					,	lastmodified: productListSearchRecord.getValue('lastmodified')
					,	lastmodifieddate: last_modified_date_str
					,	items: ProductListItemSearch.search(productListSearchRecord.getValue('custrecord_ns_pl_pl_owner'), productListSearchRecord.getId(), include_store_items, {
								sort: 'sku'
							,	order: '1'
							,	page: -1
						})
					};

				if (template_ids && productList.templateId)
				{
					template_ids.push(productList.templateId);
				}

				productLists.push(productList);
			});

			return productLists;
		}

		// Retrieves all Product Lists for a given user
	,	search: function (user, order)
		{

			var filters = [
					new nlobjSearchFilter('isinactive', null, 'is', 'F')
				,	new nlobjSearchFilter('custrecord_ns_pl_pl_owner', null, 'is', user)
				]
			,	template_ids = []
			,	product_lists = this.searchHelper(filters, this.getColumns(), false, order, template_ids)
			,	self = this;

			// Add possible missing predefined list templates
			_(this.configuration.listTemplates).each(function(template) {
				if (!_(template_ids).contains(template.templateId))
				{
					if (!template.templateId || !template.name)
					{
						console.log('Error: Wrong predefined Product List. Please check backend configuration.');
					}
					else
					{
						if (!template.scopeId)
						{
							template.scopeId = '2';
							template.scopeName = 'private';
						}

						if (!template.description)
						{
							template.description = '';
						}

						if (!template.typeId)
						{
							template.typeId = '3';
							template.typeName = 'predefined';
						}

						// This conversion to "string" is necessary since there exist an inconsistency between backend response and default values in ProductList.json
						template.scopeId = template.scopeId + '';

						product_lists.push(template);
					}
				}
			});

			if (this.isSingleList())
			{
				return _.filter(product_lists, function(pl)
				{
					// Only return predefined lists.
					return pl.typeName === 'predefined';
				});
			}

			return product_lists.filter(function (pl)
			{
				return pl.typeId !== self.later_type_id && pl.typeId !== self.quote_type_id;
			});
		}

	,	isSingleList: function ()
		{
			var self = this;

			return !this.configuration.additionEnabled && this.configuration.listTemplates && _.filter(this.configuration.listTemplates, function (pl) { return !pl.typeId || (pl.typeId !== self.later_type_id && pl.typeId !== self.quote_type_id); }).length === 1;
		}

		// Creates a new Product List record
	,	create: function (user, data)
		{
			this.verifySession();

			var productList = nlapiCreateRecord('customrecord_ns_pl_productlist');

			data.templateId && productList.setFieldValue('custrecord_ns_pl_pl_templateid', data.templateId);
			data.scopeId && productList.setFieldValue('custrecord_ns_pl_pl_scope', data.scopeId);
			data.typeId && productList.setFieldValue('custrecord_ns_pl_pl_type', data.typeId);
			data.name && productList.setFieldValue('name', this.sanitize(data.name));
			data.description && productList.setFieldValue('custrecord_ns_pl_pl_description', this.sanitize(data.description));

			productList.setFieldValue('custrecord_ns_pl_pl_owner', user);

			return nlapiSubmitRecord(productList);
		}

		// Updates a given Product List given its id
	,	update: function (user, id, data)
		{
			this.verifySession();

			var product_list = nlapiLoadRecord('customrecord_ns_pl_productlist', id);

			if (parseInt(product_list.getFieldValue('custrecord_ns_pl_pl_owner'), 10) !== user)
			{
				throw unauthorizedError;
			}

			data.templateId && product_list.setFieldValue('custrecord_ns_pl_pl_templateid', data.templateId);
			data.scopeId && product_list.setFieldValue('custrecord_ns_pl_pl_scope', data.scopeId);
			data.typeId && product_list.setFieldValue('custrecord_ns_pl_pl_type', data.typeId);
			data.name && product_list.setFieldValue('name', this.sanitize(data.name));
			product_list.setFieldValue('custrecord_ns_pl_pl_description', data.description ? this.sanitize(data.description) : '');

			nlapiSubmitRecord(product_list);
		}

		// Deletes a Product List given its id
	,	delete: function(user, id)
		{
			this.verifySession();

			var product_list = nlapiLoadRecord('customrecord_ns_pl_productlist', id);

			if (parseInt(product_list.getFieldValue('custrecord_ns_pl_pl_owner'), 10) !== user)
			{
				throw unauthorizedError;
			}

			product_list.setFieldValue('isinactive', 'T');

			var internalid = nlapiSubmitRecord(product_list);

			return internalid;
		}
	});
});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// ProductList.ServiceController.js
// ----------------
// Service to manage credit cards requests
define(
	'ProductList.ServiceController'
,	[
		'ServiceController'
	,	'SC.Models.Init'
	,	'Application'
	,	'ProductList.Model'
	]
,	function(
		ServiceController
	,	ModelsInit
	,	Application
	,	ProductListModel
	)
	{
		'use strict';

		// @class ProductList.ServiceController  Manage product list request
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'ProductList.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: {
				common: {
					requireLoggedInPPS: true
				}
			}

			// @method getUser
			// @return {Integer} user id
		,	getUser: function()
			{
				var user = ModelsInit.session.isLoggedIn2() ? nlapiGetUser() : 0
				,	role = ModelsInit.context.getRoleId();

				// This is to ensure customers can't query other customer's product lists.
				if (role !== 'shopper' && role !== 'customer_center')
				{
					user = parseInt(this.request.getParameter('user') || (this.data.owner && this.data.owner.id) || user, 10);
				}
				return user;
			}

			// @method getId
			// @return {String} internalid
		,	getId: function()
			{
				return this.request.getParameter('internalid') || this.data.internalid;
			}

			// @method get The call to ProductList.Service.ss with http method 'get' is managed by this function
			// @return {ProductList.Model.Get.Result || ProductList.Model.List.Result}
		,	get: function()
			{

				var id = this.getId()
				,	user = this.getUser();

				if (id)
				{
					if (id === 'later')
					{
						return ProductListModel.getSavedForLaterProductList(user);
					}
					else if (id === 'quote')
					{
						return ProductListModel.getRequestAQuoteProductList(user);
					}
					else
					{
						return ProductListModel.get(user, id);
					}
				}
				else
				{
					return ProductListModel.search(user, 'name');
				}
			}

			// @method post The call to ProductList.Service.ss with http method 'post' is managed by this function
			// @return {StatusObject}
		,	post: function()
			{
				var user = this.getUser()
				,	internalid = ProductListModel.create(user, this.data);
				// Do not return here as we need to output the status 201
				this.sendContent(ProductListModel.get(user, internalid), {'status': 201});
			}

			// @method put The call to ProductList.Service.ss with http method 'put' is managed by this function
			// @return {ProductList.Model.Get.Result}
		,	put: function()
			{
				var id = this.getId()
				,	user = this.getUser();
				ProductListModel.update(user, id, this.data);
				return ProductListModel.get(user, id);
			}

			// @method delete The call to ProductList.Service.ss with http method 'delete' is managed by this function
			// @return {StatusObject}
		,	delete: function()
			{
				var id = this.getId()
				,	user = this.getUser();
				ProductListModel.delete(user, id);
				return {'status': 'ok'};
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ProductList
// @class ProductListItem
// Handles creating, fetching and updating Product List Items @extends SCModel
define(
	'ProductList.Item.Model'
,	[
		'SC.Model'
	,	'SC.Models.Init'
	,	'Application'
	,	'Utils'
	,	'ProductList.Model'
	,	'ProductList.Item.Search'
	,	'Configuration'

	,	'underscore'
	]
,	function (
			SCModel
		,	ModelsInit
		,	Application
		,	Utils
		,	ProductList
		,	Search
		,	Configuration

		,	_)
{
	'use strict';
	return SCModel.extend({

		name: 'ProductList.Item'

		// @property {Configuration.ProductList} configuration General settings
	,	configuration: Configuration.get().productList

		// @method verifySession @throws {unauthorizedError}it if the user has not the appropriate session for accessing product lists.
	,	verifySession: function()
		{
			if (this.configuration.loginRequired && !ModelsInit.session.isLoggedIn2())
			{
				throw unauthorizedError;
			}
		}

		// Returns a product list item based on a given id
	,	get: function (user, id)
		{
			this.verifySession();

			var filters = [
					new nlobjSearchFilter('internalid', null, 'is', id)
				,	new nlobjSearchFilter('isinactive', null, 'is', 'F')
				,	new nlobjSearchFilter('custrecord_ns_pl_pl_owner', 'custrecord_ns_pl_pli_productlist', 'is', user)
				]
			,	sort_column = 'custrecord_ns_pl_pli_item'
			,	sort_direction = 'ASC'
			,	productlist_items = Search.searchHelper(filters, sort_column, sort_direction, true);

			if (productlist_items.length >= 1)
			{
				return productlist_items[0];
			}
			else
			{
				throw notFoundError;
			}
		}

	,	delete: function (user, id)
		{
			this.verifySession();

			var product_list_item = nlapiLoadRecord('customrecord_ns_pl_productlistitem', id)
			,	parent_product_list = ProductList.get(user, product_list_item.getFieldValue('custrecord_ns_pl_pli_productlist'));

			if (parseInt(parent_product_list.owner.id, 10) !== user)
			{
				throw unauthorizedError;
			}

			product_list_item.setFieldValue('isinactive', 'T');

			return nlapiSubmitRecord(product_list_item);
		}

		// Sanitize html input
	,	sanitize: function (text)
		{
			return text ? text.replace(/<br>/g, '\n').replace(/</g, '&lt;').replace(/\>/g, '&gt;') : '';
		}

	,	parseLineOptionsToProductList: function (options_array)
		{
			// option.value comes undefined in the case of
			// optional transaction item options that do not have a value
			var result = {};
			_.each(options_array, function (option)
			{
				result[option.cartOptionId] = {
					value: option.value && option.value.internalid
				,	displayvalue: option.value && option.value.label
				,	itemOptionId: option.itemOptionId
				,	label: option.label
				,	type: option.type
				,	values: option.values
				};
			});

			return result;
		}

		// Creates a new Product List Item record
	,	create: function (user, data)
		{
			this.verifySession();

			if (!(data.productList && data.productList.id))
			{
				throw notFoundError;
			}

			var parent_product_list = ProductList.get(user, data.productList.id);

			if (parseInt(parent_product_list.owner.id, 10) !== user)
			{
				throw unauthorizedError;
			}

			var productListItem = nlapiCreateRecord('customrecord_ns_pl_productlistitem');

			data.description && productListItem.setFieldValue('custrecord_ns_pl_pli_description', this.sanitize(data.description));

			if (data.options)
			{
				data.options && productListItem.setFieldValue('custrecord_ns_pl_pli_options', JSON.stringify(this.parseLineOptionsToProductList(data.options || {})));
			}

			data.quantity && productListItem.setFieldValue('custrecord_ns_pl_pli_quantity', data.quantity);
			data.item && data.item.internalid && productListItem.setFieldValue('custrecord_ns_pl_pli_item', data.item.internalid);
			data.priority && data.priority.id && productListItem.setFieldValue('custrecord_ns_pl_pli_priority', data.priority.id);
			productListItem.setFieldValue('custrecord_ns_pl_pli_productlist', data.productList.id);

			data.internalid = nlapiSubmitRecord(productListItem);

			return data;
		}

		// Updates a given Product List Item given its id
	,	update: function (user, id, data)
		{
			this.verifySession();

			var product_list_item = nlapiLoadRecord('customrecord_ns_pl_productlistitem', id)
			,	parent_product_list = ProductList.get(user, product_list_item.getFieldValue('custrecord_ns_pl_pli_productlist'));

			if (parseInt(parent_product_list.owner.id, 10) !== user)
			{
				throw unauthorizedError;
			}

			product_list_item.setFieldValue('custrecord_ns_pl_pli_description', this.sanitize(data.description));
			data.options && product_list_item.setFieldValue('custrecord_ns_pl_pli_options', JSON.stringify(this.parseLineOptionsToProductList(data.options || {})));
			data.quantity && product_list_item.setFieldValue('custrecord_ns_pl_pli_quantity', data.quantity);

			data.item && (data.item.id || data.item.internalid) && product_list_item.setFieldValue('custrecord_ns_pl_pli_item', (data.item.id || data.item.internalid));

			if (data.priority)
			{
				if (_.isObject(data.priority))
				{
					data.priority.id && product_list_item.setFieldValue('custrecord_ns_pl_pli_priority', data.priority.id);
				}
				else
				{
					product_list_item.setFieldValue('custrecord_ns_pl_pli_priority', data.priority);
				}
			}

			data.productList && data.productList.id && product_list_item.setFieldValue('custrecord_ns_pl_pli_productlist', data.productList.id);

			nlapiSubmitRecord(product_list_item);
		}

		// Retrieves all Product List Items related to the given Product List Id
	,	search: function (user, product_list_id, include_store_item, sort_and_paging_data)
		{
			this.verifySession();
			return Search.search(user, product_list_id, include_store_item, sort_and_paging_data);
		}

	});
});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// ProductList.Item.ServiceController.js
// ----------------
// Service to manage product list items requests
define(
	'ProductList.Item.ServiceController'
,	[
		'ServiceController'
	,	'SC.Models.Init'
	,	'Application'
	,	'ProductList.Item.Model'
	]
,	function(
		ServiceController
	,	ModelsInit
	,	Application
	,	ProductListItemModel
	)
	{
		'use strict';

		// @class ProductList.Item.ServiceController Manage product list items requests
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'ProductList.Item.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: {
				common: {
					requireLoggedInPPS: true
				}
			}

			// @method getUser
			// @return {Integer} User id
		,	getUser: function()
			{
				var role = ModelsInit.context.getRoleId()
				,	user = nlapiGetUser();

				// This is to ensure customers can't query other customer's product lists.
				if (role !== 'shopper' && role !== 'customer_center')
				{
					user = parseInt(this.request.getParameter('user') || (this.data.productList && this.data.productList.owner) || user, 10);
				}
				return user;
			}

			// @method getId
			// @return {String} internalid
		,	getId: function()
			{
				return this.request.getParameter('internalid') ? this.request.getParameter('internalid') : this.data.internalid;
			}

			// @method get The call to ProductList.Item.Service.ss with http method 'get' is managed by this function
			// @return {ProductList.Item.Model.Get.Result || ProductList.Item.Model.List.Result}
		,	get: function()
			{
				var product_list_id = this.request.getParameter('productlistid') ? this.request.getParameter('productlistid') : this.data.productlistid
				,	id = this.getId()
				,	user = this.getUser();

				return id ? ProductListItemModel.get(user, id) :
							ProductListItemModel.search(user, product_list_id, true,
								{
									sort: this.request.getParameter('sort') ? this.request.getParameter('sort') : this.data.sort // Column name
								,	order: this.request.getParameter('order') ? this.request.getParameter('order') : this.data.order // Sort direction
								,	page: this.request.getParameter('page') || -1
								}
							);
			}

			// @method post The call to ProductList.Item.Service.ss with http method 'post' is managed by this function
			// @return {StatusObject}
		,	post: function()
			{
				var	user = this.getUser();
				//Do not return this value, just send the content
				this.sendContent(ProductListItemModel.create(user, this.data), {'status': 201});
			}

			// @method put The call to ProductList.Item.Service.ss with http method 'put' is managed by this function
			// @return {ProductList.Item.Model.Get.Result}
		,	put: function()
			{
				var	id = this.getId()
				,	user = this.getUser();
				ProductListItemModel.update(user, id, this.data);
				return ProductListItemModel.get(user, id);
			}

			// @method delete The call to ProductList.Item.Service.ss with http method 'delete' is managed by this function
			// @return {StatusObject}
		,	delete: function()
			{
				var	id = this.getId()
				,	user = this.getUser();
				ProductListItemModel.delete(user, id);

				return {'status': 'ok'};
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// ProductReviews.Model.js
// ----------------
// Handles creating, fetching and updating ProductReviews
define(
	'ProductReviews.Model'
,	[
		'SC.Model'
	,	'SC.Models.Init'
	,	'Application'
	,	'Utils'
	,	'Configuration'
	,	'underscore'
	]
,	function (
		SCModel
	,	ModelsInit
	,	Application
	,	Utils
	,	Configuration
	,	_
	)
{
	'use strict';

	return SCModel.extend({
		name: 'ProductReview'
		// ## General settings
		// maxFlagsCount is the number at which a review is marked as flagged by users
	,	maxFlagsCount: Configuration.get('productReviews.maxFlagsCount')
	,	loginRequired: Configuration.get('productReviews.loginRequired')
		// the id of the flaggedStatus. If maxFlagsCount is reached, this will be its new status.
	,	flaggedStatus: Configuration.get('productReviews.flaggedStatus')
		// id of the approvedStatus
	,	approvedStatus: Configuration.get('productReviews.approvedStatus')
		// id of pendingApprovalStatus
	,	pendingApprovalStatus: Configuration.get('productReviews.pendingApprovalStatus')
	,	resultsPerPage: Configuration.get('productReviews.resultsPerPage')

		// Returns a review based on the id
	,	get: function (id)
		{
			var review = nlapiLoadRecord('customrecord_ns_pr_review', id);

			if (review)
			{
				/// Loads Review main information
				var result = {
						internalid: review.getId()
					,	status: review.getFieldValue('custrecord_ns_prr_status')
					,	isinactive: review.getFieldValue('isinactive') === 'T'
					,	title: review.getFieldValue('name') || ''
						// we parse the line breaks and get it ready for html
					,	text: review.getFieldValue('custrecord_ns_prr_text') ? review.getFieldValue('custrecord_ns_prr_text').replace(/\n/g, '<br>') : ''
					,	itemid: review.getFieldValue('custrecord_ns_prr_item_id')
					,	rating: review.getFieldValue('custrecord_ns_prr_rating')
					,	useful_count: review.getFieldValue('custrecord_ns_prr_useful_count')
					,	not_useful_count: review.getFieldValue('custrecord_ns_prr_not_useful_count')
					,	falgs_count: review.getFieldValue('custrecord_ns_prr_falgs_count')
					,	isVerified: review.getFieldValue('custrecord_ns_prr_verified') === 'T'
					,	created_on: review.getFieldValue('custrecord_ns_prr_creation_date') || review.getFieldValue('created')
					,	writer: {
							id: review.getFieldValue('custrecord_ns_prr_writer')
						,	name: review.getFieldValue('custrecord_ns_prr_writer_name') || review.getFieldText('custrecord_ns_prr_writer')
						}
					,	rating_per_attribute: {}
					}
					// Loads Attribute Rating
				,	filters = [
						new nlobjSearchFilter('custrecord_ns_prar_review', null, 'is', id)
					]

				,	columns = [
						new nlobjSearchColumn('custrecord_ns_prar_attribute')
					,	new nlobjSearchColumn('custrecord_ns_prar_rating')
					]
					// we search for the individual attribute rating records
				,	ratings_per_attribute = Application.getAllSearchResults('customrecord_ns_pr_attribute_rating', filters, columns);

				_.each(ratings_per_attribute, function (rating_per_attribute)
				{
					result.rating_per_attribute[rating_per_attribute.getText('custrecord_ns_prar_attribute')] = rating_per_attribute.getValue('custrecord_ns_prar_rating');
				});

				return result;
			}
			else
			{
				throw notFoundError;
			}
		}

	,	search: function (filters, order, page, records_per_page)
		{
			var review_filters = [
					// only approved reviews
					new nlobjSearchFilter('custrecord_ns_prr_status', null, 'is', this.approvedStatus)
					// and not inactive
				,	new nlobjSearchFilter('isinactive', null, 'is', 'F')
				]
			,	review_columns = {}
			,	result = {};

			// Creates the filters for the given arguments
			if (filters.itemid)
			{
				review_filters.push(
					new nlobjSearchFilter('custrecord_ns_prr_item_id', null, 'equalto', filters.itemid)
				);
			}

			// Only by verified buyer
			if (filters.writer)
			{
				review_filters.push(
					new nlobjSearchFilter('custrecord_ns_prr_writer', null, 'equalto', filters.writer)
				);
			}

			// only by a rating
			if (filters.rating)
			{
				review_filters.push(
					new nlobjSearchFilter('custrecord_ns_prr_rating', null, 'equalto', filters.rating)
				);
			}

			if (filters.q)
			{
				review_filters.push(
					new nlobjSearchFilter('custrecord_ns_prr_text', null, 'contains', filters.q)
				);
			}

			// Selects the columns
			review_columns = {
				internalid: new nlobjSearchColumn('internalid')
			,	title: new nlobjSearchColumn('name')
			,	text: new nlobjSearchColumn('custrecord_ns_prr_text')
			,	itemid: new nlobjSearchColumn('custrecord_ns_prr_item_id')
			,	rating: new nlobjSearchColumn('custrecord_ns_prr_rating')
			,	isVerified: new nlobjSearchColumn('custrecord_ns_prr_verified')
			,	useful_count: new nlobjSearchColumn('custrecord_ns_prr_useful_count')
			,	not_useful_count: new nlobjSearchColumn('custrecord_ns_prr_not_useful_count')
			,	writer: new nlobjSearchColumn('custrecord_ns_prr_writer')
			,	writer_name: new nlobjSearchColumn('custrecord_ns_prr_writer_name')
			,	created_on: new nlobjSearchColumn('created')
			};

			var custom_created_field_exists = Utils.recordTypeHasField('customrecord_ns_pr_review','custrecord_ns_prr_creation_date');

			if (custom_created_field_exists === true)
			{
				review_columns.custom_created_on = new nlobjSearchColumn('custrecord_ns_prr_creation_date');
			}

			// Sets the sort order
			var order_tokens = order && order.split(':') || []
			,	sort_column = order_tokens[0] || 'created'
			,	sort_direction = order_tokens[1] || 'ASC';

			review_columns[sort_column] && review_columns[sort_column].setSort(sort_direction === 'DESC');

			// Makes the request and format the response
			result = Application.getPaginatedSearchResults({
				record_type: 'customrecord_ns_pr_review'
			,	filters: review_filters
			,	columns: _.values(review_columns)
			,	page: parseInt(page, 10) || 1
			,	results_per_page: parseInt(records_per_page, 10) || this.resultsPerPage
			});

			var reviews_by_id = {}
			,	review_ids = [];

			_.each(result.records, function (review)
			{
				review_ids.push(review.getId());

				reviews_by_id[review.getId()] = {
					internalid: review.getId()
				,	title: review.getValue('name')
				,	text: review.getValue('custrecord_ns_prr_text') ? review.getValue('custrecord_ns_prr_text').replace(/\n/g, '<br>') : ''
				,	itemid: review.getValue('custrecord_ns_prr_item_id')
				,	rating: review.getValue('custrecord_ns_prr_rating')
				,	useful_count: review.getValue('custrecord_ns_prr_useful_count')
				,	not_useful_count: review.getValue('custrecord_ns_prr_not_useful_count')
				,	isVerified: review.getValue('custrecord_ns_prr_verified') === 'T'
				,	created_on: review.getValue('custrecord_ns_prr_creation_date') || review.getValue('created')
				,	writer: {
						id: review.getValue('custrecord_ns_prr_writer')
					,	name: review.getValue('custrecord_ns_prr_writer_name') || review.getText('custrecord_ns_prr_writer')
					}
				,	rating_per_attribute: {}
				};
			});

			if (review_ids.length)
			{
				/// Loads Attribute Rating
				var attribute_filters = [
						new nlobjSearchFilter('custrecord_ns_prar_review', null, 'anyof', review_ids)
					]

				,	attribute_columns = [
						new nlobjSearchColumn('custrecord_ns_prar_attribute')
					,	new nlobjSearchColumn('custrecord_ns_prar_rating')
					,	new nlobjSearchColumn('custrecord_ns_prar_review')
					]

				,	ratings_per_attribute = Application.getAllSearchResults('customrecord_ns_pr_attribute_rating', attribute_filters, attribute_columns);

				_.each(ratings_per_attribute, function (rating_per_attribute)
				{
					var review_id = rating_per_attribute.getValue('custrecord_ns_prar_review')
					,	attribute_name = rating_per_attribute.getText('custrecord_ns_prar_attribute')
					,	rating = rating_per_attribute.getValue('custrecord_ns_prar_rating');

					if (reviews_by_id[review_id])
					{
						reviews_by_id[review_id].rating_per_attribute[attribute_name] = rating;
					}
				});
			}

			result.records = _.values(reviews_by_id);

			return result;
		}

	,	create: function (data)
		{
			if (this.loginRequired && !ModelsInit.session.isLoggedIn2())
			{
				throw unauthorizedError;
			}

			var review = nlapiCreateRecord('customrecord_ns_pr_review');

			if (ModelsInit.session.isLoggedIn2())
			{
				review.setFieldValue('custrecord_ns_prr_writer', nlapiGetUser() + '');
			}

			if (data.writer)
			{
				data.writer.name && review.setFieldValue('custrecord_ns_prr_writer_name', Utils.sanitizeString(data.writer.name));
				data.writer.id && review.setFieldValue('custrecord_ns_prr_writer', data.writer.id);
			}
			data.rating && review.setFieldValue('custrecord_ns_prr_rating', data.rating);
			data.title && review.setFieldValue('name', Utils.sanitizeString(data.title));

			if (data.text)
			{
				var sanitized_text = Utils.sanitizeString(data.text);

				review.setFieldValue('custrecord_ns_prr_text', sanitized_text);
				data.text = sanitized_text.replace(/\n/g, '<br>');
			}

			data.itemid && review.setFieldValue('custrecord_ns_prr_item_id', data.itemid);

			var review_id = nlapiSubmitRecord(review);
			data.review_id = review_id;

			_.each(data.rating_per_attribute, function (rating, name)
			{
				var review_attribute = nlapiCreateRecord('customrecord_ns_pr_attribute_rating');

				review_attribute.setFieldValue('custrecord_ns_prar_item', data.itemid);
				review_attribute.setFieldValue('custrecord_ns_prar_review', review_id);
				review_attribute.setFieldValue('custrecord_ns_prar_rating', rating);
				review_attribute.setFieldText('custrecord_ns_prar_attribute', name);

				nlapiSubmitRecord(review_attribute);
			});

			return data;
		}
		// This function updates the quantity of the counters
	,	update: function (id, data)
		{
			var action = data.action

			,	field_name_by_action = {
					'flag': 'custrecord_ns_prr_falgs_count'
				,	'mark-as-useful': 'custrecord_ns_prr_useful_count'
				,	'mark-as-not-useful': 'custrecord_ns_prr_not_useful_count'
				}

			,	field_name = field_name_by_action[action];

			if (field_name)
			{
				var review = nlapiLoadRecord('customrecord_ns_pr_review', id)
				,	current_count = review.getFieldValue(field_name);

				review.setFieldValue(field_name, parseInt(current_count, 10) + 1 || 1);
				// if the review is beeing flagged, check the maxFlagsCount
				if (action === 'flag' && current_count >= this.maxFlagsCount)
				{
					// flag the review
					review.setFieldValue('custrecord_ns_prr_status', this.flaggedStatus);
				}

				nlapiSubmitRecord(review);
			}
		}
	});
});

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// ProductReviews.ServiceController.js
// ----------------
// Service to manage product review requests
define(
	'ProductReviews.ServiceController'
,	[
		'ServiceController'
	,	'Application'
	,	'ProductReviews.Model'
	]
,	function(
		ServiceController
	,	Application
	,	ProductReviewsModel
	)
	{
		'use strict';

		// @class ProductReviews.ServiceController Manage product review requests
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'ProductReviews.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: {
				common: {
					requireLoggedInPPS: true
				}
			}

			// @method get The call to ProductReviews.Service.ss with http method 'get' is managed by this function
			// @return {EmptyObject}
		,	get: function()
			{
				var result
				,	id = this.request.getParameter('internalid') ? this.request.getParameter('internalid') : this.data.internalid;
				if (id)
				{
					// we get the review
					result = ProductReviewsModel.get(id);
					// if the review is not approved
					if (result.status !== ProductReviewsModel.approvedStatus || result.isinactive)
					{
						throw notFoundError;
					}
				}
				else
				{
					var params = this.request.getAllParameters()
					,	filters = {};
					
					Object.keys(params).forEach(function(param)
					{
						filters[param] = params[param];
					});
					result = ProductReviewsModel.search(filters, filters.order, filters.page, filters.limit);
				}
				// send either the individual review, or the search result
				this.sendContent(result,{'cache': response.CACHE_DURATION_LONG});
			}

			// @method post The call to ProductReviews.Service.ss with http method 'post' is managed by this function
			// @return {StatusObject}
		,	post: function()
			{
				// Do not return here as we need to output the status 201
				this.sendContent(ProductReviewsModel.create(this.data), {'status': 201});
			}

			// @method put The call to ProductReviews.Service.ss with http method 'put' is managed by this function
			// @return {ProductReview.Model.Item}
		,	put: function()
			{
				var id = this.request.getParameter('internalid') ? this.request.getParameter('internalid') : this.data.internalid;
				// update review with the data
				ProductReviewsModel.update(id, this.data);
				// and send the review itself
				return ProductReviewsModel.get(id);
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Profile.ServiceController.js
// ----------------
// Service to manage profile requests
define(
	'Profile.ServiceController'
,	[
		'ServiceController'
	,	'SC.Models.Init'
	,	'Profile.Model'
	]
,	function(
		ServiceController
	,	ModelsInit
	,	ProfileModel
	)
	{
		'use strict';

		// @class Profile.ServiceController Manage profile requests
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'Profile.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: {
				common: {
					requireLoggedInPPS: true
				}
			,	put:
				{
					requireLogin: true
				}
			}

		// @method get The call to Profile.Service.ss with http method 'get' is managed by this function
		// @return {Profile.Model.Item}
		,	get: function()
			{
				return ProfileModel.get();
			}

		// @method put The call to Profile.Service.ss with http method 'put' is managed by this function
		// @return {Profile.Model.Item}
		,	put: function()
			{
				// Pass the data to the Profile's update method and send it response
				ProfileModel.update(this.data);
				return ProfileModel.get();
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// SiteSettings.ServiceController.js
// ----------------
// Service to manage sitesettings requests
define(
	'SiteSettings.ServiceController'
,	[
		'ServiceController'
	,	'SiteSettings.Model'
	]
,	function(
		ServiceController
	,	SiteSettingsModel
	)
	{
		'use strict';

		// @class SiteSettings.ServiceController Manage sitesettings requests
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'SiteSettings.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: {
				common: {
					requireLoggedInPPS: true
				}
			}

			// @method get The call to SiteSettings.Service.ss with http method 'get' is managed by this function
			// @return {ShoppingSession.SiteSettings}
		,	get: function()
			{
				return SiteSettingsModel.get();
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Quote
define(
	'Quote.Model'
	, [
		'Transaction.Model'
		, 'Transaction.Model.Extensions'
		, 'Utils'
		, 'Application'
		, 'underscore'
		,	'Configuration'
	]
	, function (
		TransactionModel
		, TransactionModelExtensions
		, Utils
		, Application
		, _
		,	Configuration
	)
	{
		'use strict';

		var QuoteToSalesOrderValidatorModel;

		try
		{
			QuoteToSalesOrderValidatorModel = require('QuoteToSalesOrderValidator.Model');
		}
		catch (e)
		{}

		// @class Quote.Model Defines the model used by the Quote.Service.ss service
		// @extends Transaction.Model
		return TransactionModel.extend(
		{

			//@property {String} name
			name: 'Quote'

			//@method _isCreatingARecord Internal method used to indicate whether the current operation is a creation or not
			//@return {Boolean}
			, _isCreatingARecord: function ()
			{
				return this.recordId === 'null';
			}

			//@method getTransactionRecord Load a NetSuite record (transaction)
			//@param {String} record_type
			//@param {String} id
			//@return {nlobjRecord}
			, getTransactionRecord: function ()
			{
				if (this.record)
				{
					return this.record;
				}

				if (!this._isCreatingARecord())
				{
					return TransactionModel.getTransactionRecord.apply(this, arguments);
				}

				return nlapiCreateRecord('estimate'
					, {
						recordmode: 'dynamic'
					});
			}

			//@method get Returns an Estimate JSON object
			//@return {Quote.Model.Attributes}
			//@class Quote.Model.Attributes @extend Transaction.Model.Get.Result
			//@class Quote.Model

			//@method setExtraRecordFields Override empty base method to add extra values in the estimate
			//@return {Void} This method does not return anything as it works with the value of this.result and this.record
			, getExtraRecordFields: function ()
			{
				if (!this._isCreatingARecord())
				{
					this.getEntityStatus();
				}
				//@class Quote.Model.Attributes

				//@property {String} statusRef
				this.result.statusRef = this.record.getFieldValue('statusRef');
				//@property {String} message
				this.result.message = Utils.sanitizeString(this.record.getFieldValue('message'));
				//@property {Boolean} allowToPurchase
				this.result.allowToPurchase = Application.getPermissions().transactions.tranSalesOrd >= 2;
				//@property {Boolean} isOpen
				this.result.isOpen = this.record.getFieldValue('statusRef') === 'open';

				this.result.subsidiary = this.record.getFieldValue('subsidiary');

				this.result.location_text = this.record.getFieldText('location');

				if (!this._isCreatingARecord())
				{
					//@property {QuoteToSalesOrderValidator.Model.Attributes.PurchasableStatus} purchasablestatus
					this.getSalesRep();
					this.result.purchasablestatus = QuoteToSalesOrderValidatorModel ? QuoteToSalesOrderValidatorModel.getQuoteToSalesOrderValidation(this.result) :
					{};
				}
				else
				{
					this.result.salesrep = {
						name: this.record.getFieldText('salesrep')
						, internalid: this.record.getFieldValue('salesrep')
					};
				}
				this.getDiscountInformation();
				this.getDueDate();

				// @class Quote.Model
			}

			//@method getRecordAddresses Override parent method to load address using real internal id
			//@return {Void} This method does not return anything as it works with the value of this.result and this.record
			, getRecordAddresses: function ()
			{
				//@class Transaction.Model.Get.Result
				//@property {Array<Address.Model.Attributes>} addresses
				this.result.addresses = {};
				this.result.listAddresseByIdTmp = {};

				for (var i = 1; i <= this.record.getLineItemCount('iladdrbook'); i++)
				{
					// Adds all the addresses in the address book
					this.result.listAddresseByIdTmp[this.record.getLineItemValue('iladdrbook', 'iladdrinternalid', i)] = this.addAddress(
					{
						internalid: this.record.getLineItemValue('iladdrbook', 'iladdrinternalid', i)
						, country: this.record.getLineItemValue('iladdrbook', 'iladdrshipcountry', i)
						, state: this.record.getLineItemValue('iladdrbook', 'iladdrshipstate', i)
						, city: this.record.getLineItemValue('iladdrbook', 'iladdrshipcity', i)
						, zip: this.record.getLineItemValue('iladdrbook', 'iladdrshipzip', i)
						, addr1: this.record.getLineItemValue('iladdrbook', 'iladdrshipaddr1', i)
						, addr2: this.record.getLineItemValue('iladdrbook', 'iladdrshipaddr2', i)
						, attention: this.record.getLineItemValue('iladdrbook', 'iladdrshipattention', i)
						, addressee: this.record.getLineItemValue('iladdrbook', 'iladdrshipaddressee', i)
						, phone: this.record.getLineItemValue('iladdrbook', 'iladdrshipphone', i)
					});
				}

				// Adds Shipping Address
				// @property {String} shipaddress Id of the shipping address
				this.result.shipaddress = this.addAddress(
				{
					internalid: this.record.getFieldValue('shipaddresslist')
					, country: this.record.getFieldValue('shipcountry')
					, state: this.record.getFieldValue('shipstate')
					, city: this.record.getFieldValue('shipcity')
					, zip: this.record.getFieldValue('shipzip')
					, addr1: this.record.getFieldValue('shipaddr1')
					, addr2: this.record.getFieldValue('shipaddr2')
					, attention: this.record.getFieldValue('shipattention')
					, addressee: this.record.getFieldValue('shipaddressee')
					, phone: this.record.getFieldValue('shipphone')
				});

				// Adds Bill Address
				// @property {String} billaddress Id of the billing address
				this.result.billaddress = this.addAddress(
				{
					internalid: this.record.getFieldValue('billaddresslist')
					, country: this.record.getFieldValue('billcountry')
					, state: this.record.getFieldValue('billstate')
					, city: this.record.getFieldValue('billcity')
					, zip: this.record.getFieldValue('billzip')
					, addr1: this.record.getFieldValue('billaddr1')
					, addr2: this.record.getFieldValue('billaddr2')
					, attention: this.record.getFieldValue('billattention')
					, addressee: this.record.getFieldValue('billaddressee')
					, phone: this.record.getFieldValue('billphone')
				});

				// @class Quote.Model
			}

			//@method getAddressInternalId Internal method used to generate the internal id of an address
			//@param {Address.Model.Attributes} address
			//@return  {String}
			, getAddressInternalId: function (address)
			{
				if (_.isNaN(parseInt(address.internalid, 10)))
				{
					return TransactionModel.getAddressInternalId.apply(this, arguments);
				}

				return address.internalid;
			}

			//@method _getQuoteStatus
			// @param {String} estimate_id
			// @return
			, _getQuoteStatus: function (estimate_id)
			{
				var estimates = nlapiSearchRecord('estimate', null
					, [
						['internalid', 'is', estimate_id]
						, 'and'
						, ['mainline', 'is', 'T']
					]
					, [new nlobjSearchColumn('entitystatus')]);

				return estimates[0];
			}

			//@method setEntityStatus Set the entity status of the current estimate (Quote)
			//@return {Void} This method does not return anything as it works with the value of this.result and this.record
			, getEntityStatus: function ()
			{
				// This is necessary to solve a SuiteScript issue
				var estimate_aux = this._getQuoteStatus(this.record.getId());

				//@class Quote.Model.Attributes

				//@property {Quote.Model.Attributes.EntityStatus} entitystatus
				//@class Quote.Model.Attributes.EntityStatus
				this.result.entitystatus = {
					// @property {String} id
					// id: record.getFieldValue('entitystatus')
					id: estimate_aux.getValue('entitystatus')
						// @property {String} name
						// ,	name: record.getFieldText('entitystatus')
					, name: estimate_aux.getText('entitystatus')
				};
				// @class Quote.Model
			}

			//@method getDiscountInformation Get the discount information of the current estimate
			//@return {Void} This method does not return anything as it works with the value of this.result and this.record
			, getDiscountInformation: function ()
			{
				//@class Quote.Model.Attributes

				//@property {Quote.Model.Attributes.Discount?} discount
				this.result.discount = this.record.getFieldValue('discountitem') ?
					//@class Quote.Model.Attributes.Discount
					{
						//@property {String} internalid
						internalid: this.record.getFieldValue('discountitem')
							//@property {String} name
						, name: this.record.getFieldText('discountitem')
							//@property {String} rate
						, rate: this.record.getFieldValue('discountrate')
					} : null;

				// @class Quote.Model
			}

			//@method getDueDate Get all date related field of the current estimate
			//@return {Void} This method does not return anything as it works with the value of this.result and this.record
			, getDueDate: function ()
			{
				//@class Quote.Model.Attributes
				var duedate = this.record.getFieldValue('duedate')
					, now = new Date().getTime();

				//@property {String} duedate
				this.result.duedate = duedate;
				//@property {Boolean} isOverdue
				this.result.isOverdue = this.isDateInterval(new Date(nlapiStringToDate(duedate)).getTime() - now);
				//@property {Boolean} isCloseOverdue
				this.result.isCloseOverdue = this.isDateInterval(new Date(nlapiStringToDate(duedate)).getTime() - (now + this.getDaysBeforeExpiration()));
				//@property {String} expectedclosedate
				this.result.expectedclosedate = this.record.getFieldValue('expectedclosedate');

				// @class Quote.Model
			}

			//@method list
			//@param {Transaction.Model.List.Parameters} data
			//@return {Quote.Model.List.Result}

			//@class Quote.Model.List.Result @extend Transaction.Model.List.Result
			//@class Quote.Model

			//@method setExtraListColumns Overwritten method to add extra columns (due date, expected close date, entity status, and total)
			//@return {Void}
			, setExtraListColumns: function ()
			{
				this.columns.duedate = new nlobjSearchColumn('duedate');
				this.columns.expectedclosedate = new nlobjSearchColumn('expectedclosedate');
				this.columns.entitystatus = new nlobjSearchColumn('entitystatus');
				this.columns.total = new nlobjSearchColumn('total');
			}

			//@method setExtraListFilters Overwritten method to add extra filter of the list (entity status filter)
			// @return {Void}
			, setExtraListFilters: function ()
			{
				if (this.data.filter && this.data.filter !== 'ALL')
				{
					this.filters.entitystatus_operator = 'and';
					this.filters.entitystatus = ['entitystatus', 'is', this.data.filter];
				}
			}

			// @method mapListResult overrides method from Transaction.Model
			// We are able to apply any custom extension over each record returned
			// @param {Transaction.Model.List.Result.Record} result Base result to be extended
			// @param {nlobjSearchResult} record Instance of the record returned by NetSuite search
			// @return {Transaction.Model.List.Result.Record}
			, mapListResult: function (result, record)
			{
				var duedate = record.getValue('duedate')
					, now = new Date().getTime();

				// @class Quote.Model.List.Result.Record @extend Transaction.Model.List.Result.Record
				// @property {String} duedate
				result.duedate = duedate;
				// @property {Boolean} isOverdue
				result.isOverdue = this.isDateInterval(new Date(nlapiStringToDate(duedate)).getTime() - now);
				// @property {Boolean} isCloseOverdue
				result.isCloseOverdue = this.isDateInterval(new Date(nlapiStringToDate(duedate)).getTime() - (now + this.getDaysBeforeExpiration()));
				// @property {String} expectedclosedate
				result.expectedclosedate = record.getValue('expectedclosedate');
				// @property {Quote.Model.Attributes.EntityStatus} entitystatus
				result.entitystatus = {
					id: record.getValue('entitystatus')
					, name: record.getText('entitystatus')
				};
				// @property {Number} total
				result.total = Utils.toCurrency(record.getValue('total'));
				// @property {String} total_formatted
				result.total_formatted = Utils.formatCurrency(record.getValue('total'));

				if(this.isCustomColumnsEnabled()) 
				{
					this.mapCustomColumns(result, record);
				}

				return result;
				// @class Quote.Model
			}

			//@method isDateInterval
			//@param {Number} date
			//@return {Boolean}
			, isDateInterval: function (date)
			{
				return date <= 0 && ((-1 * date) / 1000 / 60 / 60 / 24) >= 1;
			}

			//@method getDaysBeforeExpiration
			//return {Number}
			, getDaysBeforeExpiration: function ()
			{
				return Configuration.get('quote.daysToExpire') * 24 * 60 * 60 * 1000;
			}

			//@method getSalesRepFromId This method does NOT depend on this.record and this.result
			//@param {String} quote_id
			//@return {Quote.Model.Get.SalesRepresentative}
			, getSalesRepFromId: function (quote_id)
			{
				var salesrep = {};

				var search_result = nlapiLookupField(
					'estimate'
					, quote_id
					, ['salesrep.phone', 'salesrep.email', 'salesrep.entityid', 'salesrep.mobilephone', 'salesrep.fax', 'salesrep']
				);

				if (search_result)
				{
					//@class Quote.Model.Get.SalesRepresentative
					//@property {String?} phone
					salesrep.phone = search_result['salesrep.phone'];
					//@property {String} email
					salesrep.email = search_result['salesrep.email'];
					//@property {String} fullname
					salesrep.fullname = search_result['salesrep.entityid'];
					//@property {String} name
					salesrep.name = search_result['salesrep.entityid'];
					//@property {String?} mobilephone
					salesrep.mobilephone = search_result['salesrep.mobilephone'];
					//@property {String} fax
					salesrep.fax = search_result['salesrep.fax'];
					//@property {String} internalid
					salesrep.internalid = search_result.salesrep;
				}

				return salesrep;

				// @class Quote.Model
			}

			//@method postSubmitRecord Overwritten method used to extend the confirmation submission result
			//@param {Transaction.Model.Confirmation} confirmation_result
			//@return {Quote.Model.Confirmation}
			, postSubmitRecord: function (confirmation_result)
			{
				var created_salesorder = nlapiLookupField('estimate', confirmation_result.internalid, ['tranid']) ||
				{};

				//@class Quote.Model.Confirmation @extend Transaction.Model.Confirmation
				confirmation_result.tranid = created_salesorder.tranid;
				confirmation_result.salesrep = this.getSalesRepFromId(confirmation_result.internalid);
				confirmation_result.confirmationnumber = created_salesorder.tranid;
				// @class Quote.Model

				return confirmation_result;
			}

			, getSalesRep: TransactionModelExtensions.getSalesRep
		});
	});

//@class Quote.Model.List.Result @extend Transaction.Model.List.Result
//@property {Array<Quote.Model.List.Result.Record>} records;
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Quote.ServiceController.js
// ----------------
// Service to manage quote requests
define(
	'Quote.ServiceController'
,	[
		'ServiceController'
	,	'Quote.Model'
	]
,	function(
		ServiceController
	,	QuoteModel
	)
	{
		'use strict';

		try
		{
			// @class Quote.ServiceController Manage quote requests
			// @extend ServiceController
			return ServiceController.extend({

				// @property {String} name Mandatory for all ssp-libraries model
				name: 'Quote.ServiceController'

				// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
				// The values in this object are the validation needed for the current service.
				// Can have values for all the request methods ('common' values) and specific for each one.
			,	options: {
					common: {
						requireLogin: true
					,	requirePermissions: {
							list: [
								'transactions.tranEstimate.1'
							,	'transactions.tranFind.1'
							]
						}
					}
				}

				// @method get The call to Quote.Service.ss with http method 'get' is managed by this function
				// @return {Transaction.Model.Get.Result || Transaction.Model.List.Result}
			,	get: function()
				{
					var id = this.request.getParameter('internalid');
					if (id)
					{
						return QuoteModel.get('estimate', id);
					}
					else
					{
						return QuoteModel.list({
							filter: this.request.getParameter('filter')
						,	order: this.request.getParameter('order')
						,	sort: this.request.getParameter('sort')
						,	from: this.request.getParameter('from')
						,	to: this.request.getParameter('to')
						,	page: this.request.getParameter('page') || 1
						,	types: this.request.getParameter('types')
					});
					}
				}

				// @method post The call to Quote.Service.ss with http method 'post' is managed by this function
				// @return {Transaction.Model.Get.Result}
			,	post: function()
				{
					// Updates the order with the passed in data
					QuoteModel.update('estimate', this.data.internalid || 'null', this.data);

					// Gets the status
					var order_info = QuoteModel.get('estimate', this.data.internalid || 'null');

					// Finally Submits the order
					order_info.confirmation = QuoteModel.submit();
					// //Override tempid with the real sales order id that have been created
					// order_info.internalid = order_info.confirmation.internalid;
					return order_info;
				}

				// @method put The call to Quote.Service.ss with http method 'put' is managed by this function
				// @return {Transaction.Model.Get.Result}
			,	put: function()
				{
					// Pass the data to the quote_model's update method and send it response
					QuoteModel.update('estimate', this.data.internalid, this.data);
					return QuoteModel.get('estimate', this.data.internalid);
				}
			});
		}
		catch (e)
		{
			console.warn('QuotePos.Service.ss' + e.name, e);
			this.sendError(e);
		}
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Receipt.Model.js
// ----------
// Handles fetching receipts
define(
	'Receipt.Model'
,	[	
		'Application'
	,	'Utils'
	,	'Transaction.Model'
	]
,	function (
		Application
	,	Utils
	,	TransactionModel
	)
{
	'use strict';

	return TransactionModel.extend({
	
		name: 'Receipt'

	,	getStatus: function ()
		{
			this.result.status =
			{
				internalid: nlapiLookupField(this.result.recordtype, this.result.internalid, 'status')
			,	name: nlapiLookupField(this.result.recordtype, this.result.internalid, 'status', true)
			};
		}

	,	getCreatedFrom: function()
		{
			var created_from_internalid = nlapiLookupField(this.result.recordtype, this.result.internalid, 'createdfrom')
			,	recordtype = created_from_internalid ? Utils.getTransactionType(created_from_internalid) : ''
			,	tranid = recordtype ? nlapiLookupField(recordtype, created_from_internalid, 'tranid') : '';

			this.result.createdfrom =
			{
					internalid: created_from_internalid
				,	name: nlapiLookupField(this.result.recordtype, this.result.internalid, 'createdfrom', true) || ''
				,	recordtype: recordtype
				,	tranid: tranid
			};
		}
	});
});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Receipt.ServiceController.js
// ----------------
// Service to manage invoice requests
define(
	'Receipt.ServiceController'
,	[
		'ServiceController'
	,	'Receipt.Model'
	]
,	function(
		ServiceController
	,	ReceiptModel
	)
	{
		'use strict';

		// @class Receipt.ServiceController Manage invoice requests
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'Receipt.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: {
				common: {
					requireLogin: true
				,	requirePermissions: {
						list: [
							'transactions.tranFind.1'
						,	'transactions.tranCashSale.1'
						]
					}
				}
			}

			// @method get The call to Receipt.Service.ss with http method 'get' is managed by this function
			// @return {Transaction.Model.Get.Result || Transaction.Model.List.Result}
		,	get: function()
			{
				var id = this.request.getParameter('internalid')
				,	status = this.request.getParameter('status')
				,	page = this.request.getParameter('page');

				// If the id exist, sends the response of Receipt.get(id), else send (Receipt.list(options) || [])
				return id ? ReceiptModel.get('cashsale', id) : ReceiptModel.list({
							types: 'CashSale'
						,	status: status
						,	page: page
						});
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// ReturnAuthorization.ServiceController.js
// ----------------
// Service to manage return authorization requests
define(
	'ReturnAuthorization.ServiceController'
,	[
		'ServiceController'
	,	'ReturnAuthorization.Model'
	]
,	function(
		ServiceController
	,	ReturnAuthorizationModel
	)
	{
		'use strict';

		// @class ReturnAuthorization.ServiceController Manage return authorization requests
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'ReturnAuthorization.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: {
				common: {
					requireLogin: true
				,	requirePermissions: {
						list: [
							ReturnAuthorizationModel.isSCISIntegrationEnabled ? 'transactions.tranPurchasesReturns.1' : 'transactions.tranRtnAuth.1'
						,	'transactions.tranFind.1'
						]
					}
				}
			,	post: {
					requirePermissions: {
						extraList: [
							'transactions.tranRtnAuth.2'
						]
					}
				}
			,	put: {
					requirePermissions: {
						extraList: [
							'transactions.tranRtnAuth.2'
						]
					}
				}
			}

		// @method get The call to ReturnAuthorization.Service.ss with http method 'get' is managed by this function
		// @return {Transaction.Model.Get.Result || Transaction.Model.List.Result}
		,	get: function ()
			{
				var recordtype = this.request.getParameter('recordtype')
				,	id = this.request.getParameter('internalid');

				return id && recordtype ? ReturnAuthorizationModel.get(recordtype, id) : ReturnAuthorizationModel.list(
				{
					order: this.request.getParameter('order')
				,	sort: this.request.getParameter('sort')
				,	from: this.request.getParameter('from')
				,	to: this.request.getParameter('to')
				,	page: this.request.getParameter('page')
				});
			}

			// @method post The call to ReturnAuthorization.Service.ss with http method 'post' is managed by this function
			// @return {StatusObject}
		,	post: function ()
			{
				var id = ReturnAuthorizationModel.create(this.data);
				
				this.sendContent(ReturnAuthorizationModel.get('returnauthorization', id), {'status': 201});
			}

			// @method put The call to ReturnAuthorization.Service.ss with http method 'put' is managed by this function. 
			// This is used for cancelling the ReturnAuthorization.
			// @return {StatusObject}
		,	put: function ()
			{
				var id = this.request.getParameter('internalid');

				ReturnAuthorizationModel.update(id, this.data, this.request.getAllHeaders());
				this.sendContent(ReturnAuthorizationModel.get('returnauthorization', id));
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// TransactionHistory.Model.js
// ----------------
//
define(
	'TransactionHistory.Model'
,	[
		'SC.Model'
	,	'Application'
	,	'Utils'
	,	'Transaction.Model'
	]
,	function (
		SCModel
	,	Application
	,	Utils
	,	Transaction
	)
{
	'use strict';

	return Transaction.extend({
		setExtraListFilters: function ()
		{	

			this.filters.types_operator = 'and';
			this.filters.types = ['type', 'anyof',  this.data.filter.split(',')];

		}
	});
});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// TransactionHistory.ServiceController.js
// ----------------
// Service to list transactions
define(
	'TransactionHistory.ServiceController'
,	[
		'ServiceController'
	,	'TransactionHistory.Model'
	,	'Application'
	]
,	function(
		ServiceController
	,	TransactionHistoryModel
	,	Application
	)
	{
		'use strict';

		// @class TransactionHistory.ServiceController List transactions
		// @extend ServiceController
		return ServiceController.extend({

			//@property {String} name Mandatory for all ssp-libraries model
			name: 'TransactionHistory.ServiceController'

		,	options: {
				common: {
					requireLogin: true
				}
			}

			// @method _validatePermission Validate permissions of this specific Service Controller. We use this function as an exception here,
			// because the validation conditions are particular and not repeated in other services.
			// @return {Void} If the validation fails, we throw an error
		,	_validatePermission: function ()
			{
				var permissions = Application.getPermissions().transactions;

				if (!(permissions.tranFind 			> 0 &&
					(permissions.tranCustInvc 		> 0 ||
					permissions.tranCustCred	 	> 0 ||
					permissions.tranCustPymt 		> 0 ||
					permissions.tranCustDep 		> 0 ||
					permissions.tranDepAppl 		> 0)))
				{
					throw forbiddenError;
				}
			}


			// @method get The call to TransactionHistory.Service.ss with http method 'get' is managed by this function
			// @return {TransactionHistoryModel.list} A list featuring the transaction history
		,	get: function()
			{
				this._validatePermission();

				return TransactionHistoryModel.list(
					{
						filter: this.request.getParameter('filter')
					,	order: 	this.request.getParameter('order')
					,	sort: 	this.request.getParameter('sort')
					,	from: 	this.request.getParameter('from')
					,	to: 	this.request.getParameter('to')
					,	page: 	this.request.getParameter('page') || 1
					});
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//! © 2015 NetSuite Inc.

/* global release_metadata  */
define(
	'ReleaseMetadata'
	, [
		'SC.Models.Init'
		, 'underscore'
	]
	, function (
		ModelsInit
		, _
	)
	{
		'use strict';
		return {
			available: function ()
			{
				return release_metadata !== undefined;
			}

			, get: function ()
			{
				release_metadata.ns_version = release_metadata.ns_version ? release_metadata.ns_version : ModelsInit.context.getVersion();

				return release_metadata;
			}

			, getVersion: function ()
			{
				return release_metadata && release_metadata.version;
			}

			, asHTMLComment: function ()
			{
				if (!release_metadata)
				{
					return '';
				}

				// Generates something like [ bundle_id "48040" ] [ baselabel "POS_ML" ] ...
				var bracketVals = _.chain(release_metadata)
					.omit('name')
					.map(function (value, key)
					{
						return '[ ' + key + ' ' + JSON.stringify(value) + ' ]';
					})
					.value()
					.join(' ');

				return '<!-- ' + release_metadata.name + ' ' + bracketVals + ' -->';
			}
		};
	});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module QuoteToSalesOrderValidator
define(
	'QuoteToSalesOrderValidator.Model'
,	[
		'SC.Model'
	,	'Application'
	,	'StoreItem.Model'
	,	'Address.Model'
	,	'Configuration'
	,	'underscore'
	]
,	function (
		SCModel
	,	Application
	,	StoreItemModel
	,	AddressModel
	,	Configuration
	,	_
	)
{
	'use strict';

	//@class InvalidQuoteError
	var	invalidQuoteError = {
			// @property {Number} status
			status: 500
			// @property {String} code
		,	code: 'ERR_INVALID_QUOTE_STATUS'
			// @property {String} message
		,	message: 'Sorry, the specified quote id is not valid to be purchased.'
		};

	//@class QuoteToSalesOrderValidator.Model @extend SC.Model
	return SCModel.extend({
		//@property {String} name
		name: 'QuoteToSalesOrderValidator'

		//@property {InvalidQuoteError} invalidQuoteError
	,	invalidQuoteError: invalidQuoteError

		//@property {Array<QuoteToSalesOrderValidator.Model.PurchasableValidator>} purchasableQuoteConditions
	,	purchasableQuoteConditions: [
			//@class QuoteToSalesOrderValidator.Model.PurchasableValidator
			{
				errorCode: 'INVALIDPERMISSION'
				//@property {Boolean} stopValidation
			,	stopValidation: true
			,	validatesCondtion: function()
				{
					return Application.getPermissions().transactions.tranSalesOrd >= 2;
				}
			}
		,	{
				//@property {String} errorCode
				errorCode: 'INVALIDENTITYSTATUS'
				//@method validatesCondtion Validated ONE condition over a quote
				//@param {Quote.Model.Attributes} quote
				//@return {Boolean} True in case the quote is valid, false otherwise
			,	validatesCondtion: function (quote)
				{
					return quote.entitystatus.id === Configuration.get('quote.purchaseReadyStatusId');
				}
			}
		,	{
				errorCode: 'INVALIDSTATUS'
			,	validatesCondtion: function (quote)
				{
					return quote.statusRef === 'open';
				}
			}
		,	{
				errorCode: 'MISSINGSHIPMETHOD'
			,	validatesCondtion: function (quote)
				{
					var all_items_fulfillable = _.all(_.pluck(quote.lines, 'isfulfillable'), function (fulfillable)
						{
							return !fulfillable;
						});
					if (all_items_fulfillable)
					{
						return true;
					}

					return !!quote.shipmethod;
				}
			}
		,	{
				errorCode: 'MISSINGSHIPADDRESS'
			,	validatesCondtion: function (quote)
				{
					var all_items_fulfillable = _.all(_.pluck(quote.lines, 'isfulfillable'), function (fulfillable)
						{
							return !fulfillable;
						});
					if (all_items_fulfillable)
					{
						return true;
					}

					var shipping_address = quote.addresses[quote.shipaddress];
					return  !!(shipping_address && shipping_address.isvalid === 'T');
				}
			}
		,	{
				errorCode: 'MISSINGSALESREP'
			,	validatesCondtion: function (quote)
				{
					return  quote.salesrep && quote.salesrep.internalid;
				}
			}
		,	{
				errorCode: 'GIFTCERTIFICATENOTALLOWED'
			,	validatesCondtion: function (quote)
				{
					return _.all(quote.lines, function (line)
					{
						return line.item.itemtype !== 'GiftCert';
					});
				}
			}
		]
		// @class QuoteToSalesOrderValidator.Model

		//@method getQuoteToSalesOrderValidation Set the purchasable status of the current estimate
		//@param {Quote.Model.Attributes} record
		//@param {Array<QuoteToSalesOrderValidator.Model.PurchasableValidator>?} validators
		//@return {QuoteToSalesOrderValidator.Model.Attributes.PurchasableStatus}
	,	getQuoteToSalesOrderValidation: function (record, validators)
		{
			var purchase_validation_errors = []
			,	is_valid_for_purchase = false;

			validators = validators || this.purchasableQuoteConditions;

			_.find(validators, function (validator)
			{
				if (!validator.validatesCondtion(record))
				{
					purchase_validation_errors.push(validator.errorCode);
					return !!validator.stopValidation;
				}
				return false;
			});
			is_valid_for_purchase = !purchase_validation_errors.length;

			//@class QuoteToSalesOrderValidator.Model.Attributes.PurchasableStatus Container used to transport the result of validating a quote as ready for purchase
			return {
				//@property {Boolean} isPurchasable
				isPurchasable: is_valid_for_purchase
				//@property {Array<String>} validationErrors
			,	validationErrors: purchase_validation_errors
			};
			//@class QuoteToSalesOrderValidator.Model
		}

	});
});

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module QuoteToSalesOrder
define(
	'QuoteToSalesOrder.Model'
,	[
		'Transaction.Model'
	,	'QuoteToSalesOrderValidator.Model'
	,	'SC.Models.Init'
	,	'Utils'
	,	'ExternalPayment.Model'
	,	'underscore'
	,	'Configuration'
	]
,	function (
		TransactionModel
	,	QuoteToSalesOrderValidatorModel
	,	ModelsInit
	,	Utils
	,	ExternalPayment
	,	_
	,	Configuration
	)
{
	'use strict';

	//@class RequireQuoteError
	var	requireQuoteIdError = {
			// @property {Number} status
			status: 500
			// @property {String} code
		,	code: 'ERR_MISSING_QUOTEID_PARAMETER'
			// @property {String} message
		,	message: 'Sorry, the quoteid parameter is require to use this operation.'
		};

	// @class QuoteToSalesOrder.Model Defines the model used by the Quote.Service.ss service
	// @extends Transaction.Model
	return TransactionModel.extend({
		//@property {String} name
		name: 'QuoteToSalesOrder'

		//@method getTransactionRecord Override default method to read record id from local property quoteId
		//@return {nlobjRecord}
	,	getTransactionRecord: function ()
		{
			if (this.record)
			{
				return this.record;
			}

			if (this.salesorderId && this.salesorderId !== 'null' && this.salesorderId !== 'undefined')
			{
				return nlapiLoadRecord('salesorder', this.salesorderId);
			}

			var payment_method_list = []
			,	invoice_payment_method = {};

			if (this.data && this.data.paymentmethods)
			{
				payment_method_list = this.data.paymentmethods;
			}

			invoice_payment_method = _.findWhere(payment_method_list, {primary:true, type: 'invoice'});
			if (!!invoice_payment_method)
			{
				return nlapiTransformRecord('estimate'
					,	this.quoteId
					,	'salesorder'
					,	{
							recordmode: 'dynamic'
						,	customform: this.getInvoiceCustomFormId()
						}
					);
			}

			return nlapiTransformRecord('estimate', this.quoteId, 'salesorder', {recordmode: 'dynamic'});
		}

		//@method getInvoiceCustomFormId Returns the id of the form used to generate sales order that are begin pay using invoices (terms)
		//@return {String}
	,	getInvoiceCustomFormId: function ()
		{
			return Configuration.get('quoteToSalesorderWizard.invoiceFormId');
		}

		//@method getExtraRecordFields Override empty base method to add extra values in the estimate & sales order
		//@return {Void} This method does not return anything as it works with the value of this.result and this.record
	,	getExtraRecordFields: function ()
		{
			//@class QuoteToSalesOrder.Model.Attributes

			//@property {QuoteToSalesOrder.Model.Attributes.QuoteDetails} quoteDetails
			this.result.quoteDetails = this.getQuoteDetailsForValidation(this.quoteId);

			if (!this.skipQuoteValidation)
			{
				var quote_validation = QuoteToSalesOrderValidatorModel.getQuoteToSalesOrderValidation(
					_.extend({}, this.result, this.result.quoteDetails));

				if (!quote_validation.isPurchasable)
				{
					throw QuoteToSalesOrderValidatorModel.invalidQuoteError;
				}
			}

			if (this.record.getFieldValue('paymentmethod') && this.record.getFieldValue('paymenteventholdreason') !== 'FORWARD_REQUESTED')
			{
				this.result.confirmation = {
					internalid: this.salesorderId
				};
				this.postSubmitRecord(this.result.confirmation, this.record);
			}


			//@class QuoteToSalesOrder.Model
		}

		//@method getQuoteDetailsForValidation Returns all the extra quote information we return in the sales order.
		//It is used for two purposes, to validate that the quote you are transforming is valid to be transformed and to return
		//quote related information on the sales order
		//@param {String} quote_id
		//@return {QuoteToSalesOrder.Model.Attributes.QuoteDetails}
	,	getQuoteDetailsForValidation: function (quote_id)
		{
			var basic_quote_values = nlapiLookupField('estimate'
				,	quote_id
				,	[
						'entitystatus'
					,	'status'
					,	'statusRef'
					,	'tranid'
					]) || {};


			//@class QuoteToSalesOrder.Model.Attributes.QuoteDetails
			return {
				//@property {QuoteToSalesOrder.Model.Attributes.QuoteDetails.EntityStatus} entitystatus
				//@class QuoteToSalesOrder.Model.Attributes.QuoteDetails.EntityStatus
				entitystatus: {
					//@property {String} id
					id: basic_quote_values.entitystatus
				}
			//@class QuoteToSalesOrder.Model.Attributes.QuoteDetails
				//@property {String} statusRef
			,	statusRef: basic_quote_values.statusRef
				//@property {String} internalid
			,	internalid: quote_id
				//@property {QuoteToSalesOrder.Model.Get.SalesRepresentative} salesrep
			,	salesrep: this.getSalesRep(quote_id)
				//@property {String} tranid
			,	tranid: basic_quote_values.tranid
			};

			// @class QuoteToSalesOrder.Model
		}

		//@method getSalesRep Override base method to NOT depend on this.record and this.result
		//@param {String} quote_id
		//@return {QuoteToSalesOrder.Model.Get.SalesRepresentative}
	,	getSalesRep: function (quote_id)
		{
			var salesrep = {}
			,	search_result = nlapiLookupField(
				'estimate'
			,	quote_id
			,	['salesrep.phone', 'salesrep.email', 'salesrep.entityid', 'salesrep.mobilephone', 'salesrep.fax', 'salesrep']
			);

			if (search_result)
			{
				//@class QuoteToSalesOrder.Model.Get.SalesRepresentative
				//@property {String?} phone
				salesrep.phone = search_result['salesrep.phone'];
				//@property {String} email
				salesrep.email = search_result['salesrep.email'];
				//@property {String} fullname
				salesrep.fullname = search_result['salesrep.entityid'];
				//@property {String} name
				salesrep.name = search_result['salesrep.entityid'];
				//@property {String?} mobilephone
				salesrep.mobilephone = search_result['salesrep.mobilephone'];
				//@property {String} fax
				salesrep.fax = search_result['salesrep.fax'];
				//@property {String} internalid
				salesrep.internalid = search_result.salesrep;
			}

			return salesrep;

			// @class QuoteToSalesOrder.Model
		}

		//@method get Override default method to specify quote id from which the sales order is loaded
		//@param {String} salesorder_id
		//@param {String} quote_id
		//@param {Boolean} skip_quote_validation
		//@return {QuoteToSalesOrder.Model.Attributes}
	,	get: function (salesorder_id, quote_id, skip_quote_validation)
		{
			if (!quote_id)
			{
				throw requireQuoteIdError;
			}

			this.salesorderId = salesorder_id;
			this.skipQuoteValidation = skip_quote_validation ? skip_quote_validation : true;
			this.quoteId = quote_id;

			//@class QuoteToSalesOrder.Model.Attributes @extend Transaction.Model.Get.Result
			return TransactionModel.get.call(this, 'salesorder', 'tempid');

			// @class QuoteToSalesOrder.Model
		}

		//@method getCreatedFrom Override default method to specify quote id from which the sales order is loaded
		//@return {QuoteToSalesOrder.Model.Attributes}
	,	getCreatedFrom: function()
		{
			var created_from_internalid = nlapiLookupField(this.result.recordtype, this.salesorderId, 'createdfrom');
			var	recordtype = created_from_internalid ? Utils.getTransactionType(created_from_internalid) : '';
			var	tranid = recordtype ? nlapiLookupField(recordtype, created_from_internalid, 'tranid') : '';

			this.result.createdfrom =
			{
					internalid: created_from_internalid
				,	name: nlapiLookupField(this.result.recordtype, this.salesorderId, 'createdfrom', true) || ''
				,	recordtype: recordtype
				,	tranid: tranid
			};
		}

		//@method update Override default method to specify the quote id from which the transformation is done
		//@param {String} salesorder_id
		//@param {String} quote_id
		//@param {Transaction.Model.UpdateAttributes} data
		//@return {Void}
	,	update: function (salesorder_id, quote_id, data)
		{
			this.quoteId = quote_id;
			this.salesorderId = salesorder_id;

			var result = TransactionModel.update.call(this, 'salesorder', quote_id, data);
			// The setAddress method of the Transaction.Model resets the shipping cost to 0.00.
			// By calling this function afterwards we force a recalculation so it remains constant.
			this.record.localCall("Shipping.calculateRates();");
			return result;
		}

		//@method setLines Override default method so not lines are set. As those cannot be touched when creating a sales order
		//@return {Void}
	,	setLines: function () {}

		//@method getRecordAddresses Override parent method to load address using real internal id
		//@return {Void} This method does not return anything as it works with the value of this.result and this.record
	,	getRecordAddresses: function ()
		{
			//@class Transaction.Model.Get.Result
			//@property {Array<Address.Model.Attributes>} addresses
			this.result.addresses = {};
			this.result.listAddresseByIdTmp = {};

			for (var i = 1; i <= this.record.getLineItemCount('iladdrbook') ; i++)
			{
				// Adds all the addresses in the address book
				this.result.listAddresseByIdTmp[this.record.getLineItemValue('iladdrbook', 'iladdrinternalid', i)] = this.addAddress({
					internalid: this.record.getLineItemValue('iladdrbook', 'iladdrinternalid', i)
				,	country: this.record.getLineItemValue('iladdrbook', 'iladdrshipcountry', i)
				,	state: this.record.getLineItemValue('iladdrbook', 'iladdrshipstate', i)
				,	city: this.record.getLineItemValue('iladdrbook', 'iladdrshipcity', i)
				,	zip: this.record.getLineItemValue('iladdrbook', 'iladdrshipzip', i)
				,	addr1: this.record.getLineItemValue('iladdrbook', 'iladdrshipaddr1', i)
				,	addr2: this.record.getLineItemValue('iladdrbook', 'iladdrshipaddr2', i)
				,	attention: this.record.getLineItemValue('iladdrbook', 'iladdrshipattention', i)
				,	addressee: this.record.getLineItemValue('iladdrbook', 'iladdrshipaddressee', i)
				,	phone: this.record.getLineItemValue('iladdrbook', 'iladdrshipphone', i)
				});
			}

			// Adds Shipping Address
			// @property {String} shipaddress Id of the shipping address
			this.result.shipaddress = this.addAddress({
				internalid: this.record.getFieldValue('shipaddresslist')
			,	country: this.record.getFieldValue('shipcountry')
			,	state: this.record.getFieldValue('shipstate')
			,	city: this.record.getFieldValue('shipcity')
			,	zip: this.record.getFieldValue('shipzip')
			,	addr1: this.record.getFieldValue('shipaddr1')
			,	addr2: this.record.getFieldValue('shipaddr2')
			,	attention: this.record.getFieldValue('shipattention')
			,	addressee: this.record.getFieldValue('shipaddressee')
			,	phone:  this.record.getFieldValue('shipphone')
			});

			// Adds Bill Address
			// @property {String} billaddress Id of the billing address
			this.result.billaddress = this.addAddress({
				internalid: this.record.getFieldValue('billaddresslist')
			,	country: this.record.getFieldValue('billcountry')
			,	state: this.record.getFieldValue('billstate')
			,	city: this.record.getFieldValue('billcity')
			,	zip: this.record.getFieldValue('billzip')
			,	addr1: this.record.getFieldValue('billaddr1')
			,	addr2: this.record.getFieldValue('billaddr2')
			,	attention: this.record.getFieldValue('billattention')
			,	addressee: this.record.getFieldValue('billaddressee')
			,	phone: this.record.getFieldValue('billphone')
			});

			// @class Quote.Model
		}

		//@method getAddressInternalId Internal method used to generate the internal id of an address
		//@param {Address.Model.Attributes} address
		//@return  {String}
	,	getAddressInternalId: function (address)
		{
			if (_.isNaN(parseInt(address.internalid, 10)))
			{
				return TransactionModel.getAddressInternalId.apply(this, arguments);
			}

			return address.internalid;
		}

		//@method postSubmitRecord Overwritten method used to extend the confirmation submission result
		//@param {Transaction.Model.Confirmation} confirmation_result
		//@param {Transaction.Model} record
		//@return {QuoteToSalesOrder.Model.Confirmation}
	,	postSubmitRecord: function (confirmation_result, record)
		{
			var created_salesorder = !_.isUndefined(record) ? record : nlapiLoadRecord('salesorder', confirmation_result.internalid);
			confirmation_result.tranid = created_salesorder.getFieldValue('tranid');
			confirmation_result.confirmationnumber = created_salesorder.getFieldValue('tranid');

			if (confirmation_result.isexternal)
			{
				confirmation_result.redirecturl = ExternalPayment.generateUrl(confirmation_result.internalid, 'salesorder');
			confirmation_result.statuscode = created_salesorder.getFieldValue('paymenteventholdreason') === 'FORWARD_REQUESTED' ? 'redirect' : '';
			confirmation_result.paymenteventholdreason = created_salesorder.getFieldValue('paymenteventholdreason');
			}


			//@class QuoteToSalesOrder.Model.Confirmation @extend Transaction.Model.Confirmation
			confirmation_result.tranid = created_salesorder.tranid;
			confirmation_result.confirmationnumber = created_salesorder.tranid;
			// @class QuoteToSalesOrder.Model

			return confirmation_result;
		}

		//@method submit Saves the current record
		//@return {Transaction.Model.Confirmation}
	,	submit: function ()
		{
			if (!this.record)
			{
				throw new Error ('Please load a record before calling QuoteToSalesOrder.Model.Submit method.');
			}

			this.preSubmitRecord();

			var new_record_id
			,	is_payment_method_external = _.findWhere(this.data.paymentmethods, {isexternal: 'T'});
			if (is_payment_method_external)
			{
				// ignore Mandatory fields
				new_record_id = nlapiSubmitRecord(this.record, false, true);
			}
			else
			{
				new_record_id = nlapiSubmitRecord(this.record);
			}

			//@class Transaction.Model.Confirmation
			var	result = {
				//@property {String} internalid
				internalid: new_record_id
				//@property {Boolean} isexternal
			,	isexternal: is_payment_method_external

			};

			return this.postSubmitRecord(result);
			// @class Transaction.Model
		}

	});
});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// QuoteToSalesOrder.ServiceController.js
// ----------------
// Service to manage quote to sales order request
define(
	'QuoteToSalesOrder.ServiceController'
,	[
		'ServiceController'
	,	'SC.Models.Init'
	,	'QuoteToSalesOrder.Model'
	]
,	function(
		ServiceController
	,	ModelsInit
	,	QuoteToSalesOrderModel
	)
	{
		'use strict';

		// @class QuoteToSalesOrder.ServiceController Manage quote to sales order request
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'QuoteToSalesOrder.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: {
				common: {
					checkLoggedInCheckout : true
				}
			}

			// @method get The call to QuoteToSalesOrder.Service.ss with http method 'get' is managed by this function
			// @return {Transaction.Model.Get.Result}
		,	get: function()
			{
				var quote_id = this.request.getParameter('quoteid')
				,	salesorder_id = this.request.getParameter('salesorderid')
				,	skip_validation = this.request.getParameter('skipvalidation');

				return QuoteToSalesOrderModel.get(salesorder_id, quote_id, skip_validation);
			}

			// @method post The call to QuoteToSalesOrder.Service.ss with http method 'post' is managed by this function
			// @return {Transaction.Model.Get.Result}
		,	post: function()
			{
				var quote_id = this.request.getParameter('quoteid')
				,	salesorder_id = this.request.getParameter('salesorderid');

				// Updates the order with the passed in data
				QuoteToSalesOrderModel.update(salesorder_id, quote_id, this.data);
				// Gets the status
				var order_info = QuoteToSalesOrderModel.get(salesorder_id, quote_id, true);
				// Finally Submits the order
				order_info.confirmation = QuoteToSalesOrderModel.submit();
				//Override tempid with the real sales order id that have been created
				order_info.internalid = order_info.confirmation.internalid;

				return order_info;
			}

			// @method put The call to QuoteToSalesOrder.Service.ss with http method 'put' is managed by this function
			// @return {Transaction.Model.Get.Result}
		,	put: function()
			{
				var quote_id = this.request.getParameter('quoteid')
				,	salesorder_id = this.request.getParameter('salesorderid');
				// Pass the data to the quoteToSalesOrderModel's update method and send it response
				QuoteToSalesOrderModel.update(salesorder_id, quote_id, this.data);
				return QuoteToSalesOrderModel.get(salesorder_id, quote_id, true);
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module CMSadapter
define('CMSadapter.Model.v2'
,	[
		'SC.Model'
	,	'SiteSettings.Model'
	]
,	function (
		SCModel
	,	SiteSettingsModel
	)
{
	'use strict';

	// @class CMSadapter.Model Mostly do the job of getting the landing pages of a CMS enabled site so they can be bootstrapped into the application environment.
	// @extends SCModel
	return SCModel.extend({

		name: 'CMSadapterV2'

		//@method getPages @return {data:Array<CMSPages>}
	,	getPages: function(baseUrl)
		{
			try
			{
				var siteSettings = SiteSettingsModel.get();
				var cmsRequestT0 = new Date().getTime();
				var cmsPagesHeader = {'Accept': 'application/json' };
				var cmsPagesUrl = baseUrl + '/api/cms/pages?site_id=' + siteSettings.siteid + '&c=' + nlapiGetContext().getCompany() + '&{}';
				var cmsPagesResponse = nlapiRequestURL(cmsPagesUrl, null, cmsPagesHeader);
				var cmsPagesResponseBody = cmsPagesResponse.getBody();
				var data = {};

				if (cmsPagesResponse.getContentType().indexOf('json') !== -1 && cmsPagesResponse.getCode() === 200)
				{
					data.pages = JSON.parse(cmsPagesResponseBody);
				}
				else
				{
					data.error = cmsPagesResponseBody;
				}

				data._debug_requestTime = (new Date().getTime()) - cmsRequestT0;

				return data;
			}
			catch (e)
			{
				return { error: e };
			}
		}

	});
});

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module CMSadapter
define('CMSadapter.Model.v3'
,	[
		'SC.Model'
	,	'SiteSettings.Model'
	,	'underscore'
	]
,	function (
		SCModel
	,	SiteSettingsModel
	,	_
	)
{
	'use strict';

	// @class CMSadapter.Model Mostly do the job of getting the landing pages of a CMS enabled site so they can be bootstrapped into the application environment.
	// @extends SCModel
	return SCModel.extend({

		name: 'CMSadapterV3'

		//@method getPages @return {data:Array<CMSPages>}
	,	getPages: function()
		{
			try
			{
				var siteSettings = SiteSettingsModel.get();
				var cmsRequestT0 = new Date().getTime();

				var data = { 'pages': {} };
				var customRecords = {};
				var settingsRecords = {};

				var filters = [new nlobjSearchFilter('inactive', 'cmspagetype', 'is', 'F')
				,	new nlobjSearchFilter('site', null, 'is', siteSettings.siteid)]

				var columns = [new nlobjSearchColumn('url')
				,	new nlobjSearchColumn('baseurlpath', 'cmspagetype')
				,	new nlobjSearchColumn('name')
				,	new nlobjSearchColumn('pagetype')
				,	new nlobjSearchColumn('customrecordscriptid', 'cmspagetype')
				,	new nlobjSearchColumn('customrecorddata')
				,	new nlobjSearchColumn('template')
				,	new nlobjSearchColumn('addtohead')
				,	new nlobjSearchColumn('pagetitle')
				,	new nlobjSearchColumn('pageheader')
				,	new nlobjSearchColumn('metadescription')
				,	new nlobjSearchColumn('metakeywords')
				,	new nlobjSearchColumn('name', 'cmspagetype')
				,	new nlobjSearchColumn('cmscreatable', 'cmspagetype')
				]

				var pages = [];

				var result = nlapiSearchRecord('cmspage', null, filters, columns);

				if (result)
				{
					result.forEach(function(cmspage)
					{
						var page = {};

						var baseUrlPath = cmspage.getValue('baseurlpath', 'cmspagetype');

						page.name = cmspage.getValue('name');
						page.urlPath = baseUrlPath ? baseUrlPath + '/' + cmspage.getValue('url') : cmspage.getValue('url');
						page.url = cmspage.getValue('url');
						page.template = cmspage.getValue('template');
						page.addition_to_head = cmspage.getValue('addtohead');
						page.page_title = cmspage.getValue('pagetitle');
						page.page_header = cmspage.getValue('pageheader');
						page.meta_description = cmspage.getValue('metadescription');
						page.meta_keywords = cmspage.getValue('metakeywords');
						page.customrecorddata = cmspage.getValue('customrecorddata');
						page.type = parseInt(cmspage.getValue('pagetype'), 10);
						page.pageTypeName = cmspage.getValue('name', 'cmspagetype');
						page.customrecordscriptid = cmspage.getValue('customrecordscriptid', 'cmspagetype');
						page.cmscreatable = cmspage.getValue('cmscreatable', 'cmspagetype') === 'T' ? true : false;

						if (page.customrecordscriptid)
						{
							if (!settingsRecords[page.customrecordscriptid])
							{
								settingsRecords[page.customrecordscriptid] = {};
							}

							settingsRecords[page.customrecordscriptid][page.customrecorddata] = page;
						}

						pages.push(page);
					});

					_.each(settingsRecords, function(ids, recname)
					{
						var cr = nlapiCreateRecord(recname);

						var crFilters = [new nlobjSearchFilter('internalid', null, 'anyof', _.keys(ids))];
						var crColumnsRaw = cr.getAllFields().filter(function(fieldname)
						{
							return fieldname.indexOf('custrecord') === 0;
						});

						var crColumns = crColumnsRaw.map(function(column)
						{
							return new nlobjSearchColumn(column);
						});

						var settings = nlapiSearchRecord(recname, null, crFilters, crColumns);

						settings.forEach(function(setting)
						{
							var id = setting.id;

							settingsRecords[recname][id].fields = {};

							_.each(crColumnsRaw, function(columnName)
							{
								settingsRecords[recname][id].fields[columnName] = setting.getValue(columnName);
							});
						});

					});
				}

				data.pages.pages = pages;
				data._debug_requestTime = (new Date().getTime()) - cmsRequestT0;

				return data;
			}
			catch (e)
			{
				return { error: e };
			}
		}

	});
});

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module CMSadapter
define('CMSadapter.Model'
,	[
		'SC.Model'
	,	'CMSadapter.Model.v2'
	,	'CMSadapter.Model.v3'
	,	'Configuration'
	]
,	function (
		SCModel
	,	CMSadapterModelv2
	,	CMSadapterModelv3
	,	Configuration
	)
{
	'use strict';

	// @class CMSadapter.Model Mostly do the job of getting the landing pages of a CMS enabled site so they can be bootstrapped into the application environment.
	// @extends SCModel
	return SCModel.extend({

		name: 'CMSadapter'

		//@method getPages @return {data:Array<CMSPages>}
	,	getPages: function(baseUrl)
		{
			var adapterVersion = Configuration.get().cms.adapterVersion;

			switch (adapterVersion) {
				case '2':
					return CMSadapterModelv2.getPages(baseUrl);
					break;
				case '3':
					return CMSadapterModelv3.getPages();
					break;
				default:
			}
		}

	});
});

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Invoice.Service.ss
// ----------------
// Service to manage invoice requests
define(
	'Invoice.ServiceController'
,	[
		'ServiceController'
	,	'Invoice.Model'
	]
,	function(
		ServiceController
	,	InvoiceModel
	)
	{
		'use strict';

		// @class Invoice.ServiceController Supports login process
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'Invoice.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: {
				common: {
					requireLogin: true
				,	requirePermissions: {
						list: [
							'transactions.tranFind.1'
						,	'transactions.tranCustInvc.1'
						]
					}
				}
			}

		// @method get The call to Invoice.Service.ss with http method 'get' is managed by this function
		// @return {Transaction.Model.Get.Result || Transaction.Model.List.Result}
		,	get: function()
			{
				var id = this.request.getParameter('internalid')
				,	status = this.request.getParameter('status')
				,	page = this.request.getParameter('page');

				return id ?
					InvoiceModel.get('invoice', id) :
					InvoiceModel.list({
							types: 'CustInvc'
						,	status: status
						,	page: page
						});
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Transaction.ServiceController.js
// ----------------
// Service to list transactions
define(
	'Transaction.ServiceController'
,	[
		'ServiceController'
	,	'Transaction.Model'
	]
,	function(
		ServiceController
	,	TransactionModel
	)
	{
		'use strict';

		// @class Transaction.ServiceController List transactions
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'Transaction.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: {
				common: {
					requireLogin: true
				}
			}

			// @method get The call to Transaction.Service.ss with http method 'get' is managed by this function
			// @return {Transaction.Model.Get.Result || Transaction.Model.List.Result}
		,	get: function()
			{
				var id = this.request.getParameter('internalid')
			,	record_type = this.request.getParameter('recordtype');

				if (id && record_type)
				{
					return TransactionModel.get(record_type, id);
				}
				else
				{
					return TransactionModel.list(
					{
						filter: this.request.getParameter('filter')
					,	order: this.request.getParameter('order')
					,	sort: this.request.getParameter('sort')
					,	from: this.request.getParameter('from')
					,	to: this.request.getParameter('to')
					,	page: this.request.getParameter('page') || 1
					,	types: this.request.getParameter('types')
					,	createdfrom: this.request.getParameter('createdfrom')
					});
				}
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

define('Location.Model'
,   [
		'SC.Model'
	,   'Application'
	,   'Utils'
	,	'Models.Init'
	,	'SiteSettings.Model'
	,   'underscore'
	,	'Configuration'
	]
,   function (
		SCModel
	,   Application
	,   Utils
	,	ModelsInit
	,	SiteSettings
	,   _
	,	Configuration
	)
{
	'use strict';

	// @class Location.Model
	// @extends SCModel
	return SCModel.extend({
		name: 'Location'
	,	columns: {
			'address1': new nlobjSearchColumn('address1')
		,	'address2': new nlobjSearchColumn('address2')
		,	'address3': new nlobjSearchColumn('address3')
		,	'city': new nlobjSearchColumn('city')
		,	'country': new nlobjSearchColumn('country')
		,	'state': new nlobjSearchColumn('state')
		,	'internalid': new nlobjSearchColumn('internalid')
		,	'isinactive': new nlobjSearchColumn('isinactive')
		,	'isoffice': new nlobjSearchColumn('isoffice')
		,	'makeinventoryavailable': new nlobjSearchColumn('makeinventoryavailable')
		,	'makeinventoryavailablestore': new nlobjSearchColumn('makeinventoryavailablestore')
		,	'namenohierarchy': new nlobjSearchColumn('namenohierarchy')
		,	'phone': new nlobjSearchColumn('phone')
		,	'tranprefix': new nlobjSearchColumn('tranprefix')
		,	'zip': new nlobjSearchColumn('zip')
		,	'latitude': new nlobjSearchColumn ('latitude')
		,	'longitude': new nlobjSearchColumn('longitude')
		,	'locationtype:': new nlobjSearchColumn('locationtype')
		}

		//@method list
		//@return {Location.Collection}
	,   list: function (data)
		{
			return this.search(data);
		}

		//@method get Return one single location
		//@param {String} id
		//@return {Location.Model.Get.Result}
	,   get: function (data)
		{
			this.result = {};

			this.data = data;

			var internalid  = _.isArray(this.data.internalid) ? this.data.internalid : this.data.internalid.split(',')
			,	search_results = this.search(data);

			if (internalid.length === 1)
			{

				this.result = search_results[0];
			}
			else
			{
				this.result = search_results;
			}

			return this.result;
		}

		// @property {Boolean} isPickupInStoreEnabled
	,	isPickupInStoreEnabled: SiteSettings.isPickupInStoreEnabled()

		//@method search
		//@param {Object}
		//@return {Location.Result}
	,   search: function (data)
		{

			var result = {}
			,   records = []
			,   self = this;

			this.filters = [];
			this.data = data;

			this.filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));

			if (this.data.locationtype)
			{
				var location_type = _.isArray(this.data.locationtype) ? this.data.locationtype : this.data.locationtype.split(',');

				this.filters.push(new nlobjSearchFilter('locationtype', null, 'anyof', location_type));
			}


			if (this.data.latitude && this.data.longitude)
			{
				//Automatic location detection fails, without completing the latitude and longitude fields.
				//Delete this filters when fixed.
				this.filters.push(new nlobjSearchFilter('latitude', null, 'isnotempty'));
				this.filters.push(new nlobjSearchFilter('longitude', null, 'isnotempty'));

				var formula = this.getDistanceFormulates();
				if (this.data.radius)
				{
					this.filters.push(new nlobjSearchFilter('formulanumeric', null, 'lessthan', this.data.radius).setFormula(formula));
				}
				//Validate that the formula returns some value.
				this.filters.push(new nlobjSearchFilter('formulanumeric', null, 'noneof', '@NONE@'));
				this.columns.distance =  new nlobjSearchColumn('formulanumeric').setFormula(formula).setFunction('roundToTenths');
			}

			if (this.data.internalid)
			{

				var internalid  = _.isArray(this.data.internalid) ? this.data.internalid : this.data.internalid.split(',');
				this.filters.push(new nlobjSearchFilter('internalid', null, 'anyof', internalid));
			}

			if (this.data.sort)
			{
				_.each(this.data.sort.split(','), function (column_name)
				{
					if (self.columns[column_name])
					{
						self.columns[column_name].setSort(self.data.order >= 0);
					}
				});
			}

			if (this.isPickupInStoreEnabled)
			{
				this.columns.allowstorepickup = new nlobjSearchColumn('allowstorepickup');
				this.columns.timezone = new nlobjSearchColumn('timezone');
				this.columns.nextpickupcutofftime = new nlobjSearchColumn('nextpickupcutofftime');
			}

			if (this.data.page === 'all')
			{
				this.search_results = Application.getAllSearchResults('location', _.values(this.filters), _.values(this.columns));
			}
			else
			{
				this.search_results = Application.getPaginatedSearchResults({
					record_type: 'location'
				,	filters: _.values(this.filters)
				,	columns: _.values(this.columns)
				,	page: this.data.page || 1
				,	results_per_page : this.data.results_per_page
				});
			}

			var results = ((this.data.page === 'all' ? this.search_results : this.search_results.records) || []) || [];

			if (this.isPickupInStoreEnabled)
			{
				this.searchServiceHoursResults = this.searchServiceHours(_.map(results, function (record)
				{
					return record.getId();
				}));
			}

			_.each(results, function (record)
			{
				records.push(self.getRecordValues(record));
			});

			if (this.data.page === 'all' || this.data.internalid)
			{
				result = records;
			}
			else
			{
				result = this.search_results;
				result.records = records;
			}

			return result;
		}

	,	searchServiceHours: function (ids)
		{
			if (!ids || !ids.length)
			{
				return [];
			}

			var filters = [
				new nlobjSearchFilter('internalid', null, 'anyof', ids)
			,	new nlobjSearchFilter('starttime', null, 'isnotempty')
			]
			,	columns = [
					new nlobjSearchColumn('ismonday')
				,	new nlobjSearchColumn('istuesday')
				,	new nlobjSearchColumn('iswednesday')
				,	new nlobjSearchColumn('isthursday')
				,	new nlobjSearchColumn('isfriday')
				,	new nlobjSearchColumn('issaturday')
				,	new nlobjSearchColumn('issunday')
				,	new nlobjSearchColumn('starttime')
				,	new nlobjSearchColumn('endtime')
				,	new nlobjSearchColumn('internalid')
			];

			return Application.getAllSearchResults('location', filters, columns);
		}

		//@method getServiceHours
		//@return {String}
	,	getServiceHours: function (id)
		{
			var records = _.filter(this.searchServiceHoursResults || [], function(record)
			{
				return record.getId() === id;
			});

			return _.map(records, function (record)
			{
				return {
					starttime: record.getValue('starttime')
				,	endtime: record.getValue('endtime')
				,	monday: record.getValue('ismonday')
				,	tuesday: record.getValue('istuesday')
				,	wednesday: record.getValue('iswednesday')
				,	thursday: record.getValue('isthursday')
				,	friday: record.getValue('isfriday')
				,	saturday: record.getValue('issaturday')
				,	sunday: record.getValue('issunday')
				};
			});
		}

		//@method getFriendlyName
		//@return {String}
	,	getFriendlyName: function (id)
		{
			if (Configuration.get().storeLocator && Configuration.get().storeLocator.customFriendlyName)
			{
				try
				{
					return nlapiLookupField('location', id, Configuration.get().storeLocator.customFriendlyName);
				}
				catch (error)
				{
					return '';
				}
			}
			return '';
		}

		//@method getDistanceFormulates
		//@return {String} distance formulates
	,   getDistanceFormulates: function ()
		{
			//R = Earth radius 6371 (km) , 3959 (mi)
			var PI = Math.PI
			,   R = Configuration.get().storeLocator.distanceUnit === 'mi' ? 3959 : 6371
			,   lat = this.data.latitude * PI / 180
			,   lon = this.data.longitude * PI / 180
			,   formula = R +
				' * (2 * ATAN2(SQRT((SIN((' + lat + '- ({latitude} * ' + PI + ' / 180)) / 2) *' +
				'SIN((' + lat + '- ({latitude} * ' + PI + ' / 180)) / 2) + ' +
				'COS(({latitude} * ' + PI + ' / 180)) * COS(' + lat + ') *' +
				'SIN((' + lon + '- ({longitude} * ' + PI + ' / 180)) /2) *' +
				'SIN((' + lon + '- ({longitude} * ' + PI + ' / 180)) /2))),' +
				'SQRT(1 - (SIN((' + lat + '- ({latitude} * ' + PI + ' / 180)) / 2) *' +
				'SIN((' + lat + '- ({latitude} * ' + PI + ' / 180)) / 2) +' +
				'COS(({latitude} * ' + PI + ' / 180)) * COS(' + lat + ') * ' +
				'SIN((' + lon + '- ({longitude} * ' + PI + ' / 180)) /2) * ' +
				'SIN((' + lon + '- ({longitude} * ' + PI + ' / 180)) /2)))))';

			return formula;
		}

		//@method getRecordValues
		//@return {Locator.Model.Result}
	,	getRecordValues: function (record)
		{
			var map_result = {}
			,	id = record.getValue('internalid')
			,	friendlyName = this.getFriendlyName(id);
			//@property {String} recordtype
			map_result.recordtype = record.getRecordType();
			//@property {String} internalid
			map_result.internalid = id;
			//@property {String} address1
			map_result.address1 = record.getValue('address1');
			//@property {String} address2
			map_result.address2 = record.getValue('address2');
			//@property {String} address3
			map_result.address3 = record.getValue('address3');
			//@property {String} city
			map_result.city = record.getValue('city');
			//@property {String} country
			map_result.country = record.getValue('country');
			//@property {String} state
			map_result.state = record.getValue('state');
			//@property {String} isoffice
			map_result.isoffice = record.getValue('isoffice');
			//@property {String} makeinventoryavailable
			map_result.makeinventoryavailable = record.getValue('makeinventoryavailable');
			//@property {String} makeinventoryavailablestore
			map_result.makeinventoryavailablestore = record.getValue('makeinventoryavailablestore');
			//@property {String} name
			map_result.name = friendlyName !== '' ? friendlyName : record.getValue('namenohierarchy');

			//@property {String} phone
			map_result.phone = record.getValue('phone');
			//@property {String} zip
			map_result.zip = record.getValue('zip');

			//@property {Object} location
			map_result.location = {
				//@property {String} latitude
				latitude: record.getValue('latitude')
				//@property {String} longitude
			,   longitude: record.getValue('longitude')
			};
			//@property {Number} locationtype
			map_result.locationtype = record.getValue('locationtype');

			if (this.data.latitude && this.data.longitude)
			{
				var distance = Math.round(record.getValue('formulanumeric') * 10) / 10;

				if (!_.isUndefined(distance))
				{
					//@property {Number} distance
					map_result.distance = Math.round(record.getValue('formulanumeric') * 10) / 10;
					map_result.distanceunit = Configuration.get().storeLocator.distanceUnit;
				}
			}

			if (this.isPickupInStoreEnabled)
			{
				//@property {String} openinghours
				map_result.servicehours = this.getServiceHours(id);
				//@property {Object} timezone
				map_result.timezone = {
						text: record.getText('timezone')

					,	value: record.getValue('timezone')
				};

				//@property {Boolean} allowstorepickup
				map_result.allowstorepickup = record.getValue('allowstorepickup') === 'T';

				if (map_result.allowstorepickup)
				{
					//@property {String} nextpickupcutofftime
					map_result.nextpickupcutofftime = record.getValue('nextpickupcutofftime');

					var next_pickup_cut_off_time_date = map_result.nextpickupcutofftime && map_result.nextpickupcutofftime !== ' ' && nlapiStringToDate(map_result.nextpickupcutofftime);

					if (next_pickup_cut_off_time_date)
					{
						var	current_date = Utils.getTodayDate()
						,	days_of_the_week = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

						if (current_date.getDay() === next_pickup_cut_off_time_date.getDay())
						{
							map_result.nextpickupday = 'today';
						}
						else if ((current_date.getDay() + 1) === next_pickup_cut_off_time_date.getDay())
						{
							map_result.nextpickupday = 'tomorrow';
						}
						else
						{
							map_result.nextpickupday = days_of_the_week[next_pickup_cut_off_time_date.getDay()];
						}

						map_result.nextpickuphour = nlapiDateToString(next_pickup_cut_off_time_date, 'timeofday');
					}
					else
					{
						//@property {String} nextpickupday
						map_result.nextpickupday = null;
						//@property {String} nextpickuphour
						map_result.nextpickuphour = null;
						//@property {String} nextpickupcutofftime
						map_result.nextpickupcutofftime = null;
					}

				}

			}

			return map_result;
		}

	});
});


/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Location.ServiceController.js
// ----------------
// Service to get requests
define(
    'Location.ServiceController'
,   [
        'ServiceController'
    ,   'Location.Model'
    ]
,   function(
        ServiceController
    ,   LocationModel
    )
    {
        'use strict';

        return ServiceController.extend({

            name: 'Location.ServiceController'

        ,   get: function()
            {
                var id = this.request.getParameter('internalid');
                if (id)
                {
                   return LocationModel.get({
                        internalid: id
                    });
                }
                else
                {
                   return LocationModel.list({
                        'latitude': this.request.getParameter('latitude')
                    ,   'longitude': this.request.getParameter('longitude')
                    ,   'radius': this.request.getParameter('radius')
                    ,   'sort': this.request.getParameter('sort')
                    ,   'page': this.request.getParameter('page')
                    ,   'locationtype': this.request.getParameter('locationtype')
                    ,   'results_per_page': this.request.getParameter('results_per_page')
                    });
                }
            }
        });
    }
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module StoreLocator
define('StoreLocator.Model'
,	[
		'SC.Model'

	,	'Application'
	,	'Utils'
	,	'Location.Model'
	,	'Configuration'
	]
,	function (
		SCModel

	,	Application
	,	Utils
	,	LocationModel
	,	Configuration
	)
{
	'use strict';

	// @class StoreLocator.Model
	// @extends SCModel
	return LocationModel.extend({
		name: 'StoreLocator'

		//@method list Overrides filters for the retrieving the first three nearest stores.
		//@param {Object} data
		//@returns {Array<Object>} list of stores
	,	list: function (data)
		{
			data.locationtype = data.locationtype || Configuration.get('storeLocator.defaultTypeLocations');

			var result = this.search(data);

			if (!result.length && !result.recordsPerPage)
			{
				data.radius = undefined;
				data.results_per_page = data.results_per_page || Configuration.get('storeLocator.defaultQuantityLocations');
				data.page = 1;
				result = this.search(data);
			}

			return result;
		}

	});
});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module StoreLocator
define(
	'StoreLocator.ServiceController'
,   [
		'ServiceController'
	,   'StoreLocator.Model'
	]
,   function(
		ServiceController
	,   StoreLocatorModel
	)
	{
		'use strict';

		return ServiceController.extend({

			name: 'Location.ServiceController'

		,   get: function()
			{
				var id = this.request.getParameter('internalid');
				
				if (id)
				{
				   return StoreLocatorModel.get({
						internalid: id
					});
				}
				else
				{
				   return StoreLocatorModel.list({
						'latitude': this.request.getParameter('latitude')
					,	'longitude': this.request.getParameter('longitude')
					,	'radius': this.request.getParameter('radius')
					,	'sort': this.request.getParameter('sort')
					,	'page': this.request.getParameter('page')
					,	'locationtype': this.request.getParameter('locationtype')
					,	'results_per_page': this.request.getParameter('results_per_page')
					});
				}
			}
		});
	}
);
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module jQuery
define('jQuery.Deferred'
,	[],function ()
{
	/*!
	 * Modules from jQuery JavaScript Library v1.11.1
	 * http://jquery.com/
	 *
	 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2014-05-01T17:42Z
	 */

	// Can't do this because several apps including ASP.NET trace
	// the stack via arguments.caller.callee and Firefox dies if
	// you try to trace through "use strict" call chains. (#13335)
	// Support: Firefox 18+
	//

	var deletedIds = [];

	var slice = deletedIds.slice;

	var concat = deletedIds.concat;

	var push = deletedIds.push;

	var indexOf = deletedIds.indexOf;

	var class2type = {};

	var toString = class2type.toString;

	var hasOwn = class2type.hasOwnProperty;

	var support = {};

	var strundefined = typeof undefined;

	var
		version = "1.11.1",

		// Define a local copy of jQuery
		jQuery = function( selector, context ) {
			// The jQuery object is actually just the init constructor 'enhanced'
			// Need init if jQuery is called (just allow error to be thrown if not included)
			return new jQuery.fn.init( selector, context );
		},

		// Support: Android<4.1, IE<9
		// Make sure we trim BOM and NBSP
		rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

		// Matches dashed string for camelizing
		rmsPrefix = /^-ms-/,
		rdashAlpha = /-([\da-z])/gi,

		// Used by jQuery.camelCase as callback to replace()
		fcamelCase = function( all, letter ) {
			return letter.toUpperCase();
		};

	jQuery.fn = jQuery.prototype = {
		// The current version of jQuery being used
		jquery: version,

		constructor: jQuery,

		// Start with an empty selector
		selector: "",

		// The default length of a jQuery object is 0
		length: 0,

		toArray: function() {
			return slice.call( this );
		},

		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function( num ) {
			return num != null ?

				// Return just the one element from the set
				( num < 0 ? this[ num + this.length ] : this[ num ] ) :

				// Return all the elements in a clean array
				slice.call( this );
		},

		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function( elems ) {

			// Build a new jQuery matched element set
			var ret = jQuery.merge( this.constructor(), elems );

			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;
			ret.context = this.context;

			// Return the newly-formed element set
			return ret;
		},

		// Execute a callback for every element in the matched set.
		// (You can seed the arguments with an array of args, but this is
		// only used internally.)
		each: function( callback, args ) {
			return jQuery.each( this, callback, args );
		},

		map: function( callback ) {
			return this.pushStack( jQuery.map(this, function( elem, i ) {
				return callback.call( elem, i, elem );
			}));
		},

		slice: function() {
			return this.pushStack( slice.apply( this, arguments ) );
		},

		first: function() {
			return this.eq( 0 );
		},

		last: function() {
			return this.eq( -1 );
		},

		eq: function( i ) {
			var len = this.length,
				j = +i + ( i < 0 ? len : 0 );
			return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
		},

		end: function() {
			return this.prevObject || this.constructor(null);
		},

		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: push,
		sort: deletedIds.sort,
		splice: deletedIds.splice
	};

	jQuery.extend = jQuery.fn.extend = function() {
		var src, copyIsArray, copy, name, options, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;

			// skip the boolean and the target
			target = arguments[ i ] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
			target = {};
		}

		// extend jQuery itself if only one argument is passed
		if ( i === length ) {
			target = this;
			i--;
		}

		for ( ; i < length; i++ ) {
			// Only deal with non-null/undefined values
			if ( (options = arguments[ i ]) != null ) {
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && jQuery.isArray(src) ? src : [];

						} else {
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[ name ] = jQuery.extend( deep, clone, copy );

					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	jQuery.extend({
		// Unique for each copy of jQuery on the page
		expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

		// Assume jQuery is ready without the ready module
		isReady: true,

		error: function( msg ) {
			throw new Error( msg );
		},

		noop: function() {},

		// See test/unit/core.js for details concerning isFunction.
		// Since version 1.3, DOM methods and functions like alert
		// aren't supported. They return false on IE (#2968).
		isFunction: function( obj ) {
			return jQuery.type(obj) === "function";
		},

		isArray: Array.isArray || function( obj ) {
			return jQuery.type(obj) === "array";
		},

		isWindow: function( obj ) {
			/* jshint eqeqeq: false */
			return obj != null && obj == obj.window;
		},

		isNumeric: function( obj ) {
			// parseFloat NaNs numeric-cast false positives (null|true|false|"")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			return !jQuery.isArray( obj ) && obj - parseFloat( obj ) >= 0;
		},

		isEmptyObject: function( obj ) {
			var name;
			for ( name in obj ) {
				return false;
			}
			return true;
		},

		isPlainObject: function( obj ) {
			var key;

			// Must be an Object.
			// Because of IE, we also have to check the presence of the constructor property.
			// Make sure that DOM nodes and window objects don't pass through, as well
			if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
				return false;
			}

			try {
				// Not own constructor property must be Object
				if ( obj.constructor &&
					!hasOwn.call(obj, "constructor") &&
					!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
					return false;
				}
			} catch ( e ) {
				// IE8,9 Will throw exceptions on certain host objects #9897
				return false;
			}

			// Support: IE<9
			// Handle iteration over inherited properties before own properties.
			if ( support.ownLast ) {
				for ( key in obj ) {
					return hasOwn.call( obj, key );
				}
			}

			// Own properties are enumerated firstly, so to speed up,
			// if last one is own, then all properties are own.
			for ( key in obj ) {}

			return key === undefined || hasOwn.call( obj, key );
		},

		type: function( obj ) {
			if ( obj == null ) {
				return obj + "";
			}
			return typeof obj === "object" || typeof obj === "function" ?
				class2type[ toString.call(obj) ] || "object" :
				typeof obj;
		},

		// Evaluates a script in a global context
		// Workarounds based on findings by Jim Driscoll
		// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
		globalEval: function( data ) {
			if ( data && jQuery.trim( data ) ) {
				// We use execScript on Internet Explorer
				// We use an anonymous function so that context is window
				// rather than jQuery in Firefox
				( window.execScript || function( data ) {
					window[ "eval" ].call( window, data );
				} )( data );
			}
		},

		// Convert dashed to camelCase; used by the css and data modules
		// Microsoft forgot to hump their vendor prefix (#9572)
		camelCase: function( string ) {
			return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
		},

		nodeName: function( elem, name ) {
			return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
		},

		// args is for internal usage only
		each: function( obj, callback, args ) {
			var value,
				i = 0,
				length = obj.length,
				isArray = isArraylike( obj );

			if ( args ) {
				if ( isArray ) {
					for ( ; i < length; i++ ) {
						value = callback.apply( obj[ i ], args );

						if ( value === false ) {
							break;
						}
					}
				} else {
					for ( i in obj ) {
						value = callback.apply( obj[ i ], args );

						if ( value === false ) {
							break;
						}
					}
				}

			// A special, fast, case for the most common use of each
			} else {
				if ( isArray ) {
					for ( ; i < length; i++ ) {
						value = callback.call( obj[ i ], i, obj[ i ] );

						if ( value === false ) {
							break;
						}
					}
				} else {
					for ( i in obj ) {
						value = callback.call( obj[ i ], i, obj[ i ] );

						if ( value === false ) {
							break;
						}
					}
				}
			}

			return obj;
		},

		// Support: Android<4.1, IE<9
		trim: function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

		// results is for internal usage only
		makeArray: function( arr, results ) {
			var ret = results || [];

			if ( arr != null ) {
				if ( isArraylike( Object(arr) ) ) {
					jQuery.merge( ret,
						typeof arr === "string" ?
						[ arr ] : arr
					);
				} else {
					push.call( ret, arr );
				}
			}

			return ret;
		},

		inArray: function( elem, arr, i ) {
			var len;

			if ( arr ) {
				if ( indexOf ) {
					return indexOf.call( arr, elem, i );
				}

				len = arr.length;
				i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

				for ( ; i < len; i++ ) {
					// Skip accessing in sparse arrays
					if ( i in arr && arr[ i ] === elem ) {
						return i;
					}
				}
			}

			return -1;
		},

		merge: function( first, second ) {
			var len = +second.length,
				j = 0,
				i = first.length;

			while ( j < len ) {
				first[ i++ ] = second[ j++ ];
			}

			// Support: IE<9
			// Workaround casting of .length to NaN on otherwise arraylike objects (e.g., NodeLists)
			if ( len !== len ) {
				while ( second[j] !== undefined ) {
					first[ i++ ] = second[ j++ ];
				}
			}

			first.length = i;

			return first;
		},

		grep: function( elems, callback, invert ) {
			var callbackInverse,
				matches = [],
				i = 0,
				length = elems.length,
				callbackExpect = !invert;

			// Go through the array, only saving the items
			// that pass the validator function
			for ( ; i < length; i++ ) {
				callbackInverse = !callback( elems[ i ], i );
				if ( callbackInverse !== callbackExpect ) {
					matches.push( elems[ i ] );
				}
			}

			return matches;
		},

		// arg is for internal usage only
		map: function( elems, callback, arg ) {
			var value,
				i = 0,
				length = elems.length,
				isArray = isArraylike( elems ),
				ret = [];

			// Go through the array, translating each of the items to their new values
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback( elems[ i ], i, arg );

					if ( value != null ) {
						ret.push( value );
					}
				}

			// Go through every key on the object,
			} else {
				for ( i in elems ) {
					value = callback( elems[ i ], i, arg );

					if ( value != null ) {
						ret.push( value );
					}
				}
			}

			// Flatten any nested arrays
			return concat.apply( [], ret );
		},

		// A global GUID counter for objects
		guid: 1,

		// Bind a function to a context, optionally partially applying any
		// arguments.
		proxy: function( fn, context ) {
			var args, proxy, tmp;

			if ( typeof context === "string" ) {
				tmp = fn[ context ];
				context = fn;
				fn = tmp;
			}

			// Quick check to determine if target is callable, in the spec
			// this throws a TypeError, but we will just return undefined.
			if ( !jQuery.isFunction( fn ) ) {
				return undefined;
			}

			// Simulated bind
			args = slice.call( arguments, 2 );
			proxy = function() {
				return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
			};

			// Set the guid of unique handler to the same of original handler, so it can be removed
			proxy.guid = fn.guid = fn.guid || jQuery.guid++;

			return proxy;
		},

		now: function() {
			return +( new Date() );
		},

		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		support: support
	});

	// Populate the class2type map
	jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	});

	function isArraylike( obj ) {
		var length = obj.length,
			type = jQuery.type( obj );

		if ( type === "function" || jQuery.isWindow( obj ) ) {
			return false;
		}

		if ( obj.nodeType === 1 && length ) {
			return true;
		}

		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && ( length - 1 ) in obj;
	}


	var rnotwhite = (/\S+/g);

	// String to Object options format cache
	var optionsCache = {};

	// Convert String-formatted options into Object-formatted ones and store in cache
	function createOptions( options ) {
		var object = optionsCache[ options ] = {};
		jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
			object[ flag ] = true;
		});
		return object;
	}


	/*
	 * Create a callback list using the following parameters:
	 *
	 *	options: an optional list of space-separated options that will change how
	 *			the callback list behaves or a more traditional option object
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible options:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */
	jQuery.Callbacks = function( options ) {

		// Convert options from String-formatted to Object-formatted if needed
		// (we check in cache first)
		options = typeof options === "string" ?
			( optionsCache[ options ] || createOptions( options ) ) :
			jQuery.extend( {}, options );

		var // Flag to know if list is currently firing
			firing,
			// Last fire value (for non-forgettable lists)
			memory,
			// Flag to know if list was already fired
			fired,
			// End of the loop when firing
			firingLength,
			// Index of currently firing callback (modified by remove if needed)
			firingIndex,
			// First callback to fire (used internally by add and fireWith)
			firingStart,
			// Actual callback list
			list = [],
			// Stack of fire calls for repeatable lists
			stack = !options.once && [],
			// Fire callbacks
			fire = function( data ) {
				memory = options.memory && data;
				fired = true;
				firingIndex = firingStart || 0;
				firingStart = 0;
				firingLength = list.length;
				firing = true;
				for ( ; list && firingIndex < firingLength; firingIndex++ ) {
					if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
						memory = false; // To prevent further calls using add
						break;
					}
				}
				firing = false;
				if ( list ) {
					if ( stack ) {
						if ( stack.length ) {
							fire( stack.shift() );
						}
					} else if ( memory ) {
						list = [];
					} else {
						self.disable();
					}
				}
			},
			// Actual Callbacks object
			self = {
				// Add a callback or a collection of callbacks to the list
				add: function() {
					if ( list ) {
						// First, we save the current length
						var start = list.length;
						(function add( args ) {
							jQuery.each( args, function( _, arg ) {
								var type = jQuery.type( arg );
								if ( type === "function" ) {
									if ( !options.unique || !self.has( arg ) ) {
										list.push( arg );
									}
								} else if ( arg && arg.length && type !== "string" ) {
									// Inspect recursively
									add( arg );
								}
							});
						})( arguments );
						// Do we need to add the callbacks to the
						// current firing batch?
						if ( firing ) {
							firingLength = list.length;
						// With memory, if we're not firing then
						// we should call right away
						} else if ( memory ) {
							firingStart = start;
							fire( memory );
						}
					}
					return this;
				},
				// Remove a callback from the list
				remove: function() {
					if ( list ) {
						jQuery.each( arguments, function( _, arg ) {
							var index;
							while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
								list.splice( index, 1 );
								// Handle firing indexes
								if ( firing ) {
									if ( index <= firingLength ) {
										firingLength--;
									}
									if ( index <= firingIndex ) {
										firingIndex--;
									}
								}
							}
						});
					}
					return this;
				},
				// Check if a given callback is in the list.
				// If no argument is given, return whether or not list has callbacks attached.
				has: function( fn ) {
					return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
				},
				// Remove all callbacks from the list
				empty: function() {
					list = [];
					firingLength = 0;
					return this;
				},
				// Have the list do nothing anymore
				disable: function() {
					list = stack = memory = undefined;
					return this;
				},
				// Is it disabled?
				disabled: function() {
					return !list;
				},
				// Lock the list in its current state
				lock: function() {
					stack = undefined;
					if ( !memory ) {
						self.disable();
					}
					return this;
				},
				// Is it locked?
				locked: function() {
					return !stack;
				},
				// Call all callbacks with the given context and arguments
				fireWith: function( context, args ) {
					if ( list && ( !fired || stack ) ) {
						args = args || [];
						args = [ context, args.slice ? args.slice() : args ];
						if ( firing ) {
							stack.push( args );
						} else {
							fire( args );
						}
					}
					return this;
				},
				// Call all the callbacks with the given arguments
				fire: function() {
					self.fireWith( this, arguments );
					return this;
				},
				// To know if the callbacks have already been called at least once
				fired: function() {
					return !!fired;
				}
			};

		return self;
	};


	jQuery.extend({

		Deferred: function( func ) {
			var tuples = [
					// action, add listener, listener list, final state
					[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
					[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
					[ "notify", "progress", jQuery.Callbacks("memory") ]
				],
				state = "pending",
				promise = {
					state: function() {
						return state;
					},
					always: function() {
						deferred.done( arguments ).fail( arguments );
						return this;
					},
					then: function( /* fnDone, fnFail, fnProgress */ ) {
						var fns = arguments;
						return jQuery.Deferred(function( newDefer ) {
							jQuery.each( tuples, function( i, tuple ) {
								var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
								// deferred[ done | fail | progress ] for forwarding actions to newDefer
								deferred[ tuple[1] ](function() {
									var returned = fn && fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise()
											.done( newDefer.resolve )
											.fail( newDefer.reject )
											.progress( newDefer.notify );
									} else {
										newDefer[ tuple[ 0 ] + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
									}
								});
							});
							fns = null;
						}).promise();
					},
					// Get a promise for this deferred
					// If obj is provided, the promise aspect is added to the object
					promise: function( obj ) {
						return obj != null ? jQuery.extend( obj, promise ) : promise;
					}
				},
				deferred = {};

			// Keep pipe for back-compat
			promise.pipe = promise.then;

			// Add list-specific methods
			jQuery.each( tuples, function( i, tuple ) {
				var list = tuple[ 2 ],
					stateString = tuple[ 3 ];

				// promise[ done | fail | progress ] = list.add
				promise[ tuple[1] ] = list.add;

				// Handle state
				if ( stateString ) {
					list.add(function() {
						// state = [ resolved | rejected ]
						state = stateString;

					// [ reject_list | resolve_list ].disable; progress_list.lock
					}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
				}

				// deferred[ resolve | reject | notify ]
				deferred[ tuple[0] ] = function() {
					deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
					return this;
				};
				deferred[ tuple[0] + "With" ] = list.fireWith;
			});

			// Make the deferred a promise
			promise.promise( deferred );

			// Call given func if any
			if ( func ) {
				func.call( deferred, deferred );
			}

			// All done!
			return deferred;
		},

		// Deferred helper
		when: function( subordinate /* , ..., subordinateN */ ) {
			var i = 0,
				resolveValues = slice.call( arguments ),
				length = resolveValues.length,

				// the count of uncompleted subordinates
				remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

				// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
				deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

				// Update function for both resolve and progress values
				updateFunc = function( i, contexts, values ) {
					return function( value ) {
						contexts[ i ] = this;
						values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
						if ( values === progressValues ) {
							deferred.notifyWith( contexts, values );

						} else if ( !(--remaining) ) {
							deferred.resolveWith( contexts, values );
						}
					};
				},

				progressValues, progressContexts, resolveContexts;

			// add listeners to Deferred subordinates; treat others as resolved
			if ( length > 1 ) {
				progressValues = new Array( length );
				progressContexts = new Array( length );
				resolveContexts = new Array( length );
				for ( ; i < length; i++ ) {
					if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
						resolveValues[ i ].promise()
							.done( updateFunc( i, resolveContexts, resolveValues ) )
							.fail( deferred.reject )
							.progress( updateFunc( i, progressContexts, progressValues ) );
					} else {
						--remaining;
					}
				}
			}

			// if we're not waiting on anything, resolve the master
			if ( !remaining ) {
				deferred.resolveWith( resolveContexts, resolveValues );
			}

			return deferred.promise();
		}
	});




	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.

	// Note that for maximum portability, libraries that are not jQuery should
	// declare themselves as anonymous modules, and avoid setting a global if an
	// AMD loader is present. jQuery is a special case. For more information, see
	// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function() {
			return jQuery;
		});
	}




	var
		// Map over jQuery in case of overwrite
		_jQuery = window.jQuery,

		// Map over the $ in case of overwrite
		_$ = window.$;

	jQuery.noConflict = function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	};

	// Expose jQuery and $ identifiers, even in
	// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)
	if ( typeof noGlobal === strundefined ) {
		window.jQuery = window.$ = jQuery;
	}

	return jQuery;
});

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module SC
define('SC.CancelableEvents'
,	[
		'Utils'
	,	'underscore'
	,	'jQuery.Deferred'
	]
,	function (
	 	Utils
	,	_
	,	jQuery
	)
{
	'use strict';

	//@class SC.CancelableEvents
	return {
		//@method cancelableOn Allow to attach an event handler into a particular event name
		//@public
		//@param {String} event_name The name of the event to attach to
		//@param {Function} handler The event handler function that will be invoked when the event __event_name__ is triggered.
		//This function can receive optionally one parameter representing the action parameter. Besides optionally can return a jQuery.Deferred
		//to details the execution of the trigger's callback. If the returned jQuery.Deferred is rejected the trigger's callback wont be called
		//@return {Void}
		cancelableOn: function cancelableOn (event_name, handler)
		{
			this._cancelableOn(this, event_name, handler);
		}

		//@method cancelableOff Allow to detach an event handler.
		//@public
		//@param {String} event_name The name of the event to detach from. Note that this parameter is mandatory
		//@param {Function} handler The event handler function that will be removed from the list of register handlers. Note this parameter is required.
		//@return {Void}
	,	cancelableOff: function cancelableOff (event_name, handler)
		{
			if (!_.isString(event_name) || !_.isFunction(handler))
			{
				throw {
					status: SC.ERROR_IDENTIFIERS.invalidParameter.status
				,	code: SC.ERROR_IDENTIFIERS.invalidParameter.code
				,	message: 'Parameter "event_name" and "handler" must be String and Function respectively'
				};
			}
			this._cancelableOff(this, event_name, handler);
		}

		//@method _cancelableOff Internal method that implemented the logic to remove an event handler from an event container.
		//@private
		//@param {Object} events_container_entity Any object used to store the list of event handlers
		//@param {String} event_name The name of the event to detach from. Note that this parameter is mandatory
		//@param {Function} handler The event handler function that will be removed from the list of register handlers. Note this parameter is required.
		//@return {Object} the same events_container_entity passed in as parameter
	,	_cancelableOff: function _cancelableOff (events_container_entity, event_name, handler)
		{
			if (!events_container_entity ||
				!events_container_entity._cancelableEvents ||
				!events_container_entity._cancelableEvents[event_name] ||
				!events_container_entity._cancelableEvents[event_name].length)
			{
				return events_container_entity;
			}

			events_container_entity._cancelableEvents[event_name] = _.reject(events_container_entity._cancelableEvents[event_name], function (event_object)
			{
				return event_object.fn === handler;
			});

			return events_container_entity;
		}

		//@method _cancelableOn Internal method that implements the logic to add a new event handler into a container
		//@private
		//@param {Object} events_container_entity Any object used to store the list of event handlers
		//@param {String} event_name The name of the event to attach to
		//@param {Function} handler The event handler function that will be invoked when the event __event_name__ is triggered.
		//This function can receive optionally one parameter representing the action parameter. Besides optionally can return a jQuery.Deferred
		//to details the execution of the trigger's callback. If the returned jQuery.Deferred is rejected the trigger's callback wont be called
		//@return {Object} the same events_container_entity passed in as parameter
	,	_cancelableOn: function _cancelableOn (events_container_entity, event_name, handler)
		{
			events_container_entity._cancelableEvents = events_container_entity._cancelableEvents || {};
			var event_handlers = events_container_entity._cancelableEvents[event_name] = events_container_entity._cancelableEvents[event_name] || [];

			event_handlers.push({
				fn: handler
			});

			return events_container_entity;
		}

		//@method cancelableDisable Allow to disable all the handlers of a particular event
		//@public
		//@param {String} event_name The name of the event to disable
		//@return {Void}
	,	cancelableDisable: function cancelableDisable (event_name)
		{
			if (!_.isString(event_name))
			{
				throw {
					status: SC.ERROR_IDENTIFIERS.invalidParameter.status
				,	code: SC.ERROR_IDENTIFIERS.invalidParameter.code
				,	message: 'Parameter "event_name" must be String'
				};
			}
			this._cancelableDisable(this, event_name);
		}

		//@method _cancelableDisable Internal method that implements the logic to disable an event into a container
		//@private
		//@param {Object} events_container_entity Any object used to store the list of event handlers
		//@param {String} event_name The name of the event to attach to
		//@return {Object} the same events_container_entity passed in as parameter
	,	_cancelableDisable: function _cancelableDisable (events_container_entity, event_name)
		{
			events_container_entity._cancelableEvents = events_container_entity._cancelableEvents || {};
			events_container_entity._cancelableDisabledEvents = events_container_entity._cancelableDisabledEvents || {};
			events_container_entity._cancelableDisabledEvents[event_name] = events_container_entity._cancelableDisabledEvents[event_name] || [];

			//If already disable an event without re-enable it do nothing
			if(_.isEmpty(events_container_entity._cancelableDisabledEvents[event_name]))
			{
				events_container_entity._cancelableDisabledEvents[event_name] = events_container_entity._cancelableEvents[event_name] || [];
				events_container_entity._cancelableEvents[event_name] = [];
			}

			return events_container_entity;
		}

		//@method cancelableEnable Allow to enable (restore) all the handlers of a particular event
		//@public
		//@param {String} event_name The name of the event to disable
		//@return {Void}
	,	cancelableEnable: function cancelableEnable (event_name)
		{
			if (!_.isString(event_name))
			{
				throw {
					status: SC.ERROR_IDENTIFIERS.invalidParameter.status
				,	code: SC.ERROR_IDENTIFIERS.invalidParameter.code
				,	message: 'Parameter "event_name" must be String'
				};
			}
			this._cancelableEnable(this, event_name);
		}

		//@method _cancelableEnable Internal method that implements the logic to enable (restore) an event into a container
		//@private
		//@param {Object} events_container_entity Any object used to store the list of event handlers
		//@param {String} event_name The name of the event to attach to
		//@return {Object} the same events_container_entity passed in as parameter
	,	_cancelableEnable: function _cancelableEnable (events_container_entity, event_name)
		{
			events_container_entity._cancelableEvents = events_container_entity._cancelableEvents || {};
			events_container_entity._cancelableDisabledEvents = events_container_entity._cancelableDisabledEvents || {};
			events_container_entity._cancelableDisabledEvents[event_name] = events_container_entity._cancelableDisabledEvents[event_name] || [];

			//If the event was not disable before do nothing
			if(!_.isEmpty(events_container_entity._cancelableDisabledEvents[event_name]))
			{
				events_container_entity._cancelableEvents[event_name] = _.union(
					events_container_entity._cancelableEvents[event_name] || []
				,	events_container_entity._cancelableDisabledEvents[event_name]
				);
				events_container_entity._cancelableDisabledEvents[event_name] = [];
			}

			return events_container_entity;
		}

		//@method cancelableTrigger Trigger the indicate event with the passed in parameters. In case that any of the event handler reject the execution (the callback WONT be called)
		//@public
		//@param {String} event_name Event to trigger
		//@param {...params} args All other parameter passed to this function will be broadcaster to all event handlers
		//@return {jQuery.Deferred} As the event handler of an event can be asynchronous (that why it use Deferrers) the invocation of the callback is async. This means that this function
		//will return Deferred to represent this asynchronous
	,	cancelableTrigger: function cancelableTrigger (event_name)
		{
			var args = Array.prototype.slice.call(arguments).slice(1);
			return this._cancelableTrigger(this, event_name, args, true);
		}

		//@method cancelableTriggerUnsafe Trigger the indicate event with the passed in parameters WITHOUT sanitize them.
		//In case that any of the event handler reject (returns a rejected Deferred) the execution (the callback WONT be called)
		//@public
		//@param {String} event_name Event to trigger
		//@param {...params} args All other parameter passed to this function will be broadcaster to all event handlers
		//@return {jQuery.Deferred} As the event handler of an event can be asynchronous (that why it use Deferrers) the invocation of the callback is async. This means that this function
		//will return Deferred to represent this asynchronous
	,	cancelableTriggerUnsafe: function cancelableTriggerUnsafe (event_name)
		{
			var args = Array.prototype.slice.call(arguments).slice(1);
			return this._cancelableTrigger(this, event_name, args, false);
		}

		//@method _cancelableTrigger Internal method that will trigger the indicate event with the passed in data (intent). In case that any of the event handler reject the execution (the callback WONT be called)
		//@private
		//@param {Object} events_container_entity Store of the event handlers
		//@param {String} event_name Event to trigger
		//@param {Array<Any>} args Array of parameters to send to all event handlers attached to the specified event (if any)
		//@param {Boolean} safe_parameters Indicate if the parameter args should be sanitized or no.
		//@return {jQuery.Deferred}
	,	_cancelableTrigger: function _cancelableTrigger (events_container_entity, event_name, args, safe_parameters)
		{
			var self = this;

			if (!events_container_entity || !events_container_entity._cancelableEvents || !events_container_entity._cancelableEvents[event_name] || !events_container_entity._cancelableEvents[event_name].length)
			{
				return jQuery.Deferred().resolve();
			}
			else
			{
				var event_handler_promises = _.map(events_container_entity._cancelableEvents[event_name], function (event_handler_container)
				{
					try {
						return event_handler_container.fn.apply(null, safe_parameters ? _.map(args, self._getSafeParameter) : args);
					} catch (e) {
						console.log('SCA_EXTENSIBILITY_LAYER_ERROR', 'Exception on event handler for event ' + event_name, e);
						console.log('SCA_EXTENSIBILITY_LAYER_ERROR_STACK', e.stack);

						return jQuery.Deferred().reject(e);
					}
				});

				return jQuery.when.apply(jQuery, event_handler_promises);
			}
		}

		//@method _getSafeParameter Generate a safe-to-be-used copy of the passed in parameter
		//@private
		//@param {Object?} original_intent Any object
		//@return {Object?} Safe to be used by event handlers methods
	,	_getSafeParameter: function _getSafeParameter (original_intent)
		{
			return _.isUndefined(original_intent) ? original_intent : Utils.deepCopy(original_intent);
		}
	};

});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module SC
define('SC.BaseComponent'
,	[
		'SC.CancelableEvents'

	,	'Application'
	//,	'Instrumentation'

	,	'Utils'
	,	'jQuery.Deferred'
	,	'underscore'
	]
,	function (
		SCCancelableEvents

	,	Application
	//,	Instrumentation

	,	Utils
	,	jQuery
	,	_
	)
{
	'use strict';

	// @param methods_to_async keeps the async api component methods that we need to generate
	// the synchronous version
	var methods_to_async;

	// @function _asyncToSync helper method to generate a synchronous version of a backend async
	// component method. It exist only until we have real asynchronous behavior in backend.
	// @param {Function} async_fn function that returns a @?class jQuery.Deferred
	// @return {Function<Obj>, Function<Error>} Function that returns an Object or throws an error.
	// @private
	var _asyncToSync = function _asyncToSync(async_fn)
	{

		return function synchronousWrapper()
		{
			var result_sync
			,	result_error
			,	args = Array.prototype.slice.call(arguments);

			async_fn.apply(this, args)
			.done(function asyncSuccess(result)
			{
				result_sync = result;
			})
			.fail(function asyncFail(error)
			{
				result_error = error;
			});

			if( result_error )
			{
				throw result_error;
			}

			return result_sync;
		};
	};

	// @class SC.BaseComponent Abstract Base class for SuiteCommerce back-end Components (SuiteScript)
	// Concrete components inherit from this class.
	// @extends SC.CancelableEvents @extlayer
	var base_component = _.extend({


		// @property {String} componentName This is the name that reference this type of component


		// @method extend Extend the current component to generate a child one
		// @param {Object} child_component Any object with properties/methods that will be used to generate the SC.Component that will be returned
		// @return {SC.BaseComponent}
		// @static @public @extlayer
		extend: function extend (child_component)
		{
			if (!child_component || (!child_component.componentName && !this.componentName))
			{
				return this._reportError('INVALID_PARAM', 'Invalid SC.Component. Property "componentName" is required.');
			}

			methods_to_async = _.filter(_.keys(child_component), function(key)
			{
				return _.isFunction(child_component[key]) && key.indexOf('_') !== 0;
			});

			return _.extend({}, this, child_component);
		}

		// @method _reportError Internal method used to centrally handle error reporting
		// @private
		// @param {String} code Error code
		// @param {String} description Error description
		// @return {Void}
	,	_reportError: function _reportError (code, description)
		{
			var error = new Error(description);
			error.name = code;
			throw error;
		}

		// @method _asyncErrorHandle Handle common async error wrappers it throws error so as to cancel the before:model.method events also
		// @param {jQuery.Deferred} deferred
		// @return {Function<Error>, Error} Error handle function
	,	_asyncErrorHandle: function _asyncErrorHandle (deferred)
		{
			return function (error)
			{
				if (error)
				{
					deferred.reject();
					throw error;
				}
			};
		}

		// @method _exposeAPIEvent Handle common code to expose private Application before and after events
		// into public Extensibility events
		// @param {String} event_name name of the event of the form before:<model.name>.metodName
		// @return {jQuery.Deferred}
		// @private
	,	_exposeAPIEvent: function _exposeAPIEvent()
		{
			var	result = jQuery.Deferred()
			,	args = Array.prototype.slice.call(arguments);

			this.cancelableTrigger.apply(this, args)
				.fail(this._asyncErrorHandle(result))
				.done(result.resolve);

			return result;
		}

		// @method _generateSyncMethods helper method to generate a synchronous version of all of the backend async
		// component method. It exist only until we have real asynchronous behavior in backend.
		// @return {Function<Void>} Function that returns an Object or throws an error.
		// @private
	,	_generateSyncMethods: function _generateSyncMethods()
		{
			var self = this;

			_.each(methods_to_async, function(method_name)
		    {
                self[method_name] = _.wrap(self[method_name], function(fn)
                {
					/*Instrumentation.log({
						method_name: method_name
					});*/

                    var args = Array.prototype.slice.call(arguments, 1);
                    return fn.apply(this, args);
                });

		    	self[method_name + 'Sync'] = _asyncToSync(self[method_name]);
		    });
		}

		// @method _suscribeToInnerEvents subscribes to the inner events, according to the innerToOuterMap param, in onrther to trigger the outer events
		// @param {Array<String, String, Function>} innerToOuterMap Maps inner events with outer events
		// @private
	,	_suscribeToInnerEvents: function _suscribeToInnerEvents(innerToOuterMap)
		{
			var self = this;
			_.map(innerToOuterMap, function(innerToOuter){

				Application.on(innerToOuter.inner, function(){
					//remove the model (first argument) and keeps the first place of the array
					var args = Utils.deepCopy(Array.prototype.slice.call(arguments, 1));
					args = innerToOuter.normalize ? innerToOuter.normalize.call(self, args) : args;

					//prepend the event name to the arguments array
					args = _.isArray(args) ? args : [args];
					args.unshift(innerToOuter.outer);

					_.each(innerToOuter.disableEvents || [], function(event_name)
					{
						self.cancelableDisable(event_name);
					});
					_.each(innerToOuter.enableEvents || [], function(event_name)
					{
						self.cancelableEnable(event_name);
					});
					return self._exposeAPIEvent.apply(self, args);
				});

			});
		}

	}, SCCancelableEvents);

	// @method on alias for @?method cancelableOn @extlayer @public
	base_component.on = base_component.cancelableOn;
	// @method off alias for @?method cancelableOff @extlayer @public
	base_component.off = base_component.cancelableOff;

	return base_component;
});

/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Cart
define('Cart.Component.DataValidator'
,	[],function ()
{
	'use strict';

	var new_line_schema = {
			required: true
		,	type: 'object'
		,	properties: {
				internalid: {
					type: 'string'
				}
			,	quantity: {
					required: true
				,	type: 'number'
				}
			,	item: {
					required: true
				,	type: 'object'
				,	properties: {
						internalid: {
							required: true
						,	type: 'number'
						}
					,	itemtype: {
							required: true
						,	type: 'string'
						}
					}
				}
			,	options: {
					type: 'array'
				,	items: {
						type: 'object'
					,	properties: {
							cartOptionId: {
								required: true
							,	type: 'string'
							}
						,	value: {
								required: true
							,	type: 'object'
							,	properties: {
									internalid: {
										required: true
									,	type: 'string'
									}
								}
							}
						}
					}
				}
			,	shipaddress: {
					type: 'string'
				}
			,	shipmethod: {
					type: 'string'
				}
			,	amount: {
					type: 'number'
				}
			,	note: {
					type: 'string'
				}
			}
		};
	
	var edit_line_schema = {
			required: true
		,	type: 'object'
		,	properties: {
				internalid: {
					required: true
				,	type: 'string'
				}
			,	quantity: {
					required: true
				,	type: 'number'
				}
			,	item: {
					required: true
				,	type: 'object'
				,	properties: {
						internalid: {
							required: true
						,	type: 'number'
						}
					}
				}
			,	options: {
					type: 'array'
				,	items: {
						type: 'object'
					,	properties: {
							cartOptionId: {
								required: true
							,	type: 'string'
							}
						,	value: {
								required: true
							,	type: 'object'
							,	properties: {
									internalid: {
										required: true
									,	type: 'string'
									}
								}
							}
						}
					}
				}
			,	shipaddress: {
					type: 'string'
				}
			,	shipmethod: {
					type: 'string'
				}
			,	amount: {
					type: 'number'
				}
			,	note: {
					type: 'string'
				}
			}
		};
	
	var paymentMethodSchema = {
			required: true
		,	type: 'object'
		,	properties: {
				internalid: {
					required: false
				,	type: 'string'
				}
			,	type: {
					required: true
				,	type: 'string'
				,	enum: [
						'creditcard'
					,	'invoice'
					,	'paypal'
					,	'giftcertificate'
					,	'external_checkout'
					]
				}
			,	creditcard: {
					required: false
				,	type: 'object'
				,	properties: {
						ccnumber: {
							required: true
						,	type: 'string'
						}
					,	ccname: {
							required: true
						,	type: 'string'
						}
					,	ccexpiredate: {
							required: true
						,	type: 'string'
						}
					,	expmonth: {
							required: true
						,	type: 'string'
						}
					,	expyear: {
							required: true
						,	type: 'string'
						}
					,	ccsecuritycode: {
							required: false
						,	type: 'string'
						}
					,	paymentmethod: {
							required: true
						,	type: 'object'
						,	properties: {
								internalid: {
									required: false
								,	type: 'string'
								}
							,	name: {
									required: true
								,	type: 'string'
								}
							,	creditcard: {
									required: true
								,	type: 'string'
								}
							,	ispaypal: {
									required: true
								,	type: 'string'
								}
							,	key: {
									required: true
								,	type: 'string'
								}
							}
						}
					}
				}
			,	key: {
					required: false
				,	type: 'string'
				}
			,	thankyouurl: {
					required: false
				,	type: 'string'
				}
			,	errorurl: {
					required: false
				,	type: 'string'
				}
			,	giftcertificate: {
					required: false
				,	type: 'object'
				,	properties: {
						code: {
							required: true
						,	type: 'string'
						}
					}
				}
			}
	};
	
	return {
		newLineSchema: new_line_schema
	,	editLineSchema: edit_line_schema
	,	paymentMethodSchema: paymentMethodSchema
	};

});
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Cart
define('ICart.Component'
,	[
		'SC.BaseComponent'
	,	'Cart.Component.DataValidator'
	,	'SC.Models.Init'
	,	'Utils'

	,	'Application'

	,	'underscore'
	]
,	function (
		SCBaseComponent
	,	CartComponentDataValidator
	,	ModelsInit
	,	Utils

	,	Application

	,	_
	)
{
	'use strict';

	//Did in this way to be compatible with SCIS
	var StoreItem;

	try {
		StoreItem = require('StoreItem.Model');
	}
	catch(e)
	{
	}

	// We removed the is-my-json-valid library but kept the code to be able to add another validation library without code changes
	var isMyJsonValid
	,	new_line_validator = isMyJsonValid && isMyJsonValid(CartComponentDataValidator.newLineSchema)
	,	edit_line_validator = isMyJsonValid && isMyJsonValid(CartComponentDataValidator.editLineSchema)
	,	payment_method_validator = isMyJsonValid && isMyJsonValid(CartComponentDataValidator.paymentMethodSchema);

	// @function format formats An entity data grouping both commons attributes (SCIS and SCA) and non-commons. The last goes into the 'extras' key
	// @private
	// @param {Object} entity Data object to format
	// @param {Array<String>} commonAttrs Array with a string of all the common attributes that are at the first level of the returned formatted object
	// @return {Object} A Formatted object structured with all the unique properties inside the extra object. Extras additional properties unique to SCIS or SCA
	var	format = function format(entity, commonAttrs)
	{
			var formatted = {extras: {}};

			_.keys(entity).forEach(function(attr)
			{
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
		}


		// @class ICart.Component An abstract base class for backend-end Cart component.
		// For example, concrete front-end Cart implementations like SCA and SCIS inherit from this class
		// @extends SC.BaseComponent
		// @public @extlayer
	,	icart_component = SCBaseComponent.extend({

			componentName: 'Cart'

			// @method _validateLine Validates the input agains the newLineSchema. Used by Cart.Component
			// not working because of removed is-my-json-valid so read the schema for documentation
			// @private
			// @param {Object} line to validate
			// @return {Error} validation error
		,	_validateLine: function _validateLine(line)
			{
				if (new_line_validator && !new_line_validator(line))
				{
					var errors = _.reduce(new_line_validator.errors, function(memo, error)
					{
						return memo + ' ' + error.field + ' ' + error.message;
					}, '');

					this._reportError('INVALID_PARAM', 'Invalid line: '+ errors);
				}
			}

			// @method _validateEditLine Validates the input agains the editLineSchema. Used by Cart.Component
			// not working because of removed is-my-json-valid so read the schema for documentation
			// @private
			// @param {Object} line to validate
			// @return {Error} validation error
		,	_validateEditLine: function _validateEditLine(line)
			{
				if (edit_line_validator && !edit_line_validator(line))
				{
					var errors = _.reduce(edit_line_validator.errors, function(memo, error)
					{
						return memo+' '+error.field+' '+error.message;
					}, '');
					this._reportError('INVALID_PARAM', 'Invalid line: '+errors);
				}
			}

			// @method _validatePaymentMethod Validates the input agains the paymentMethodSchema. Used by Cart.Component
			// not working because of removed is-my-json-valid so read the schema for documentation
			// @private
			// @param {Object} payment_method to validate
			// @return {Error} validation error
		,	_validatePaymentMethod: function _validatePaymentMethod(payment_method)
			{
				if(payment_method_validator && !payment_method_validator(payment_method))
				{
					var errors = _.reduce(payment_method_validator.errors, function(memo, error)
					{
						return memo+' '+error.field+' '+error.message;
					}, '');
					this._reportError('INVALID_PARAM', 'Invalid payment method: '+errors);
				}
			}

			// @method addLine Adds a new line into the cart
			// @public @extlayer
			// @param {Line} data
			// @return {Deferred<String>} Return a Deferred that is resolved into the added line id, String, in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	addLine: function addLine(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}
			// @method addLines Adds new lines into the cart
			// @public @extlayer
			// @param {Array<Line>} data
			// @return {Deferred<Array<String>>} Return a Deferred that is resolved into the added lines ids, String, in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	addLines: function addLines(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method getLines returns the lines of the cart
			// @return {Deferred<Array<Line>>} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
			// @public @extlayer
		,	getLines: function getLines()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method removeLine Removes a line from the cart
			// @public @extlayer
			// @param {String} internalid
			// @return {Deferred} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	removeLine: function removeLine(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method updateLine Updates a line into the cart
			// @public @extlayer
			// @param {Line} data
			// @return {Deferred} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	updateLine: function updateLine(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method getSummary Returns the summary of the cart
			// @public @extlayer
			// @return {Deferred<Summary>} Return a Deferred that is resolved with a @?class Summary instance in the case
			// the operation was done successfully or rejected with an error message.
		,	getSummary: function getSummary()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method submit Submits the order
			// @public @extlayer
			// @return {Deferred<ConfirmationSubmit>} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	submit: function submit()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method addPayment Adds a payment method. If none is passed the current method is removed
			// @public @extlayer
			// @param {PaymentMethod} data
			// @return {Deferred} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	addPayment: function addPayment(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}
		
			// @method getPaymentMethods returns the payment methods added to the order
			// @public @extlayer
			// @return {Deferred<Array<PaymentMethod>>} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	getPaymentMethods: function getPaymentMethods()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method addPromotion Adds a promotion.
			// @param {String} promocode
			// @public @extlayer
		,	addPromotion: function addPromotion(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method removePromotion Removes a promotion or all promotions if promocode is null
			// @param {String} promocode
			// @public @extlayer
		,	removePromotion: function removePromotion(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}
		
			// @method getPromotions returns the promotions' codes added to the cart
			// @public @extlayer
			// @return {Deferred<Array<Promotion>>} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	getPromotions: function getPromotions()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method estimateShipping Returns the estimated shipping costs.
			// @public @extlayer
			// @param {Address} data
			// @return {Deferred<Summary>} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	estimateShipping: function estimateShipping(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method clearEstimateShipping Removes the shipping method.
			// @public @extlayer
			// @return {Deferred<Summary>} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	clearEstimateShipping: function clearEstimateShipping()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}
		
			// @method getShipAddress Returns the ship address of the order
			// @public @extlayer
			// @return {Deferred<Address>} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	getShipAddress: function getShipAddress()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}
		
			// @method getBillAddress Returns the bill address of the order
			// @public @extlayer
			// @return {Deferred<Address>} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	getBillAddress: function getBillAddress()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}
		
			// @method setShipAddress Sets the ship address
			// @param {String} address_id
			// @public @extlayer
			// @return {Deferred} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	setShipAddress: function setShipAddress(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method setBillAddress Sets the bill address
			// @param {String} address_id
			// @public @extlayer
			// @return {Deferred} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	setBillAddress: function setBillAddress(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}
		
			// @method getShipMethods Returns the ship methods of the order
			// @public @extlayer
			// @return {Deferred<Array<ShipMethod>>} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	getShipMethods: function getShipMethods()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method getShipMethod Returns the ship method of the order
			// @public @extlayer
			// @return {Deferred<ShipMethod>} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	getShipMethod: function getShipMethod()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}
		
			// @method setShippingMethod Sets the ship method of the order
			// @public @extlayer
			// @return {Deferred} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	setShippingMethod: function setShippingMethod(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method voidLine Voids a line. Implemented only for SCIS
			// @public @extlayer
		,	voidLine: function voidLine()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method unvoidLine Un-voids a line. Implemented only for SCIS
			// @public @extlayer
		,	unvoidLine: function unvoidLine()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method updateCustomer Updates a customer data. Implemented only for SCIS
			// @public @extlayer
		,	updateCustomer: function updateCustomer()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// The methods below are explicitly declared in order to clarify the available API.
			// These are auto-generated by SC.BaseComponent so, don't need to do any implementation (does the same but synchronously)

			// @method addLineSync Synchronous version of @?method addLine
			// @public @extlayer
		,	addLineSync: function addLineSync(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method addLinesSync Synchronous version of @?method addLines
			// @public @extlayer
		,	addLinesSync: function addLinesSync(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method getLinesSync Synchronous version of @?method getLines
			// @public @extlayer
		,	getLinesSync: function getLinesSync(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method removeLineSync Synchronous version of @?method removeLine
			// @public @extlayer
		,	removeLineSync: function removeLineSync(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method updateLineSync Synchronous version of @?method  updateLine
			// @public @extlayer
		,	updateLineSync: function updateLineSync(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method getSummarySync Synchronous version of @?method getSummary
			// @public @extlayer
		,	getSummarySync: function getSummarySync()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method submitSync Synchronous version of @?method  submit
			// @public @extlayer
		,	submitSync: function submitSync()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method addPaymentSync Synchronous version of @?method addPayment
			// @public @extlayer
		,	addPaymentSync: function addPaymentSync(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}
		
			//@method getPaymentMethodsSync Synchronous version of @?method getPaymentMethods
			//@public @extlayer
		,	getPaymentMethodsSync: function getPaymentMethodsSync()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			//@method addPromotionSync Synchronous version of @?method addPromotion
			//@public @extlayer
		,	addPromotionSync: function addPromotionSync()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			//@method removePromotionSync Synchronous version of @?method removePromotion
			//@public @extlayer
		,	removePromotionSync: function removePromotionSync()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}
		
			//@method getPromotionsSync Synchronous version of @?method getPromotions
			//@public @extlayer
		,	getPromotionsSync: function getPromotionsSync()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method estimateShippingSync Synchronous version of @?method estimateShipping
			//@public @extlayer
		,	estimateShippingSync: function estimateShippingSync(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			//@method clearEstimateShippingSync Synchronous version of @?method clearEstimateShipping
			//@public @extlayer
		,	clearEstimateShippingSync: function clearEstimateShippingSync()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}
		
			//@method getShipAddressSync Synchronous version of @?method getShipAddress
			//@public @extlayer
		,	getShipAddressSync: function getShipAddressSync()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			//@method getBillAddressSync Synchronous version of @?method getBillAddress
			//@public @extlayer
		,	getBillAddressSync: function getBillAddressSync()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			//@method getShipMethodsSync Synchronous version of @?method getShipMethods
			//@public @extlayer
		,	getShipMethodsSync: function getShipMethodsSync()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			//@method getShipMethodSync Synchronous version of @?method getShipMethod
			//@public @extlayer
		,	getShipMethodSync: function getShipMethodSync()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			//@method voidLineSync Synchronous version of @?method voidLine
			//Implemented only for SCIS.
			//@public @extlayer
		,	voidLineSync: function voidLineSync()
			{
				//implemented only for SCIS
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method unvoidLineSync Synchronous version of @?method unvoidLine
			// Implemented only for SCIS. In other implementations throws an Error
			// @public @extlayer
		,	unvoidLineSync: function unvoidLineSync()
			{
				//implemented only for SCIS
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method updateCustomerSync Synchronous version of @?method  updateCustomer
			// Implemented only for SCIS. In other implementations throws an Error
			// @public @extlayer
		,	updateCustomerSync: function updateCustomerSync()
			{
				//implemented only for SCIS
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}
		

			//Normalization functions used by {@method _suscribeToInnerEvents} called by Cart.Component

		,	_normalizeAddressId: function _normalizeAddressId(data)
			{
				var address = data[0] || data[1];
				
				return {
					address_id: address.billaddress || address.shipaddress
				};
			}
		
		,	_normalizeShipMethodId: function _normalizeShipMethodId(data)
			{
				var shipmethod = data[0] || data[1];
				
				return {
					shipmethod_id: shipmethod.shipmethod
				};
			}
		
			//@method _normalizeSummary formats the summary grouping both commons attributes (SCIS and SCA) and non-commons.
			//The last into a extras named object
			//@private
			//@param {Summary} summary An object containing the summary
		,	_normalizeSummary: function _normalizeSummary(summary)
			{
				var commonSummaryAttrs = [
					'total'
				,	'taxtotal'
				,	'tax2total'
				,	'discounttotal'
				,	'subtotal'
				,	'shippingcost'
				,	'handlingcost'
				,	'giftcertapplied'
				,	'estimatedshipping'
				];
				return format(summary, commonSummaryAttrs);
			}

			// @method _normalizeLine formats the line grouping both commons attributes (SCIS and SCA) and non-commons.
			// The last into a extras named object.
			// @private
			// @param {Object} line
		,	_normalizeLine: function _normalizeLine(line)
			{
				line.item = StoreItem ? StoreItem.get(line.item.internalid, line.item.itemtype || line.item.type, 'details') : line.item;

				var commonLineAttrs = [
						'internalid'
					,	'item'
					,	'quantity'
					,	'amount'
					,	'rate'
					,	'tax_amount'
					,	'tax_code'
					,	'itemtype'
					,	'options'
					]
				,	commonItemAttrs = [
						'internalid'
					,	'itemid'
					,	'displayname'
					,	'isinactive'
					,	'itemtype'
					,	'minimumquantity'
					];

				var formatted_line = format(line, commonLineAttrs);
				formatted_line.item = format(line.item, commonItemAttrs);

				return formatted_line;
			}

			// @method _normalizeAddLineBefore formats the line that will receive as parameter the event handler of 'beforeAddLine'
			// @private
			// @param {Line} line
		,	_normalizeAddLineBefore: function _normalizeAddLineBefore(data)
			{
				return {
					line: this._normalizeLine(data[0])
				};
			}

			// @method _normalizeAddLineAfter formats the line that will receive as parameter the event handler of 'afterAddLine'
			// @private
			// @param {Line} line
		,	_normalizeAddLineAfter: function _normalizeAddLineAfter(data)
			{
				return {
					result: data[0]
				,	line: this._normalizeLine(data[1])
				};
			}

			// @method _normalizeRemoveLineBefore formats the line that will receive as parameter the event handler of 'beforeRemoveLine'
			// @private
		,	_normalizeRemoveLineBefore: function _normalizeRemoveLineBefore(data)
			{
				return {
					internalid: data[0]
				};
			}

			// @method _normalizeRemoveLineAfter formats the line that will receive as parameter the event handler of 'afterRemoveLine'
			// @private
		,	_normalizeRemoveLineAfter: function _normalizeRemoveLineAfter(data)
			{
				return {
					result: data[0]
				,	internalid: data[1]
				};
			}

			// @method _normalizeUpdateLineBefore formats the line that will receive as parameter the event handler of 'beforeUpdateLine'
			// @private
		,	_normalizeUpdateLineBefore: function _normalizeUpdateLineBefore(data)
			{
				return {
					line: this._normalizeLine(data[1])
				};
			}

			// @method _normalizeUpdateLineAfter formats the line that will receive as parameter the event handler of 'afterUpdateLine'
			// @private
		,	_normalizeUpdateLineAfter: function _normalizeUpdateLineAfter(data)
			{
				return {
					result: data[0]
				,	line: this._normalizeLine(data[2])
				};
			}

			// @method _normalizeSubmitBefore formats the line that will receive as parameter the event handler of 'beforeSubmit'
			// @private
		,	_normalizeSubmitBefore: function _normalizeSubmitBefore()
			{
				return {};
			}

			// @method _normalizeSubmitBefore formats the line that will receive as parameter the event handler of 'afterSubmit'
			// @private
		,	_normalizeSubmitAfter: function _normalizeSubmitAfter(data)
			{
				return {
					result: data[0]
				};
			}

		,	_normalizeEstimateBefore: function _normalizeEstimateBefore(data)
			{
				var address = data[0].address;

				return {
					address: address
				};
			}

		,	_normalizeEstimateAfter: function _normalizeEstimateAfter(data)
			{
				var address = data[0]
				,	summary = data[1];

				return {
					result: this._normalizeSummary(summary)
				,	address: address
				};
			}

		,	_normalizeRemoveEstimateBefore: function _normalizeRemoveEstimateBefore()
			{
				return {};
			}

		,	_normalizeRemoveEstimateAfter: function _normalizeRemoveEstimateAfter(data)
			{
				var summary = data[0];
				return {
					result: this._normalizeSummary(summary)
				};
			}

			// @method _normalizePaymentMethod formats the payment method
			// @private
		,	_normalizePaymentMethod: function _normalizePaymentMethod(data)
			{
				var payment_method = Utils.deepCopy(_.first(data.paymentmethods));

				if(_.isUndefined(payment_method))
				{
					return {};
				}

				var commonPaymentMethodAttrs = [
						'internalid'
					,	'type'
					,	'creditcard'
					,	'key'
					,	'thankyouurl'
					,	'errorurl'
					,	'giftcertificate'
					]
				,	commonCreditCardAttrs = [
						'ccnumber'
					,	'ccname'
					,	'ccexpiredate'
					,	'expmonth'
					,	'expyear'
					,	'ccsecuritycode'
					,	'paymentmethod'
					]
				,	commonCreditCardPaymentAttrs = [
						'internalid'
					,	'name'
					,	'creditcard'
					,	'ispaypal'
					,	'key'
					]
				,	commonGiftCertificateAttrs = [
						'internalid'
					,	'name'
					,	'creditcard'
					,	'ispaypal'
					,	'key'
					];

				var formatted_payment_method = format(payment_method, commonPaymentMethodAttrs);

				if(payment_method.creditcard)
				{
					formatted_payment_method.creditcard = format(payment_method.creditcard, commonCreditCardAttrs);

					if(payment_method.creditcard.paymentmethod)
					{
						formatted_payment_method.creditcard.paymentmethod = format(payment_method.creditcard.paymentmethod, commonCreditCardPaymentAttrs);
					}
				}

				if(payment_method.giftcertificate)
				{
					formatted_payment_method.giftcertificate = format(payment_method.giftcertificate, commonGiftCertificateAttrs);
				}

				return formatted_payment_method;
			}

			// @method _normalizePaymentMethodBefore formats the line that will receive as parameter the event handler of 'beforeAddPayment'
			// @private
		,	_normalizePaymentMethodBefore: function _normalizePaymentMethodBefore(data)
			{
				return {
					payment_method: this._normalizePaymentMethod(data[0])
				};
			}

			// @method _normalizePaymentMethodAfter formats the line that will receive as parameter the event handler of 'afterAddPayment'
			// @private
		,	_normalizePaymentMethodAfter: function _normalizePaymentMethodAfter(data)
			{
				return {
					payment_method: this._normalizePaymentMethod(data[1])
				};
			}

			// @method _normalizeAddPromotionBefore formats the Promocodes that will receive as parameter the event handler of beforeAddPromotion'
			// @private
		,	_normalizeAddPromotionBefore: function _normalizeAddPromotionBefore (data)
			{
				return {
					promocode: data[0]
				};
			}

		,	_normalizeAddPromotion: function _normalizeAddPromotion(inner_promotion)
			{
				var promotion = Utils.deepCopy(inner_promotion)
				,	commonPromotionAttrs = [
						'internalid'
					,	'type'
					,	'name'
					,	'rate'
					,	'code'
					,	'errormsg'
					,	'isvalid'
					];

				return format(promotion, commonPromotionAttrs);
			}
		
			// @method _normalizeAddPromotionAfter formats the Promocodes that will receive as parameter the event handler of afterAddPromotion'
			// @private
		,	_normalizeAddPromotionAfter: function _normalizeAddPromotionAfter (data)
			{
				return {
					promocode: data[1]
				};
			}

			// @method _normalizeRemovePromotionBefore formats the Promocodes that will receive as parameter the event handler of beforeRemovePromotion'
			// @private
		,	_normalizeRemovePromotionBefore: function _normalizeRemovePromotionBefore (promocode)
			{
				return {
					promocode: promocode
				};
			}

			// @method _normalizeRemovePromotionAfter formats the Promocodes that will receive as parameter the event handler of afterRemovePromotion'
			// @private
		,	_normalizeRemovePromotionAfter: function _normalizeRemovePromotionAfter (promocode)
			{
				return {
					promocode: promocode
				};
			}
		
		,	_normalizeAddress: function _normalizeAddress(inner_address)
			{
				var address = Utils.deepCopy(inner_address)
				,	commonAddressAttrs = [
						'internalid'
					,	'zip'
					,	'country'
					,	'addr1'
					,	'addr2'
					,	'addr3'
					,	'city'
					,	'company'
					,	'defaultbilling'
					,	'defaultshipping'
					,	'fullname'
					,	'isresidential'
					,	'isvalid'
					,	'state'
					];

				return format(address, commonAddressAttrs);
			}
		
		,	_normalizeShipMethods: function _normalizeShipMethods(inner_shipmethod)
			{
				var ship_method = Utils.deepCopy(inner_shipmethod)
				,	commonShipMethodAttrs = [
						'internalid'
					,	'name'
					,	'rate'
					,	'rate_formatted'
					,	'shipcarrier'
					];
				
				return format(ship_method, commonShipMethodAttrs);
			}
		
	});

	return icart_component;
});

//@class FormattedObject
//@property {Object} extras additional properties unique to SCIS or SCA

// extra class definitions:

// @class ShipMethod
// @property {String} internalid
// @property {String} name
// @property {Number} rate
// @property {String} rate_formatted
// @property {String} shipcarrier

// @class Address
// @property {String} internalid
// @property {String} zip
// @property {String} country
// @property {String} addr1
// @property {String} addr2
// @property {String} addr3
// @property {String} city
// @property {String} company
// @property {Boolean} defaultbilling
// @property {Boolean} defaultshipping
// @property {String} fullname
// @property {Boolean} isresidential
// @property {Boolean} isvalid
// @property {String} state

// @class PaymentMethod
// @property {String} internalid
// @property {String} type [creditcard, invoice, paypal, giftcertificate, external_checkout]
// @property {CreditCard} creditcard Required only if it is a creditcard
// @property {String} key
// @property {String} thankyouurl
// @property {String} errorurl
// @property {GiftCertificate} giftcertificate Required only if it is a giftcertificate

// @class CreditCard
// @property {String} ccnumber
// @property {String} ccname
// @property {String} ccexpiredate
// @property {String} expmonth
// @property {String} expyear
// @property {String} ccsecuritycode
// @property {InnerPaymentMethod} paymentmethod

// @class InnerPaymentMethod
// @property {String} internalid
// @property {String} name
// @property {Boolean} creditcard
// @property {Boolean} ispaypal
// @property {String} key

// @class GiftCertificate
// @property {String} code

// @class Line
// @property {String} internalid
// @property {Number} quantity
// @property {Number} amount
// @property {Number} rate
// @property {Number} tax_amount
// @property {String} tax_code
// @property {String} itemtype
// @property {Line.Extras} extras
// @property {Line.Item} item
// @property {Array<Line.Option>} options

// @class Line.Extras
// @property {String} shipaddress SCA specific
// @property {String} shipmethod SCA specific
// @property {Number} tax_rate SCA specific
// @property {String} rate_formatted SCA specific
// @property {Number} discount SCA specific
// @property {number} total SCA specific
// @property {String} amount_formatted SCA specific
// @property {String} tax_amount_formatted SCA specific
// @property {String} discount_formatted SCA specific
// @property {String} total_formatted SCA specific
// @property {String} description SCIS specific
// @property {String} giftcertfrom SCIS specific
// @property {String} giftcertmessage SCIS specific
// @property {Number} giftcertnumber SCIS specific
// @property {String} giftcertrecipientemail SCIS specific
// @property {String} giftcertrecipientname SCIS specific
// @property {String} taxrate1 SCIS specific
// @property {String} taxrate2 SCIS specific
// @property {String} grossamt SCIS specific
// @property {String} tax1amt SCIS specific
// @property {String} custreferralcode SCIS specific
// @property {Boolean} excludefromraterequest SCIS specific
// @property {String} custcol_ns_pos_voidqty SCIS specific
// @property {Number} voidPercentage SCIS specific
// @property {Number} returnedQuantity SCIS specific
// @property {Boolean} isUnvalidatedReturn SCIS specific
// @property {Boolean} order SCIS specific
// @property {String} note SCIS specific

// @class Line.Option
// @property {String} cartOptionId
// @property {{internalid:String}} value

// @class Line.Item
// @property {Number} internalid
// @property {String} itemid
// @property {String} displayname
// @property {Boolean} isinactive
// @property {String} itemtype
// @property {Number} minimumquantity
// @property {Line.Item.Extras} extras

// @class Line.Item.Extras
// @property {Boolean} isinstock SCA specific
// @property {Boolean} isonline SCA specific
// @property {Object} matrixchilditems_detail SCA specific
// @property {Boolean} ispurchasable SCA specific
// @property {String} stockdescription SCA specific
// @property {Boolean} isfulfillable SCA specific
// @property {Boolean} isbackorderable SCA specific
// @property {Boolean} showoutofstockmessage SCA specific
// @property {String} outofstockmessage SCA specific
// @property {String} storedisplayname2 SCA specific
// @property {Number} pricelevel1 SCA specific
// @property {String} pricelevel1_formatted SCA specific
// @property {String} urlcomponent SCA specific
// @property {Object} itemimages_detail SCA specific
// @property {Object} onlinecustomerprice_detail SCA specific
// @property {Object} itemoptions_detail SCA specific
// @property {String} type SCIS specific
// @property {String} baseprice SCIS specific
// @property {String} matrix_parent SCIS specific
// @property {String} upccode SCIS specific
// @property {String} additional_upcs SCIS specific
// @property {Boolean} isdonationitem SCIS specific
// @property {Boolean} custitem_ns_pos_physical_item SCIS specific

// @class Summary
// @property {Number} total
// @property {Number} taxtotal
// @property {Number} tax2total
// @property {Number} discounttotal
// @property {Number} subtotal
// @property {Number} shippingcost
// @property {Number} handlingcost
// @property {Number} giftcertapplied

// @property {String} discounttotal_formatted SCA specific
// @property {String} taxonshipping_formatted SCA specific
// @property {String} taxondiscount_formatted SCA specific
// @property {Number} itemcount SCA specific
// @property {String} taxonhandling_formatted SCA specific
// @property {Number} discountedsubtotal SCA specific
// @property {String} discountedsubtotal_formatted SCA specific
// @property {Number} taxondiscount SCA specific
// @property {String} handlingcost_formatted SCA specific
// @property {Number} taxonshipping SCA specific
// @property {String} taxtotal_formatted SCA specific
// @property {String} totalcombinedtaxes_formatted SCA specific
// @property {Number} totalcombinedtaxes SCA specific
// @property {String} giftcertapplied_formatted SCA specific
// @property {String} shippingcost_formatted SCA specific
// @property {Number} discountrate SCA specific
// @property {Number} taxonhandling SCA specific
// @property {String} tax2total_formatted SCA specific
// @property {String} discountrate_formatted SCA specific
// @property {Number} estimatedshipping SCA specific
// @property {String} estimatedshipping_formatted SCA specific
// @property {String} total_formatted SCA specific
// @property {String} subtotal_formatted SCA specific

// @property {String} shippingtax1rate SCIS specific
// @property {Boolean} shippingcostoverridden SCIS specific
// @property {Number} amountdue SCIS specific
// @property {String} tranid SCIS specific
// @property {Date} createddate SCIS specific
// @property {String} couponcode SCIS specific
// @property {Date} createdfrom SCIS specific
// @property {Number} changedue SCIS specific

// @class ConfirmationSubmit in SCA the object returned by getShoppingSession().getOrder().submit()
//@class FormattedObject
//@property {Object} extras additional properties unique to SCIS or SCA
;
/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Cart
define('Cart.Component'
,	[
		'ICart.Component'
	,	'LiveOrder.Model'
	,	'SC.Models.Init'

	,	'Application'

	,	'Utils'
	,	'jQuery.Deferred'
	,	'underscore'
	]
,	function (
		ICartComponent
	,	LiveOrderModel
	,	ModelsInit

	,	Application

	,	Utils
	,	jQuery
	,	_
	)
{
	'use strict';

	// @class Cart.Component This is the concrete backend-end Cart implementation of SuiteCommerce Advanced / SuiteCommerce Standard.
	// See @?class ICart.Component
	// @extend ICart.Component
	var cart_component = ICartComponent.extend({

		addLine: function addLine(data)
		{
			var deferred = jQuery.Deferred();
			try
			{
				this._validateLine(data.line);
				deferred.resolve(LiveOrderModel.addLine(data.line));
			}
			catch(e)
			{
				deferred.reject(e);
			}

			return deferred;
		}

	,	addLines: function addLines(data)
		{
			var deferred = jQuery.Deferred();
			try
			{
				var self = this;
				_.map(data.lines, function(line){
					self._validateLine(line);
				});
				var lines = _.map(LiveOrderModel.addLines(data.lines), function(added_line){
					return added_line.orderitemid;
				});
				deferred.resolve(lines);
			}
			catch(e)
			{
				deferred.reject(e);
			}

			return deferred;
		}

	,	getLines: function getLines()
		{
			var deferred = jQuery.Deferred();
			try
			{
				var self = this;
				var lines = _.map(LiveOrderModel.getLinesOnly(), function(line){
					return self._normalizeLine(line);
				});
				deferred.resolve(lines);
			}
			catch(e)
			{
				deferred.reject(e);
			}
			return deferred;
		}

	,	removeLine: function removeLine(data)
		{
			var deferred = jQuery.Deferred();
			try
			{
				if(!data.internalid || !_.isString(data.internalid))
				{
					this._reportError('INVALID_PARAM', 'Invalid id: Must be a defined string');
				}
				deferred.resolve(LiveOrderModel.removeLine(data.internalid));
			}
			catch(e)
			{
				deferred.reject(e);
			}
			return deferred;
		}

	,	updateLine: function updateLine(data)
		{
			var deferred = jQuery.Deferred();
			try
			{
				this._validateEditLine(data.line);
				deferred.resolve(LiveOrderModel.updateLine(data.line.internalid, data.line));
			}
			catch(e)
			{
				deferred.reject(e);
			}
			return deferred;
		}

	,	getSummary: function getSummary()
		{
			var deferred = jQuery.Deferred();
			try
			{
				var summary = LiveOrderModel.getSummary();
				deferred.resolve(this._normalizeSummary(summary));
			}
			catch(e)
			{
				deferred.reject(e);
			}
			return deferred;
		}

	,	submit: function submit()
		{
			var deferred = jQuery.Deferred();
			try
			{
				if(!Utils.isCheckoutDomain())
				{
					this._reportError('UNSECURE_SESSION', 'Unsecure session: Must be under a secure domain or logged in');
				}
				
				deferred.resolve(LiveOrderModel.submit());
			}
			catch(e)
			{
				deferred.reject(e);
			}
			return deferred;
		}

	,	addPayment: function addPayment(data)
		{
			var deferred = jQuery.Deferred();
			try
			{
				if(!Utils.isCheckoutDomain() || !ModelsInit.session.isLoggedIn2())
				{
					this._reportError('UNSECURE_SESSION', 'Unsecure session: Must be under a secure domain or logged in');
				}

				this._validatePaymentMethod(data.payment_method);

				var payment_methods = {paymentmethods: [data.payment_method]};

				LiveOrderModel.setPaymentMethods(payment_methods);

				deferred.resolve();
			}
			catch(e)
			{
				deferred.reject(e);
			}
			return deferred;
		}
		
	,	getPaymentMethods: function getPaymentMethods()
		{
			var deferred = jQuery.Deferred();
			try
			{
				var self = this
				,	payment_methods = LiveOrderModel.getPaymentMethodsOnly();
				
				deferred.resolve(_.map(payment_methods, function(payment_method){
					return self._normalizePaymentMethod({paymentmethods: [payment_method]});
				}));
			}
			catch(e)
			{
				deferred.reject(e);
			}
			return deferred;
		}
		
	,	estimateShipping: function estimateShipping(data)
		{
			var deferred = jQuery.Deferred();
			try
			{
				if (!data || !_.isObject(data.address))
				{
					this._reportError('INVALID_PARAM', 'Invalid parameter. It must be a valid object and must contain an address object');
				}

				var address = data.address
				,	address_internalid = address.zip + '-' + address.country + '-null';

				data.addresses = [{
					internalid: address_internalid
				,	zip: address.zip
				,	country: address.country
				}];

				data.shipaddress = address_internalid;

				LiveOrderModel.estimateShippingCost(data);

				var result = this._normalizeSummary(LiveOrderModel.getSummary());
				deferred.resolve(result);
			}
			catch(e)
			{
				deferred.reject(e);
			}
			return deferred;
		}

	,	clearEstimateShipping: function clearEstimateShipping()
		{
			var deferred = jQuery.Deferred();
			try
			{
				LiveOrderModel.removeEstimateShippingCost();

				var result = this._normalizeSummary(LiveOrderModel.getSummary());
				deferred.resolve(result);
			}
			catch(e)
			{
				deferred.reject(e);
			}
			return deferred;
		}
		
	,	getShipAddress: function getShipAddress()
		{
			var deferred = jQuery.Deferred();
			try
			{
				var addresses = {}
				,	shipaddress
				,	field_values = LiveOrderModel.getFieldValues({
						keys: ['shipaddress']
					,	items: []
					});

				LiveOrderModel.addAddress(field_values.shipaddress, addresses);
				
				shipaddress = _.first(_.values(addresses));
				deferred.resolve(this._normalizeAddress(shipaddress));
			}
			catch(e)
			{
				deferred.reject(e);
			}
			return deferred;
		}
		
	,	getBillAddress: function getBillAddress()
		{
			var deferred = jQuery.Deferred();
			try
			{
				var addresses = {}
				,	billaddress
				,	field_values = LiveOrderModel.getFieldValues({
						keys: ['billaddress']
					,	items: []
					});

				LiveOrderModel.addAddress(field_values.billaddress, addresses);
				
				billaddress = _.first(_.values(addresses));
				deferred.resolve(this._normalizeAddress(billaddress));
			}
			catch(e)
			{
				deferred.reject(e);
			}
			return deferred;
		}
		
	,	setShipAddress: function setShipAddress(data)
		{
			var deferred = jQuery.Deferred();

			try
			{
				if(!Utils.isCheckoutDomain() || !ModelsInit.session.isLoggedIn2())
				{
					this._reportError('UNSECURE_SESSION', 'Unsecure session: Must be under either a secure domain or logged in');
				}
				
				if (!_.isObject(data) || (data.address_id && !_.isString(data.address_id)))
				{
					this._reportError('INVALID_PARAM', 'Invalid parameter. It must be a valid object and must contain either a valid address_id string or null');
				}
				
				LiveOrderModel.setShippingAddressOnly({shipaddress: data.address_id});
				
				deferred.resolve();
			}
			catch (e)
			{
				deferred.reject(e);
			}

			return deferred;
		}

	,	setBillAddress: function setBillAddress(data)
		{
			var deferred = jQuery.Deferred();

			try
			{
				if(!Utils.isCheckoutDomain() || !ModelsInit.session.isLoggedIn2())
				{
					this._reportError('UNSECURE_SESSION', 'Unsecure session: Must be under either a secure domain or logged in');
				}
				
				if (!_.isObject(data) || (data.address_id && !_.isString(data.address_id)))
				{
					this._reportError('INVALID_PARAM', 'Invalid parameter. It must be a valid object and must contain either a valid address_id string or null');
				}
				
				LiveOrderModel.setBillingAddressOnly({billaddress: data.address_id});
				
				deferred.resolve();
			}
			catch (e)
			{
				deferred.reject(e);
			}

			return deferred;
		}
		
	,	getShipMethods: function getShipMethods()
		{
			var deferred = jQuery.Deferred();
			try
			{
				var ship_methods = LiveOrderModel.getShipMethodsOnly();
				deferred.resolve(_.map(ship_methods, this._normalizeShipMethods));
			}
			catch(e)
			{
				deferred.reject(e);
			}
			return deferred;
		}
		
	,	getShipMethod: function getShipMethod()
		{
			var deferred = jQuery.Deferred();
			try
			{
				var field_values = LiveOrderModel.getFieldValues({
						keys: ['shipmethod']
					,	items: []
					})
				,	shipmethod_id = field_values.shipmethod ? field_values.shipmethod.shipmethod : null;
				
				this.getShipMethods().then(
					function(shipmethods)
					{
						var shipmethod = _.find(shipmethods, {internalid: shipmethod_id});
						deferred.resolve(shipmethod);
					}
				,	deferred.reject
				);
			}
			catch(e)
			{
				deferred.reject(e);
			}
			return deferred;
		}
		
	,	setShippingMethod: function setShippingMethod(data)
		{
			var deferred = jQuery.Deferred();

			try
			{
				if(!Utils.isCheckoutDomain() || !ModelsInit.session.isLoggedIn2())
				{
					this._reportError('UNSECURE_SESSION', 'Unsecure session: Must be under either a secure domain or logged in');
				}
				
				if (!_.isObject(data) || (data.shipmethod_id && !_.isString(data.shipmethod_id)))
				{
					this._reportError('INVALID_PARAM', 'Invalid parameter. It must be a valid object and must contain either a valid shipmethod_id string or null');
				}
				
				LiveOrderModel.setShippingMethodOnly({shipmethod: data.shipmethod_id});
				
				deferred.resolve();
			}
			catch (e)
			{
				deferred.reject(e);
			}

			return deferred;
		}

	,	addPromotion: function addPromotion(data)
		{
			var deferred = jQuery.Deferred();

			try
			{
				if (!_.isObject(data) || !_.isString(data.promocode))
				{
					this._reportError('INVALID_PARAM', 'Invalid parameter. It must be a valid object and must contain a promocode object');
				}
				
				deferred.resolve(LiveOrderModel.addPromotion(data.promocode));
			}
			catch (e)
			{
				deferred.reject(e);
			}

			return deferred;
		}

	,	removePromotion: function removePromotion(data)
		{
			var deferred = jQuery.Deferred();

			try
			{
				if (!_.isUndefined(data) && (!_.isObject(data) || !_.isString(data.promocode)))
				{
					this._reportError('INVALID_PARAM', 'Invalid parameter "promocode". It must be a valid string');
				}
				
				var promocode = data ? [{code: data.promocode}] : null;
				
				deferred.resolve(LiveOrderModel.removeAllPromocodes(promocode));
			}
			catch (e)
			{
				deferred.reject(e);
			}

			return deferred;
		}
		
	,	getPromotions: function getPromotions()
		{
			var deferred = jQuery.Deferred();
			try
			{
				var promocodes = LiveOrderModel.getPromoCodesOnly();
				deferred.resolve(_.map(promocodes, this._normalizeAddPromotion));
			}
			catch(e)
			{
				deferred.reject(e);
			}
			return deferred;
		}

	});

	cart_component._generateSyncMethods();

	//Maps inner events to the outer events to be triggered and a normalize function to be used in order to transform the inenr arguments to the outers
	var innerToOuterMap = [
		// @class ICart.Component
		// @event beforeAddLine Cancelable event triggered before a new line is added to the cart. @public @extlayer
		{inner: 'before:LiveOrder.addLine', outer: 'beforeAddLine', normalize: cart_component._normalizeAddLineBefore}
		// @event afterAddLine Triggered after a line is added to the cart. @public @extlayer
	,	{inner: 'after:LiveOrder.addLine', outer: 'afterAddLine', normalize: cart_component._normalizeAddLineAfter}
		// @event beforeRemoveLine Cancelable event triggered before a line is removed from the cart. @public @extlayer
	,	{inner: 'before:LiveOrder.removeLine', outer: 'beforeRemoveLine', normalize: cart_component._normalizeRemoveLineBefore}
		// @event afterRemoveLine Triggered after a line is removed from the cart. @public @extlayer
	,	{inner: 'after:LiveOrder.removeLine', outer: 'afterRemoveLine', normalize: cart_component._normalizeRemoveLineAfter}
		// @event beforeSubmit Cancelable event triggered before the cart's order is submitted. @public @extlayer
	,	{inner: 'before:LiveOrder.submit', outer: 'beforeSubmit', normalize: cart_component._normalizeSubmitBefore}
		// @event afterSubmit Triggered after the cart's order is submitted. @public @extlayer
	,	{inner: 'after:LiveOrder.submit', outer: 'afterSubmit', normalize: cart_component._normalizeSubmitAfter}
		// @event beforeUpdateLine Cancelable event triggered before one line is updated. @public @extlayer
	,	{inner: 'before:LiveOrder.updateLine', outer: 'beforeUpdateLine', normalize: cart_component._normalizeUpdateLineBefore, disableEvents: ['beforeAddLine', 'afterAddLine', 'beforeRemoveLine', 'afterRemoveLine']}
		// @event afterUpdateLine Triggered after a line is updated in the cart. @public @extlayer
	,	{inner: 'after:LiveOrder.updateLine', outer: 'afterUpdateLine', normalize: cart_component._normalizeUpdateLineAfter, enableEvents: ['beforeAddLine', 'afterAddLine', 'beforeRemoveLine', 'afterRemoveLine']}
		// @event beforeEstimateShipping Cancelable event triggered before a shipping estimation in the cart @public @extlayer
	,	{inner: 'before:LiveOrder.estimateShippingCost', outer: 'beforeEstimateShipping', normalize: cart_component._normalizeEstimateBefore}
		// @event beforeClearEstimateShipping Cancelable event triggered before removing a shipping method from the cart's order. @public @extlayer
	,	{inner: 'before:LiveOrder.removeEstimateShippingCost', outer: 'beforeClearEstimateShipping', normalize: cart_component._normalizeRemoveEstimateBefore}

		// @event beforeAddPayment Cancelable event triggered before one line is updated. @public @extlayer
	,	{inner: 'before:LiveOrder.setPaymentMethods', outer: 'beforeAddPayment', normalize: cart_component._normalizePaymentMethodBefore}
		// @event afterAddPayment Triggered after a line is updated in the cart. @public @extlayer
	,	{inner: 'after:LiveOrder.setPaymentMethods', outer: 'afterAddPayment', normalize: cart_component._normalizePaymentMethodAfter}
		// @event beforeAddPromotion Cancelable event triggered before a Promocode is added from the cart's order. @public @extlayer
	,	{inner: 'before:LiveOrder.addPromotion', outer: 'beforeAddPromotion', normalize: cart_component._normalizeAddPromotionBefore}
		// @event afterAddPromotion Triggered after a Promocode is added from the cart's order. @public @extlayer
	,	{inner: 'after:LiveOrder.addPromotion', outer: 'afterAddPromotion', normalize: cart_component._normalizeAddPromotionAfter}
		// @event beforeSetBillingAddress Cancelable event triggered before a billing address is setted to the cart's order. @public @extlayer
	,	{inner: 'before:LiveOrder.setBillingAddress', outer: 'beforeSetBillAddress', normalize: cart_component._normalizeAddressId}
		// @event afterSetBillingAddress Triggered after a billing address is setted to the cart's order. @public @extlayer
	,	{inner: 'after:LiveOrder.setBillingAddress', outer: 'afterSetBillAddress', normalize: cart_component._normalizeAddressId}
		// @event beforeSetShippingAddress Cancelable event triggered before a shipping address is setted to the cart's order. @public @extlayer
	,	{inner: 'before:LiveOrder.setShippingAddress', outer: 'beforeSetShipAddress', normalize: cart_component._normalizeAddressId}
		// @event afterSetShippingAddress Triggered after a shipping address is setted to the cart's order. @public @extlayer
	,	{inner: 'after:LiveOrder.setShippingAddress', outer: 'afterSetShipAddress', normalize: cart_component._normalizeAddressId}
		// @event beforeSetShippingMethod Cancelable event triggered before a shipping method is setted to the cart's order. @public @extlayer
	,	{inner: 'before:LiveOrder.setShippingMethod', outer: 'beforeSetShippingMethod', normalize: cart_component._normalizeShipMethodId}
		// @event afterSetShippingMethod Triggered after a shipping method is setted to the cart's order. @public @extlayer
	,	{inner: 'after:LiveOrder.setShippingMethod', outer: 'afterSetShippingMethod', normalize: cart_component._normalizeShipMethodId}


	/*
	,	{inner: 'before:LiveOrder.delete', outer: 'beforeDelete', normalize: null}
	,	{inner: 'after:LiveOrder.delete', outer: 'afterDelete', normalize: null}
	,	{inner: 'before:LiveOrder.suspend', outer: 'beforeSuspend', normalize: null}
	,	{inner: 'after:LiveOrder.suspend', outer: 'afterSuspend', normalize: null}
	*/
	];
	cart_component._suscribeToInnerEvents(innerToOuterMap);

	Application.on('before:LiveOrder.removeAllPromocodes', function (model, inner_promocodes)
	{
		var promocodes = Utils.deepCopy(inner_promocodes);

		var	promocodes_deferred = _.map(promocodes, function(promocode){
			var args = cart_component._normalizeRemovePromotionBefore(promocode);
			
			// @event beforeRemovePromotion Cancelable event triggered before a Promocode is removed from the cart's order. @public @extlayer
			return cart_component.cancelableTrigger('beforeRemovePromotion', args);
		})
		, result = jQuery.Deferred();

		jQuery.when.apply(jQuery, promocodes_deferred)
		.fail(cart_component._asyncErrorHandle(result))
		.done(result.resolve);
		
		return result;
	});

	Application.on('after:LiveOrder.removeAllPromocodes', function (model, result, inner_promocodes)
	{
		//In this case result is undefined
		var promocodes = Utils.deepCopy(inner_promocodes);

		var	promocodes_deferred = _.map(promocodes, function(promocode){
			var args = cart_component._normalizeRemovePromotionAfter(promocode);
			
			// @event afterRemovePromotion Triggered after a Promocode is removed from the cart's order. @public @extlayer
			return cart_component.cancelableTrigger('afterRemovePromotion', args);
		})
		, promise = jQuery.Deferred();

		jQuery.when.apply(jQuery, promocodes_deferred)
		.fail(cart_component._asyncErrorHandle(promise))
		.done(promise.resolve);
		
		return promise;
	});


	Application.on('after:LiveOrder.estimateShippingCost', function (model, result, data)
	{
		//In this case result is undefined

		var summary = Utils.deepCopy(model.getSummary());
		var address = Utils.deepCopy(data.address);

		var args = cart_component._normalizeEstimateAfter([address, summary]);
		// @event afterEstimateShipping Triggered after an estimate shipping is done in the cart. @public @extlayer
		return cart_component.cancelableTrigger('afterEstimateShipping', args);
	});

	Application.on('after:LiveOrder.removeEstimateShippingCost', function (model)
	{
		var summary = Utils.deepCopy(model.getSummary());

		var args = cart_component._normalizeRemoveEstimateAfter([summary]);
		// @event afterClearEstimateShipping Triggered after a shipping is removed from the cart. @public @extlayer
		return cart_component.cancelableTrigger('afterClearEstimateShipping', args);
	});


	Application.on('before:LiveOrder.addLines', function (model, lines)
	{
		var lines_copy = Utils.deepCopy(lines);

		var	lines_deferred = _.map(lines_copy, function(line){
			var args = cart_component._normalizeAddLineBefore([line]);
			return cart_component.cancelableTrigger('beforeAddLine', args);
		})
		, result = jQuery.Deferred();

		jQuery.when.apply(jQuery, lines_deferred)
			.fail(cart_component._asyncErrorHandle(result))
			.done(result.resolve);

		return result;
	});

	Application.on('after:LiveOrder.addLines', function (model, lines_ids, lines)
	{
		var lines_copy = Utils.deepCopy(lines);
		var lines_ids_copy = Utils.deepCopy(lines_ids);

		var	lines_deferred = _.map(lines_copy, function(line){

			try
			{
				var line_id = _.find(lines_ids_copy, function(line_id){
					return line_id.internalid === line.item.internalid.toString();
				}).orderitemid;

				var args = cart_component._normalizeAddLineAfter([line_id, line]);
				return cart_component.cancelableTrigger('afterAddLine', args);
			}
			catch(e)
			{
				return jQuery.Deferred().reject(e);
			}
		})
		, result = jQuery.Deferred();

		jQuery.when.apply(jQuery, lines_deferred)
			.fail(cart_component._asyncErrorHandle(result))
			.done(result.resolve);

		return result;
	});

	// @class Cart.Component
	Application.registerComponent(cart_component);
});

define('SCA', ['Application', 'Account.ForgotPassword.ServiceController', 'Account.Login.ServiceController', 'Account.Register.ServiceController', 'Account.RegisterAsGuest.ServiceController', 'Account.ResetPassword.ServiceController', 'Address.ServiceController', 'Case.Fields.ServiceController', 'Case.ServiceController', 'Categories.ServiceController', 'DateEffectiveCategory.ServiceController', 'CheckoutEnvironment.ServiceController', 'ShoppingUserEnvironment.ServiceController', 'MyAccountEnvironment.ServiceController', 'CreditCard.ServiceController', 'CreditMemo.ServiceController', 'CustomerPayment.ServiceController', 'Deposit.ServiceController', 'DepositApplication.ServiceController', 'GoogleTagManager.ServiceController', 'LiveOrder.GiftCertificate.ServiceController', 'LiveOrder.Line.ServiceController', 'LiveOrder.ServiceController', 'LivePayment.ServiceController', 'Newsletter.ServiceController', 'ReorderItems.ServiceController', 'OrderHistory.ServiceController', 'PaymentMethod.ServiceController', 'PrintStatement.ServiceController', 'ProductList.ServiceController', 'ProductList.Item.ServiceController', 'ProductReviews.ServiceController', 'Profile.ServiceController', 'SiteSettings.ServiceController', 'Quote.ServiceController', 'Receipt.ServiceController', 'ReturnAuthorization.ServiceController', 'TransactionHistory.ServiceController', 'ReleaseMetadata', 'QuoteToSalesOrderValidator.Model', 'QuoteToSalesOrder.ServiceController', 'CMSadapter.Model', 'Invoice.ServiceController', 'Transaction.ServiceController', 'Location.ServiceController', 'StoreLocator.ServiceController', 'Location.ServiceController', 'ExternalPayment.Model', 'SC.BaseComponent', 'Cart.Component'], function (){});

BuildTimeInf={isSCLite: undefined, product: "SCA"}
ConfigurationManifestDefaults = {
	"addresses": {
		"isPhoneMandatory": true
	},
	"layout": {
		"colorPalette": [
			{
				"paletteId": "default",
				"colorName": "black",
				"colorValue": "#212121"
			},
			{
				"paletteId": "default",
				"colorName": "gray",
				"colorValue": "#9c9c9c"
			},
			{
				"paletteId": "default",
				"colorName": "grey",
				"colorValue": "#9c9c9c"
			},
			{
				"paletteId": "default",
				"colorName": "white",
				"colorValue": "#fff"
			},
			{
				"paletteId": "default",
				"colorName": "brown",
				"colorValue": "#804d3b"
			},
			{
				"paletteId": "default",
				"colorName": "beige",
				"colorValue": "#eedcbe"
			},
			{
				"paletteId": "default",
				"colorName": "blue",
				"colorValue": "#0f5da3"
			},
			{
				"paletteId": "default",
				"colorName": "light-blue",
				"colorValue": "#8fdeec"
			},
			{
				"paletteId": "default",
				"colorName": "purple",
				"colorValue": "#9b4a97"
			},
			{
				"paletteId": "default",
				"colorName": "lilac",
				"colorValue": "#ceadd0"
			},
			{
				"paletteId": "default",
				"colorName": "red",
				"colorValue": "#f63440"
			},
			{
				"paletteId": "default",
				"colorName": "pink",
				"colorValue": "#ffa5c1"
			},
			{
				"paletteId": "default",
				"colorName": "orange",
				"colorValue": "#ff5200"
			},
			{
				"paletteId": "default",
				"colorName": "peach",
				"colorValue": "#ffcc8c"
			},
			{
				"paletteId": "default",
				"colorName": "yellow",
				"colorValue": "#ffde00"
			},
			{
				"paletteId": "default",
				"colorName": "light-yellow",
				"colorValue": "#ffee7a"
			},
			{
				"paletteId": "default",
				"colorName": "green",
				"colorValue": "#00af43"
			},
			{
				"paletteId": "default",
				"colorName": "lime",
				"colorValue": "#c3d600"
			},
			{
				"paletteId": "default",
				"colorName": "teal",
				"colorValue": "#00ab95"
			},
			{
				"paletteId": "default",
				"colorName": "aqua",
				"colorValue": "#28e1c5"
			},
			{
				"paletteId": "default",
				"colorName": "burgandy",
				"colorValue": "#9c0633"
			},
			{
				"paletteId": "default",
				"colorName": "navy",
				"colorValue": "#002d5d"
			}
		],
		"lightColors": [
			"white"
		]
	},
	"imageNotAvailable": "img/no_image_available.jpeg",
	"imageSizeMapping": [
		{
			"id": "thumbnail",
			"value": "thumbnail"
		},
		{
			"id": "main",
			"value": "main"
		},
		{
			"id": "tinythumb",
			"value": "tinythumb"
		},
		{
			"id": "zoom",
			"value": "zoom"
		},
		{
			"id": "fullscreen",
			"value": "fullscreen"
		},
		{
			"id": "homeslider",
			"value": "homeslider"
		},
		{
			"id": "homecell",
			"value": "homecell"
		}
	],
	"bronto": {
		"accountId": "",
		"adapterUrl": "https://cdn.bronto.com/netsuite/configure.js"
	},
	"addToCartBehavior": "showCartConfirmationModal",
	"addToCartFromFacetsView": false,
	"promocodes": {
		"allowMultiples": false
	},
	"matrixchilditems": {
		"enabled": false,
		"fieldset": "matrixchilditems_search"
	},
	"showTaxDetailsPerLine": false,
	"summaryTaxLabel": "Tax",
	"cases": {
		"defaultValues": {
			"statusStart": {
				"id": "1"
			},
			"statusClose": {
				"id": "5"
			},
			"origin": {
				"id": "-5"
			}
		}
	},
	"categories": {
		"menuLevel": 3,
		"addToNavigationTabs": true,
		"sideMenu": {
			"sortBy": "sequencenumber",
			"additionalFields": [],
			"uncollapsible": false,
			"showMax": 5,
			"collapsed": false
		},
		"subCategories": {
			"sortBy": "sequencenumber",
			"fields": []
		},
		"category": {
			"fields": []
		},
		"breadcrumb": {
			"fields": []
		},
		"menu": {
			"sortBy": "sequencenumber",
			"fields": []
		}
	},
	"checkoutApp": {
		"skipLogin": false,
		"checkoutSteps": "Standard",
		"paypalLogo": "https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg",
		"invoiceTermsAndConditions": "<h4>Invoice Terms and Conditions</h4><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"
	},
	"isMultiShippingEnabled": false,
	"removePaypalAddress": true,
	"useStandardHeaderFooter": false,
	"isThreeDSecureEnabled": false,
	"autoPopulateNameAndEmail": true,
	"forms": {
		"loginAsGuest": {
			"showName": false,
			"showEmail": true
		},
		"address": {
			"showAddressLineTwo": true
		}
	},
	"cms": {
		"useCMS": true,
		"escToLoginDisabled": false,
		"baseUrl": "",
		"adapterVersion": "3",
		"contentWait": 200
	},
	"defaultSearchUrl": "search",
	"searchApiMasterOptions": [
		{
			"id": "Facets",
			"fieldset": "search",
			"include": "facets"
		},
		{
			"id": "itemDetails",
			"fieldset": "details",
			"include": "facets"
		},
		{
			"id": "relatedItems",
			"fieldset": "relateditems_details"
		},
		{
			"id": "correlatedItems",
			"fieldset": "correlateditems_details"
		},
		{
			"id": "merchandisingZone"
		},
		{
			"id": "typeAhead",
			"fieldset": "typeahead"
		},
		{
			"id": "itemsSearcher",
			"fieldset": "itemssearcher"
		},
		{
			"id": "CmsAdapterSearch",
			"fieldset": "search"
		}
	],
	"defaultPaginationSettings": {
		"showPageList": true,
		"pagesToShow": 9,
		"showPageIndicator": false
	},
	"defaultPaginationSettingsPhone": {
		"showPageList": false,
		"pagesToShow": 9,
		"showPageIndicator": true
	},
	"defaultPaginationSettingsTablet": {
		"showPageList": true,
		"pagesToShow": 4,
		"showPageIndicator": true
	},
	"paymentmethods": [
		{
			"key": "5,5,1555641112",
			"regex": "^4[0-9]{12}(?:[0-9]{3})?$",
			"description": "VISA"
		},
		{
			"key": "4,5,1555641112",
			"regex": "^(5[1-5][0-9]{14}|2(2(2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7([0-1][0-9]|20))[0-9]{12})$",
			"description": "Master Card"
		},
		{
			"key": "6,5,1555641112",
			"regex": "^3[47][0-9]{13}$",
			"description": "American Express"
		},
		{
			"key": "3,5,1555641112",
			"regex": "^6(?:011|5[0-9]{2})[0-9]{12}$",
			"description": "Discover"
		},
		{
			"key": "16,5,1555641112",
			"regex": "^(?:5[0678]\\\\d\\\\d|6304|6390|67\\\\d\\\\d)\\\\d{8,15}$",
			"description": "Maestro"
		},
		{
			"key": "17,3,1555641112",
			"regex": "",
			"description": "This company allows both private individuals and businesses to accept payments over the Internet"
		}
	],
	"cookieWarningBanner": {
		"closable": true,
		"saveInCookie": true,
		"anchorText": "Learn More",
		"message": "To provide a better shopping experience, our website uses cookies. Continuing use of the site implies consent."
	},
	"creditCard": {
		"showCreditCardHelp": true,
		"creditCardHelpTitle": "Enter the 3- or 4-digit Card Security Code. The placement of this number depends on the credit card provider, as shown below.",
		"imageCvvAllCards": "",
		"imageCvvAmericanCard": "",
		"creditCardShowSecureInfo": "<p class=\"order-wizard-paymentmethod-creditcard-secure-info\">We take all reasonable steps to protect our customers personal information against loss, misuse and alteration. We use encryption technology whenever receiving and transferring your personal information on our site. <strong>When you are viewing a page that is requesting personal information, the URL in the address bar at top of your browser will start with \"https\". </strong> This indicates your transaction session is secured through Secure Sockets Layer (SSL). If the web page you are viewing does not start with \"https\", please contact us.</p>"
	},
	"customFields": {
		"salesorder": []
	},
	"facetsAsUrlParameters": false,
	"facets": [
		{
			"id": "pricelevel5",
			"name": "Price",
			"priority": 10,
			"behavior": "range",
			"template": "facets_faceted_navigation_item_range.tpl",
			"uncollapsible": true,
			"titleToken": "Price $(1) - $(0)",
			"titleSeparator": ", ",
			"parser": "currency",
			"isParameter": true,
			"max": 4
		}
	],
	"facetDelimiters": {
		"betweenFacetNameAndValue": "/",
		"betweenDifferentFacets": "/",
		"betweenDifferentFacetsValues": ",",
		"betweenRangeFacetsValues": "to",
		"betweenFacetsAndOptions": "?",
		"betweenOptionNameAndValue": "=",
		"betweenDifferentOptions": "&"
	},
	"facetsSeoLimits": {
		"numberOfFacetsGroups": 2,
		"numberOfFacetsValues": 2,
		"options": [
			"page",
			"keywords"
		]
	},
	"itemsDisplayOptions": [
		{
			"id": "list",
			"name": "List",
			"template": "facets_item_cell_list.tpl",
			"columns": 1,
			"icon": "icon-display-list"
		},
		{
			"id": "table",
			"name": "Table",
			"template": "facets_item_cell_table.tpl",
			"columns": 2,
			"icon": "icon-display-table"
		},
		{
			"id": "grid",
			"name": "Grid",
			"template": "facets_item_cell_grid.tpl",
			"columns": 4,
			"icon": "icon-display-grid",
			"isDefault": true
		}
	],
	"itemsDisplayOptionsPhone": [
		{
			"id": "list",
			"name": "List",
			"template": "facets_item_cell_list.tpl",
			"columns": 1,
			"icon": "icon-display-list"
		},
		{
			"id": "table",
			"name": "Table",
			"template": "facets_item_cell_table.tpl",
			"columns": 2,
			"icon": "icon-display-table",
			"isDefault": true
		}
	],
	"itemsDisplayOptionsTablet": [
		{
			"id": "list",
			"name": "List",
			"template": "facets_item_cell_list.tpl",
			"columns": 1,
			"icon": "icon-display-list"
		},
		{
			"id": "table",
			"name": "Table",
			"template": "facets_item_cell_table.tpl",
			"columns": 2,
			"icon": "icon-display-table"
		},
		{
			"id": "grid",
			"name": "Grid",
			"template": "facets_item_cell_grid.tpl",
			"columns": 4,
			"icon": "icon-display-grid",
			"isDefault": true
		}
	],
	"defaultSearchTitle": "Products",
	"searchPrefs": {
		"maxLength": 40
	},
	"resultsPerPage": [
		{
			"items": 12,
			"name": "$(0) per page"
		},
		{
			"items": 24,
			"name": "$(0) per page",
			"isDefault": true
		},
		{
			"items": 48,
			"name": "$(0) per page"
		}
	],
	"sortOptions": [
		{
			"id": "relevance:desc",
			"name": "Relevance",
			"isDefault": true
		},
		{
			"id": "onlinecustomerprice:asc",
			"name": "Price, low to high",
			"isDefault": false
		},
		{
			"id": "onlinecustomerprice:desc",
			"name": "Price, high to low",
			"isDefault": false
		}
	],
	"sortOptionsPhone": [
		{
			"id": "relevance:desc",
			"name": "Sort by relevance",
			"isDefault": true
		},
		{
			"id": "onlinecustomerprice:asc",
			"name": "Sort by price, low to high",
			"isDefault": false
		},
		{
			"id": "onlinecustomerprice:desc",
			"name": "Sort by price, high to low",
			"isDefault": false
		}
	],
	"sortOptionsTablet": [
		{
			"id": "relevance:desc",
			"name": "Sort by relevance",
			"isDefault": true
		},
		{
			"id": "onlinecustomerprice:asc",
			"name": "Sort by price, low to high",
			"isDefault": false
		},
		{
			"id": "onlinecustomerprice:desc",
			"name": "Sort by price, high to low",
			"isDefault": false
		}
	],
	"tracking": {
		"googleAdWordsConversion": {
			"id": "",
			"value": 0,
			"label": ""
		},
		"googleTagManager": {
			"isMultiDomain": false,
			"id": "",
			"dataLayerName": "dataLayer"
		},
		"googleUniversalAnalytics": {
			"propertyID": "",
			"domainName": "",
			"domainNameSecure": ""
		}
	},
	"header": {
		"notShowCurrencySelector": false,
		"logoUrl": ""
	},
	"home": {
		"carouselImages": [],
		"bottomBannerImages": []
	},
	"transactionListColumns": {
		"invoiceOpen": [
			{
				"id": "duedate",
				"label": "Due Date"
			},
			{
				"id": "trandate",
				"label": "Date"
			},
			{
				"id": "amount",
				"label": "Amount"
			}
		],
		"invoicePaid": [
			{
				"id": "trandate",
				"label": "Date"
			},
			{
				"id": "closedate",
				"label": "Close Date"
			},
			{
				"id": "amount",
				"label": "Amount"
			}
		],
		"enableInvoice": false,
		"orderHistory": [
			{
				"id": "trandate",
				"label": "Date"
			},
			{
				"id": "amount",
				"label": "Amount"
			},
			{
				"id": "status",
				"label": "Status"
			}
		],
		"enableOrderHistory": false,
		"quote": [
			{
				"id": "trandate",
				"label": "Request date:"
			},
			{
				"id": "duedate",
				"label": "Expiration date:"
			},
			{
				"id": "total_formatted",
				"label": "Amount"
			},
			{
				"id": "entitystatus",
				"label": "Status"
			}
		],
		"enableQuote": false,
		"returnAuthorization": [
			{
				"id": "trandate",
				"label": "Date"
			},
			{
				"id": "quantity",
				"label": "Items:"
			},
			{
				"id": "amount_formatted",
				"label": "Amount"
			},
			{
				"id": "status",
				"label": "Status"
			}
		],
		"enableReturnAuthorization": false
	},
	"ItemOptions": {
		"showOnlyTheListedOptions": false,
		"optionsConfiguration": [
			{
				"cartOptionId": "custcol13",
				"label": "Color",
				"urlParameterName": "color",
				"colors": "default",
				"index": 10,
				"templateSelector": "product_views_option_color.tpl",
				"showSelectorInList": false,
				"templateFacetCell": "product_views_option_facets_color.tpl",
				"templateSelected": "transaction_line_views_selected_option_color.tpl"
			},
			{
				"cartOptionId": "GIFTCERTFROM",
				"urlParameterName": "from",
				"label": "From"
			},
			{
				"cartOptionId": "GIFTCERTRECIPIENTNAME",
				"urlParameterName": "to",
				"label": "To"
			},
			{
				"cartOptionId": "GIFTCERTRECIPIENTEMAIL",
				"urlParameterName": "to-email",
				"label": "To email"
			},
			{
				"cartOptionId": "GIFTCERTMESSAGE",
				"urlParameterName": "message",
				"label": "Message"
			}
		],
		"maximumOptionValuesQuantityWithoutPusher": 8,
		"defaultTemplates": {
			"selectorByType": [
				{
					"type": "select",
					"template": "product_views_option_tile.tpl"
				},
				{
					"type": "date",
					"template": "product_views_option_date.tpl"
				},
				{
					"type": "email",
					"template": "product_views_option_email.tpl"
				},
				{
					"type": "url",
					"template": "product_views_option_url.tpl"
				},
				{
					"type": "password",
					"template": "product_views_option_password.tpl"
				},
				{
					"type": "float",
					"template": "product_views_option_float.tpl"
				},
				{
					"type": "integer",
					"template": "product_views_option_integer.tpl"
				},
				{
					"type": "datetimetz",
					"template": "product_views_option_datetimetz.tpl"
				},
				{
					"type": "percent",
					"template": "product_views_option_percent.tpl"
				},
				{
					"type": "currency",
					"template": "product_views_option_currency.tpl"
				},
				{
					"type": "textarea",
					"template": "product_views_option_textarea.tpl"
				},
				{
					"type": "phone",
					"template": "product_views_option_phone.tpl"
				},
				{
					"type": "timeofday",
					"template": "product_views_option_timeofday.tpl"
				},
				{
					"type": "checkbox",
					"template": "product_views_option_checkbox.tpl"
				},
				{
					"type": "default",
					"template": "product_views_option_text.tpl"
				}
			],
			"facetCellByType": [
				{
					"type": "default",
					"template": "product_views_option_facets_color.tpl"
				}
			],
			"selectedByType": [
				{
					"type": "default",
					"template": "transaction_line_views_selected_option.tpl"
				}
			]
		}
	},
	"listHeader": {
		"filterRangeQuantityDays": 0
	},
	"transactionRecordOriginMapping": [
		{
			"id": "backend",
			"origin": 0,
			"name": "",
			"detailedName": "Purchase"
		},
		{
			"id": "inStore",
			"origin": 1,
			"name": "In Store",
			"detailedName": "In Store Purchase"
		},
		{
			"id": "online",
			"origin": 2,
			"name": "Online",
			"detailedName": "Online Purchase"
		}
	],
	"overview": {
		"customerSupportURL": "",
		"homeBanners": [],
		"homeRecentOrdersQuantity": 3
	},
	"isPickupInStoreEnabled": false,
	"productDetailsInformation": [
		{
			"name": "Details",
			"contentFromKey": "storedetaileddescription",
			"itemprop": "description"
		}
	],
	"productline": {
		"multiImageOption": [
			"custcol4",
			"custcol3"
		]
	},
	"productList": {
		"additionEnabled": true,
		"loginRequired": true,
		"listTemplates": [
			{
				"templateId": "1",
				"name": "My list",
				"description": "An example predefined list",
				"scopeId": 2,
				"scopeName": "private"
			},
			{
				"templateId": "2",
				"name": "Saved for Later",
				"description": "This is for the cart saved for later items",
				"scopeId": 2,
				"scopeName": "private",
				"typeId": "2",
				"typeName": "later"
			},
			{
				"templateId": "3",
				"name": "Request a Quote",
				"description": "This is for the request a quote items",
				"scopeId": 2,
				"scopeName": "private",
				"typeId": "4",
				"typeName": "quote"
			}
		],
		"templates": [
			{
				"id": "list",
				"name": "List",
				"columns": 1,
				"icon": "list-header-view-icon-list",
				"isDefault": true
			},
			{
				"id": "condensed",
				"name": "Condensed",
				"columns": 1,
				"icon": "list-header-view-icon-condensed"
			}
		]
	},
	"productReviews": {
		"maxFlagsCount": 2,
		"loginRequired": false,
		"flaggedStatus": 4,
		"approvedStatus": "2",
		"pendingApprovalStatus": 1,
		"resultsPerPage": 25,
		"maxRate": 5,
		"computeOverall": true,
		"filterOptions": [
			{
				"id": "all",
				"name": "All Reviews",
				"params": "{}",
				"isDefault": true
			},
			{
				"id": "5star",
				"name": "5 Star Reviews",
				"params": "{\"rating\": 5}",
				"isDefault": false
			},
			{
				"id": "4star",
				"name": "4 Star Reviews",
				"params": "{\"rating\": 4}",
				"isDefault": false
			},
			{
				"id": "3star",
				"name": "3 Star Reviews",
				"params": "{\"rating\": 3}",
				"isDefault": false
			},
			{
				"id": "2star",
				"name": "2 Star Reviews",
				"params": "{\"rating\": 2}",
				"isDefault": false
			},
			{
				"id": "1star",
				"name": "1 Star Reviews",
				"params": "{\"rating\": 1}",
				"isDefault": false
			}
		],
		"sortOptions": [
			{
				"id": "date",
				"name": "By Date",
				"params": "{\"order\": \"created_on:ASC\"}",
				"isDefault": true
			},
			{
				"id": "rating",
				"name": "By Rating",
				"params": "{\"order\": \"rating:ASC\"}",
				"isDefault": false
			}
		]
	},
	"quickOrder": {
		"showHyperlink": true,
		"textHyperlink": "Quick Order"
	},
	"quote": {
		"daysToExpire": 7,
		"disclaimerSummary": "To place the order please contact <strong>Contact Center</strong> at <strong>(000)-XXX-XXXX</strong> or send an email to <a href=\"mailto:xxxx@xxxx.com\">xxxx@xxxx.com</a>",
		"disclaimer": "For immediate assistance contact <strong>Contact Center</strong> at <strong>(000)-XXX-XXXX</strong> or send an email to <a href=\"mailto:xxxx@xxxx.com\">xxxx@xxxx.com</a>",
		"defaultPhone": "(000)-XXX-XXXX",
		"defaultEmail": "xxxx@xxxx.com",
		"purchaseReadyStatusId": "12",
		"showHyperlink": true,
		"textHyperlink": "Request a Quote",
		"requestAQuoteWizardBottomMessage": "Once your quote has been submitted, a sales representative will contact you in <strong>XX business days</strong>. For immediate assistance call us at <strong>(000)-XXX-XXXX</strong> or email us at <a href='mailto:xxxx@xxxx.com'>xxxx@xxxx.com</a>",
		"contactBusinessDaysMessage": "A sales representative will contact you in <strong>XX business days</strong>."
	},
	"quoteToSalesorderWizard": {
		"invoiceFormId": "89"
	},
	"recentlyViewedItems": {
		"useCookie": true,
		"numberOfItemsDisplayed": 6
	},
	"returnAuthorization": {
		"cancelUrlRoot": "https://system.netsuite.com",
		"reasons": [
			{
				"text": "Wrong Item Shipped",
				"id": 1,
				"order": 1
			},
			{
				"text": "Did not fit",
				"id": 2,
				"order": 2
			},
			{
				"text": "Quality did not meet my standards",
				"id": 3,
				"order": 3
			},
			{
				"text": "Not as pictured on the Website",
				"id": 4,
				"order": 4
			},
			{
				"text": "Damaged during shipping",
				"id": 5,
				"order": 5
			},
			{
				"text": "Changed my mind",
				"id": 6,
				"order": 6
			},
			{
				"text": "Item was defective",
				"id": 7,
				"order": 7
			},
			{
				"text": "Arrived too late",
				"id": 8,
				"order": 8
			},
			{
				"text": "Other",
				"id": 9,
				"order": 9,
				"isOther": true
			}
		]
	},
	"isSCISIntegrationEnabled": true,
	"locationTypeMapping": {
		"store": {
			"internalid": "1",
			"name": "Store"
		}
	},
	"navigationData": [
		{
			"text": "Home",
			"href": "/",
			"dataTouchpoint": "home",
			"dataHashtag": "#/",
			"level": "1",
			"classnames": "header-menu-home-anchor"
		},
		{
			"text": "Shop",
			"href": "/search",
			"dataTouchpoint": "home",
			"dataHashtag": "#/search",
			"level": "1",
			"classnames": "header-menu-shop-anchor"
		},
		{
			"text": "Categories placeholder",
			"level": "1",
			"placeholder": "Categories"
		}
	],
	"typeahead": {
		"minLength": 3,
		"maxResults": 4,
		"sort": "relevance:desc"
	},
	"cache": {
		"contentPageCdn": "MEDIUM",
		"contentPageTtl": 7200
	},
	"addThis": {
		"enable": false,
		"pubId": "ra-50abc2544eed5fa5",
		"toolboxClass": "addthis_default_style addthis_toolbox addthis_button_compact",
		"servicesToShow": [
			{
				"key": "facebook",
				"value": "Facebook"
			},
			{
				"key": "google_plusone",
				"value": ""
			},
			{
				"key": "email",
				"value": "Email"
			},
			{
				"key": "expanded",
				"value": "More"
			}
		],
		"options": [
			{
				"key": "username",
				"value": ""
			},
			{
				"key": "data_track_addressbar",
				"value": true
			}
		]
	},
	"facebook": {
		"enable": false,
		"appId": "",
		"popupOptions": {
			"status": "no",
			"resizable": "yes",
			"scrollbars": "yes",
			"personalbar": "no",
			"directories": "no",
			"location": "no",
			"toolbar": "no",
			"menubar": "no",
			"width": 500,
			"height": 250,
			"left": 0,
			"top": 0
		}
	},
	"googlePlus": {
		"enable": true,
		"popupOptions": {
			"status": "no",
			"resizable": "yes",
			"scrollbars": "yes",
			"personalbar": "no",
			"directories": "no",
			"location": "no",
			"toolbar": "no",
			"menubar": "no",
			"width": 600,
			"height": 600,
			"left": 0,
			"top": 0
		}
	},
	"pinterest": {
		"enableHover": true,
		"enableButton": true,
		"imageSize": "main",
		"popupOptions": {
			"status": "no",
			"resizable": "yes",
			"scrollbars": "yes",
			"personalbar": "no",
			"directories": "no",
			"location": "no",
			"toolbar": "no",
			"menubar": "no",
			"width": 680,
			"height": 300,
			"left": 0,
			"top": 0
		}
	},
	"twitter": {
		"enable": true,
		"popupOptions": {
			"status": "no",
			"resizable": "yes",
			"scrollbars": "yes",
			"personalbar": "no",
			"directories": "no",
			"location": "no",
			"toolbar": "no",
			"menubar": "no",
			"width": 632,
			"height": 250,
			"left": 0,
			"top": 0
		},
		"via": ""
	},
	"faviconPath": "",
	"filterSite": {
		"option": "current"
	},
	"orderShoppingFieldKeys": {
		"keys": [
			"shipaddress",
			"summary",
			"promocodes"
		],
		"items": [
			"amount",
			"promotionamount",
			"promotiondiscount",
			"orderitemid",
			"quantity",
			"minimimquantity",
			"onlinecustomerprice_detail",
			"internalid",
			"options",
			"itemtype",
			"rate",
			"rate_formatted",
			"taxrate1",
			"taxtype1",
			"taxrate2",
			"taxtype2",
			"tax1amt",
			"discounts_impact"
		]
	},
	"orderCheckoutFieldKeys": {
		"keys": [
			"giftcertificates",
			"shipaddress",
			"billaddress",
			"payment",
			"summary",
			"promocodes",
			"shipmethod",
			"shipmethods",
			"agreetermcondition",
			"purchasenumber"
		],
		"items": [
			"amount",
			"promotionamount",
			"promotiondiscount",
			"orderitemid",
			"quantity",
			"minimumquantity",
			"maximumquantity",
			"onlinecustomerprice_detail",
			"internalid",
			"rate",
			"rate_formatted",
			"options",
			"itemtype",
			"itemid",
			"taxrate1",
			"taxtype1",
			"taxrate2",
			"taxtype2",
			"tax1amt",
			"discounts_impact"
		]
	},
	"suitescriptResultsPerPage": 20,
	"fieldKeys": {
		"itemsFieldsAdvancedName": "order",
		"itemsFieldsStandardKeys": [
			"canonicalurl",
			"displayname",
			"internalid",
			"itemid",
			"itemoptions_detail",
			"itemtype",
			"minimumquantity",
			"maximumquantity",
			"onlinecustomerprice_detail",
			"pricelevel1",
			"pricelevel1_formatted",
			"isinstock",
			"ispurchasable",
			"isbackordable",
			"outofstockmessage",
			"stockdescription",
			"showoutofstockmessage",
			"storedisplayimage",
			"storedisplayname2",
			"storedisplaythumbnail",
			"isfullfillable"
		]
	},
	"extraTranslations": [],
	"storeLocator": {
		"icons": {
			"stores": "img/default-marker.png",
			"position": "img/position-marker.png",
			"autocomplete": "img/position-marker.png"
		},
		"zoomInDetails": 17,
		"openPopupOnMouseOver": true,
		"title": "Store Locator",
		"isEnabled": true,
		"radius": 50,
		"showLocalizationMap": true,
		"showAllStoresRecordsPerPage": 28,
		"defaultTypeLocations": "1",
		"defaultQuantityLocations": 3,
		"distanceUnit": "mi",
		"apiKey": "",
		"mapOptions": {
			"centerPosition": {
				"latitude": -34.86993,
				"longitude": -56.145212
			},
			"zoom": 11,
			"mapTypeControl": false,
			"streetViewControl": false,
			"mapTypeId": "ROADMAP"
		}
	}
};

require.config({"paths":{"Backbone.Validation":"backbone-validation.server.custom"},"shim":{"Backbone.Validation":{"exports":"Backbone.Validation"}}});
