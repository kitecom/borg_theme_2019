/*jshint esversion: 6 */

var gulp = require('gulp')
,	nconf = require('nconf');

'use strict';

//compute all the differences from all the  manifests in the workspace folder
//for each manifest, get all the promises to change each file
//after all the files have updated the manifest, impact the changes (write the manifest)
//after all the manifests have finished, the task is completed

gulp.task('update-manifest', (cb) => {

	var helper = require('../extension-mechanism/update-manifest/update-manifest-task')
	return helper.startUpdateManifest(cb);
});


if(nconf.get('extensionMode'))
{
	/**
	  * Updates the manifest removing and adding entries to match your files and folders.
	  * @task {extension:update-manifest}
	  * @group {Utility tasks}
	  * @order {5}
	  */
	gulp.task('extension:update-manifest', gulp.parallel('update-manifest'));
}
else
{
	/**
	  *Updates the manifest removing and adding entries to match your files and folders.
	  * @task {theme:update-manifest}
	  * @group {Utility tasks}
	  * @order {5}
	  */
	gulp.task('theme:update-manifest', gulp.parallel('update-manifest'));
}

// gulp.task('watch-manifest', [], ()=>
// {
// 	initWatchManifest();

// 	var file_manifest
// 	,	manifest_path;

// 	return gulp.watch(watched_files, function(event) {

// 	  if (event.type === 'added' ) {
// 	  	file_manifest = findManifest(manifests, event.path);
// 	  	manifest_path = path.join(file_manifest.local_folder, 'manifest.json');

// 	  	//update the last version in the manifest manager of the manifest
// 	  	file_manifest = manifest_manager.updateManifest(manifest_path);
// 	    updateManfiest(file_manifest, event.path.replace(/\\/g, '/'), event.type);
// 	  }
// 	  else if(event.type === 'deleted') {
// 	  	file_manifest = findManifest(manifests, event.path);
// 	  	manifest_path = path.join(file_manifest.local_folder, 'manifest.json');

// 	  	//update the last version in the manifest manager of the manifest
// 	  	file_manifest = manifest_manager.updateManifest(manifest_path);
// 	    updateManfiest(file_manifest, event.path.replace(/\\/g, '/'), event.type);
// 	  }
// 	  else if(event.type === 'renamed')
// 	  {
// 	  	file_manifest = findManifest(manifests, event.path);
// 	  	manifest_path = path.join(file_manifest.local_folder, 'manifest.json');

// 	  	//update the last version in the manifest manager of the manifest
// 	  	file_manifest = manifest_manager.updateManifest(manifest_path);
// 	    updateManfiest(file_manifest, event.path.replace(/\\/g, '/'), event.type);
// 	  }
// 	});
// });
