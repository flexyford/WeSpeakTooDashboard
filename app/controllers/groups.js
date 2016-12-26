import Ember from 'ember';
const { get, set } = Ember;

export default Ember.Controller.extend({
  queryParams: ['category', 'page', 'order', 'selected'],
  category: 34,
  order: 'members',
  page: 20,
  selected: null,

  selectedGroups: Ember.computed('model', 'selected', function() {
    let selected = this.get('selected');
    let selectedIds = selected ? selected.split(',') : [];
    let groups = this.get('model');
    return selectedIds.map((id) => {
      return groups.findBy('id', id);
    });
  })
});
