import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const Docs = new Mongo.Collection('docs');

if (Meteor.isServer) {
  Meteor.publish('docs', function() {
    return Docs.find();
  });
}

Meteor.methods({
  'docs.add'(docsEntryName, docsEntryText) {
    check(docsEntryName, String);
    check(docsEntryText, String);

    let cleanName = docsEntryName.replace(/[^a-z0-9]/gi, '-').toLowerCase();

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (Docs.findOne({cleanName: cleanName})) {
      throw new Meteor.Error('already-exists');
    }

    if (docsEntryName.length < 0) {
      throw new Meteor.Error('title-required');
    }

    if (docsEntryText.length < 0) {
      throw new Meteor.Error('text-required');
    }

    Docs.insert({
      username: Meteor.user().username,
      name: docsEntryName,
      cleanName: cleanName,
      body: docsEntryText,
      createdAt: new Date(),
      owner: this.userId,
      edits: [{body: docsEntryText,
               user: this.userId,
               username: Meteor.user().username,
               createdAt: new Date()}]
    });
  },
  'docs.delete'(docsEntryId) {
    check(docsEntryId, String);

    if (!this.userId ||
        !Docs.findOne({_id: docsEntryId})) {
      throw new Meteor.Error('not-authorized');
    }

    if (!Roles.userIsInRole(this.userId, 'admin') &&
        Docs.findOne({_id: docsEntryId}).owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Docs.remove({_id: docsEntryId});
  },
  'docs.edit'(docsEntryId, docsEntryText) {
    check(docsEntryId, String);
    check(docsEntryText, String);

    if (!this.userId ||
        !Docs.findOne({_id: docsEntryId})) {
      throw new Meteor.Error('not-authorized');
    }

    // if (!Roles.userIsInRole(this.userId, 'admin') &&
    //     Docs.findOne({_id: docsEntryId}).owner !== this.userId) {
    //   throw new Meteor.Error('not-authorized');
    // }

    Docs.update({_id: docsEntryId},
                {$set: {body: docsEntryText}});
    Docs.update({_id: docsEntryId},
                {$push: {edits: {body: docsEntryText,
                                 user: this.userId,
                                 username: Meteor.user().username,
                                 createdAt: new Date()}}});
  }
});
