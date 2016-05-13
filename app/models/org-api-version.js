import DS from 'ember-data';

export default DS.Model.extend({
    label: DS.attr('string'),
    url: DS.attr('string'),
    version: DS.attr('string')
});