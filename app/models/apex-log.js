import DS from 'ember-data';

//https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_apexlog.htm
export default DS.Model.extend({
    application: DS.attr('string'),
    durationMilliseconds: DS.attr('number'),
    location: DS.attr('string'),
    logLength: DS.attr('number'),
    logUserId: DS.attr('string'),
    operation: DS.attr('string'),
    request: DS.attr('string'),
    startTime: DS.attr('date'),
    status: DS.attr('string'),

    apexTestResults: DS.hasMany('apex-test-result')
});
