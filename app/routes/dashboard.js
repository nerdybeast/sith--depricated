import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import config from 'sith/config/environment';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

    session: Ember.inject.service(),

    model() {

        let apiVersions = this.store.findAll('org-api-version');
        let dashboard = Ember.$.getJSON(`${config.APP.apiDomain}/api/dashboard`);

        return Ember.RSVP.hash({ apiVersions, dashboard }).then(function(hash) {

            //Turn the orgLimits property into an Ember Object so that we can observe changes.
            hash.orgLimits = Ember.Object.create(hash.dashboard.orgLimits);

            delete hash.dashboard;

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
