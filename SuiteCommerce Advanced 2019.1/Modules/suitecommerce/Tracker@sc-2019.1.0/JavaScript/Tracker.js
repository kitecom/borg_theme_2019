/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Tracker
define('Tracker', ['Singleton', 'underscore', 'Backbone'], function (Singleton, _, Backbone) {
  var Tracker = function () {
    // Place holder for tracking modules.
    // When creating your own tracker module, be sure to push it to this array.
    this.trackers = [];
  };

  Tracker.prototype.track = function (method) {
    // Each method could be called with different type of parameters.
    // So we pass them all what ever they are.
    var parameters = Array.prototype.slice.call(arguments, 1);

    _.each(this.trackers, function (tracker) {
      // Only call the method if it exists, the context is the original tracker.
      tracker[method] && tracker[method].apply(tracker, parameters);
    });

    return this;
  };

  Tracker.prototype.trackPageview = function (url) {
    return this.track('trackPageview', url);
  };

  Tracker.prototype.trackHomePageview = function (url) {
    return this.track('trackHomePageview', url);
  };

  Tracker.prototype.trackPageviewForCart = function (data) {
    return this.track('trackPageviewForCart', data);
  };

  Tracker.prototype.trackPageviewForCheckoutStep = function (url, step) {
    return this.track('trackPageviewForCheckoutStep', url, step);
  };

  Tracker.prototype.trackNonEcomemercePageView = function (url) {
    return this.track('trackNonEcomemercePageView', url);
  };

  Tracker.prototype.trackProceedToCheckout = function () {
    return this.track('trackProceedToCheckout');
  };

  Tracker.prototype.trackLogin = function (event) {
    this.track('trackLogin', event);
    return this.doTheCallback(event);
  };

  Tracker.prototype.trackRegister = function (event) {
    this.track('trackRegister', event);
    return this.doTheCallback(event);
  };

  Tracker.prototype.trackCheckoutAsGuest = function (event) {
    this.track('trackCheckoutAsGuest', event);
    return this.doTheCallback(event);
  };

  Tracker.prototype.trackAddToWishlist = function (line) {
    return this.track('trackAddToWishlist', line);
  };

  Tracker.prototype.trackSearchResults = function (items, keyword) {
    return this.track('trackSearchResults', items, keyword);
  };

  Tracker.prototype.trackAddToCart = function (line) {
    return this.track(
      'trackEvent',
      {
        category: 'Shopping - User Interaction',
        action: 'Add To Cart',
        label: line.generateURL()
      }
    ).track('trackAddToCart', line);
  };

  Tracker.prototype.trackGenericEvent = function () {
    return this.track('trackGenericEvent', arguments);
  };

  Tracker.prototype.trackEvent = function (event) {
    this.track('trackEvent', event);
    return this.doTheCallback(event);
  };

  Tracker.prototype.doTheCallback = function(event) {
    if (event.callback) {
      var doCallback = _.find(this.trackers, function (tracker) {
        return tracker.doCallback && tracker.doCallback();
      });

      !doCallback && event.callback();
    }
    return this;
  };

  Tracker.prototype.trackTransaction = function (transaction, event) {
    return this.track(
      'trackEvent',
      event || {
        category: 'Checkout - User Interanction',
        action: 'Place Order',
        label: ''
      }
    ).track('trackTransaction', transaction);
  };

  Tracker.prototype.trackViewCart = function (cart) {
    return this.track('trackViewCart', cart);
  };

  Tracker.prototype.trackProductList = function (items, listName) {
    var options = _.parseUrlOptions(location.search),
      key = options.keywords || '';

    listName = (key ? 'Search Results' : 'Category') || listName;

    if(listName === 'Search Results')
    {
      this.trackSearchResults(items, key);
    }

    return this.track('trackProductList', items, listName);
  };

  Tracker.prototype.trackProductListEvent = function (items, listName) {
    var options = _.parseUrlOptions(location.search),
      key = options.keywords || '';

    listName = listName || (key ? 'Search Results' : 'Category');

    return this.track('trackProductListEvent', items, listName);
  };

  Tracker.prototype.trackProductClick = function (item) {
    return this.track('trackProductClick', item);
  };

  Tracker.prototype.trackProductView = function (product) {
    return this.track('trackProductView', product);
  };

  Tracker.prototype.trackSelectedPayment = function (payment) {
    return this.track('trackSelectedPayment', payment);
  };

  Tracker.prototype.resetTracker = function () {
    return this.track('resetTracker');
  };

  Tracker.prototype.addCrossDomainParameters = function (url) {
    _.each(this.trackers, function (tracker) {
      if (tracker.addCrossDomainParameters) {
        url = tracker.addCrossDomainParameters(url);
      }
    });

    return url;
  };

  return _.extend(Tracker, Singleton, Backbone.Events);
});

// @class TrackEvent
// @property {String} category
// @property {String} action
// @property {String} label
// @property {Number} value
// @property {Function} callback
// @property {String?} page
