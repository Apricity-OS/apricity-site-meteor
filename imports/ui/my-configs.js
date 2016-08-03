import {Template} from 'meteor/templating';

import {Configs} from '../api/configs.js';

Template.myConfigsPage.onCreated(function() {
  Meteor.subscribe('configs');
});

Template.myConfigsPage.helpers({
  configs() {
    console.log(Configs.find().fetch());
    return Configs.find({owner: Meteor.userId()}, {sort: {editedAt: -1}});
  }
});

