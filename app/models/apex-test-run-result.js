/**
 * https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/sforce_api_objects_apextestrunresult.htm
 */

import DS from 'ember-data';

export default DS.Model.extend({
    asyncApexJobId: DS.attr('string'),
    classesCompleted: DS.attr('number'),
    classesEnqueued: DS.attr('number'),
    endTime: DS.attr('date'),
    isAllTests: DS.attr('boolean'),
    jobName: DS.attr('string'),
    source: DS.attr('string'),
    startTime: DS.attr('date'),
    status: DS.attr('string'),
    testTime: DS.attr('number'),
    userId: DS.attr('string'),

    asyncApexJob: DS.belongsTo('async-apex-job')
});
