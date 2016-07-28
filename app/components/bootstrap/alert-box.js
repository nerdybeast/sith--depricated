import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['alert', 'alert-dismissible'],
    classNameBindings: ['severityClassName'],
    attributeBindings: ['role'],

    severityClassName: Ember.computed('model.severity', function() {
        return `alert-${this.get('model.severity')}`;
    }),

    role: 'alert',

    model: Ember.Object.create({
        severity: 'info',
        title: null,
        details: null
    }),

    didInsertElement() {
        this.$().on('closed.bs.alert', () => {
            this.get('close')();
        });
    }
});
