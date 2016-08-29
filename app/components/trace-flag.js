import Ember from 'ember';

export default Ember.Component.extend({

    store: Ember.inject.service(),
    user: Ember.inject.service(),
    notify: Ember.inject.service(),

    isEditingNewTraceFlag: false,

    //
    alert: null,

    //Will be set to a list of all the debug levels in the store.
    debugLevels: null,

    //Will hold the debug level chosen by the user in the create trace flag form.
    newDebugLevel: null,

    //TODO: Make this list dynamic in case Salesforce adds to or removes from this list of logging areas.
    levelFields: Ember.A(['apexCode', 'apexProfiling', 'callout', 'database', 'validation', 'visualforce', 'workflow', 'system']),

    didReceiveAttrs() {
        let debugLevels = this.get('store').peekAll('debug-level');
        this.set('debugLevels', debugLevels);
    },

    //Fired after every render of this component.
    didRender() {
        this.$('[data-toggle="tooltip"]').tooltip({
            delay: {
                show: 300,
                hide: 100
            }
        });
    },

    //Fired when this component is about to be removed from the DOM.
    willDestroyElement() {
        this.$('[data-toggle="tooltip"]').tooltip('destroy');
    },

    actions: {

        updateTraceFlag(traceFlag, hours) {

            let notify = this.get('notify');

            traceFlag.setProperties({
                'startDate': moment().format(),
                'expirationDate': moment().add(hours, 'hours').format()
            });

            traceFlag.save().then(result => {

                console.info('updating trace flag result =>', result);
                notify.success('TraceFlag successfully updated');

            }).catch(error => {

                traceFlag.rollbackAttributes();
                notify.error('Failed to update TraceFlag');
                console.error('failed to update trace flag =>', error);

            });
        },

        editNewTraceFlag() {
            this.toggleProperty('isEditingNewTraceFlag');
        },

        cancelNewTraceFlag() {
            this.toggleProperty('isEditingNewTraceFlag');
        },

        setDebugLevel(debugLevel) {
            this.set('newDebugLevel', debugLevel);
            this.$('#debugLevelInput').val(debugLevel.get('developerName'));
        },

        saveNewTraceFlag(hours) {

            let notify = this.get('notify');
            let startDate = moment().format();
            let expirationDate = moment().add(hours, 'hours').format();

            let debugLevel = this.get('newDebugLevel');

            //Hide the trace flag form during the save.
            this.toggleProperty('isEditingNewTraceFlag');

            let newTraceFlag = this.get('store').createRecord('trace-flag', {
                logType: 'USER_DEBUG',
                tracedEntityId: this.get('user.id'),
                startDate,
                expirationDate,
                debugLevelId: debugLevel.id,
                debugLevel
            });

            this.get('create')(newTraceFlag);

            newTraceFlag.save().then(result => {

                console.info(result);
                notify.success('TraceFlag successfully created');

            }).catch(error => {

                console.error('Error creating new trace flag =>', error);

                //Will delete this new trace flag from the store because isNew === true
                newTraceFlag.rollbackAttributes();

                //Re-enable the form so the user can try again.
                this.toggleProperty('isEditingNewTraceFlag');

                notify.error('Failed to create TraceFlag');

            });
        },

        deleteTraceFlag(traceFlag) {

            let notify = this.get('notify');

            //Will send a delete request to the server.
            traceFlag.destroyRecord().then(result => {
                console.info('delete result', result);
                notify.success('TraceFlag successfully deleted');
            }).catch(error => {
                console.error(error);
                notify.error('Unable to delete TraceFlag');
            });
        },

        closeAlert() {
            this.set('alert', null);
        }
    }

});
