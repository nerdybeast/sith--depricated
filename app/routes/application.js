import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {

	actions: {
		login () {

			var lockOptions = {
				//Opens the Auth0 login dialog.
				authParams: { scope: 'openid'}
			};

			/**
			 * We are using our own custom authenticator here because we need to extract data from the authentication responses.
			 * This replaces the default Auth0 authenticator which is used by stating:
			 * this.get('session').authenticate('simple-auth-authenticator:lock', lockOptions);
			 */
			this.get('session').authenticate('authenticator:sith-custom', lockOptions);
		},

		logout () {
			this.get('session').invalidate();
		}
	}
});
