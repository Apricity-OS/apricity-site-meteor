import { Meteor } from 'meteor/meteor';

import '../imports/api/content.js';
import '../imports/api/configs.js';

Meteor.startup(() => {
    UploadServer.init({
        tmpDir: process.env.PWD + '/.uploads/tmp/',
        uploadDir: process.env.PWD + '/.uploads/',
        checkCreateDirectories: true, //create the directories for you
        getDirectory: function(fileInfo, formData) {
            return formData.username + '/';
        },
      });
});
