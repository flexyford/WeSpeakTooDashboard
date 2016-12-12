import Ember from 'ember';

export default Ember.Controller.extend({
  events: Ember.computed.alias('model'),

  actions: {
    decrement(event, speaker) {
      let speakerKey = `${speaker}Speakers`;
      let count = event.get(speakerKey);
      if(count === 0) return;
      event.set(speakerKey, count - 1);
    },
    increment(event, speaker) {
      let speakerKey = `${speaker}Speakers`;
      let count = event.get(speakerKey);
      event.set(speakerKey, count + 1);
    }
  }
});
