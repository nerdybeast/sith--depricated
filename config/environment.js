/* jshint node: true */

module.exports = function(environment) {

	var ENV = {
		modulePrefix: 'sith',
		environment: environment,
		baseURL: '/',
		locationType: 'auto',
		EmberENV: {
			FEATURES: {
				// Here you can enable experimental features on an ember canary build
				// e.g. 'with-controller': true
			}
		},

		APP: {
			ioDomain: null,
			apiDomain: null
		}
	};

	if (environment === 'test') {
		// Testem prefers this...
		ENV.baseURL = '/';
		ENV.locationType = 'none';

		// keep test console output quieter
		ENV.APP.LOG_ACTIVE_GENERATION = false;
		ENV.APP.LOG_VIEW_LOOKUPS = false;

		ENV.APP.rootElement = '#ember-testing';
	}

	if(environment === 'localhost' || environment === 'local') {
		ENV.APP.apiDomain = 'http://localhost:5000';
	}

	if (environment === 'development') {
		// ENV.APP.LOG_RESOLVER = true;
		// ENV.APP.LOG_ACTIVE_GENERATION = true;
		// ENV.APP.LOG_TRANSITIONS = true;
		// ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
		// ENV.APP.LOG_VIEW_LOOKUPS = true;
		ENV.APP.apiDomain = 'https://sith-apprentice-api.herokuapp.com';
	}

	if (environment === 'staging') {
		ENV.APP.apiDomain = 'https://sith-lord-api.herokuapp.com';
	}

	if (environment === 'production') {
		ENV.APP.apiDomain = 'https://sith-api.herokuapp.com';
	}

	//START => Auth0 options
	//See: https://github.com/auth0/auth0-ember-simple-auth/blob/master/README.md
	ENV['ember-simple-auth'] = {
		authenticationRoute: 'index',
	  	routeAfterAuthentication: 'home',
	  	routeIfAlreadyAuthenticated: 'home'
	};

	ENV['auth0-ember-simple-auth'] = {
		domain: "sith-oath.auth0.com",
		
		//This property is found in the ".env" file for this project.
		//See the "ember-cli-build.js" file for the "dotEnv" setup.
		clientID: process.env.AUTH0_CLIENT_ID
	};

	ENV['contentSecurityPolicy'] = {
	    'font-src': "'self' data: https://*.auth0.com",
	    'style-src': "'self' 'unsafe-inline'",
	    'script-src': "'self' 'unsafe-eval' https://*.auth0.com",
	    'img-src': '*.gravatar.com *.wp.com data:',
	    'connect-src': "'self' http://localhost:* https://sith-oath.auth0.com"
  	};
  	//END => Auth0 options

	return ENV;
};
