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
    status: DS.attr('string')
});
