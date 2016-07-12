import {Template} from 'meteor/templating';

import {Configs} from '../api/configs.js';

Template.dashPage.onCreated(function() {
    Meteor.subscribe('configs');
});

Template.dashPage.helpers({
    configs() {
        console.log(Configs.find({public: true}).fetch());
        return Configs.find({public: true});
    },
});

