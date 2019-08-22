var gulp = require('gulp');

function whoService(req, res)
{
    var protocol = req.protocol
    ,   host = req.get('host')
    ,   app = req.params.app
    ,   nconf = require('nconf')
    ,   extension_mode = nconf.get('extensionMode');

    //A null url make the local ssp file grab the resource from backend (production)

    var css = {
            tag: 'link'
        ,   resource: 'css'
        ,   url: `${protocol}://${host}/tmp/css/${app}.css`
        }

    ,   requirejs = {
            tag: 'script'
        ,   resource: 'requirejs'
        ,   url: `${protocol}://${host}/tmp/require.js`
        }

    ,   define_patch = {
            tag: 'script'
        ,   resource: 'define_patch'
        ,   url: `${protocol}://${host}/define_patch.js`
        }

    ,   javascript_libs = {
            tag: 'script'
        ,   resource: 'javascript_libs'
        ,   url: `${protocol}://${host}/tmp/javascript-libs.js`
        }

    ,   templates = {
            tag: 'script'
        ,   resource: 'templates'
        ,   url: `${protocol}://${host}/tmp/${app}-templates.js`
        }

    ,   js_core = {
            tag: 'script'
        ,   resource: 'js_core'
        ,   url: null
        }

    ,   js_extensions = {
            tag: 'script'
        ,   resource: 'js_extensions'
        ,   url: `${protocol}://${host}/tmp/extensions/${app}_ext.js`
        };

    var response;
    if(extension_mode)
    {
        response = [
            css
        ,   requirejs
        ,   define_patch
        ,   javascript_libs
        ,   templates
        ,   js_core
        ,   js_extensions
        ];
    }
    else
    {
        //In the case of the Theme devTools, the extension javascript is grabbed  from backend
        js_extensions.url = null;

        response = [
            css
        ,   requirejs
        ,   define_patch
        ,   javascript_libs
        ,   templates
        ,   js_core
        ,   js_extensions
        ];
    }

    res.setHeader('Content-Type', 'application/json');
    res.json(response);
}

function definePatchService(req, res)
{
    var response = function define_patch()
    {
        var src_define = define;
        define = function define(name, cb)
        {
            var is_tpl = name && /\.tpl$/.test(name);
            var cb_string = cb ? cb.toString().replace(/\s/g, '') : '';
            var is_empty_cb = cb_string === 'function(){}';

            if(is_tpl && is_empty_cb)
            {
                return;
            }
            return src_define.apply(this, arguments);
        }

        define.amd = {
            jQuery: true
        };
    };

    res.setHeader('Content-Type', 'application/javascript');
    res.send(`${response}; define_patch();`);
}

function copyRequireJs()
{
    var nconf = require('nconf')
	,	fs = require('fs')
    ,	path = require('path');

    return fs.createReadStream(path.join(
        process.cwd()
    ,   'node_modules'
    ,   'requirejs'
    ,   'require.js'
    ))
    .pipe(fs.createWriteStream(path.join(
        nconf.get('folders:output')
    ,   'require.js'
    )));
}

// gulp connect implements both http server for static files
gulp.task('connect', gulp.series(copyRequireJs, function start_server(cb)
{
    try {
        var nconf = require('nconf')
        ,   fs = require('fs')
        ,   PluginError = require('plugin-error')
        ,   https = require('https')
        ,   cors = require('cors')
        ,   express = require('express');

        var db_config = nconf.get('dbConfig');

        var app = express();
        app.use(cors({origin: true}));
        app.use('/', express.static(nconf.get('folders:local')));
        app.use('/', express.static(nconf.get('folders:source:source_path')));
        //Service used by the index-local.ssp files to know what files load
        app.use('/who/:app', whoService);
        //Serves the script patch to ignore tpl defines executed by core javascript file
        app.use('/define_patch.js', definePatchService);

        //setup secure server for scis
        if (nconf.get('credentials:is_scis')) {
            db_config.https = true;

            var keyfile = process.env[db_config.key] || db_config.key;
            var certfile = process.env[db_config.cert] || db_config.cert;

            if (!keyfile || !certfile) {
                throw new PluginError('Https Certificate and/or Certificate Key Not Found.',
                    'Please check the paths or environment variables as registered in: gulp/config/config.json file.\n' +
                    '\tConfiguration variables: dbConfig->key and dbConfig->cert. Thank you.');
            }

            db_config.key = fs.readFileSync(keyfile, 'utf8')
            db_config.cert = fs.readFileSync(certfile, 'utf8')

            var server = https.createServer(db_config, app);
            server.listen(db_config.port);
        } else {
            //setup http server for sca/scs
            app.listen(db_config.port);
        }
        cb();
    }
    catch(error)
    {
        cb(error);
    }
}));
