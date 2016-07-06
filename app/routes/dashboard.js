import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import config from 'sith/config/environment';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

    session: Ember.inject.service(),

    model() {

        return Ember.$.ajax({
            type: 'GET',
            url: `${config.APP.apiDomain}/api/dashboard`,
            contentType: 'application/json'
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
