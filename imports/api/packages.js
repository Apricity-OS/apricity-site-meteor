import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {Meteor} from 'meteor/meteor';

export const Packages = new Mongo.Collection('packages');

function startQueuedPackage() {
  let pkg = Packages.findOne({queued: true}, {sort: {queuedTime: 1}});

  HTTP.del('http://45.55.247.46:8000/repo');
  HTTP.put('http://45.55.247.46:8000/repo', {
    params: {
      'package_name': pkg.packageName,
      'repo_name': pkg.repoName,
      'repo_endpoint': pkg.repoEndpoint
    }
  }, function(error, response) {
    if (error) {
      // console.log(error);
    } else {
      Packages.update({_id: pkg._id}, {$set: {running: true, queued: false}});
      // console.log(response);
    }
  });
}

if (Meteor.isServer) {
  Meteor.publish('packages', function() {
    return Packages.find();
  });

  Meteor.setInterval(function checkPackageQueue() {
    if (!Packages.findOne({running: true})) {
      if (Packages.find({queued: true}).fetch().length) {
        startQueuedPackage();
      }
    } else {
      HTTP.get('http://45.55.247.46:8000/repo', {}, function(error, response) {
        if (error) {
          // console.log(error);
        } else {
          let runningPackage = Packages.findOne({running: true});
          // console.log(response);
          let data = response.data;
          if (data.status === 'success') {
            Packages.update({running: true}, {$set: {
              running: false,
              queued: false,
              completed: true,
              failed: false,
              log: 'http://192.241.147.116/' +
                runningPackage.repoEndpoint + '/' +
                runningPackage.packageName + '.log'
            }});
          } else if (data.status === 'failure') {
            Packages.update({running: true}, {$set: {
              running: false,
              queued: false,
              completed: false,
              failed: true,
              log: 'http://192.241.147.116/' +
                runningPackage.repoEndpoint + '/' +
                runningPackage.packageName + '.log'
            }});
          } else if (data.status === 'not completed') {
            // console.log('Current package not completed');
          }
        }
      });
    }
  }, 30000); // run every 30 seconds
}

Meteor.methods({
  'packages.add'(packageName) {
    check(packageName, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (!packageExists(packageName)) {
      throw new Meteor.Error('invalid-package');
    }

    let packageNum = Packages.find({
      packageName: packageName
    }).fetch().length + 1;

    Packages.insert({
      packageName: packageName,
      initiator: this.userId,
      running: false,
      queued: true,
      queuedTime: new Date(),
      buildNum: packageNum
    });
  }
});
