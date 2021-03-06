import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  normalize(model, hash) {
    if(hash['event_url']) {
      // `hash.id` is not always guaranteed to be unqiue but the
      // `event_url` identifier is unqiue so we strip that instead
      const re_find_index = new RegExp(/events\/(\d+)\//);
      let matches = hash.event_url.match(re_find_index);
      if (matches) { hash.id = matches.pop(); }
    }

    hash.description = Ember.String.htmlSafe(hash.description);

    let event = this.store.peekRecord('event', hash.id);

    if (event) {
      // Copying Meetup CSV info to Event
      hash.maleSpeakers = event.get('maleSpeakers');
      hash.femaleSpeakers = event.get('femaleSpeakers');
      hash.nonBinarySpeakers = event.get('nonBinarySpeakers');
    }

    return this._super(...arguments);
  }
});
