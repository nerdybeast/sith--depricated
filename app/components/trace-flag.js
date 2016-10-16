import Ember from 'ember';
import config from 'sith/config/environment';

export default Ember.Component.extend({

    store: Ember.inject.service(),
    user: Ember.inject.service(),
    notify: Ember.inject.service(),
    io: Ember.inject.service('socket-io'),

    isEditingNewTraceFlag: false,

    //Will be set to a list of all the debug levels in the store.
    debugLevels: null,

    //Will hold the debug level chosen by the user in the create trace flag form.
    newDebugLevel: null,

    //Used to determine if a test run is executing when this trace flag component is rendered. Used to
    //prevent the user from manipulating their traceflags during the test run which could affect analytics collecting.
    asyncApexJobs: null,

    activeAsyncApexJobs: Ember.computed.filterBy('asyncApexJobs', 'status', 'Processing'),

    //Used to disabled the ability to manipulate trace flags during a test run.
    testsExecuting: Ember.computed.notEmpty('activeAsyncApexJobs'),

    init() {

        //Make sure Ember is able to do important setup work (if any);
        this._super(...arguments);

        let io = this.get('io').socketFor(`${config.APP.apiDomain}/`);

        io.on('connect', () => {

            console.log('io.on(connect) fired in trace-flag component');

            io.emit('initialize-traceflag-tracking', this.get('user.socketProfile'), (socketNamespace) => {

                console.log(`trace-flag component socketNamespace => ${socketNamespace}`);

                let traceFlagSocket = this.get('io').socketFor(`${config.APP.apiDomain}/${socketNamespace}`);
                traceFlagSocket.on('trace-flag-update', this.onTraceFlagUpdate, this);
            });
        });
    },

    //DEFAULT EMBER HOOK
    didReceiveAttrs() {
        let store = this.get('store');
        this.set('debugLevels', store.peekAll('debug-level'));
        this.set('asyncApexJobs', store.peekAll('async-apex-job'));
    },

    //Fired after every render/re-render of this component, primarily used for DOM manipulation.
    //DEFAULT EMBER HOOK
    didRender() {
        this.$('[data-toggle="tooltip"]').tooltip({
            delay: {
                show: 300,
                hide: 100
            }
        });
    },

    //Fired when this component is about to be removed from the DOM.
    //DEFAULT EMBER HOOK
    willDestroyElement() {
        this.$('[data-toggle="tooltip"]').tooltip('destroy');
    },

    //Fired by socket-io.
    onTraceFlagUpdate(traceFlags) {
        //See the hbs template where each trace-flag component is defined to see what parent action 'update' is bound to.
        this.get('update')(traceFlags);
    },

    actions: {

        updateTraceFlag(traceFlag, hours) {

            let notify = this.get('notify');

            if(this.get('testsExecuting')) {
                notify.error('cannot update trace flags during test execution');
                return;
            }

            traceFlag.setProperties({
                'startDate': moment().format(),
                'expirationDate': moment().add(hours, 'hours').format()
            });

            traceFlag.save().then(result => {

                console.info('updating trace flag result =>', result);
                notify.success('trace flag updated');

            }).catch(ex => {

                traceFlag.rollbackAttributes();

                ex.errors.forEach(error => notify.error({ html: `<h4>${error.title}</h4><div>${error.detail}</div>` }));
                console.error('failed to update trace flag =>', ex);
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

            if(this.get('testsExecuting')) {
                notify.error('cannot create trace flags during test execution');
                return;
            }

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

            if(this.get('testsExecuting') && traceFlag.get('debugLevel.developerName') === 'APEX_ANALYTICS') {
                notify.error('cannot delete the APEX_ANALYTICS trace flag while tests are running');
                return;
            }

            //Will send a delete request to the server and automatically update the store.
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
                notify.success(`trace flags refreshed, found ${traceFlags.get('length')}`);
            }).catch(error => {
                notify.error(error.message);
            }).finally(() => {
                refreshIcon.removeClass(animateClasses);
            });
        }
    }

});
