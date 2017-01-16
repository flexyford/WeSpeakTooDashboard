import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('groups', function() {
    this.route('index', { path: "/" });
    this.route("group", { path: "/:group_id" }, function() {
      this.route("events");
    });
  });
});

export default Router;
