import Ember from 'ember';
const { get, set } = Ember;

export default Ember.Controller.extend({
  queryParams: ['category', 'page', 'order'],
  category: 34,
  order: 'members',
  page: 20,

  selectedGroups: [],
  currentGroup: null,

  groups: Ember.computed.alias('model'),

  actions: {
    submit(selected) {
      this.set('selectedGroups', selected);
      this.set('currentGroup', selected);
    }
  }
});
