var shell = require('shelljs')
,	path = require('path')
,	fs = require('fs');

module.exports = {

	distroFile: 'distro.json'

,	read: function()
	{
		return JSON.parse(shell.cat(this.distroFile).toString());
	}

,	write: function(distro)
	{
		fs.writeFileSync(this.distroFile, JSON.stringify(distro, null, '\t'));
	}

,	installModule: function(srcFolder, targetFolder)
	{
		targetFolder = targetFolder || 'cool_store_custom'
		shell.mkdir('-p', 'Modules/' + targetFolder);
		shell.cp('-rf',
			path.join(__dirname, srcFolder),
			'Modules/' + targetFolder);
		var version = srcFolder.split('@')[1];
		var moduleName = path.basename(srcFolder.split('@')[0])

		var distro = this.read();
		console.log('installing module '+targetFolder + '/' + moduleName+', version: '+version)
		distro.modules[targetFolder + '/' + moduleName] = version;
		this.write(distro);
	}

	// @method uninstallModule @param module somesing like 'suitecommerce/Address@1.0.0'
,	uninstallModule: function(module)
	{
		var version = module.split('@')[1];
		var moduleName = module.split('@')[0];
		var distro = this.read();
		delete distro.modules[moduleName];
		this.write(distro);
		var modulePath = 'Modules/' + module
		console.log('Removing module' ,modulePath)
		shell.rm('-rf', modulePath);
	}

}