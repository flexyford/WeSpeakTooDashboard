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
    let params = Object.assign({}, {
      category: get(this, 'category'),
      order: get(this, 'order'),
      page: get(this, 'page')
    });

    set(this, 'params', params);
  },

  actions: {
    submit(changeset) {
      let params = Object.assign({}, get(this, 'params'), changeset);
      get(this, 'on-submit')(params);
    }
  }
});
