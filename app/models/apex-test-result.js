import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
    apexClassId: DS.attr('string'),
    apexLogId: DS.attr('string'),
    apexTestRunResultId: DS.attr('string'),
    asyncApexJobId: DS.attr('string'),
    message: DS.attr('string'),
    methodName: DS.attr('string'),
    outcome: DS.attr('string'),
    queueItemId: DS.attr('string'),
    runTime: DS.attr('number'),
    stackTrace: DS.attr('string'),
    testTimestamp: DS.attr('date'),

    apexClass: DS.belongsTo('class'),
    apexLog: DS.belongsTo('apex-log'),
    asyncApexJob: DS.belongsTo('async-apex-job'),
    queueItem: DS.belongsTo('apex-test-queue-item'),

    //Will be available in version 37
    //apexTestRunResult: DS.belongsTo('apex-test-run-result')

    //This list of analytics will be those whos "scope" property matches the "methodName" property on this model.
    analytics: DS.hasMany('analytic'),

    currentAnalytic: Ember.computed('analytics.[]', function() {
        return this.get('analytics').sortBy('createdDate').get('lastObject');
    })
});
