import { Meteor } from 'meteor/meteor';

import '../imports/api/content.js';
import '../imports/api/configs.js';
import '../imports/api/builds.js';
import '../imports/api/packages.js';
import '../imports/api/users.js';
import '../imports/api/posts.js';
import '../imports/api/docs.js';
import '../imports/api/stripe.js';
import '../imports/api/downloads.js';

import {runOnce} from '../lib/runonce.js';
import {ImportedUsers,
        ImportedCategories,
        ImportedDiscussions,
        ImportedComments} from '../imports/api/vanillaimports.js';

import {Categories, ParentCategories} from '../imports/api/categories.js';
import {Discussions} from '../imports/api/discussions.js';
import {Comments} from '../imports/api/comments.js';
import {Posts} from '../imports/api/posts.js';

Meteor.startup(() => {
  // Delete
  // SSLProxy({
  //   port: 6000,
  //   ssl: {
  //     key: Assets.getText("key.pem"),
  //     cert: Assets.getText("cert.pem")
  //   }
  // });

  UploadServer.init({
    tmpDir: process.env.PWD + '/.uploads/tmp/',
    uploadDir: process.env.PWD + '/.uploads/',
    maxFileSize: 100000000,  // 100 mb
    checkCreateDirectories: true,  //create the directories for you
    getDirectory: function(fileInfo, formData) {
      return formData.username + '/';
    }
    });

  Accounts.emailTemplates.siteName = 'Apricity OS';
  Accounts.emailTemplates.from = 'Apricity OS Accounts <noreply@apricityos.com>';

  Accounts.emailTemplates.enrollAccount.subject = function(user) {
    return 'Apricity OS: Account Verification';
  };
  Accounts.emailTemplates.enrollAccount.text = function(user, url) {
    return 'Hi ' + user.username + '!\n\n' +
      'Apricity OS has a brand new site, and we\'ve automatically generated ' +
      'an account for you based on the one you had on the old forum. ' +
      'You\'ll be able to post things on the new forum, as well as contribute ' +
      'to the new wiki and participate in IRC discussions. You\'ll ' +
      'also be able to create Freezedry configurations and build them online.' +
      '\n\nClick the link below to verify your account and set your password:' +
      '\n' + url;
  };

  Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return 'Apricity OS: Account Verification';
  };
  Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    return 'Hi ' + user.username + '!\n\n' +
      'Thanks for making an account at the Apricity OS website! ' +
      '\n\nYou\'ll be able to post things on the new forum, as well as contribute ' +
      'to the new wiki and participate in IRC discussions. You\'ll ' +
      'also be able to create Freezedry configurations and build them online.' +
      '\n\nClick the link below to verify your account:' +
      '\n' + url;
  };

  if (!Meteor.users.findOne({username: 'admin'})) {
    runOnce(function() {
      console.log('Creating admin');
      Accounts.createUser({
        username: 'admin',
        email: 'agajews@gmail.com'
      });
      let adminId = Meteor.users.findOne({username: 'admin'})._id;
      Roles.addUsersToRoles(adminId, 'admin');
      Accounts.sendEnrollmentEmail(adminId);
    }, 'createAdmin');
  }

  if (ImportedUsers.find().fetch().length > 0) {
    runOnce(function() {
      console.log('Importing users');
      _.each(ImportedUsers.find().fetch(), function(user) {
        if (!Meteor.users.findOne({username: user.username})) {
          Accounts.createUser({
            username: user.username,
            email: user.email
          });
          let userId = Meteor.users.findOne({username: user.username})._id;
          Roles.addUsersToRoles(userId, 'user');
          // ENABLE
          // Accounts.sendEnrollmentEmail(userId);
        }
      });
    }, 'importUsers');
  }

  if (ImportedCategories.find().fetch().length > 0) {
    runOnce(function() {
      console.log('Importing categories');
      _.each(ImportedCategories.find().fetch(), function(category) {
        if (category.parentName !== 'Root') {
          ParentCategories.upsert({name: category.parentName},
                                  {name: category.parentName});
          let restricted = false;
          if (category.restricted) {
            restricted = true;
          }
          Categories.insert({
            name: category.name,
            description: category.description,
            parent: ParentCategories.findOne({name: category.parentName})._id,
            restricted: restricted
          }, function(error, _id) {
            ImportedCategories.update({categoryId: category.categoryId},
                                      {$set: {mongoId: _id}});
          });
        }
      });
    }, 'importCategories');
  }

  if (ImportedDiscussions.find().fetch().length > 0 &&
      ImportedUsers.find().fetch().length > 0 &&
      ImportedCategories.find().fetch().length > 0) {
    runOnce(function() {
      console.log('Importing discussions');
      _.each(ImportedDiscussions.find().fetch(), function(discussion) {
        Discussions.insert({
          name: discussion.name,
          body: discussion.body,
          category: ImportedCategories.findOne({name: discussion.category}).mongoId,
          username: discussion.username,
          owner: Meteor.users.findOne({username: discussion.username})._id,
          createdAt: new Date(discussion.createdAt)
        }, function(error, _id) {
          ImportedDiscussions.update({discussionId: discussion.discussionId},
                                     {$set: {mongoId: _id}});
        });
      });
    }, 'importDiscussions');
  }

  if (ImportedComments.find().fetch().length > 0 &&
      ImportedUsers.find().fetch().length > 0 &&
      ImportedDiscussions.find({mongoId: {$ne: false}}).fetch().length > 0 &&
      ImportedCategories.find().fetch().length > 0) {
    runOnce(function() {
      console.log('Importing comments');
      _.each(ImportedComments.find().fetch(), function(comment) {
        if (ImportedDiscussions.findOne({discussionId: comment.discussionId})) {
          Comments.insert({
            body: comment.body,
            username: comment.username,
            owner: Meteor.users.findOne({username: comment.username})._id,
            discussion: ImportedDiscussions.findOne({discussionId: comment.discussionId}).mongoId,
            createdAt: new Date(comment.createdAt)
          });
        } else {
          console.log('Comment discussion not found');
        }
      });
    }, 'importComments');

    if (Posts.find({cleanName: {$ne: true}}).fetch().length > 0) {
      runOnce(function() {
        console.log('Cleaning imported post names');
        _.each(Posts.find({cleanName: {$ne: true}}).fetch(), function(post) {
          Posts.update({_id: post._id}, {$set: {cleanName: post.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}});
        });
      });
    }
  }
});
