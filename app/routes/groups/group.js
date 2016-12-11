import Ember from 'ember';

export default Ember.Route.extend({
  afterModel(group) {
    this.transitionTo('groups.group.events');
  }
});
