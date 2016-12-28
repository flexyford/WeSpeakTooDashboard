import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    page: {
      refreshModel: true
    }
  },

  beforeModel() {
    let groups = this.get('store').peekAll('group');
    let groupsFromServer = groups.filterBy('urlname');
    const didTransitionFromImport = groups.get('length') > 0 &&
          groupsFromServer.get('length') === 0;

    this.set('didTransitionFromImport', didTransitionFromImport);

    if (didTransitionFromImport) {
      this.set('import_ids', groups.mapBy('id').join(','));
    }
  },

  setupController(controller, groups) {
    // Call _super for default behavior
    this._super(...arguments);

    // Set Lat/Lon Query Parms if necessary
    const shouldSetLocation = !(
      controller.get('zip') || (controller.get('lat') || controller.get('lon'))
    );

    let groupWithLocation = groups.find((group) => {
      return group.get('lat') && group.get('lon');
    });

    if (shouldSetLocation && groupWithLocation) {
      controller.set('lat', groupWithLocation.get('lat'));
      controller.set('lon', groupWithLocation.get('lon'));
    }
  },

  model(params) {
    let promises = [];
    const didTransitionFromImport = this.get('didTransitionFromImport');

    let groupQueryParams = this.groupQueryParams(params);
    const waitForLocation = !(groupQueryParams.zip || groupQueryParams.lat);

    let group_ids =  didTransitionFromImport ?
        this.get('import_ids') : params.selected;

    if (group_ids) {
      let findAll = this.get('store').findAll('group', {
        adapterOptions: { group_id: group_ids },
        // Force Reload since pushPayload from import
        // returns incomplete data models
        reload: didTransitionFromImport
      });
      promises.push(findAll);
    }

    // If the are no location query parameters, then we have to wait for the
    // first batch of promises, ie 'import' or 'selected' to return.
    // Once we have those groups, we can set the lat/lon location in query params
    // to the lat/lon of the first group.
    if (!waitForLocation) {
      let query = this.get('store').query('group', groupQueryParams);
      promises.push(query);
    }

    // First Phase of Requests
    return Ember.RSVP.all(promises).then((models) => {
      let groups = models.reduce((groups, model) => {
        return groups.concat(model.toArray());
      }, []);

      if (!waitForLocation) { return groups.uniq(); }

      // Second Phase of Requests with Location
      let groupWithLocation = groups.find((group) => {
        return group.get('lat') && group.get('lon');
      });

      if (groupWithLocation) {
        Object.assign(groupQueryParams, {
          lat: groupWithLocation.get('lat'),
          lon: groupWithLocation.get('lon')
        });
      }

      return this.get('store').query('group', groupQueryParams).then((models) => {
        return groups.concat(models.toArray()).uniq();
      });
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
