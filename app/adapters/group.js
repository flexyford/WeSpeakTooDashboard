import ENV from "austin-speaks-too/config/environment";
import Ember from 'ember';
import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  host: 'https://api.meetup.com',

  findRecord(store, type, group_id) {
    const url = `${this.host}/2/groups`;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      $.ajax({
        url,
        data: Object.assign({
          key: ENV.MEETUP_KEY,
          sign: true
        }, { group_id }),
        dataType: 'jsonp'
      }).then(function(response) {
        let status = response.status;
        if (status && status.match(/^4\d+/)) {
          reject(response);
        }
        resolve({ group: response.results });
      }, function(jqXHR) {
        reject(jqXHR);
      });
    });
  },

  query(store, type, query) {
    const url = `${this.host}/find/groups`;
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
