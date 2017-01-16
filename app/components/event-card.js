import Ember from 'ember';
const { get } = Ember;

const speakerKeys = ['maleSpeakers', 'femaleSpeakers', 'nonBinarySpeakers'];

export default Ember.Component.extend({
  tagName: 'li',

  classNames: ['row', 'event'],
  classNameBindings: ['isNotated:notated'],

  event: null,

  isNotated: Ember.computed('event', function() {
    return get(this, 'event.isNotated');
  }),

  actions: {
    decrement(event, speaker) {
      let speakerKey = `${speaker}Speakers`;
      let count = event.get(speakerKey);
      if (!count) { return; }
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
      speakerKeys.forEach((speaker) => {
        event.set(speaker, 0);
      });
    }
  }
});
