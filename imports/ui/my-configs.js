import {Template} from 'meteor/templating';

import {Configs} from '../api/configs.js';

Template.myConfigsPage.helpers({
    configs() {
        console.log(Configs.find());
        return Configs.find({owner: Meteor.userId()});
    },
});

