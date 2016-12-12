import ENV from "austin-speaks-too/config/environment";
import Ember from 'ember';
import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  host: 'https://api.meetup.com',
  query(store, type, query) {
    debugger;
    let params = {
      page: 20,
      limited_events: false,
      group_urlname: query.urlname,
      time: '1451610000000,',
      order: 'time',
      status: 'past',
      desc: false
    };
    const url = `${this.host}/2/events`;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      $.ajax({
        url,
        data: Object.assign({
          key: ENV.MEETUP_KEY,
          sign: true
        }, params),
        dataType: 'jsonp'
      }).then(function(response) {
        debugger;
        let status = response.status;
        if (status && status.match(/^4\d+/)) {
          reject(response);
        }
        resolve({ "events": response.results});
      }, function(jqXHR) {
        reject(jqXHR);
      });
    });
  }
});
