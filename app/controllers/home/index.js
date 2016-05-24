import Ember from 'ember';
import config from 'sith/config/environment';

export default Ember.Controller.extend({
    
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
                    
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({ data })
            }).done((response) => {
                response.forEach((item) => {
                    this.store.createRecord('apex-test-queue-item', item);
                });
            }).fail(function(data) {
                console.error(data);
            }).always(function() {
                
            });
        }
    }
});
