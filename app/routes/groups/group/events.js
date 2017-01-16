import Ember from 'ember';
const { get, set } = Ember;

export default Ember.Route.extend({
  beforeModel() {
    this.set('group', this.modelFor('groups.group'));
  },

  model: function(params) {
    let group = get(this, 'group');
    return get(this, 'store').query('event', {
      group_id: group.get('id'),
      urlname: group.get('urlname')
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('group', get(this, 'group'));
  }
});
