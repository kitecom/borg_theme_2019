if(!window.loadedResourcesPromises){
	require(["{{starterName}}"]);
	{{{afterapplicationstarts}}}
} else {
	Deferred.all(window.loadedResourcesPromises)
	.done(function(){
		require(["{{starterName}}"]);
		{{{afterapplicationstarts}}}
	});
}