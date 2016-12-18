import Ember from 'ember';
import ENV from "austin-speaks-too/config/environment";

const { get, set } = Ember;

import { CATEGORIES } from 'austin-speaks-too/utils/meetup';

export default Ember.Component.extend({
  params: null,

  'on-success': Ember.K,
  'on-error': Ember.K,

  categories: CATEGORIES,

  defaults: Ember.computed('categories', function() {
    return {
      category: get(this, 'categories').findBy('name', 'Tech').value,
      order: 'members',
      page: 20
    };
  }),

  actions: {
    submit(changeset) {
      let params = Object.assign({}, get(this, 'defaults'), changeset);
      get(this, 'on-submit')(params);
    }
  }
});
