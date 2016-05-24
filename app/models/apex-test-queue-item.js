import DS from 'ember-data';

export default DS.Model.extend({
    apexClassId: DS.attr('string'),
    createdById: DS.attr('string'),
    createdDate: DS.attr('date'),
    extendedStatus: DS.attr('string'),
    parentJobId: DS.attr('string'),
    status: DS.attr('string')
});
