import Ember from 'ember';

export default Ember.Controller.extend({
  parent: Ember.inject.controller('groups'),

  groups: Ember.computed.alias('parent.model'),
  selected: Ember.computed.alias('parent.selected'),
  selectedGroups: Ember.computed.alias('parent.selectedGroups'),

  canLoadMore: Ember.computed('parent.page', 'groups.length', function() {
    return this.get('parent.page') <= this.get('groups.length');
  }),

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
    },
    loadMore() {
      let parent = this.get('parent');
      let results = parent.get('page') + 20;
      parent.set('page', results);
    }
  }
});
