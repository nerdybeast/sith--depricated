/* jshint node:true */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var Funnel = require('broccoli-funnel');

module.exports = function(defaults) {

	var app = new EmberApp(defaults, {
		
		//We are using an ember addon called "ember-cli-dotenv" that is an ember-friendly version of the
		//"dotenv" node package. This addon automatically imports the ".env" file in this project so that
		//we can pull in information we dont want stored in git.
		dotEnv: {
			
			//This property determines which keys we be pulled from the ".env" file. 
			clientAllowedKeys: [
				'AUTH0_CLIENT_ID'
			]
		}
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
