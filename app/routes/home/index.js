import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import config from 'sith/config/environment';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

    model() {

        var classes = this.store.findAll('class');
        var apiVersions = this.store.findAll('org-api-version');
        var orgLimits = Ember.$.getJSON(`${config.APP.apiDomain}/api/limits`);

        return Ember.RSVP.hash({classes, apiVersions, orgLimits}).then(hash => {

            //Turn the orgLimits property into an Ember Object so that we can observe changes.
            hash.orgLimits = Ember.Object.create(hash.orgLimits);
            
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
