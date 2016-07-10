import { Meteor } from 'meteor/meteor';

import '../imports/api/content.js';
import '../imports/api/configs.js';

Meteor.startup(() => {
    Slingshot.fileRestrictions('screenshots', {
        allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
        maxSize: 10 * 1024 * 1024,
    });

    Slingshot.createDirective('screenshots', Slingshot.S3Storage, {
        bucket: 'apricity',

        maxSize: 10 * 1024 * 1024,

        acl: 'public-read',

        authorize: function () {
            //Deny uploads if user is not logged in.
            if (!Meteor.userId()) {
                let message = 'Please login before posting files';
                throw new Meteor.Error('Login Required', message);
            }
            console.log('Authorized');

            return true;
        },

        key: function (file) {
            //Store file into a directory by the user's username.
            return 'screenshots/' + Meteor.user().username + '/' + file.name;
        },
    });
    Slingshot.fileRestrictions('wallpapers', {
        allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
        maxSize: 10 * 1024 * 1024,
    });

    Slingshot.createDirective('wallpapers', Slingshot.S3Storage, {
        bucket: 'apricity',

        maxSize: 10 * 1024 * 1024,

        acl: 'public-read',

        authorize: function () {
            //Deny uploads if user is not logged in.
            if (!Meteor.userId()) {
                let message = 'Please login before posting files';
                throw new Meteor.Error('Login Required', message);
            }
            console.log('Authorized');

            return true;
        },

        key: function (file) {
            //Store file into a directory by the user's username.
            return 'wallpapers/' + Meteor.user().username + '/' + file.name;
        },
    });
});
