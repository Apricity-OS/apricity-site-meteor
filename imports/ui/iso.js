import {Template} from 'meteor/templating';

import {Configs} from '../api/configs.js';
import {Builds} from '../api/builds.js';

Template.isoPage.onCreated(function() {
  Meteor.subscribe('builds');
  Meteor.subscribe('configs');
});

Template.isoPage.helpers({
  buildAllowed() {
    // no queued builds for this config
    return Builds.find({
      configUsername: FlowRouter.getParam('username'),
      name: FlowRouter.getParam('configName'),
      $or: [{queued: true}, {running: true}]
    }).fetch().length === 0;
  },
  config() {
    return Configs.findOne({
      username: FlowRouter.getParam('username'),
      name: FlowRouter.getParam('configName')
    });
  },
  builds() {
    return Builds.find({
      configUsername: FlowRouter.getParam('username'),
      name: FlowRouter.getParam('configName')
    }, {sort: {queuedTime: -1}});
  },
  username() {
    return FlowRouter.getParam('username');
  },
  fullName() {
    let config = Configs.findOne({
      username: FlowRouter.getParam('username'),
      name: FlowRouter.getParam('configName')
    });
    if (config) {
      return config.fullName;
    }
    return undefined;
  },
  configName() {
    return FlowRouter.getParam('configName');
  }
});

Template.isoPage.events({
  'click .create-new-build'(event, instance){
    let config = Configs.findOne({
      username: FlowRouter.getParam('username'),
      name: FlowRouter.getParam('configName')
    });

    Meteor.call('builds.add', config._id, FlowRouter.getParam('username'));
  }
});

Template.buildRow.helpers({

  queueNum() {
    if (this.build.queued) {
      let queueNum = Builds.find(
        {queued: true}, {sort: {queuedTime: 1}}
      ).map(b => b._id).indexOf(this.build._id) + 1;
      return queueNum;
    }
    return undefined;
  },

  date() {
    return this.build.queuedTime.toDateString();
  },

  canCancel() {
    return (this.build.username === Meteor.user().username ||
            this.build.configOwner === Meteor.userId() ||
            Roles.userIsInRole(Meteor.userId(), 'admin')) &&
      !Builds.findOne({_id: this.build._id}).running;
  }
});

Template.buildRow.events({
  'click .cancel-build'(event, instance) {
    event.preventDefault();
    Meteor.call('builds.remove', this.build._id);
  }
});
