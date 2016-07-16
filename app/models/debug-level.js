import DS from 'ember-data';

export default DS.Model.extend({

    //Debug levels
    apexCode: DS.attr('string'),
    apexProfiling: DS.attr('string'),
    callout: DS.attr('string'),
    database: DS.attr('string'),
    validation: DS.attr('string'),
    visualforce: DS.attr('string'),
    workflow: DS.attr('string'),
    system: DS.attr('string'),

    language: DS.attr('string'),

    developerName: DS.attr('string'),
    masterLabel: DS.attr('string'),

    traceFlags: DS.hasMany('trace-flag')
});
