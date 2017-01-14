import Ember from 'ember';
import PapaParse from 'papaparse';

import ENV from "austin-speaks-too/config/environment";

const { DATADOTWORLD_KEY } = ENV;

const { get } = Ember;

export default Ember.Controller.extend({
  remoteFiles: [
    {
      name: 'Austin',
      url: 'https://download.data.world/file_download/flexyford/wespeaktoo/wespeaktoo-austin.csv'
    },
    {
      name: 'Washington DC',
      url: 'https://download.data.world/file_download/flexyford/wespeaktoo/wespeaktoo-washington-dc.csv'
    }
  ],

  import(csv, options = {}) {
    PapaParse.parse(csv, Object.assign({}, options, {
      complete: (results) => {
        let { data } = results;
        let columns = data.shift();

        let indeces = {
          groupId: columns.indexOf('group_id'),
          eventId: columns.indexOf('event_id'),
          eventName: columns.indexOf('event_name'),
          eventTime: columns.indexOf('event_time'),
          male: columns.indexOf('male'),
          female: columns.indexOf('female'),
          nonBinary: columns.indexOf('non-binary')
        };

        let events = data.map((result) => {
          // Return Keys from `app/model/event`
          return {
            id: result[indeces.eventId],
            name: result[indeces.eventName],
            time: result[indeces.eventTime],
            maleSpeakers: result[indeces.male],
            femaleSpeakers: result[indeces.female],
            nonBinarySpeakers: result[indeces.nonBinary],
            group: result[indeces.groupId]
          };
        }).filterBy('id');

        let groups = data.reduce((groups, result) => {
          let id = result[indeces.groupId];
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
    }));
  },

  actions: {
    importRemote(url) {
      if (url.includes('data.world')) {
        let params = [ `authentication=Bearer ${DATADOTWORLD_KEY}` ];
        url = url.concat(`?${params.join('&')}`);
      }

      this.get('import').call(this, url, { download: true, delimiter: ',' });
    },

    importLocal([ file ]) {
      this.get('import').call(this, file);
    },

    submit(queryParams) {
      this.transitionToRoute('groups', { queryParams });
    }
  }
});
