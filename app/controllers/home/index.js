import Ember from 'ember';
import config from 'sith/config/environment';

export default Ember.Controller.extend({

    io: Ember.inject.service('socket-io'),

    //Inject the controllers/home.js into this controller.
    homeController: Ember.inject.controller('home'),

	//Default ember hook that we are overriding to instantiate sokct.io
	//See: http://emberjs.com/api/classes/Ember.Controller.html#method_init
	init: function() {
		this._super(...arguments);

		//Because our socket is running on the same server as our api, we only need to provide the domain and socket.io figures out the rest.
        let socket = this.get('io').socketFor(`${config.APP.apiDomain}/`);

        //Will fire when we make a connection to the socket.io instance running on the server.
		socket.on('connect', () => {
			console.info('Socket connected!');

            socket.on('debug-from-server', this.onDebugFromServer, this);
            socket.on('test-status', this.onTestStatus, this);
            socket.on('process-test-results', this.onProcessTestResults, this);
            socket.on('analytics', this.onAnalytics, this);
		});
	},

    //Our api adds an "id" property to the api versions response from Salesforce and we simply copy the version number
    //to the id field (this makes ember data happy) and we get an integer value for the version instead of a string value returned by salesforce.
    orgVersions: Ember.computed.mapBy('model.apiVersions', 'id'),

    //"orgVersions" will be an array of integers, this simply grabs the largest one.
    currentMaxOrgVersion: Ember.computed.max('orgVersions'),

    //"orgVersions" will be an array of integers, this simply grabs the smallest one.
    currentMinOrgVersion: Ember.computed.min('orgVersions'),

    //A simple filter to show all test classes.
    testClasses: Ember.computed.filterBy('model.classes', 'isTestClass', true),

    //A simple filter that holds all of the classes that have been selected for a test run.
    selectedForTestRun: Ember.computed.filterBy('model.classes', 'selected', true),

    //
    loadingTestRun: false,

    //
    dailyApiUsage: Ember.computed('model.orgLimits.DailyApiRequests.{Max,Remaining}', function() {
        let dailyApiRequests = this.get('model.orgLimits.DailyApiRequests');
        let used = dailyApiRequests.Max - dailyApiRequests.Remaining;
        let percentageUsed = Number(Math.round((used / dailyApiRequests.Max) + "e+2")  + "e-2") * 100;
        return `${percentageUsed}% (${used}/${dailyApiRequests.Max})`;
    }),

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

            this.toggleProperty('loadingTestRun');

            Ember.$.ajax({
                method: 'POST',
                url: `${config.APP.apiDomain}/api/run-tests`,
                headers: {

                    //Tell the api that we want a json api doc response instead of a traditional json response.
                    'Accept': 'application/vnd.api+json',

                    //Tell the api that we are sending standard json in the body of this request.
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({ data })
            }).done((response) => {

                /**
                 * Using .pushPayload() here instead of .push() because the response here is in a traditional json api doc format and the push method
                 * requires data to be in a slightly altered format. pushPayload here will use the default application serializer (serializers/application.js)
                 * to put this data in the store without having to manipulate here on the fly or change our api to return a non-standard json api doc.
                 */
                this.store.pushPayload(response);

                /**
                 * TODO: Need to rethink how to create these relationships without looping through ALL the records in the store.
                 * This is really inefficient and could be cleaned up.
                 */
                this.store.peekAll('apex-test-queue-item').forEach(record => {

                    record.set('apexClass', this.store.peekRecord('class', record.get('apexClassId')));

                    //This async-apex-job record will have just been loaded into the store in the .pushPayload() call above.
                    record.set('parentJob', this.store.peekRecord('async-apex-job', record.get('parentJobId')));
                });

                this.store.peekAll('async-apex-job').forEach(record => {
                    record.set('apexClass', this.store.peekRecord('class', record.get('apexClassId')));
                });

            }).fail((data) => {
                console.error(data);
            }).always(() => {
                this.toggleProperty('loadingTestRun');
            });
        }
    },

    onDebugFromServer(msg) {
        console.info('onDebugFromServer =>', msg);
    },

    //TODO: The logic in this method needs to be moved to either the api or a reuseable method.
    onTestStatus(msg) {
        console.info('onTestStatus =>', msg);

        let type = msg.sobjectType.dasherize();

        let data = msg.records.map(record => {
            return this.basicJsonApiDocFromSobject(type, record);
        });

        this.store.push({ data });
    },

    /**
     *
     * @param  {object} data - This is expected to be a standard json api document.
     * @return {void}
     */
    onProcessTestResults(data) {

        console.info('onProcessTestResults =>', data);

        this.store.pushPayload(data);

        this.store.peekAll('apex-test-result').forEach(record => {
            record.set('apexClass', this.store.peekRecord('class', record.get('apexClassId')));
            record.set('asyncApexJob', this.store.peekRecord('async-apex-job', record.get('asyncApexJobId')));
            record.set('queueItem', this.store.peekRecord('apex-test-queue-item', record.get('queueItemId')));
        });

        this.store.peekAll('async-apex-job').forEach(record => {
            record.set('apexClass', this.store.peekRecord('class', record.get('apexClassId')));
        });
    },

    onAnalytics(msg) {
        console.info('onAnalytics =>', msg);

        let apexTestResults = this.store.peekAll('apex-test-result');

        msg.analytics.forEach(analytic => {

            let apexTestResult = apexTestResults.find(testResult => {
                return testResult.get('methodName') === analytic.scope && testResult.get('apexLogId') === msg.debugLogId;
            });

            //Tack on the associated ApexTextResult record.
            analytic.apexTestResult = apexTestResult;

            this.store.createRecord('analytic', analytic);
        });
    },

    basicJsonApiDocFromSobject(type, record) {
        let id = record.id;
        delete record.id;
        delete record.attributes;
        return { id, type, attributes: record };
    }
});
