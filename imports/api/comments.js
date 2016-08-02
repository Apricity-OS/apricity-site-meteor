import {Mongo} from 'meteor/mongo';
import {Discussions} from './discussions.js';
import {check} from 'meteor/check';

export const Comments = new Mongo.Collection('comments');

if (Meteor.isServer) {
  Meteor.publish('comments', function() {
    return Comments.find();
  });
}

Meteor.methods({
  'comments.add'(discussionId, commentText) {
    check(discussionId, String);
    check(commentText, String);
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (!Discussions.findOne({_id: discussionId})) {
      throw new Meteor.Error('discussion-not-found');
    }

    Comments.insert({
      username: Meteor.user().username,
      body: commentText,
      createdAt: new Date(),
      discussion: discussionId
    });
  },
  'comments.delete'(commentId) {
    check(commentId, String);

    if (!this.userId ||
        !Comments.findOne({_id: commentId}) ||
        Comments.findOne({_id: commentId}).username !== Meteor.user().username) {
      throw new Meteor.Error('not-authorized');
    }

    Comments.remove({_id: commentId});
  },
  'comments.edit'(commentId, commentText) {
    check(commentId, String);
    check(commentText, String);

    if (!this.userId ||
        !Comments.findOne({_id: commentId}) ||
        Comments.findOne({_id: commentId}).username !== Meteor.user().username) {
      throw new Meteor.Error('not-authorized');
    }

    Comments.update({_id: commentId},
                    {$set: {body: commentText}});
  }
});
