import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import config from 'sith/config/environment';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

    session: Ember.inject.service(),
    profile: Ember.computed.alias('session.data.authenticated.profile'),

    model() {

        let user = this.get('profile.identities')[0].user_id;

        let apiVersions = this.store.findAll('org-api-version');
        let debugLevels = this.store.findAll('debug-level');
        let dashboard = Ember.$.getJSON(`${config.APP.apiDomain}/api/dashboard`);
        let traceFlags = this.store.query('trace-flag', { user });

        return Ember.RSVP.hash({ apiVersions, debugLevels, dashboard, traceFlags }).then((hash) => {

            //Turn the orgLimits property into an Ember Object so that we can observe changes.
            hash.orgLimits = Ember.Object.create(hash.dashboard.orgLimits);

            delete hash.dashboard;

            hash.traceFlags.forEach(flag => {
                let debugLevel = this.store.peekRecord('debug-level', flag.get('debugLevelId'));
                flag.set('debugLevel', debugLevel);
            });

            return hash;
        });
    },

    actions: {

        error(modelHookError) {

            modelHookError.title = 'An error has occurred';

            //Return true to bubble this error up to parent routes. Any modification made to the modelHookError
            //object will be bubbled up as well.
            return true;
        }
    }
});
