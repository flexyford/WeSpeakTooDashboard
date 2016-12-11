import Ember from 'ember';

export default Ember.Controller.extend({
  events: Ember.computed.alias('model')
});
