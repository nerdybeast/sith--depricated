import DS from 'ember-data';

export default DS.Model.extend({
    className: DS.attr('string'),
    executionTime: DS.attr('number'),
    isTest: DS.attr('boolean'),
    scope: DS.attr('string'),

    //No transform is being used on these properties because they will be nested objects/arrays that
    //we don't need to create seperate models for, we want these properties to pass through as is.
    //See: http://thejsguy.com/2016/01/29/working-with-nested-data-in-ember-data-models.html
    //See: http://emberjs.com/api/data/classes/DS.html#method_attr
    limits: DS.attr(),
    parameters: DS.attr(),

    class: DS.belongsTo('class'),
    apexTestResult: DS.belongsTo('apex-test-result'),

    createdDate: new Date()
});
