import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    
    model() {
        
        var classes = this.store.findAll('class');
        var apiVersions = this.store.findAll('org-api-version');
        
        return Ember.RSVP.hash({classes, apiVersions});
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