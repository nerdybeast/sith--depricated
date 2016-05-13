import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    apiVersion: DS.attr('number')
});
