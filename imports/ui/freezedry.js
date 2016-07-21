import {Template} from 'meteor/templating';

import {Configs} from '../api/configs.js';

import {configToToml} from '../api/builds.js';

Template.freezedry.helpers({
  toml() {
    return configToToml(this.config.config);
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
  descriptionTab() {
    return Template.instance().state.get('descriptionTab');
  },
  configTab() {
    return Template.instance().state.get('configTab');
  },
});

Template.freezedry.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.set('descriptionTab', true);
})

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

  'click .delete-dropdown'(event, instance) {
    event.preventDefault();
    $('#delete-modal-' + this.config.name).modal('show');
  },

  'click .delete-config'(event, instance) {
    event.preventDefault();
    let self = this;
    $('#delete-modal-' + this.config.name).modal('hide');
    $('#delete-modal-' + this.config.name).on('hidden.bs.modal', function() {
      Meteor.call('configs.delete', self.config._id);
    });
  },

  'click .description-tab'(event, instance) {
    event.preventDefault();
    instance.state.set('descriptionTab', true);
    instance.state.set('configTab', false);
  },
  'click .config-tab'(event, instance) {
    event.preventDefault();
    instance.state.set('configTab', true);
    instance.state.set('descriptionTab', false);
  },
});
