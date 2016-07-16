import {Template} from 'meteor/templating';

import {Configs} from '../api/configs.js';
import {Builds} from '../api/builds.js';

Template.isoPage.onCreated(function() {
    Meteor.subscribe('builds');
    Meteor.subscribe('configs');
});

Template.isoPage.helpers({
    config() {
        return Configs.findOne({
            username: FlowRouter.getParam('username'),
            name: FlowRouter.getParam('configName'),
        });
    },
    builds() {
        return Builds.find({
            username: FlowRouter.getParam('username'),
            name: FlowRouter.getParam('configName'),
        }, {sort: {queuedTime: -1}});
    },
    username() {
        return FlowRouter.getParam('username');
    },
    fullName() {
        let config = Configs.findOne({
            username: FlowRouter.getParam('username'),
            name: FlowRouter.getParam('configName'),
        });
        if (config) {
            return config.fullName;
        }
    },
    configName() {
        return FlowRouter.getParam('configName');
    },
});

Template.isoPage.events({
    'click .create-new-build'(event, instance){
        let config = Configs.findOne({
            username: FlowRouter.getParam('username'),
            name: FlowRouter.getParam('configName'),
        });

        Meteor.call('builds.add', config._id);
    },
});

Template.buildRow.helpers({
    num() {
        return this.build.buildNum;
    },
    queueNum() {
        if (this.build.queued) {
            let queueNum = Builds.find(
                {queued: true}, {sort: {queuedTime: 1}}
            ).map(b => b._id).indexOf(this.build._id) + 1;
            return queueNum;
        }
    },
    date() {
        return this.build.queuedTime.toDateString();
    },
});
