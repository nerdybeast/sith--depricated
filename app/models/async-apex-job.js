import DS from 'ember-data';

export default DS.Model.extend({
    apexClassId: DS.attr('string'),
    completedDate: DS.attr('date'),
    extendedStatus: DS.attr('string'),
    jobItemsProcessed: DS.attr('number'),
    jobType: DS.attr('string'),
    methodName: DS.attr('string'),
    numberOfErrors: DS.attr('string'),
    status: DS.attr('string'),
    totalJobItems: DS.attr('string'),

    apexClass: DS.belongsTo('class'),
    apexTestQueueItems: DS.hasMany('apex-test-queue-item')
});
