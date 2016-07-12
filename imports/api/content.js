import {Mongo} from 'meteor/mongo';

export const Content = new Mongo.Collection('content');

if (Meteor.isServer) {
    Meteor.publish('content', function() {
        return Content.find();
    });
}
