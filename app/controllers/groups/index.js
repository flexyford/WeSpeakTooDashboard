import Ember from 'ember';

export default Ember.Controller.extend({
  selectedGroups: [],
  containsSelections: Ember.computed.bool('selectedGroups.length'),

  firstGroup: Ember.computed('selectedGroups.length', function() {
    return this.get('selectedGroups.firstObject');
  }),

  groups: Ember.computed.alias('model'),
  disabled: Ember.computed.not('containsSelections')
});
