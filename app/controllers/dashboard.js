import Ember from 'ember';

export default Ember.Controller.extend({

    user: Ember.inject.service(),
    notify: Ember.inject.service(),

    orgLimitUpdateCount: 0,

    updateTraceFlags(traceFlags) {

        let notify = this.get('notify');

        //Get all the trace flags currently sitting in the store.
        let existingTraceFlags = this.store.peekAll('trace-flag');

        let newTraceFlagIds = traceFlags.data.mapBy('id');

        //Filter out all the trace flags that are sitting in the store that no longer exist in Salesforce and delete them from the store.
        let traceFlagsToBeDeleted = existingTraceFlags.filter(flag => !_.includes(newTraceFlagIds, flag.get('id')));
        traceFlagsToBeDeleted.forEach(flag => {
            notify.info(`trace flag ${flag.get('id')} deleted remotely`);
            this.store.unloadRecord(flag);
        });

        //Now that the uneeded trace flags have been deleted from the store, we can push in the new ones.
        this.store.pushPayload(traceFlags);

        traceFlags = this.store.peekAll('trace-flag');

        traceFlags.forEach(flag => {
            let debugLevel = this.store.peekRecord('debug-level', flag.get('debugLevelId'));
            flag.set('debugLevel', debugLevel);
        });

        this.set('model.traceFlags', traceFlags);

        return traceFlags;
    },

    actions: {

        updateOrgApiLimits(currentLimits) {
            this.set('model.orgLimits', currentLimits);
            this.incrementProperty('orgLimitUpdateCount');

            if(this.get('orgLimitUpdateCount') >= 10) {
                this.send('pushOrgLimitsToStore', currentLimits);
                this.set('orgLimitUpdateCount', 0);
            }
        },

        pushOrgLimitsToStore(currentLimits) {

            //Will convert all the top level keys of this object to camelCase (does not recurse down into nested properties).
            currentLimits = _.mapKeys(currentLimits, (val, key) => {
                return key.camelize();
            });

            this.store.createRecord('org-limit', currentLimits);
        },

        onTraceFlagCreate() {
            this.set('model.traceFlags', this.store.peekAll('trace-flag'));
        },

        onTraceFlagUpdate(traceFlags) {
            return this.updateTraceFlags(traceFlags);
        },

        onTraceFlagReload() {

            let user = this.get('user.id');

            //Will get all the trace flags for the current user from Salesforce.
            return this.store.query('trace-flag', { user }).then(traceFlags => {
                return this.updateTraceFlags(traceFlags);
            });
        }
    }
});
