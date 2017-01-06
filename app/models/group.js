import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  urlname: DS.attr('string'),
  name: DS.attr('string'),
  description: DS.attr('string'),
  category: DS.attr('string'),
  members: DS.attr('string'),
  link: DS.attr('string'),

  lat: DS.attr('string'),
  lon: DS.attr('string'),

  imageUrl: DS.attr('string'),

  events: DS.hasMany('event'),

  hasEvents: Ember.computed.bool('events.length'),

  totalSpeakers: Ember.computed('maleSpeakers', 'femaleSpeakers', 'nonBinarySpeakers', function() {
    return this.get('maleSpeakers') +
      this.get('femaleSpeakers') +
      this.get('nonBinarySpeakers');
  }),

  maleSpeakers: Ember.computed('events.@each.maleSpeakers', function() {
    let events = this.get('events');
    return events.filterBy('maleSpeakers').reduce((total, event) => {
      return total + event.get('maleSpeakers');
    }, 0);
  }),

  malePercentage: Ember.computed('totalSpeakers', 'maleSpeakers', function() {
    let total = this.get('totalSpeakers');
    if (!total) { return 0; }

    let num = this.get('maleSpeakers') / total;
    return Math.round(num * 100);
  }),

  femaleSpeakers: Ember.computed('events.@each.femaleSpeakers', function() {
    let events = this.get('events');
    return events.filterBy('femaleSpeakers').reduce((total, event) => {
      return total + event.get('femaleSpeakers');
    }, 0);
  }),

  femalePercentage: Ember.computed('totalSpeakers', 'femaleSpeakers', function() {
    let total = this.get('totalSpeakers');
    if (!total) { return 0; }

    let num = this.get('femaleSpeakers') / total;
    return Math.round(num * 100);
  }),

  nonBinarySpeakers: Ember.computed('events.@each.nonBinarySpeakers', function() {
    let events = this.get('events');
    return events.filterBy('nonBinarySpeakers').reduce((total, event) => {
      return total + event.get('nonBinarySpeakers');
    }, 0);
  }),

  nonBinaryPercentage: Ember.computed('totalSpeakers', 'nonBinarySpeakers', function() {
    let total = this.get('totalSpeakers');
    if (!total) { return 0; }

    let num = this.get('nonBinarySpeakers') / total;
    return Math.round(num * 100);
  })
});
