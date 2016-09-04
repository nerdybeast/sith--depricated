import Ember from 'ember';
import config from 'sith/config/environment';

export default Ember.Component.extend({

    user: Ember.inject.service(),

    //Inject the socket.io service into this controller.
    io: Ember.inject.service('socket-io'),

    //
    mainSocket: Ember.computed('io', function() {
        return this.get('io').socketFor(`${config.APP.apiDomain}/`);
    }),

    dashboardSocket: null,

    socketStatus: null,

    //Default ember hook that we are overriding to instantiate socket.io
	//See: http://emberjs.com/api/classes/Ember.Controller.html#method_init
    init() {

        //Make sure Ember is able to do important setup work (if any);
        this._super(...arguments);

        if(this.get('model') === undefined) {
            Ember.assert('A "model" property must be set when creating an instance of the "org-limit-watch" component, ex: {{org-limit-watch model=some.value}}');
        }

        let mainSocket = this.get('mainSocket');

        mainSocket.on('connect', () => {

            //NOTE: "this" in this context of the socket connection is undefined (even if using function() instead of the above lexical arrow function),
            //no way to get the socket id unless we ask the server for it.

            console.info('mainSocket connected in the org-limit-watch component.');

            if(!this.get('dashboardSocket')) {

                mainSocket.emit('initialize-dashboard', this.get('user.profile'), (socketNamespace) => {

                    console.info('initialize-dashboard response =>', socketNamespace);

                    let dashboardSocket = this.get('io').socketFor(`${config.APP.apiDomain}/${socketNamespace}`);

                    dashboardSocket.on('connect', () => this.set('socketStatus', 'connected'));
                    dashboardSocket.on('reconnecting', () => this.set('socketStatus', 'connecting'));
                    dashboardSocket.on('reconnect_error', () => this.set('socketStatus', 'disconnected'));
                    dashboardSocket.on('reconnect', this.dashboardReconnect, this);
                    dashboardSocket.on('org-limits-update', this.orgLimitsUpdate, this);

                    this.set('dashboardSocket', dashboardSocket);
                });
            }
        });

        mainSocket.on('reconnecting', (attemptCount) => console.warn(`mainSocket trying to reconnect, attempt number ${attemptCount}`));
        mainSocket.on('reconnect', (attemptCount) => console.info(`mainSocket reconnected on attempt number ${attemptCount}`));
        mainSocket.on('reconnect_error', (error) => console.error(`mainSocket unable to reconnect => ${error.message}`));
	},

    //Default Ember hook
    willDestroyElement() {
        let dashboardSocket = this.get('dashboardSocket');
        dashboardSocket.off('org-limits-update', this.orgLimitsUpdate);
    },

    modelPretty: Ember.computed('model', function() {

        let data = [];

        _.forEach(this.get('model'), (val, key) => {

            let name = key.dasherize().split('-').map(word => word.capitalize()).join(' ');
            let used = val.Max - val.Remaining;
            let percentageUsed = Number(Math.floor((used / val.Max) + "e+2"));

            //Will be true if the percentage is too samll of a number to run Math.floor() on, example:
            //percentageUsed => 9.777777777777778e-7
            if(isNaN(percentageUsed)) {
                percentageUsed = 0;
            }

            let value = `${percentageUsed}% (${used} / ${val.Max})`;

            data.push({ name, value });
        });

        return data;
    }),

    orgLimitsUpdate(message) {
        this.sendAction('update', Ember.Object.create(message));
    },

    dashboardReconnect() {
        this.set('socketStatus', 'connected');
        this.get('mainSocket').emit('initialize-dashboard', this.get('user.profile'));
    }
});
