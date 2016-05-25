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
    
    //Will be set to true if the current class has been selected for a test run.
    selected: null,
    
    //@each will not only observe the apexTestQueueItems array but will also fire if any property on any item
    //in that array changes. We need this because we want to observe the status property on the apex-test-queue-item.
    testRunStatus: Ember.computed('apexTestQueueItems.@each.status', function() {
        
        //The default ember sortBy only sorts in ASC order.
        let items = this.get('apexTestQueueItems').sortBy('createdDate');
        
        //Grab the last queue item since it will be the most recent one.
        return items.get('lastObject.status');
    })
});
