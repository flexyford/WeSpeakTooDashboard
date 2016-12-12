import Ember from 'ember';
import PapaParse from 'papaparse';

export default Ember.Component.extend({
  tagName: 'a',
  className: ['export'],
  attributeBindings: ['href', 'download'],

  href: '#',
  download: 'meetup-data.csv',

  groups: [],

  click() {
    let csvData = this.csvData();
    this.set('href', csvData);
  },

  csvData: function() {
    // Only Include Groups with Events
    let groups = this.get('groups').filter((group) => group.get('events.length'));
    let keys = ['group', 'group_name', 'event', 'event_name', 'rsvp', 'male', 'female', 'non-binary'];

    // http://papaparse.com/docs#unparse-examples
    let csv = PapaParse.unparse({
      fields: keys,
      data: groups.reduce((events, group) => {
        let groupEvents = group.get('events').map((event) => {
          return [
            group.get('id'),
            group.get('name'),
            event.get('id'),
            event.get('name'),
            event.get('rsvp'),
            event.get('maleSpeakers'),
            event.get('femaleSpeakers'),
            event.get('nonBinarySpeakers')
          ];
        });
        return events.concat(groupEvents);
      }, [])
    });
    return 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
  }
});
