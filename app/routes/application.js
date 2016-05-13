import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {

	actions: {
		login () {

			var lockOptions = {
				//Opens the Auth0 login dialog.
				authParams: { scope: 'openid'}
			};

			//this.get('session').authenticate('simple-auth-authenticator:lock', lockOptions);
			this.get('session').authenticate('authenticator:sith-custom', lockOptions);
		},

		logout () {
			this.get('session').invalidate();
		}
	}
});
