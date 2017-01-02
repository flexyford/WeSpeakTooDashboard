import Ember from 'ember';

const { get } = Ember;

export default Ember.Controller.extend({
  isFindDisabled: Ember.computed('currentRouteName', function() {
    let routes = ['index', 'groups.index', 'groups.group.events'];
    return !routes.includes( get(this, 'currentRouteName') );
  }),

  isSelectDisabled: Ember.computed('currentRouteName', function() {
    let routes = ['groups.index', 'groups.group.events'];
    return !routes.includes( get(this, 'currentRouteName') );
  }),

  isNotateDisabled: Ember.computed('currentRouteName', function() {
    let routes = ['groups.group.events'];
    return !routes.includes( get(this, 'currentRouteName') );
  })
});
