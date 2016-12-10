import Ember from 'ember';
const { get, set } = Ember;

export default Ember.Controller.extend({
  groups: null,
  actions: {
    onSuccess(groups) {
      set(this, 'groups', groups);
    }
  }
});
