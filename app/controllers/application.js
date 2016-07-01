import Ember from 'ember';

export default Ember.Controller.extend({
	session: Ember.inject.service(),
	profile: Ember.computed.alias('session.data.authenticated.profile')
});
