import {Template} from 'meteor/templating';

import {Configs} from '../api/configs.js';

Template.userConfigsPage.onCreated(function() {
    Meteor.subscribe('configs');
});

Template.userConfigsPage.helpers({
    configs() {
        console.log(Configs.find().fetch());
        return Configs.find({
            username: FlowRouter.getParam('username'),
            public: true,
        }, {sort: {createdAt: -1}});
    },
    username() {
        return FlowRouter.getParam('username');
    },
    isMe() {
        return Meteor.user().username === FlowRouter.getParam('username');
    },
});

