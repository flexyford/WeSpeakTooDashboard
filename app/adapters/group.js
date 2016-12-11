import ENV from "austin-speaks-too/config/environment";
import Ember from 'ember';
import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  query(store, type, query) {
    const url = `${this.host}/find/groups`;
    debugger;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      $.ajax({
      url,
      data: Object.assign({
        key: ENV.MEETUP_KEY,
        sign: true
      }, query),
      dataType: 'jsonp'
      }).then(function(response) {
        let status = response.status;
        if (status && status.match(/^4\d+/)) {
          reject(response);
        }
        resolve({ "groups": response.data});
      }, function(jqXHR) {
        reject(jqXHR);
      });
    });
  }
});
