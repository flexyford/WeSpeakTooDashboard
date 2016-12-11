import Ember from 'ember';
const { get, set } = Ember;

export default Ember.Route.extend({
  beforeModel: function() {
    set(this, 'group', this.modelFor('groups.group'));
  },

  model: function(params) {
    let group = get(this, 'group');
    debugger;
    return get(this, 'store').query('event', { urlname: group.get('urlname')});
  }
});
