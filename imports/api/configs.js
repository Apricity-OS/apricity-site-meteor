import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {Meteor} from 'meteor/meteor';

export const Configs = new Mongo.Collection('configs');
import {Builds} from './builds.js';

if (Meteor.isServer) {
  Meteor.publish('configs', function() {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return Configs.find();
    } else {
      return Configs.find({hide: {$ne: true}, $or: [{owner: this.userId}, {public: true}]});
    }
  });
}

Meteor.methods({
  'configs.makePublic'(configId) {
    check(configId, String);

    if (!this.userId || Configs.findOne({_id: configId}).owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Configs.update({_id: configId}, {$set: {public: true}});
  },

  'configs.makePrivate'(configId) {
    check(configId, String);

    if (!this.userId || Configs.findOne({_id: configId}).owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Configs.update({_id: configId}, {$set: {public: false}});
  },

  'configs.create'(config, cleanName, fullName, screenshotUrl, description) {
    check(fullName, String);
    check(screenshotUrl, String);
    check(description, String);
    check(cleanName, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Roles.addUsersToRoles(this.userId, 'createdConfig');

    Configs.insert({
      config: config,
      name: cleanName,
      fullName: fullName,
      description: description,
      screenshot: screenshotUrl,
      createdAt: new Date(),
      editedAt: new Date(),
      public: false,
      owner: this.userId,
      username: Meteor.user().username,
      upvotes: {},
      numVotes: 0
    });
  },

  'configs.edit'(configId, config, cleanName, fullName, screenshotUrl, description) {
    check(configId, String);
    check(fullName, String);
    check(screenshotUrl, String);
    check(description, String);
    check(cleanName, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (this.userId !== config.owner && !Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-authorized');
    }

    if (!Configs.findOne({_id: configId})) {
      throw new Meteor.Error('not-found');
    }

    Configs.update({_id: configId}, {$set: {
      config: config,
      name: cleanName,
      fullName: fullName,
      description: description,
      screenshot: screenshotUrl,
      editedAt: new Date()
    }});
  },

  'configs.delete'(configId) {
    check(configId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (this.userId !== Configs.findOne({_id: configId}).owner && !Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-authorized');
    }

    Configs.remove({_id: configId});
    Builds.remove({configId: configId});
  },

  'configs.upvote'(configId) {
    check(configId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    let currentUpvotes = Configs.findOne({_id: configId}).upvotes;
    currentUpvotes[this.userId] = true;
    Configs.update({_id: configId}, {$set: {upvotes: currentUpvotes}});

    let numVotes = 0;
    for (let username in currentUpvotes) {
      if (currentUpvotes[username]) {
        numVotes += 1;
      }
    }

    Configs.update({_id: configId}, {$set: {numVotes: numVotes}});
  },

  'configs.unVote'(configId) {
    check(configId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    let currentUpvotes = Configs.findOne({_id: configId}).upvotes;
    currentUpvotes[this.userId] = false;
    Configs.update({_id: configId}, {$set: {upvotes: currentUpvotes}});

    let numVotes = 0;
    for (let username in currentUpvotes) {
      if (currentUpvotes[username]) {
        numVotes += 1;
      }
    }

    Configs.update({_id: configId}, {$set: {numVotes: numVotes}});
  }
});
