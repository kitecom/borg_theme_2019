'use strict';

var log = require('fancy-log')
,	c = require('ansi-colors')
,	nconf = require('nconf')
,	path = require('path')
,	_ = require('underscore');

var SkinServiceClient = require('./skin-service-client')
,	WebsiteService = require('./website-service')
,	FileCabinet = require('../library/file-cabinet')
,	FileServiceClient = require('./client-script/FileServiceClient');

'use strict';

var skin_record_helper = {

	syncSkinsRecords: function syncSkinsRecords(data, cb)
	{
		log(c.green('Synchronizing skin records with your local ' + data.new_manifest.name + ' skins...'));

		var modify_skins_data = {
			skins_to_create: []
		,	skins_to_update: []
		,	skins_to_delete: []
		};

		skin_record_helper.getSkinsFilesId(data)
		.then(function(data)
		{

			if(data.record_operation === 'create')
			{
				modify_skins_data.skins_to_create = data.manifest_skins;
				return modify_skins_data;
			}
			else
			{
				return skin_record_helper.getSkinsRecords(data)
					.then(function(result)
					{
						if(result.length)
						{
							result = _.sortBy(result, 'name');
						}

						data.skins_records = result;
						skin_record_helper.computeSkinDifferences(data, modify_skins_data);
						return modify_skins_data;
					});
			}
		})
		.then(function(modify_skins_data)
		{
			var promises = [];

			modify_skins_data.extension_record = data.extension_record;
			promises = promises.concat(skin_record_helper.updateSkins(modify_skins_data));
			promises = promises.concat(skin_record_helper.createSkins(modify_skins_data));
			promises = promises.concat(skin_record_helper.deleteSkins(modify_skins_data));

			return Promise.all(promises);
		})
		.then(function()
		{
			cb(null, data);
		})
		.catch(function(error)
		{
			log(c.green('Finished synchronizing skin records...'));
			cb(error);
		});
	}

	/*
		Find which skin records corresponds with the local skins and if they have to be updated
		create new or delete skins
	*/
,	computeSkinDifferences: function computeSkinDifferences(data, skin_differences)
	{
		_.each(data.skins_records,	function(skin_record)
		{
			var skin_local = _.findWhere(data.manifest_skins, {file_id: skin_record.file});

			if(!skin_local)
			{
				skin_local = _.findWhere(data.manifest_skins, {name: skin_record.name});
			}

			if(skin_local)
			{
				skin_local.skin_id = skin_record.skin_id;

				if(skin_local.name !== skin_record.name ||
					skin_local.file_id !== skin_record.file)
				{
					skin_differences.skins_to_update.push(skin_local);
				}

				var index = _.findIndex(data.manifest_skins, skin_local);
				data.manifest_skins.splice(index, 1);
			}
			else
			{
				skin_differences.skins_to_delete.push(skin_record);
			}
		});

		if(data.manifest_skins.length)
		{
			_.each(data.manifest_skins, function(skin)
			{
				skin_differences.skins_to_create.push(skin);
			});
		}
	}

,	updateSkins: function updateSkins(data)
	{
		var update_promises = []
		,	skins_to_update = data.skins_to_update
		;

		_.each(skins_to_update, function(skin)
		{
			update_promises.push(

				SkinServiceClient.updateSkin(
					{
						skin_id: skin.skin_id
					,	name: skin.name
					,	theme: data.extension_record.extension_id
					,	file:  skin.file_id
					}
				)
				.then(function(result)
				{
					log(c.green('Skin ' + skin.name + ' updated successfully.'));
				})
			);
		});

		return update_promises;
	}

,	createSkins: function createSkins(data)
	{
		var create_promises = []
		,	skins_to_create = data.skins_to_create
		;

		_.each(skins_to_create, function(skin)
		{
			create_promises.push(

				SkinServiceClient.createSkin(
					{
						name: skin.name
					,	theme: data.extension_record.extension_id
					,	file: skin.file_id
					}
				)
				.then(function(result)
				{
					log(c.green('Skin ' + skin.name + ' created successfully.'));
				})
			);
		});

		return create_promises;
	}

,	deleteSkins: function deleteSkins(data)
	{
		var delete_promises = []
		,	skins_to_delete = data.skins_to_delete;

		_.each(skins_to_delete, function(skin)
		{
			delete_promises.push(
				SkinServiceClient.deleteSkin(skin.skin_id)
                .then(function(result)
				{
					log(c.green('Skin ' + skin.name + ' was deleted.'));
				})
			);
		});

		return delete_promises;
	}

,	getSkinsFilesId: function getSkinsFilesId(data)
	{
		var manifest_skins = JSON.parse(JSON.stringify(data.manifest.skins));

		var base_theme_path = path.join('SuiteScripts',
			nconf.get('folders:extensions_dest_name')
		,	data.new_manifest.vendor
		,	data.new_manifest.name + '@' + data.new_manifest.version
		);

		var skins_path = _.map(manifest_skins, skin => { return path.join(base_theme_path, skin.file).replace(/\\/g, '/') });

		return FileServiceClient.getInstance()
        .getFiles(skins_path)
        .then(function(files)
        {
            _.each(files, function(file, i)
            {
                manifest_skins[i].file_id = file.file_id;
            });

            data.manifest_skins = manifest_skins;
            return data;
        });
	}

,	getSkinsRecords: function getSkinsRecords(data)
	{
		var query_params = {
        	theme: data.extension_record.extension_id
		};

		return SkinServiceClient.searchSkins(query_params)
        .then(function(response)
        {
            return response.result.skins;
        });
	}
};

module.exports = skin_record_helper;
