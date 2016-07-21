import {Template} from 'meteor/templating';

import {Configs} from '../api/configs.js';

Template.specificConfigPage.onCreated(function() {
  Meteor.subscribe('configs');
});

Template.specificConfigPage.helpers({
  config() {
    console.log(Configs.find().fetch());
    console.log(FlowRouter.getParam('username'));
    console.log(FlowRouter.getParam('configName'));
    console.log(Configs.find().fetch());
    return Configs.findOne({
      username: FlowRouter.getParam('username'),
      name: FlowRouter.getParam('configName'),
      $or: [{public: true}, {owner: Meteor.userId()}],
    });
  },
});

