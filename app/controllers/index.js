import Ember from 'ember';

export default Ember.Controller.extend({

    isAuthenticating: false,

    actions: {

        login() {

            this.toggleProperty('isAuthenticating');

            let attempts = 0;

            /**
             * The auth0 lock dialog doesn't have a hook for when it's closed manually by the user so
             * here we are hacking the crap out of it to find that close button. Also, we don't know when the lock dialog
             * will initially load so we are going to run this function in a loop until it's found.
             */
            let findCloseAnchor = () => {

                let closeAnchor = Ember.$('.a0-lock-container a.a0-close');

                //Will be true when we finally find the close button.
                if(closeAnchor.length > 0) {

                    //Attaching a click handler that will stop the page loader from showing, bringing the user back to the login button.
                    closeAnchor.click(() => this.toggleProperty('isAuthenticating'));

                    return;
                }

                //Prevents an infinite loop.
                if(attempts <= 50) {
                    attempts++;
                    setTimeout(findCloseAnchor, 100);
                }
            };

            findCloseAnchor();

            //Returning true will allow this action to bubble up to the application route's action hash.
            //This is where the actual authentication occurs.
            return true;
		}
	}
});
