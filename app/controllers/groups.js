import Ember from 'ember';
const { get, set } = Ember;

export default Ember.Controller.extend({
  queryParams: [
    'category', 'page', 'order', 'selected', 'radius', 'zip', 'lat', 'lon'
  ],
  category: 34,
  order: 'members',
  page: 200,
  radius: 'smart',
  zip: null,
  lat: null,
  lon: null,

  init(){
    this._super(...arguments);
    let applicationController = Ember.getOwner(this).lookup('controller:application');
    this.set('applicationController', applicationController);
  },

  currentRouteName: Ember.computed.oneWay('applicationController.currentRouteName'),

  selected: null,

  selectedGroups: Ember.computed('model', 'selected', function() {
    let selected = this.get('selected');
    let selectedIds = selected ? selected.split(',') : [];
    let groups = this.get('model');
    return selectedIds.map((id) => {
      return groups.findBy('id', id);
    });
  }),

  noneSelected: Ember.computed.equal('selectedGroups.length', 0),

  isGroupsRoute: Ember.computed.equal('currentRouteName', 'groups.index'),

  actions: {
    removeGroup(group) {
      let selected = this.get('selected');
      let selectedIds = selected ? selected.split(',') : [];
      let index = selectedIds.indexOf(group.id);
      selectedIds.splice(index, 1);
      this.set('selected', selectedIds.join(','));
    }
  }
});
