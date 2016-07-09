import Ember from 'ember';

export default Ember.Component.extend({

    //Must be set on component creation
    status: null,

    //Default Ember hook
    init() {

        //Ensures Ember does the necessary setup for this component
        this._super(...arguments);

        if(this.get('status') === undefined) {
            Ember.assert('A "status" property must be set when creating an instance of the "connection-status" component, ex: {{connection-status status=some.value}}');
        }
    },

    tagName: 'span',
    classNames: ['glyphicon'],
    classNameBindings: ['isConnecting:glyphicon-animate-spin', 'textColor', 'icon'],

    textColor: null,
    isConnecting: null,
    icon: null,

    statusObserver: Ember.observer('status', function() {

        let status = this.get('status');
        let textColor, isConnecting = false, icon;

        switch (status) {
            case 'connecting':
                textColor = 'text-warning';
                isConnecting = true;
                icon = 'glyphicon-cog';
                break;
            case 'connected':
                textColor = 'text-success';
                icon = 'glyphicon-ok';
                break;
            default:
                textColor = 'text-danger';
                icon = 'glyphicon-alert';
        }

        this.setProperties({ textColor, isConnecting, icon });
    })
});
