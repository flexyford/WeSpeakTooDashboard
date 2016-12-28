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
              group_id: result[indeces.group]
            };
          });

          let groups = data.reduce((groups, result) => {
            let id = result[indeces.group];
            if (!groups.find((g) => g.id === id)) {
              return groups.concat({
                id,
                event_ids: events.filterBy('group_id', id).mapBy('id')
              });
            }
            return groups;
          }, []);

          let payload = { groups, events };
          get(this, 'store').pushPayload(payload);

          let selected = groups.mapBy('id').join(',');
          this.transitionToRoute('groups.group.events', payload.groups[0].id, {
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
