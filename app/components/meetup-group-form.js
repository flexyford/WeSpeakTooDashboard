import Ember from 'ember';

const { get } = Ember;

import { CATEGORIES } from 'austin-speaks-too/utils/meetup';

const [ LATITUDE, LONGITUDE ] = [ 0, 1 ];

export default Ember.Component.extend({
  geolocation: Ember.inject.service(),
  currentLocation: Ember.computed.oneWay('geolocation.currentLocation'),
  noCurrentLocation: Ember.computed.not('currentLocation'),

  params: null,

  'on-success': Ember.K,
  'on-error': Ember.K,

  useCurrentLocation: false,

  categories: CATEGORIES,
  zip: '78705', // Default to Austin, Tx

  defaults: Ember.computed('categories', 'zip', 'currentLocation', 'useCurrentLocation', function() {
    const useCurrentLocation = get(this, 'useCurrentLocation');
    let currentLocation = get(this, 'currentLocation') || [ null, null ];
    return {
      category: get(this, 'categories').findBy('name', 'Tech').value,
      zip: useCurrentLocation ? null : get(this, 'zip'),
      lat: useCurrentLocation ? currentLocation[LATITUDE] : null,
      lon: useCurrentLocation ? currentLocation[LONGITUDE] : null
    };
  }),

  waitingForLocation: Ember.computed('useCurrentLocation', 'currentLocation', function() {
    return this.get('useCurrentLocation') && !this.get('currentLocation');
  }),

  actions: {
    setCurrentLocation() {
      this.set('useCurrentLocation', true);
      let params = Object.assign({}, get(this, 'defaults'));
      get(this, 'on-submit')(params);
    },

    submit(changeset) {
      let params = Object.assign({}, get(this, 'defaults'), changeset);
      get(this, 'on-submit')(params);
    }
  }
});
