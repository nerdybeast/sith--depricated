import Ember from 'ember';
import config from 'sith/config/environment';

const apiDomain = config.APP.apiDomain;

export default Ember.Component.extend({

    session: Ember.inject.service(),
    profile: Ember.computed.alias('session.data.authenticated.profile'),

    //Inject the socket.io service into this controller.
    io: Ember.inject.service('socket-io'),

    //Alias the org-limit-change socket.io namespace so that the current client doesn't pick up messages
    //that are intended for another user that is logged into a different Salesforce org.
    orgLimitChangeSocket: Ember.computed('io', function() {
        let orgId = this.get('profile.organization_id');
        return this.get('io').socketFor(`${apiDomain}/org-limit-change:${orgId}`);
    }),

    //Default ember hook that we are overriding to instantiate sokct.io
	//See: http://emberjs.com/api/classes/Ember.Controller.html#method_init
    init() {

        //Make sure Ember is able to do important setup work (if any);
        this._super(...arguments);

        if(this.get('model') === undefined) {
            Ember.assert('A "model" property must be set when creating an instance of the "org-limit-watch" component, ex: {{org-limit-watch model=some.value}}');
        }

        let orgLimitChangeSocket = this.get('orgLimitChangeSocket');

        orgLimitChangeSocket.on('connect', function() {
            //NOTE: "this" in this context is undefined, no way to get the socket id unless we ask the server for it.
        });

        orgLimitChangeSocket.on('org-limits-update', this.orgLimitsUpdate, this);
	},

    willDestroyElement() {
        console.log('willDestroyElement');
        let orgLimitChangeSocket = this.get('orgLimitChangeSocket');
        orgLimitChangeSocket.off('org-limits-update', this.orgLimitsUpdate, this);
    },

    dailyApiUsage: Ember.computed('model.DailyApiRequests.{Max,Remaining}', function() {
        let dailyApiRequests = this.get('model.DailyApiRequests');
        let used = dailyApiRequests.Max - dailyApiRequests.Remaining;
        let percentageUsed = Number(Math.round((used / dailyApiRequests.Max) + "e+2")  + "e-2") * 100;
        return `${percentageUsed}% (${used}/${dailyApiRequests.Max})`;
    }),

    orgLimitsUpdate(message) {
        this.sendAction('update', Ember.Object.create(message));
    }

});
