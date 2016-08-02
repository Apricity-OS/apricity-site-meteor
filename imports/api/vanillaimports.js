import {Mongo} from 'meteor/mongo';

export const ImportedUsers = new Mongo.Collection('imported_users');
export const ImportedCategories = new Mongo.Collection('imported_categories');
export const ImportedDiscussions = new Mongo.Collection('imported_discussions');
export const ImportedComments = new Mongo.Collection('imported_comments');
