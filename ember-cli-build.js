/* jshint node:true */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var Funnel = require('broccoli-funnel');

module.exports = function(defaults) {

	var app = new EmberApp(defaults, {
		// Add options here
	});

	//app.import('bower_components/bootstrap/dist/css/bootstrap.min.css');
	app.import('vendor/bootstrap.slate.min.css');

	app.import('bower_components/bootstrap/dist/js/bootstrap.min.js');

	//Pull the entire Bootstrap fonts directory into the app.
	var bootstrapFonts = new Funnel('bower_components/bootstrap/dist/fonts', {
		destDir: '/fonts'
	});

	return app.toTree(bootstrapFonts);
};
