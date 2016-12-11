import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.get('store').query('group', params);
  },

  afterModel: function(model) {
    console.log('groups = ', model);
  }
});
