import {Mongo} from 'meteor/mongo';
import {Discussions} from './discussions.js';
import {check} from 'meteor/check';

export const Comments = new Mongo.Collection('comments');

if (Meteor.isServer) {
  Meteor.publish('comments', function() {
    return Comments.find();
  });
}

if (Meteor.isServer) {
  let notifyDiscussionContributors = function(discussionId, editorUsername) {
    _.each(_.uniq(_.union(_.map(Comments.find({discussion: discussionId}).fetch(),
                                c => c.username),
                          [Discussions.findOne({_id: discussionId}).username])),
           username => {
             Email.send({
               to: Meteor.users.findOne({username: username}).emails[0].address,
               from: "noreply@apricityos.com",
               subject: "Apricity OS Forum: New Comment On A Discussion You Participated In",
               text: editorUsername + " commented on a discussion you participated in.\n\n" +
                 "Follow the link below to check it out:" + "\nhttp://apricityos.com/forum/discussion/" + discussionId +
                 "\n\nHave a great day!"
             });
           });
  };

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

      notifyDiscussionContributors(discussionId, Meteor.user().username);

    },
    'comments.delete'(commentId) {
      check(commentId, String);

      if (!this.userId ||
          !Comments.findOne({_id: commentId})) {
        throw new Meteor.Error('not-authorized');
      }

      if (Comments.findOne({_id: commentId}).username !== Meteor.user().username &&
          !Roles.userIsInRole(this.userId, 'admin') &&
          !Roles.userIsInRole(this.userId, 'moderator')) {
        throw new Meteor.Error('not-authorized');
      }

      Comments.remove({_id: commentId});
    },
    'comments.edit'(commentId, commentText) {
      check(commentId, String);
      check(commentText, String);

      if (!this.userId ||
          !Comments.findOne({_id: commentId})) {
        throw new Meteor.Error('not-authorized');
      }

      if (Comments.findOne({_id: commentId}).username !== Meteor.user().username &&
          !Roles.userIsInRole(this.userId, 'admin') &&
          !Roles.userIsInRole(this.userId, 'moderator')) {
        throw new Meteor.Error('not-authorized');
      }

      Comments.update({_id: commentId},
                      {$set: {body: commentText}});
    }
  });
}
