import Ember from 'ember';

export default Ember.Controller.extend({

    orgLimitUpdateCount: 0,

    //Our api adds an "id" property to the api versions response from Salesforce and we simply copy the version number
    //to the id field (this makes ember data happy) and we get an integer value for the version instead of a string value returned by salesforce.
    orgVersions: Ember.computed.mapBy('model.apiVersions', 'id'),

    //"orgVersions" will be an array of integers, this simply grabs the largest one.
    currentMaxOrgVersion: Ember.computed.max('orgVersions'),

    //"orgVersions" will be an array of integers, this simply grabs the smallest one.
    currentMinOrgVersion: Ember.computed.min('orgVersions'),

    actions: {

        updateOrgApiLimits(currentLimits) {
            this.set('model.orgLimits', currentLimits);
            this.incrementProperty('orgLimitUpdateCount');

            if(this.get('orgLimitUpdateCount') >= 10) {
                this.send('pushOrgLimitsToStore', currentLimits);
                this.set('orgLimitUpdateCount', 0);
            }
        },

        pushOrgLimitsToStore(currentLimits) {

            //Will convert all the top level keys of this object to camelCase (does not recurse down into nested properties).
            currentLimits = _.mapKeys(currentLimits, (val, key) => {
                return key.camelize();
            });

            this.store.createRecord('org-limit', currentLimits);
        }
    }
});
