import Ember from 'ember';

const { get } = Ember;

export default Ember.Controller.extend({
  isFindParent: Ember.computed('currentRouteName', function() {
    let childRoutes = ['groups.index', 'groups.group.events'];
    return childRoutes.includes( get(this, 'currentRouteName') );
  }),

  isSelectParent: Ember.computed('currentRouteName', function() {
    let childRoutes = ['groups.group.events'];
    return childRoutes.includes( get(this, 'currentRouteName') );
  })
});
