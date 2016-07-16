import {Template} from 'meteor/templating';

import {Content} from '../api/content.js';

function getContent(name){
    let field = Content.findOne({name: name});
    console.log(field);
    return field && field.text;
}

Template.homePage.onCreated(function() {
    Meteor.subscribe('content', {
        onReady() {
            console.log(Content.find({}).length);
        },
    });
});

Template.homePage.helpers({
    tagline() {
        return getContent('tagline');
    },
    homeIntro() {
        return getContent('homeIntro');
    },
    homeFreezedry() {
        return getContent('homeFreezedry');
    },
    homeBattery() {
        return getContent('homeBattery');
    },
    homeUpdates() {
        return getContent('homeUpdates');
    },
    homeSecurity() {
        return getContent('homeSecurity');
    },
});
