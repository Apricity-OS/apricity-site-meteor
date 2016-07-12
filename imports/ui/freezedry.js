import {Template} from 'meteor/templating';

import {Configs} from '../api/configs.js';

import tomlify from 'tomlify';

Template.freezedry.helpers({
    toml() {
        return tomlify(this.config.config);
    },
    toUpvote() {
        upvoted = Configs.findOne({_id: this.config._id}).upvotes[Meteor.userId()];
        return !upvoted;
    },
    toUnVote() {
        upvoted = Configs.findOne({_id: this.config._id}).upvotes[Meteor.userId()];
        return upvoted;
    },
    toMakePublic() {
        return this.config.owner === Meteor.userId() && !this.config.public;
    },
    toMakePrivate() {
        return this.config.owner === Meteor.userId() && this.config.public;
    },
    numVotes() {
        return this.config.numVotes;
    },
});

Template.freezedry.events({
    'click .make-public'(event, instance) {
        event.preventDefault();
        Meteor.call('configs.makePublic', this.config._id);
        // Configs.update({_id: this.config._id}, {$set: {public: true}});
    },
    'click .make-private'(event, instance) {
        event.preventDefault();
        Meteor.call('configs.makePrivate', this.config._id);
        // Configs.update({_id: this.config._id}, {$set: {public: false}});
    },
    'click .upvote'(event, instance) {
        event.preventDefault();
        Meteor.call('configs.upvote', this.config._id);
        // let currentUpvotes = Configs.findOne({_id: this.config._id}).upvotes;
        // currentUpvotes[Meteor.userId()] = true;
        // Configs.update({_id: this.config._id}, {$set: {upvotes: currentUpvotes}});
    },
    'click .un-vote'(event, instance) {
        event.preventDefault();
        Meteor.call('configs.unVote', this.config._id);
        // let currentUpvotes = Configs.findOne({_id: this.config._id}).upvotes;
        // currentUpvotes[Meteor.userId()] = false;
        // Configs.update({_id: this.config._id}, {$set: {upvotes: currentUpvotes}});
    },
});
