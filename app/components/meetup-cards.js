import Ember from 'ember';

export default Ember.Component.extend({
  groups: [],
  selectedGroups: [],

  'on-add-group': Ember.K,
  'on-load-more-groups': Ember.K,
  'on-remove-group': Ember.K,

  meetups: Ember.computed('groups', 'selectedGroups', function() {
    let groups = this.get('groups');
    groups.forEach((g) => {
      g.set('selected', this.get('selectedGroups').includes(g));
    });
    return groups.sort((a,b) => {
      return parseInt(a.get('members')) - parseInt(b.get('members'));
    }).reverse();
  }),

  actions: {
    toggle(meetup) {
      meetup.toggleProperty('selected');
      if (meetup.selected) {
        this.get('on-add-group')(meetup);
      } else {
        this.get('on-remove-group')(meetup);
      }
    }
  }
});
