/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

define(
    'Instrumentation'
,   [
        'SC.Models.Init'
    ,   'ReleaseMetadata'
    ]
,   function (
        ModelsInit
    ,   ReleaseMetadata
    )
    {
        var logger = {
            log: function log(info)
            {
                /*try {
                    var product = BuildTimeInf.product.toLowerCase();
                    if (product === 'scis' || !info.method_name)
                    {
                        return;
                    }

                    var url = nlapiResolveURL('SUITELET', 'customscript_' + product + '_loggerendpoint', 'customdeploy_' + product + '_loggerendpoint', 'external');

                    ReleaseMetadata = ReleaseMetadata.get();

                    var data = {
                        type: product.toUpperCase()
                    ,   info: [{
                            suiteScriptAppVersion: ReleaseMetadata.version
                        ,   extensibilityLayerMethodName: info.method_name
                        }]
                    ,   error: null
                    };

                    nlapiRequestURL(url, JSON.stringify(data), {'Content-Type': 'application/json'}, 'POST');
                }
                catch(error)
                {
                    console.log(JSON.stringify(error));
                }*/
            }
        };

        return logger;
    }
);
