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

  group: DS.belongsTo('group'),

  total: Ember.computed('maleSpeakers', 'femaleSpeakers', 'nonBinarySpeakers', function() {
    return ['maleSpeakers', 'femaleSpeakers', 'nonBinarySpeakers']
      .reduce((total, identity) => {
        let identityCount = get(this, identity) || 0;
        return total + identityCount;
      }, 0);
  }),

  noSpeakers: Ember.computed('maleSpeakers', 'femaleSpeakers', 'nonBinarySpeakers', function() {
    return ['maleSpeakers', 'femaleSpeakers', 'nonBinarySpeakers']
      .reduce((noSpeakers, identity) => {
        let foundNone = get(this, identity) === 0;
        return noSpeakers && foundNone;
      }, true);
  }),

  isNotated: Ember.computed.bool('_speakers'),

  hasMale: Ember.computed.gt('maleSpeakers', 0),
  hasFemale: Ember.computed.gt('femaleSpeakers', 0),
  hasNonBinary: Ember.computed.gt('nonBinarySpeakers', 0),

  _speakers: Ember.computed.or('maleSpeakers', 'femaleSpeakers', 'nonBinarySpeakers', 'noSpeakers')

});
