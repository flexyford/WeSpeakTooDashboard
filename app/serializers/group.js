import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  normalize(model, hash, prop) {
    if (hash.group_photo && hash.group_photo.photo_link) {
      hash.imageUrl = hash.group_photo.photo_link;
    }

    hash.category = hash.category && hash.category.name;
    hash.description = Ember.String.htmlSafe(hash.description);
    return this._super(...arguments);
  }
});
