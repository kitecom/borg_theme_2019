/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

define('Logger', ['Url', 'jQuery'], function (Url, $)
{

    'use strict';

    var instance = null;

    function Logger()
    {

        if (this instanceof Logger)
        {
            throw 'Is not possible to create a new Logger. Please use getLogger method instead.';
        }

        var queueErrorTemp = []
            , queueInfoTemp = [];
        var isWaiting = false;

        function clearQueues()
        {
            localStorage.setItem('queueError', JSON.stringify(queueErrorTemp));
            localStorage.setItem('queueInfo', JSON.stringify(queueInfoTemp));
			queueErrorTemp = [];
			queueInfoTemp = [];
            isWaiting = false;
        }

        function appendTemp()
        {
            if (queueErrorTemp.length > 0)
            {
                var queueError = localStorage.getItem('queueError');
                queueError = queueError == null ? [] : JSON.parse(queueError);
                localStorage.setItem('queueError', JSON.stringify(queueError.concat(queueErrorTemp)));
            }
            if (queueInfoTemp.length > 0)
            {
                var queueInfo = localStorage.getItem('queueInfo');
                queueInfo = queueInfo == null ? [] : JSON.parse(queueInfo);
                localStorage.setItem('queueInfo', JSON.stringify(queueInfo.concat(queueInfoTemp)));
            }
            isWaiting = false;
        }

        function sendQueues(isAsync)
        {
            var parsedURL = new Url().parse(SC.ENVIRONMENT.baseUrl);
            var product = SC.ENVIRONMENT.BuildTimeInf.product;
            var relativeURL = '/app/site/hosting/scriptlet.nl?script=customscript_' + product.toLowerCase() + '_loggerendpoint&deploy=customdeploy_' + product.toLowerCase() + '_loggerendpoint';
            var URL = parsedURL.schema ? (parsedURL.schema + '://' + parsedURL.netLoc + relativeURL) : relativeURL;
            var queueError = JSON.parse(localStorage.getItem('queueError'));
            var queueInfo = JSON.parse(localStorage.getItem('queueInfo'));
            if (queueInfo && queueInfo.length > 0 || queueError && queueError.length > 0)
            {
                isWaiting = true;
                var data = {
                    type: product
                    , info: queueInfo
                    , error: queueError
                };
                if (navigator.sendBeacon)
                {
                    var status = navigator.sendBeacon(URL, JSON.stringify(data));
                    if (status)
					{
                        clearQueues();
					}
                    else
					{
                        appendTemp();
                }
				}
                else
                {
                    $.ajax(
                        {
                            type: 'POST'
                            , url: URL
                            , data: JSON.stringify(data)
                            , contentType: 'text/plain; charset=UTF-8'
                            , async: isAsync
                        }).done(clearQueues)
                        .fail(appendTemp);
                }
            }
        }

        setInterval(function ()
        {
            sendQueues(true);
        }, 60000);

		window.addEventListener('beforeunload', function ()
        {
            sendQueues(false);
        });

        this.info = function (obj)
        {
            obj.suiteScriptAppVersion = SC.ENVIRONMENT.RELEASE_METADATA.version;
            obj.message = "clientSideLogDateTime: " + (new Date()).toISOString();
            if (isWaiting)
            {
                queueInfoTemp.push(obj);
            }
            else
            {
                var queueInfo = JSON.parse(localStorage.getItem('queueInfo')) || [];
                queueInfo.push(obj);
                localStorage.setItem('queueInfo', JSON.stringify(queueInfo));
            }
        };

        this.error = function (obj)
        {
            obj.suiteScriptAppVersion = SC.ENVIRONMENT.RELEASE_METADATA.version;
            obj.message = "clientSideLogDateTime: " + (new Date()).toISOString();
            if (isWaiting)
            {
                queueErrorTemp.push(obj);
            }
            else
            {
                var queueError = JSON.parse(localStorage.getItem('queueError')) || [];
                queueError.push(obj);
                localStorage.setItem('queueError', JSON.stringify(queueError));
            }
        };
        return this;
    }

    Logger.getLogger = function ()
    {
        instance = instance || Logger.apply(
        {});
        return instance;
    };

    return Logger;
});