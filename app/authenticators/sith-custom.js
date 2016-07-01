import Ember from 'ember';
import Base from 'auth0-ember-simple-auth/authenticators/lock';
import config from 'sith/config/environment';

const LOG_TITLE = 'authenticators/sith-custom';

/**
 * This is a little bit of a hack to add headers to all out-going requests made from this app. This is being done
 * until we can figure out how to set headers using the Auth0 authorizer when not using ember-data.
 */
let setHeaders = function(auth) {
	Ember.$.ajaxPrefilter(function( options, oriOptions, jqXHR ) {

		let customDomain = auth.profile.urls.custom_domain;
		let enterprise = auth.profile.urls.enterprise;
	    let instanceUrl = customDomain || enterprise.substring(0, enterprise.indexOf('/services'));

	    jqXHR.setRequestHeader('sessionId', auth.profile.identities[0].access_token);
        jqXHR.setRequestHeader('accessToken', auth.accessToken);
	    jqXHR.setRequestHeader('Authorization', `Bearer ${auth.jwt}`);
	    jqXHR.setRequestHeader('instanceUrl', instanceUrl);
		jqXHR.setRequestHeader('username', auth.profile.username);

        //Setting the default global Accept header to request json api docs. This can be ovverriden
        //on a call to call basis by simply setting the Accept header. This will be useful in cases
        //when we want simple json.
        jqXHR.setRequestHeader('Accept', 'application/vnd.api+json');
	});
};

let sendUserData = function(data) {
	return new Ember.RSVP.Promise(resolve => {

		let url = `${config.APP.apiDomain}/api/user`;
		let contentType = 'application/json';
		let profile = JSON.stringify(data.profile);

		Ember.$.post({ url, contentType, data: profile }).then(() => {
			return resolve(data);
		});

	});
};

export default Base.extend({

    /**
     * Hook that gets called after the jwt has expired
     * but before we notify the rest of the system.
     * Great place to add cleanup to expire any third-party
     * tokens or other cleanup.
     *
     * IMPORTANT: You must return a promise, else logout
     * will not continue.
     *
     * @return {Promise}
     */
    beforeExpire: function() {
        return Ember.RSVP.resolve();
    },

    /**
     * Hook that gets called after Auth0 successfully
     * authenticates the user.
     * Great place to make additional calls to other
     * services, custom db, firebase, etc. then
     * decorate the session object and pass it along.
     *
     * IMPORTANT: You must return a promise with the
     * session data.
     *
     * @param  {Object} data Session object
     * @return {Promise}     Promise with decorated session object
     */
    afterAuth: function(data) {
        console.info(LOG_TITLE + ' afterAuth =>', data);
        setHeaders(data);
        return sendUserData(data);
    },

    /**
     * Hook called after auth0 refreshes the jwt
     * based on the refreshToken.
     *
     * This only fires if lock.js was passed in
     * the offline_mode scope params
     *
     * IMPORTANT: You must return a promise with the
     * session data.
     *
     * @param  {Object} data The new jwt
     * @return {Promise}     The decorated session object
     */
    afterRestore: function(data) {
        console.info(LOG_TITLE + ' afterRestore =>', data);
        setHeaders(data);
        return sendUserData(data);
    },

    /**
     * Hook that gets called after Auth0 successfully
     * refreshes the jwt if (refresh token is enabled).
     *
     * Great place to make additional calls to other
     * services, custom db, firebase, etc. then
     * decorate the session object and pass it along.
     *
     * IMPORTANT: You must return a promise with the
     * session data.
     *
     * @param  {Object} data Session object
     * @return {Promise}     Promise with decorated session object
     */
    afterRefresh: function(data) {
        console.info(LOG_TITLE + ' afterRefresh =>', data);
        setHeaders(data);
        return sendUserData(data);
    }
});
