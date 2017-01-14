import Ember from 'ember';
import PapaParse from 'papaparse';

import ENV from "austin-speaks-too/config/environment";

const { DATADOTWORLD_KEY } = ENV;

const { get } = Ember;

export default Ember.Controller.extend({
  remoteFiles: [
    {
      name: 'Austin',
      url: 'https://download.data.world/file_download/flexyford/wespeaktoo-austin-2016/wespeaktoo-austin-2016.csv'
    }
  ],

  import(csv, options = {}) {
    PapaParse.parse(csv, Object.assign({}, options, {
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
