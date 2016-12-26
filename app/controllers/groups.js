import Ember from 'ember';
const { get, set } = Ember;

export default Ember.Controller.extend({
  queryParams: ['category', 'page', 'order'],
  category: 34,
  order: 'members',
  page: 20
});
