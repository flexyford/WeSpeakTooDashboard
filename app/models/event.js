import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  rsvp: DS.attr('string'),
  maleSpeakers: DS.attr('number'),
  femaleSpeakers: DS.attr('number'),
  nonBinarySpeakers: DS.attr('number'),

  group: DS.belongsTo('group')
});
