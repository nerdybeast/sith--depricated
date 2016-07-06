import Ember from 'ember';
import config from 'sith/config/environment';

export default Ember.Component.extend({

    session: Ember.inject.service(),

    //Inject the socket.io service into this controller.
    io: Ember.inject.service('socket-io'),

    profile: Ember.computed.alias('session.data.authenticated.profile'),

    //
    mainSocket: Ember.computed('io', function() {
        return this.get('io').socketFor(`${config.APP.apiDomain}/`);
    }),

    dashboardSocketNamespace: null,

    //Default ember hook that we are overriding to instantiate sokct.io
	//See: http://emberjs.com/api/classes/Ember.Controller.html#method_init
    init() {

        //Make sure Ember is able to do important setup work (if any);
        this._super(...arguments);

        if(this.get('model') === undefined) {
            Ember.assert('A "model" property must be set when creating an instance of the "org-limit-watch" component, ex: {{org-limit-watch model=some.value}}');
        }

        let mainSocket = this.get('mainSocket');

        mainSocket.on('connect', () => {

            //NOTE: "this" in this context of the socket connection is undefined (even if using function() instead of the above arrow function),
            //no way to get the socket id unless we ask the server for it.

            console.info('mainSocket connected in the org-limit-watch component.');

            //NOTE: We are nesting this .emit() inside of the main socket connect because if the server is restarted, the "connect" event
            //will automatically fire again without having to refresh the page. If this happens we want to automaticaly restart our dashboard stats.
            mainSocket.emit('initialize-dashboard', this.get('profile.username'), (response) => {

                console.info('initialize-dashboard response =>', response);
                this.set('dashboardSocketNamespace', response.socketNamespace);

                //Here we are letting the server tell us what socket namespace to use.
                let orgLimitsSocket = this.get('io').socketFor(`${config.APP.apiDomain}/${response.socketNamespace}`);

                //TODO: Figure out why this is firing twice...
                orgLimitsSocket.on('connect', () => {
                    console.info('org-limit-socket connected');
                });

                orgLimitsSocket.on('org-limits-update', this.orgLimitsUpdate, this);
            });
        });
	},

    //Default Ember hook
    willDestroyElement() {
        console.log('willDestroyElement');

        let dashboardSocketNamespace = this.get('dashboardSocketNamespace');
        console.log('dashboardSocketNamespace =>', dashboardSocketNamespace);

        let orgLimitsSocket = this.get('io').socketFor(`${config.APP.apiDomain}/${dashboardSocketNamespace}`);
        orgLimitsSocket.off('org-limits-update', this.orgLimitsUpdate, this);
    },

    // dailyApiUsage: Ember.computed('model', function() {
    //     let dailyApiRequests = this.get('model.DailyApiRequests');
    //     let used = dailyApiRequests.Max - dailyApiRequests.Remaining;
    //     let percentageUsed = Number(Math.round((used / dailyApiRequests.Max) + "e+2")  + "e-2") * 100;
    //     return `${percentageUsed}% (${used}/${dailyApiRequests.Max})`;
    // }),

    modelPretty: Ember.computed('model', function() {

        let data = [];

        _.forEach(this.get('model'), (val, key) => {

            let name = key.dasherize().split('-').map(word => word.capitalize()).join(' ');

            let used = val.Max - val.Remaining;
            let percentageUsed = Number(Math.round((used / val.Max) + "e+2")  + "e-2") * 100;
            let value = `${percentageUsed}% (${used}/${val.Max})`;

            data.push({ name, value });
        });

        return data;
    }),

    orgLimitsUpdate(message) {
        this.sendAction('update', Ember.Object.create(message));
    }

});
