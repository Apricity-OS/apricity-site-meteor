import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

const Downloads = new Mongo.Collection('downloads');

Meteor.methods({
  'downloads.insert'(name, edition, channel, version, type) {
    if (!name) {
      throw new Meteor.Error('name-required');
    }
    Downloads.insert({
      name: name,
      edition: edition,
      channel: channel,
      version: version,
      type: type,
      createdAt: new Date()
    });
  }
});
