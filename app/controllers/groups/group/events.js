import Ember from 'ember';

const { get } = Ember;

export default Ember.Controller.extend({
  events: Ember.computed('model',
                         'model.@each.maleSpeakers',
                         'model.@each.femaleSpeakers',
                         'model.@each.nonBinarySpeakers', function() {
    // Recompute on male/female/non-binary speakers so d3 can redraw
    return this.get('model');
                         }),

  hasDrawableEvents: Ember.computed.bool('drawEvents.length'),

  drawEvents: Ember.computed.filterBy('events', 'hasSpeakers'),

  sortByTimeDesc: ['time:desc'],
  sortedEvents: Ember.computed.sort('events', 'sortByTimeDesc')
});
