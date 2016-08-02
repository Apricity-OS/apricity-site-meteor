import {Mongo} from 'meteor/mongo';

export const Categories = new Mongo.Collection('categories');
export const ParentCategories = new Mongo.Collection('parent_categories');

if (Meteor.isServer) {
  Meteor.publish('categories', function() {
    return Categories.find();
  });

  Meteor.publish('parentCategories', function() {
    return ParentCategories.find();
  });
}
