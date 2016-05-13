import Ember from 'ember';

export default Ember.Controller.extend({
    
    //Our api adds an "id" property to the api versions response from Salesforce and we simply copy the version number
    //to the id field (this makes ember data happy) and we get an integer value for the version instead of a string value returned by salesforce. 
    orgVersions: Ember.computed.mapBy('model.apiVersions', 'id'),
    
    currentOrgVersion: Ember.computed.max('orgVersions')
});
