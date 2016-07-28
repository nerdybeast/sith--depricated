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

    //TODO: Make this dynamic, possibly with another component...
    loggingLevelsHtml: Ember.computed('debugLevel', function() {
        let debugLevel = this.get('debugLevel');
        return `
            <div class="row">
                <div class="col-xs-6">ApexCode: </div><div class="col-xs-6">${debugLevel.get('apexCode')}</div>
            </div>
            <div class="row">
                <div class="col-xs-6">ApexProfiling: </div><div class="col-xs-6">${debugLevel.get('apexProfiling')}</div>
            </div>
            <div class="row">
                <div class="col-xs-6">Callout: </div><div class="col-xs-6">${debugLevel.get('callout')}</div>
            </div>
            <div class="row">
                <div class="col-xs-6">Database: </div><div class="col-xs-6">${debugLevel.get('database')}</div>
            </div>
            <div class="row">
                <div class="col-xs-6">Validation: </div><div class="col-xs-6">${debugLevel.get('validation')}</div>
            </div>
            <div class="row">
                <div class="col-xs-6">Workflow: </div><div class="col-xs-6">${debugLevel.get('workflow')}</div>
            </div>
            <div class="row">
                <div class="col-xs-6">System: </div><div class="col-xs-6">${debugLevel.get('system')}</div>
            </div>
        `;
    })
});
