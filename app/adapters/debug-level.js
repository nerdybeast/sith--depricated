import ApplicationAdapter from './application';

//NOTE: This inherets from our default application adapter and the host is already set there.
export default ApplicationAdapter.extend({

    //Here we are overriding the namespace that is set in the application.js adapter.
    namespace: 'api/sobjects'
});
