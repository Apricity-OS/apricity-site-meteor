import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const Posts = new Mongo.Collection('posts');

if (Meteor.isServer) {
  Meteor.publish('posts', function() {
    return Posts.find();
  });
}

Meteor.methods({
  'posts.add'(postName, postText) {
    check(postName, String);
    check(postText, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (!Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-authorized');
    }

    if (postName.length < 0) {
      throw new Meteor.Error('title-required');
    }

    if (postText.length < 0) {
      throw new Meteor.Error('text-required');
    }

    Posts.insert({
      username: Meteor.user().username,
      name: postName,
      cleanName: postName.replace(/[^a-z0-9]/gi, '-').toLowerCase(),
      body: postText,
      createdAt: new Date(),
      owner: this.userId
    });
  },
  'posts.delete'(postId) {
    check(postId, String);

    if (!this.userId ||
        !Posts.findOne({_id: postId}) ||
        Posts.findOne({_id: postId}).owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Posts.remove({_id: postId});
  },
  'posts.edit'(postId, postText) {
    check(postId, String);
    check(postText, String);

    if (!this.userId ||
        !Posts.findOne({_id: postId}) ||
        Posts.findOne({_id: postId}).owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Posts.update({_id: postId},
                 {$set: {body: postText}});
  }
});
