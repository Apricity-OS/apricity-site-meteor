import { Meteor } from 'meteor/meteor';

import '../imports/api/content.js';
import '../imports/api/configs.js';
import '../imports/api/builds.js';

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
});
