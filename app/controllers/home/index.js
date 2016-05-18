import Ember from 'ember';

export default Ember.Controller.extend({
    
    //Our api adds an "id" property to the api versions response from Salesforce and we simply copy the version number
    //to the id field (this makes ember data happy) and we get an integer value for the version instead of a string value returned by salesforce. 
    orgVersions: Ember.computed.mapBy('model.apiVersions', 'id'),
    
    //"orgVersions" will be an array of integers, this simply grabs the largest one.
    currentOrgVersion: Ember.computed.max('orgVersions'),
    
    //A simple filter to show all test classes.
    testClasses: Ember.computed.filterBy('model.classes', 'isTestClass', true)
});
