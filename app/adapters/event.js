import ENV from "austin-speaks-too/config/environment";
import Ember from 'ember';
import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  host: 'https://api.meetup.com',
  query(store, type, query) {
    let params = {
      page: 200,
      limited_events: false,
      group_id: query.group_id,
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
      }).then((response) => {
        let status = response.status;
        if (status && status.match(/^4\d+/)) {
          reject(response);
        }
        response.results = response.results.map((event) => {
          return Object.assign({}, event, {
            group: query.group_id
          });
        });
        resolve({ "events": response.results});
      }, function(jqXHR) {
        reject(jqXHR);
      });
    });
  }
});
