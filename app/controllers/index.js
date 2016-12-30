import Ember from 'ember';
import PapaParse from 'papaparse';

const { get, set } = Ember;

export default Ember.Controller.extend({
  actions: {
    import(files) {
      let csv = files[0];
      let data = PapaParse.parse(csv, {
        complete: (results) => {
          let { data } = results;
          let columns = data.shift();

          let indeces = {
            group: columns.indexOf('group'),
            event: columns.indexOf('event'),
            male: columns.indexOf('male'),
            female: columns.indexOf('female'),
            nonBinary: columns.indexOf('non-binary')
          };

          let events = data.map((result) => {
            return {
              id: result[indeces.event],
              male_speakers: result[indeces.male],
              female_speakers: result[indeces.female],
              non_binary_speakers: result[indeces.nonBinary],
              group: result[indeces.group]
            };
          }).filterBy('id');

          let groups = data.reduce((groups, result) => {
            let id = result[indeces.group];
            if (!groups.find((g) => g.id === id)) {
              return groups.concat({
                id,
                events: events.filterBy('group_id', id).mapBy('id')
              });
            }
            return groups;
          }, []).filterBy('id');

          let payload = { groups, events };
          get(this, 'store').pushPayload(payload);

          let selected = groups.mapBy('id').join(',');
          this.transitionToRoute('groups', {
            queryParams: { selected }
          });
        }
      });
    },
    submit(queryParams) {
      this.transitionToRoute('groups', { queryParams });
    }
  }
});
