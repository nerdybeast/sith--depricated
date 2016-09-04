import Ember from 'ember';

export default Ember.Controller.extend({

    user: Ember.inject.service(),
    notify: Ember.inject.service(),

    orgLimitUpdateCount: 0,

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

        onTraceFlagReload() {

            let user = this.get('user.id');

            return this.store.query('trace-flag', { user }).then(traceFlags => {

                traceFlags.forEach(flag => {
                    let debugLevel = this.store.peekRecord('debug-level', flag.get('debugLevelId'));
                    flag.set('debugLevel', debugLevel);
                });

                this.set('model.traceFlags', this.store.peekAll('trace-flag'));

                return traceFlags;
            });
        }
    }
});
