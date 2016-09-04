import Ember from 'ember';
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

    //DebugLevel record id
    debugLevelId: DS.attr('string'),

    //The type of log to generate, most likely will be "USER_DEBUG"
    logType: DS.attr('string'),

    startDate: DS.attr('string'),
    expirationDate: DS.attr('string'),

    //User being traced
    tracedEntityId: DS.attr('string'),

    debugLevel: DS.belongsTo('debug-level'),

    loggingLevelsHtml: Ember.computed('debugLevel', function() {
        let debugLevel = this.get('debugLevel');
        return debugLevel.get('levels').map(level => {
            return `
                <div class="row">
                    <div class="col-xs-6">${level.title}: </div>
                    <div class="col-xs-6">${debugLevel.get(level.name)}</div>
                </div>
            `;
        }).join('');
    })
});
