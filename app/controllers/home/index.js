import Ember from 'ember';
import config from 'sith/config/environment';

export default Ember.Controller.extend({
    
    io: Ember.inject.service('socket-io'),
	
	//Default ember hook that we are overriding to instantiate sokct.io
	//See: http://emberjs.com/api/classes/Ember.Controller.html#method_init
	init: function() {
		this._super(...arguments);
		
		//Because our socket is running on the same server as our api, we only need to provide the domain and socket.io figures out the rest.
        let socket = this.get('io').socketFor(`${config.APP.apiDomain}/`);
		
        //Will fire when we make a connection to the socket.io instance running on the server.
		socket.on('connect', () => {
			console.info('Socket connected!');
			
            socket.on('debug-from-server', this.onDebugFromServer);
		});
	},
    
    //Inject the controllers/home.js into this controller.
    homeController: Ember.inject.controller('home'),
    
    //Our api adds an "id" property to the api versions response from Salesforce and we simply copy the version number
    //to the id field (this makes ember data happy) and we get an integer value for the version instead of a string value returned by salesforce. 
    orgVersions: Ember.computed.mapBy('model.apiVersions', 'id'),
    
    //"orgVersions" will be an array of integers, this simply grabs the largest one.
    currentOrgVersion: Ember.computed.max('orgVersions'),
    
    //A simple filter to show all test classes.
    testClasses: Ember.computed.filterBy('model.classes', 'isTestClass', true),
    
    //
    selectedForTestRun: Ember.computed.filterBy('model.classes', 'selected', true),
    
    actions: {
        
        startTestRun() {
            console.info('Classes selected:', this.get('selectedForTestRun'));
            
            let classes = this.get('selectedForTestRun');
            
            if(classes.length === 0) {
                return;
            }
            
            let data = {
                userId: this.get('homeController.userId'),
                
                //Extract an array of just the ids for the classes that have been selected.
                classIds: classes.mapBy('id')
            };
            
            Ember.$.ajax({
                method: 'POST',
                url: `${config.APP.apiDomain}/api/run-tests`,
                headers: {
                    //Tell the api that we want a traditional json response instead of a json api doc.
                    'Accept': 'application/json',
                    
                    //Tell the api that we are sending standard json in the body of this request.
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({ data })
            }).done((response) => {
                
                response.forEach((item) => {
                     
                    item.apexClass = this.store.peekRecord('class', item.apexClassId);
                    this.store.createRecord('apex-test-queue-item', item);
                });
                
            }).fail(function(data) {
                console.error(data);
            }).always(function() {
                
            });
        }
    },
    
    onDebugFromServer: function(data) {
        console.info('onDebugFromServer =>', data);
    }
});
