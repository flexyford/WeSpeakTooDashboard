import Ember from 'ember';
import ENV from "austin-speaks-too/config/environment";

const { get, set } = Ember;

import { CATEGORIES } from 'austin-speaks-too/utils/meetup';

const [ LATITUDE, LONGITUDE ] = [ 0, 1 ];

export default Ember.Component.extend({
  geolocation: Ember.inject.service(),

  params: null,

  'on-success': Ember.K,
  'on-error': Ember.K,

  useCurrentLocation: false,

  init() {
    this._super(...arguments);
    this.get('geolocation').getLocation().then((geoObject) => {
      var currentLocation = this.get('geolocation').get('currentLocation');
      this.set('latlng', currentLocation);
    });
  },

  latlng: null,

  categories: CATEGORIES,
  zip: '78705', // Default to Austin, Tx

  defaults: Ember.computed('categories', 'zip', function() {
    return {
      category: get(this, 'categories').findBy('name', 'Tech').value,
      zip: get(this, 'zip'),
      lat: null,
      lon: null
    };
  }),

  waitingForLocation: Ember.computed('useCurrentLocation', 'latlng', function() {
    return this.get('useCurrentLocation') && !this.get('latlng');
  }),

  actions: {
    setCurrentLocation() {
      this.set('zip', null);
      this.set('useCurrentLocation', true);
    },
    submit(changeset) {
      let params = Object.assign({}, get(this, 'defaults'), changeset);
      if (this.get('useCurrentLocation')) {
        params.lat = this.get('latlng')[LATITUDE];
        params.lon = this.get('latlng')[LONGITUDE];
      }
      get(this, 'on-submit')(params);
    }
  }
});
