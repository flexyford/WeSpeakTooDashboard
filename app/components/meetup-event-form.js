import Ember from 'ember';
import ENV from "austin-speaks-too/config/environment";

const { get, set } = Ember;

export default Ember.Component.extend({
  groups: [],
  selectedGroups: [],

  collection: Ember.computed('selectedGroups', function() {
    return {
      selectedGroups: get(this, 'selectedGroups')
    };
  }),

  actions: {
    submit(changeset) {
      get(this, 'on-submit')(changeset.selectedGroups);
    }
  }
});
