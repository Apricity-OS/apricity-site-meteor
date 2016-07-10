import {Mongo} from 'meteor/mongo';

export const Configs = new Mongo.Collection('configs');

if (Meteor.isServer) {
    Meteor.publish('configs', function() {
        return Configs.find();
    });
}
