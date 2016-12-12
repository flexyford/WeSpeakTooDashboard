import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  normalize(model, hash, prop) {
    hash.rsvp = hash['yes_rsvp_count'];
    hash.description = Ember.String.htmlSafe(hash.description);

    // Default to zero Speakers when fetching from Meetup API
    hash.maleSpeakers = 0;
    hash.femaleSpeakers = 0;
    hash.nonBinarySpeakers = 0;
    return this._super(...arguments);
  }
});
