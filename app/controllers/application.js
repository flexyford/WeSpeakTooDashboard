import Ember from 'ember';

const { get, set } = Ember;

export default Ember.Controller.extend({
  isFindActive: true,

  isSelectActive: Ember.computed('currentRouteName', function() {
    let isSelectActive = false;

    debugger;

    switch( get(this, 'currentRouteName') ) {
    case 'groups.group.events':
      isSelectActive = true;
    case 'groups.index':
      isSelectActive = true;
    }

    return isSelectActive;
  }),

  isNotateActive: Ember.computed('currentRouteName', function() {
    let isNotateActive = false;

    switch( get(this, 'currentRouteName') ) {
    case 'groups.group.events':
      isNotateActive = true;
    }

    return isNotateActive;
  }),

  isExportActive: false
});
