import Ember from 'ember';

export default Ember.Service.extend({

    session: Ember.inject.service(),

    profile: Ember.computed.alias('session.data.authenticated.profile'),

    id: Ember.computed('profile', function() {
        return this.get('profile.identities')[0].user_id;
    }),

    sessionId: Ember.computed.alias('profile.session_id'),
    instanceUrl: Ember.computed.alias('profile.instance_url'),
    username: Ember.computed.alias('profile.username'),
    orgId: Ember.computed.alias('profile.organization_id'),

    socketProfile: Ember.computed('id', 'sessionId', 'instanceUrl', 'username', 'orgId', function() {
        return this.getProperties('id', 'sessionId', 'instanceUrl', 'username', 'orgId');
    })
});
