import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  normalize(model, hash, prop) {
    hash.description = Ember.String.htmlSafe(hash.description);
    return this._super(...arguments);
  }
});
