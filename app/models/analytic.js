import DS from 'ember-data';

export default DS.Model.extend({
    className: DS.attr('string'),
    executionTime: DS.attr('number'),
    isTest: DS.attr('boolean'),
    scope: DS.attr('string'),

    apexTestResult: DS.belongsTo('apex-test-result'),

    createdDate: new Date()
});
