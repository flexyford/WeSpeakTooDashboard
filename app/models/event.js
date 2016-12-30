import Ember from 'ember';
import DS from 'ember-data';

const { get } = Ember;

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  rsvp: DS.attr('string'),

  maleSpeakers: DS.attr('number'),
  femaleSpeakers: DS.attr('number'),
  nonBinarySpeakers: DS.attr('number'),
  noSpeakers: DS.attr('boolean'),

  group: DS.belongsTo('group'),

  noSpeakers: Ember.computed('maleSpeakers', 'femaleSpeakers', 'nonBinarySpeakers', function() {
    return get(this, 'maleSpeakers') === 0 &&
      get(this, 'femaleSpeakers') === 0 &&
      get(this, 'nonBinarySpeakers') === 0;
  }),

  isNotated: Ember.computed.bool('_speakers'),

  hasMale: Ember.computed.gt('maleSpeakers', 0),
  hasFemale: Ember.computed.gt('femaleSpeakers', 0),
  hasNonBinary: Ember.computed.gt('nonBinarySpeakers', 0),

  _speakers: Ember.computed.or('maleSpeakers', 'femaleSpeakers', 'nonBinarySpeakers', 'noSpeakers')

});
