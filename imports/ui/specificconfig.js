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
        return Configs.findOne({
            username: FlowRouter.getParam('username'),
            name: FlowRouter.getParam('configName'),
            public: true,
        });
    },
});

