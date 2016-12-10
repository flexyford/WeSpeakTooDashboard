import Ember from 'ember';
import ENV from "austin-speaks-too/config/environment";

const { get, set } = Ember;

export default Ember.Component.extend({
  params: null,

  'on-success': Ember.K,
  'on-error': Ember.K,

  endpoint: 'groups',

  // default query params
  page: 20,
  category: 34, // tech
  order: 'members',

  init: function() {
    this._super(...arguments);
    let params = {};

    switch(get(this, 'endpoint')) {
    case 'events':
      break;
    case 'groups':
    default:
      Object.assign(params, {
        category: get(this, 'category'),
        order: get(this, 'order'),
        page: get(this, 'page')
      });
    }

    set(this, 'params', params);
  },

  actions: {
    getMeetupEndpoint(changeset) {
      let meetupEndpointPath;
      switch(get(this, 'endpoint')) {
      case 'events':
        meetupEndpointPath = 'events';
        break;
      case 'groups':
      default:
        meetupEndpointPath = 'find/groups';
      }

      return $.ajax({
        url: `https://api.meetup.com/${meetupEndpointPath}`,
        data: Object.assign({
          key: ENV.MEETUP_KEY,
          sign: true
        }, get(this, 'params'), changeset),
        dataType: 'jsonp'
      });
    },

    success(response) {
      let data = response.data.map((d) => {
        return {
          name: d.name,
          urlname: d.urlname
        };
      });
      debugger;
      get(this, 'on-success')(data);
    },

    error(error) {
      get(this, 'on-error')(error);
    }
  }
});
