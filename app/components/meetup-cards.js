import Ember from 'ember';

export default Ember.Component.extend({
  groups: [],
  selectedGroups: [],

  meetups: Ember.computed('groups', 'selectedGroups', function() {
    let groups = this.get('groups');
    this.get('groups').forEach((g) => {
      g.set('selected', this.get('selectedGroups').includes(g));
    });
    return groups;
  }),

  actions: {
    toggle(meetup) {
      meetup.toggleProperty('selected');
      const isSelected = meetup.selected;
      if (isSelected) {
        this.get('selectedGroups').pushObject(meetup);
      } else {
        this.get('selectedGroups').removeObject(meetup);
      }
    }
  }
});
