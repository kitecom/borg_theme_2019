'use strict';

var fs = require('fs')
	,	fsExtensions = require('./fs-extensions')
	,	path = require('path')
	,	_ = require('underscore')
	,	archiver = require('archiver');

function pad(num, size, padding) {
	var s = num + '';
	while (s.length < size)
	{
		s = padding + s;
	}
	return s;
}

function getVolumeName(options)
{
	var name = options.target.baseName + options.target.extension;
	if (options.isMultiVolume)
	{
		name = name + '.' + pad(options.currentVolumeIndex, 3, '0');
	}

	return path.join(options.target.folder, name);
}

function Writer(options)
{
	var current_file
		,	current_file_length = 0;

	options.currentVolumeIndex = 0;

	function isFull(chunkLength)
	{
		return options.isMultiVolume && (current_file_length + chunkLength > options.maxVolumeLength);
	}

	function start(path)
	{
		current_file = fs.openSync(path, 'w');
		current_file_length = 0;
	}

	function close()
	{
		current_file && fs.closeSync(current_file);
	}

	function write(chunk, encoding, done)
	{
		try
		{
			if (!current_file || isFull(chunk.length))
			{
				close();

				options.currentVolumeIndex++;
				start(getVolumeName(options));
			}

			fs.writeSync(current_file, chunk, 0, chunk.length);
			current_file_length += chunk.length;
			done();
		}
		catch(error)
		{
			done(error);
		}
	}

	return {
		write: write
	};
}

function generateArchive(options, cb)
{
	//defaults
	options.sources = options.sources || [];
	options.target = options.target || 'archive.zip';
	options.archiveType = options.archiveType || 'zip';
	options.isMultiVolume = options.isMultiVolume || false;

	var target = fsExtensions.parsePath(options.target);
	options.target = target;
	fsExtensions.createFolder(target.folder);

	var	archive = archiver(options.archiveType).on('error', cb);

	var stream = require('stream')
		,   my_stream = new stream.Writable()
		,   writer = Writer(options);
	my_stream._write = writer.write;

	my_stream.on('finish', cb);

	archive.pipe(my_stream);

	_.each(options.sources, function(source)
	{
		_.each(source.src, function(src)
		{
			src && archive.glob(src, source);
		});
	});

	archive.finalize();
}

/*
 * Example usage

	generateArchive({
			target: '../folder/me.tar'
		,	isMultiVolume: true
		,	archiveType: 'tar'
		,	maxVolumeLength: 1024 * 1024 * 5
		,	sources: [{expand: true, src: ['C:\\next-gen\\Modules\\**\\*']}]
	}, function(){
		console.log('end callback');
	});

*/
module.exports = generateArchive;
