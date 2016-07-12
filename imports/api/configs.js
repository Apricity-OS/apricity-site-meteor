import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {Meteor} from 'meteor/meteor';

export const Configs = new Mongo.Collection('configs');

if (Meteor.isServer) {
    Meteor.publish('configs', function() {
        return Configs.find({$or: [{owner: this.userId}, {public: true}]});
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

        Configs.insert({
            config: config,
            name: cleanName,
            fullName: fullName,
            description: description,
            screenshot: screenshotUrl,
            public: false,
            owner: this.userId,
            username: Meteor.user().username,
            upvotes: {},
            numVotes: 0,
        });
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
    },
});
