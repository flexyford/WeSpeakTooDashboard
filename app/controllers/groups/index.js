import Ember from 'ember';

export default Ember.Controller.extend({
  parent: Ember.inject.controller('groups'),

  selected: Ember.computed.alias('parent.selected'),
  selectedGroups: Ember.computed.alias('parent.selectedGroups'),

  containsSelections: Ember.computed.bool('selectedGroups.length'),

  firstGroup: Ember.computed('selectedGroups.length', function() {
    return this.get('selectedGroups.firstObject');
  }),

  groups: Ember.computed.alias('model'),
  disabled: Ember.computed.not('containsSelections'),

  actions: {
    selectGroup(group) {
      let selected = this.get('selected');
      selected = selected ? selected.concat(`,${group.id}`) : group.id;
      this.set('selected', selected);
    },
    removeGroup(group) {
      let selected = this.get('selected');
      let selectedIds = selected ? selected.split(',') : [];
      let index = selectedIds.indexOf(group.id);
      selectedIds.splice(index, 1);
      this.set('selected', selectedIds.join(','));
    }
  }
});
