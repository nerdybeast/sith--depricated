import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    actions: {
        
        //Default Ember hook that fires if the model hook in this route returns a rejected promise.
        error(modelHookError, transition) {
            console.error('route/home model error =>', modelHookError);
            console.error('route/home transition =>', transition);
            
            /**
             * We must return true here in order to bubble this error up to the application route which is the root route
             * of this application. That is where we are globally catching errors for Google Analytics and in order for any
             * child routes to fully transition into their "-error" route, this error needs to bubble all the way up. 
             */
            return true;
        }
    }
});
