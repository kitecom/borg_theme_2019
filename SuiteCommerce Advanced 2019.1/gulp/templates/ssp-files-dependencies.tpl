function Deferred(){
    this.status = 'started';
    this.data = undefined;
    this.doneCb = [];
}

Deferred.prototype.done = function (fn){
    if (this.status === 'resolved'){
        fn(this.data)
    }else{
        this.doneCb.push(fn);
    }
}

Deferred.prototype.resolve = function (data){
    this.data = data;
    this.status = 'resolved';
    for(var i = 0; i < this.doneCb.length; i++){
        this.doneCb[i](this.data);
    }
    return this;
}

Deferred.all = function (deferreds) {
    var keys = Object.keys(deferreds);
    var numberOfResolvedDeferreds = 0;
    var toReturn = new Deferred();
    for (var i = 0; i < keys.length; i++){
        deferreds[keys[i]].done(function(){
            numberOfResolvedDeferreds++;
            if(numberOfResolvedDeferreds === keys.length){
                toReturn.resolve();
            }
        });
    }
    return toReturn;
}

function loadJSON(url, resourceName){
    window.loadedResourcesPromises = window.loadedResourcesPromises || {};
    var promise = new Deferred();
    window.loadedResourcesPromises[resourceName] = promise;
    var http = new XMLHttpRequest();
    http.open('GET', url);
    http.onreadystatechange = function (){
        if (http.readyState === 4 && http.status === 200) {
            promise.resolve(JSON.parse(http.responseText));
        }
    };
    http.send(null);
    return promise;
}

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

function merge(target, source){
    if (isObject(target) && isObject(source)) {
        var sourceKeys = Object.keys(source);
        var sourceKey;
        for (var i = 0; i < sourceKeys.length; i++){
            sourceKey = sourceKeys[i];
            if (isObject(source[sourceKey])){
                if(target[sourceKey] === undefined){
                    target[sourceKey] = source[sourceKey];
                } else {
                    merge(target[sourceKey], source[sourceKey]);
                }
            } else {
                target[sourceKey] = source[sourceKey];
            }
        }
    }
    return target;
};
                                              
function _each(values, fn)
{
    for(var i = 0; i < values.length; i++)
    {
        fn(values[i], i);
    }
};

var SC = window.SC = {
    ENVIRONMENT: {
        jsEnvironment: (typeof nsglobal === 'undefined') ? 'browser' : 'server'
    },
    isCrossOrigin: function()
    {
        return '<%= Environment.currentHostString %>' !== document.location.hostname;
    },
    isPageGenerator: function()
    {
        return typeof nsglobal !== 'undefined';
    },
    getSessionInfo: function(key)
    {
        var session = SC.SESSION || SC.DEFAULT_SESSION || {};
        return (key) ? session[key] : session;
    },   
    getPublishedObject: function(key)
    {
        return SC.ENVIRONMENT && SC.ENVIRONMENT.published && SC.ENVIRONMENT.published[key] ? SC.ENVIRONMENT.published[key] : null;
    }
};