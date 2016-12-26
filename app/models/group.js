import DS from 'ember-data';

export default DS.Model.extend({
  urlname: DS.attr('string'),
  name: DS.attr('string'),
  description: DS.attr('string'),
  category: DS.attr('string'),
  members: DS.attr('string'),
  link: DS.attr('string'),

  imageUrl: DS.attr('string'),

  events: DS.hasMany('event')
});
