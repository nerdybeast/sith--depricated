import Ember from 'ember';

export function momentDate(params) {
    let actualDate = params[0];
    let format = params[1];
    return moment(actualDate).format(format);
}

export default Ember.Helper.helper(momentDate);
