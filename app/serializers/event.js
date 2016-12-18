import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  normalize(model, hash, prop) {
    if(hash['event_url']) {
      // `hash.id` is not always guaranteed to be unqiue but the
      // `event_url` identifier is unqiue so we strip that instead
      const re_find_index = new RegExp(/events\/(\d+)\//);
      let matches = hash.event_url.match(re_find_index);
      if (matches) { hash.id = matches.pop(); }
    }

    hash.rsvp = hash['yes_rsvp_count'];

    hash.description = Ember.String.htmlSafe(hash.description);

    // Default to zero Speakers when fetching from Meetup API
    hash.maleSpeakers = hash['male_speakers'] || 0;
    hash.femaleSpeakers = hash['female_speakers'] || 0;
    hash.nonBinarySpeakers = hash['non_binary_speakers'] || 0;
    return this._super(...arguments);
  }
});
