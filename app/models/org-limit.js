import DS from 'ember-data';

export default DS.Model.extend({
    concurrentAsyncGetReportInstances: DS.attr(),
    concurrentSyncReportRuns: DS.attr(),
    dailyApiRequests: DS.attr(),
    dailyAsyncApexExecutions: DS.attr(),
    dailyBulkApiRequests: DS.attr(),
    dailyDurableGenericStreamingApiEvents: DS.attr(),
    dailyDurableStreamingApiEvents: DS.attr(),
    dailyGenericStreamingApiEvents: DS.attr(),
    dailyStreamingApiEvents: DS.attr(),
    dailyWorkflowEmails: DS.attr(),
    dataStorageMB: DS.attr(),
    durableStreamingApiConcurrentClients: DS.attr(),
    fileStorageMB: DS.attr(),
    hourlyAsyncReportRuns: DS.attr(),
    hourlyDashboardRefreshes: DS.attr(),
    hourlyDashboardResults: DS.attr(),
    hourlyDashboardStatuses: DS.attr(),
    hourlyODataCallout: DS.attr(),
    hourlySyncReportRuns: DS.attr(),
    hourlyTimeBasedWorkflow: DS.attr(),
    massEmail: DS.attr(),
    singleEmail: DS.attr(),
    streamingApiConcurrentClients: DS.attr()
});
