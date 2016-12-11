import Ember from 'ember';
const { get, set } = Ember;

export default Ember.Controller.extend({
  actions: {
    submit(queryParams) {
      this.transitionToRoute('groups', { queryParams });
    }
  }
});
