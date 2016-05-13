/**
 * Since this is the application adapter, we are setting "default" values that all requests through ember-data will use
 * unless overriden by model specific adapter.
 */

import JSONAPIAdapter from 'ember-data/adapters/json-api';
import config from '../config/environment';

export default JSONAPIAdapter.extend({
    host: config.APP.apiDomain,
	namespace: 'api'
});