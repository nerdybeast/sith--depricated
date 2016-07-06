import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        updateOrgApiLimits(currentLimits) {
            this.set('model.orgLimits', currentLimits);
        }
    }
});
