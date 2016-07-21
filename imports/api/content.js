import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const Content = new Mongo.Collection('content');

if (Meteor.isServer) {
  Meteor.publish('content', function() {
    return Content.find();
  });
}

Meteor.methods({
  'content.change'(contentName, contentText) {
    check(contentName, String);
    if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-authorized');
    }
    if (!Content.findOne({name: contentName})) {
      throw new Meteor.Error('no-such-content');
    }
    Content.update({name: contentName}, {$set: {text: contentText}});
  },
});
