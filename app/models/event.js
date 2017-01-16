import Ember from 'ember';
import DS from 'ember-data';

import momentComputed from 'ember-moment/computeds/moment';
import format from 'ember-moment/computeds/format';
import locale from 'ember-moment/computeds/locale';

const { get } = Ember;

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  time: DS.attr('number'), // Time Since the Epoch

  maleSpeakers: DS.attr('number'),
  femaleSpeakers: DS.attr('number'),
  nonBinarySpeakers: DS.attr('number'),

  group: DS.belongsTo('group'),

  date: Ember.computed('time', function() {
    return new Date(get(this, 'time'));
  }),

  dateFormatted: format(locale(momentComputed('date'), 'moment.locale'), 'MMMM DD, YYYY'),

  totalSpeakers: Ember.computed('maleSpeakers', 'femaleSpeakers', 'nonBinarySpeakers', function() {
    return this.get('maleSpeakers') +
      this.get('femaleSpeakers') +
      this.get('nonBinarySpeakers');
  }),

  _hasSpeakers: Ember.computed.or('maleSpeakers', 'femaleSpeakers', 'nonBinarySpeakers'),
  hasSpeakers: Ember.computed.gt('_hasSpeakers', 0),
  noSpeakers: Ember.computed.equal('_hasSpeakers', 0),
  isNotated: Ember.computed.gte('_hasSpeakers', 0),

  hasMale: Ember.computed.gt('maleSpeakers', 0),
  hasFemale: Ember.computed.gt('femaleSpeakers', 0),
  hasNonBinary: Ember.computed.gt('nonBinarySpeakers', 0)
});
