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
    getMeetupEndpoint(changeset) {
      return Ember.RSVP.Promise.all(
        changeset.selectedGroups.map((group) => {
          return $.ajax({
            url: `https://api.meetup.com/2/events`,
            data: Object.assign({
              key: ENV.MEETUP_KEY,
              sign: true,
              page: 10,
              group_urlname: group.urlname
            }),
            dataType: 'jsonp'
          });
        })
      );
    },

    success(response) {
      debugger;
      return;
    },

    error(error) {
      return;
    }
  }
});
