import Ember from 'ember';

export default Ember.Component.extend({

    apiVersions: null,
    classes: null,

    //An array of just the current org api version numbers.
    apiVersionNumbers: Ember.computed.mapBy('apiVersions', 'id'),

    //"orgVersions" will be an array of integers, this simply grabs the largest one.
    currentMaxOrgVersion: Ember.computed.max('apiVersionNumbers'),

    //"orgVersions" will be an array of integers, this simply grabs the smallest one.
    currentMinOrgVersion: Ember.computed.min('apiVersionNumbers'),

    //Gives us an array of just the classes api versions.
    classApiVersions: Ember.computed.mapBy('model.classes', 'apiVersion'),

    /**
     * Returns how many classes have the max api version allowed in the current org.
     * @type {Number}
     */
    classesAtMaxApiVersion: Ember.computed.filter('classes', function(apexClass) {
        return apexClass.get('apiVersion') === this.get('currentMaxOrgVersion');
    }),

    /**
     * Returns how many classes have their api version at the lowest supported vesion or less (unsupported).
     * @type {Number}
     */
    classesBelowMinApiVersion: Ember.computed.filter('classes', function(apexClass) {
        return apexClass.get('apiVersion') <= this.get('currentMinOrgVersion');
    })
});
