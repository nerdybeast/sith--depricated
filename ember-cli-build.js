/* jshint node:true */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var Funnel = require('broccoli-funnel');

module.exports = function(defaults) {

	var app = new EmberApp(defaults, {

		/**
		 * We are using an ember addon called "ember-cli-dotenv" that is an ember-friendly version of the
		 * "dotenv" node package. This addon automatically imports the ".env" file in this project so that
		 * we can pull in information we dont want stored in git.
		 *
		 * NOTE: If deploying to Heroku, we have no way of getting a ".env" file out there without it being git
		 * but that's okay because Heroku uses "Config Variables" that are automatically injected into the node
		 * process.
		 *
		 * See: https://www.npmjs.com/package/ember-cli-dotenv
		 */
		dotEnv: {

			/**
			 * Putting our .env file in the config folder for one, because it's related and I would like to avoid
			 * polluting the root directory of this project as much as possible.
			 */
			path: './config/.env',

			/**
			 * This property determines which keys we be pulled from the ".env" file. For security reasons, the
			 * ember-cli version of this library forces you to explicitly state which env settings you want injected
			 * to help avoid exposing unwanted variables.
			 */
			clientAllowedKeys: [
				'AUTH0_CLIENT_ID'
			]
		}
	});

	app.import('bower_components/bootswatch/slate/bootstrap.min.css');

	app.import('bower_components/bootstrap/dist/js/bootstrap.min.js');
	app.import('bower_components/lodash/dist/lodash.min.js');
	app.import('bower_components/clipboard/dist/clipboard.min.js');
	app.import('bower_components/moment/min/moment.min.js');

	app.import('vendor/clipboard-setup.js');

	//Pull the entire Bootstrap fonts directory into the app.
	var bootstrapFonts = new Funnel('bower_components/bootstrap/dist/fonts', {
		destDir: '/fonts'
	});

	return app.toTree(bootstrapFonts);
};
