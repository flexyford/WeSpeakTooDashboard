import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel(transition) {
    let groups = this.get('store').peekAll('group');
    let groupsFromServer = groups.filterBy('urlname');
    const didTransitionFromImport = groups.length ?
        groups.length === groupsFromServer.length : false;

    this.set('didTransitionFromImport', didTransitionFromImport);
  },

  model(params) {
    let groupQueryParams = this.groupQueryParams(params);

    let requests = [
      this.get('store').query('group', groupQueryParams),
    ];

    let group_ids = this.get('didTransitionFromImport') ?
        this.get('store').peekAll('group').mapBy('id').join(',') :
        params.selected || undefined;

    if (group_ids) {
      requests.push(
        this.get('store').findAll('group', {
          adapterOptions: { group_id: group_ids }
        })
      );
    }

    return Ember.RSVP.all(requests).then((models) => {
      return models.reduce((groups, model) => {
        return groups.concat(model.toArray());
      }, []).uniq();
    });
  },

  groupQueryParams(params) {
    let required = {
      category: params.category,
      page: params.page,
      radius: params.radius
    };

    let optional = {};
    if (params.zip) {
      optional.zip = params.zip;
    } else if (params.lat && params.lon) {
      optional.lat = params.lat;
      optional.lon = params.lon;
    }

    return Object.assign(required, optional);
  }
});
