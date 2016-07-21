import { Meteor } from 'meteor/meteor';

import '../imports/api/content.js';
import '../imports/api/configs.js';
import '../imports/api/builds.js';
import '../imports/api/packages.js';
import '../imports/api/users.js';

Meteor.startup(() => {
  UploadServer.init({
    tmpDir: process.env.PWD + '/.uploads/tmp/',
    uploadDir: process.env.PWD + '/.uploads/',
    maxFileSize: 100000000,  // 100 mb
    checkCreateDirectories: true,  //create the directories for you
    getDirectory: function(fileInfo, formData) {
      return formData.username + '/';
    },
    });

  Accounts.emailTemplates.siteName = 'Apricity OS';
  Accounts.emailTemplates.from = 'Apricity OS Accounts <noreply@apricityos.com>';

  Accounts.emailTemplates.enrollAccount.subject = function(user) {
    return 'Apricity OS: Account Verification';
  }
  Accounts.emailTemplates.enrollAccount.text = function(user, url) {
    return 'Hi ' + user.username + '!\n\n' +
      'Apricity OS has a brand new site, and we\'ve automatically generated' +
      'an account for you based on the one you had on the old forum. ' +
      'You\'ll be able to post things on the new forum, as well as contribute ' +
      'to the new wiki and participate in IRC discussions.\n\n' +
      'Click the link below to verify your account and set your password:\n\n' +
      url;
  }

  Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return 'Apricity OS: Account Verification';
  }
  Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    return 'Hi ' + user.username + '!\n\n' +
      'Thanks for making an account at the Apricity OS website! ' +
      'You\'ll be able to post things on the new forum, as well as contribute ' +
      'to the new wiki and participate in IRC discussions. You\'ll' +
      'also be able to create Freezedry configurations and build them online.\n\n' +
      'Click the link below to verify your account:\n\n' +
      url;
  }

  if (!Meteor.users.findOne({username: 'admin'})) {
    console.log('Creating admin');
    Accounts.createUser({
      username: 'admin',
      email: 'agajews@gmail.com'
    });
    let adminId = Meteor.users.findOne({username: 'admin'})._id;

    Roles.addUsersToRoles(adminId, 'admin');
    Accounts.sendEnrollmentEmail(adminId);
  }
});
