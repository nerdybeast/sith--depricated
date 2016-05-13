import Ember from 'ember';

export default Ember.Controller.extend({
	
	//Inject the session service into this controller
	session: Ember.inject.service(),
	
	profile: Ember.computed.alias('session.data.authenticated.profile')
});
