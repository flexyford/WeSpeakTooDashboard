import Ember from 'ember';
import PapaParse from 'papaparse';

export default Ember.Component.extend({
  tagName: 'a',
  classNames: ['btn', 'btn-default', 'export'],
  classNameBindings: ['disabled'],
  attributeBindings: ['href', 'download', 'disabled'],

  disabled: false,

  href: '#',
  download: 'meetup-data.csv',

  groups: [],

  click() {
    let csvData = this.csvData();
    this.set('href', csvData);
  },

  csvData: function() {
    // Only Include Groups with Events
    let groups = this.get('groups');
    let keys = ['group', 'group_name', 'event', 'event_name', 'rsvp', 'male', 'female', 'non-binary'];

    // http://papaparse.com/docs#unparse-examples
    let csv = PapaParse.unparse({
      fields: keys,
      data: groups.reduce((rows, group) => {
        let groupEvents = group.get('events');

        if (groupEvents.get('length')) {
          let eventRows = groupEvents.map((event) => {
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
          return rows.concat(eventRows);
        } else {
          let groupRows = [ group ].map((group) => {
            return [
              group.get('id'),
              group.get('name')
            ];
          });
          return rows.concat(groupRows);
        }
      }, [])
    });
    return 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
  }
});
