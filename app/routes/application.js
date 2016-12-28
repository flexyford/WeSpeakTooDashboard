import Ember from 'ember';

export default Ember.Route.extend({
  geolocation: Ember.inject.service(),
  model() {
    // Always use zip or lat / lng in URL so we don't have to block
    this.get('geolocation').getLocation();
  }
});
