import Ember from 'ember';
const { get, set } = Ember;

export default Ember.Route.extend({
  beforeModel() {
    this.set('group', this.modelFor('groups.group'));
  },
  model: function(params) {
    let group = this.get('group');
    return get(this, 'store').query('event', { urlname: group.get('urlname')});
  }
});
