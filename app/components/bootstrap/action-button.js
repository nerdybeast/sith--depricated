import Ember from 'ember';

export default Ember.Component.extend({

    notify: Ember.inject.service(),

    tagName: 'button',
    classNames: ['btn'],
    classNameBindings: ['color'],
    attributeBindings: ['disabled'],

    level: 'default',
    buttonText: null,
    pending: false,
    pendingText: 'Loading...',

    color: Ember.computed('level', function() {
        return `btn-${this.get('level')}`;
    }),

    //If this returns null, the disabled attribute wont be rendered on the button.
    disabled: Ember.computed('pending', function() {
        return this.get('pending') || null;
    }),

    //Built in event handler: https://guides.emberjs.com/v2.7.0/components/handling-events/#toc_event-names
    click() {

        this.set('pending', true);

        let notify = this.get('notify');
        let actionPromise = this.get('action')();

        actionPromise.then(message => {
            notify.success(message);
        }).catch(errors => {
            errors.forEach(error => notify.error({ html: error }));
        }).finally(() => {
            this.set('pending', false);
        });
    }
});
