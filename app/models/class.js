import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
    apiVersion: DS.attr('number'),
    createdById: DS.attr('string'),
    createdDate: DS.attr('date'),
    isTestClass: DS.attr('boolean'),
    isValid: DS.attr('boolean'),
    lastModifiedById: DS.attr('string'),
    lastModifiedDate: DS.attr('date'),
    lengthWithoutComments: DS.attr('number'),
    name: DS.attr('string'),
    namespacePrefix: DS.attr('string'),
    status: DS.attr('string'),

    apexTestQueueItems: DS.hasMany('apex-test-queue-item'),
    asyncApexJobs: DS.hasMany('async-apex-job'),
    analytics: DS.hasMany('analytics'),

    //Will be set to true if the current class has been selected for a test run.
    selected: null,

    //Will only fire if the length of the apexTestQueueItems array changes.
    currentQueueItem: Ember.computed('apexTestQueueItems.[]', function() {

        //The default ember sortBy only sorts in ASC order, grab the last queue item since it will be the most recent one.
        return this.get('apexTestQueueItems').sortBy('createdDate').get('lastObject');
    }),

    //Simple alias to all of the apex test results for the current class.
    apexTestResults: Ember.computed.alias('currentQueueItem.apexTestResults.[]')
});
