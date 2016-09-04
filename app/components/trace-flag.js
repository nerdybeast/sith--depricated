import Ember from 'ember';

export default Ember.Component.extend({

    store: Ember.inject.service(),
    user: Ember.inject.service(),
    notify: Ember.inject.service(),

    isEditingNewTraceFlag: false,

    //Will be set to a list of all the debug levels in the store.
    debugLevels: null,

    //Will hold the debug level chosen by the user in the create trace flag form.
    newDebugLevel: null,

    didReceiveAttrs() {
        let debugLevels = this.get('store').peekAll('debug-level');
        this.set('debugLevels', debugLevels);
    },

    //Fired after every render/re-render of this component.
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
                notify.success('trace flag updated');

            }).catch(error => {

                traceFlag.rollbackAttributes();
                notify.error('failed to update trace flag');
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
            let debugLevel = this.get('newDebugLevel');

            if(!debugLevel) {
                notify.error('no debug level chosen');
                return;
            }

            //Hide the trace flag form during the save.
            this.toggleProperty('isEditingNewTraceFlag');

            let newTraceFlag = this.get('store').createRecord('trace-flag', {
                logType: 'USER_DEBUG',
                tracedEntityId: this.get('user.id'),
                startDate: moment().format(),
                expirationDate: moment().add(hours, 'hours').format(),
                debugLevelId: debugLevel.id,
                debugLevel
            });

            //NOTE: This "create" function is defined in the .hbs template that includes this trace-flag component.
            this.get('create')(newTraceFlag);

            newTraceFlag.save().then(result => {

                console.info(result);
                notify.success('trace flag created');

            }).catch(error => {

                console.error('Error creating new trace flag =>', error);

                //Will delete this new trace flag from the store because isNew === true
                newTraceFlag.rollbackAttributes();

                //Re-enable the form so the user can try again.
                this.toggleProperty('isEditingNewTraceFlag');

                notify.error('failed to create trace flag');

            });
        },

        deleteTraceFlag(traceFlag) {

            let notify = this.get('notify');

            //Will send a delete request to the server.
            traceFlag.destroyRecord().then(result => {
                console.info('delete result', result);
                notify.success('trace flag successfully deleted');
            }).catch(error => {
                console.error(error);
                notify.error('unable to delete trace flag');
            });
        },

        reloadTraceFlags() {

            let notify = this.get('notify');
            let refreshIcon = this.$('#TraceFlagReload');
            let animateClasses = 'glyphicon-animate-spin-fast text-success';

            refreshIcon.addClass(animateClasses);
            let reloadPromise = this.get('reload')();

            reloadPromise.then(traceFlags => {

                let count = traceFlags.get('length');

                notify.success('trace flags refreshed');
                notify.info(`${count} trace flag${count !== 1 ? 's' : ''} found`);

            }).catch(error => {
                notify.error(error.message);
            }).finally(() => {
                refreshIcon.removeClass(animateClasses);
            });
        }
    }

});
