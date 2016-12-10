import Ember from 'ember';
import ENV from "austin-speaks-too/config/environment";

export default Ember.Route.extend({
  model: function() {
    return $.ajax({
      url: 'https://api.meetup.com/find/groups',
      data:{
        category: 34,
        page: 30,
        order: 'members',
        sign: true,
        key: ENV.MEETUP_KEY
      },
      dataType: 'jsonp'
    });
  }
});
