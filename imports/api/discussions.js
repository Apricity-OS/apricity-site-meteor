import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

import {Categories} from './categories.js';

export const Discussions = new Mongo.Collection('discussions');

if (Meteor.isServer) {
  Meteor.publish('discussions', function() {
    return Discussions.find();
  });
}

Meteor.methods({
  'discussions.add'(discussionName, discussionText, discussionCategory) {
    check(discussionName, String);
    check(discussionText, String);
    check(discussionCategory, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (discussionName.length < 0) {
      throw new Meteor.Error('title-required');
    }

    if (discussionText.length < 0) {
      throw new Meteor.Error('text-required');
    }

    if (!Categories.findOne({name: discussionCategory})) {
      throw new Meteor.Error('category-not-found');
    }

    if (Categories.findOne({name: discussionCategory}).restricted && !Roles.userIsInRole(this.userId)) {
      throw new Meteor.Error('not-authorized');
    }

    Discussions.insert({
      username: Meteor.user().username,
      category: Categories.findOne({name: discussionCategory})._id,
      name: discussionName,
      body: discussionText,
      createdAt: new Date(),
      owner: this.userId
    });
  },
  'discussions.delete'(discussionId) {
    check(discussionId, String);

    if (!this.userId ||
        !Discussions.findOne({_id: discussionId})) {
      throw new Meteor.Error('not-authorized');
    }

    if (Discussions.findOne({_id: discussionId}).owner !== this.userId &&
        !Roles.userIsInRole(this.userId, 'admin') &&
        !Roles.userIsInRole(this.userId, 'moderator')) {
      throw new Meteor.Error('not-authorized');
    }

    Discussions.remove({_id: discussionId});
  },
  'discussions.edit'(discussionId, discussionText) {
    check(discussionId, String);
    check(discussionText, String);

    if (!this.userId ||
        !Discussions.findOne({_id: discussionId})) {
      throw new Meteor.Error('not-authorized');
    }

    if (Discussions.findOne({_id: discussionId}).owner !== this.userId &&
        !Roles.userIsInRole(this.userId, 'admin') &&
        !Roles.userIsInRole(this.userId, 'moderator')) {
      throw new Meteor.Error('not-authorized');
    }

    Discussions.update({_id: discussionId},
                       {$set: {body: discussionText}});
  }
});
