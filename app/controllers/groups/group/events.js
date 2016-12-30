import Ember from 'ember';

const speakerKeys = ['maleSpeakers', 'femaleSpeakers', 'nonBinarySpeakers'];

export default Ember.Controller.extend({
  events: Ember.computed.alias('model'),

  actions: {
    decrement(event, speaker) {
      let speakerKey = `${speaker}Speakers`;
      let count = event.get(speakerKey);
      if (!count) return;
      event.set(speakerKey, count - 1);
    },
    increment(event, speaker) {
      // Initialize All Events to Zero Speakers
      if (!event.get('isNotated')) {
        this.send('none', event);
      }

      let speakerKey = `${speaker}Speakers`;
      let count = event.get(speakerKey);
      event.set(speakerKey, count + 1);
    },
    none(event) {
      speakerKeys.forEach((speakers) => {
        event.set(speakers, 0);
      });
    }
  }
});
