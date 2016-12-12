import Ember from 'ember';
import PapaParse from 'papaparse';

export default Ember.Component.extend({
  tagName: 'a',
  className: ['export'],
  attributeBindings: ['href', 'download'],

  href: '#',
  download: 'meetup-data.csv',

  events: [],
  groups: [],

  click() {
    debugger;
    let csvData = this.csvData();
    this.set('href', csvData);
    // return true;
  },

  csvData: function() {
    let events = this.get('events').toArray();
    let keys = ['name', 'rsvp', 'male', 'female', 'non-binary'];
    let csv = PapaParse.unparse({
      fields: keys,
      data: events.map((event) => {
        return [
          event.get('name'),
          event.get('rsvp'),
          event.get('maleSpeakers'),
          event.get('femaleSpeakers'),
          event.get('nonBinarySpeakers')
        ];
      })
    });
    return 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
  }
});
