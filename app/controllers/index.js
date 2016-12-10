import Ember from 'ember';
const { get, set } = Ember;

export default Ember.Controller.extend({
  groups: null,
  actions: {
    onGroups(groups) {
      set(this, 'groups', groups);
    },

    onEvents(events) {
      set(this, 'events', events);
    }
  }
});
