import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {Meteor} from 'meteor/meteor';

import {Configs} from './configs.js';

import tomlify from 'tomlify';

export const Builds = new Mongo.Collection('builds');

export function configToToml(config) {
  // Turn arrays into dicts
  let outConfig = _.deepClone(config, 3);
  outConfig.pacman.packages = {'gen': outConfig.pacman.packages};
  outConfig.systemd.services = {'gen': outConfig.systemd.services};
  outConfig.gnome.extensions = {'gen': outConfig.gnome.extensions};
  outConfig.gnome.favorite_apps = {'gen': outConfig.gnome.favorite_apps};
  outConfig.vim.plugins = {'gen': outConfig.vim.plugins};
  outConfig.vim.vimrc = {'gen': outConfig.vim.vimrc};
  outConfig.zsh.zshrc = {'gen': outConfig.zsh.zshrc};
  outConfig.code.root = {'gen': outConfig.code.root};
  outConfig.code.user = {'gen': outConfig.code.user};

  let toml = 'inherits = "base.toml"\n' + tomlify(outConfig);
  return toml;
}

// UPDATE THIS
// let buildServerUrl = 'http://10.136.15.8:8000';
let buildServerUrl = 'http://159.203.176.252:8000';
let staticServerUrl = 'http://192.241.147.116';

const MAX_BUILDS = 2;

function startQueuedBuild() {
  let build = Builds.findOne({queued: true}, {sort: {queuedTime: 1}});
  let toml = configToToml(build.config);

  HTTP.del(buildServerUrl + '/build');
  HTTP.put(buildServerUrl + '/build', {
    params: {
      'oname': build.name,
      'username': build.username,
      'config': toml,
      'num': build.buildNum
    }
  }, function(error, response) {
    if (error) {
      console.log(error);
    } else {
      Builds.update({_id: build._id}, {$set: {running: true, queued: false}});
      console.log(response);
    }
  });
}

function deleteBuild(username, isoName) {
  HTTP.del(buildServerUrl + '/build/' + username + '/' + isoName);
}

if (Meteor.isServer) {
  Meteor.publish('builds', function() {
    return Builds.find();
  });

  // Reset build queue
  Meteor.setInterval(function checkBuildQueue() {
    if (!Builds.findOne({running: true})) {
      if (Builds.find({queued: true}).fetch().length) {
        startQueuedBuild();
      }
    } else {  // a build is running
      HTTP.get(buildServerUrl + '/build', {}, function(error, response) {
        if (error) {
          console.log(error);
        } else {
          let runningBuild = Builds.findOne({running: true});
          console.log(response);
          let data = response.data;
          if (data.status === 'success') {
            Builds.update({running: true}, {$set: {
              running: false,
              queued: false,
              completed: true,
              failed: false,
              download: staticServerUrl + '/freezedry-build/' +
                runningBuild.username + '/apricity_os-' + runningBuild.name +
                '-' + runningBuild.buildNum + '.iso',
              log: staticServerUrl + '/freezedry-build/' +
                runningBuild.username + '/apricity_os-' + runningBuild.name +
                '-' + runningBuild.buildNum + '.log'
            }});
          } else if (data.status === 'failure') {
            Builds.update({running: true}, {$set: {
              running: false,
              queued: false,
              completed: false,
              failed: true,
              log: staticServerUrl + '/freezedry-build/' +
                runningBuild.username + '/apricity_os-' + runningBuild.name +
                '-' + runningBuild.buildNum + '.log'
            }});
          } else if (data.status === 'not completed') {
            console.log('Current build not completed');
          }
        }
      });
    }
  }, 30000);  // run every 30 seconds
}

Meteor.methods({
  'builds.add'(configId, username) {
    check(configId, String);
    check(username, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    let config = Configs.findOne({
      _id: configId,
      username: username
    });

    if (Builds.find({
      name: config.name,
      username: config.username,
      queued: true
    }).fetch().length > 0) {
      throw new Meteor.Error('not-allowed');
    }

    let buildNum = Builds.find({
      username: config.username,
      name: config.name
    }).fetch().length + 1;
    let latest = Builds.findOne({
      username: config.username,
      name: config.name
    }, {sort: {buildNum: -1}});
    if (latest) {
      Builds.update({_id: latest._id}, {$set: {latest: false}});
    }
    // has download link, not protected
    if (Builds.find({download: {$ne: undefined},
                    protected: false}).fetch().length > MAX_BUILDS) {
      // delete oldest build download
      let oldest = Builds.findOne({download: {$ne: undefined},
                                   prodected: false}, {sort: {queuedTime: 1}});
      // Builds.remove({_id: oldest._id});
      Builds.update({_id: oldest._id}, {$set: {download: undefined}});
      deleteBuild(oldest.username, oldest.name);
    }
    if (!config) {
      throw new Meteor.Error('config-not-found');
    }
    let protected = false;
    if (Meteor.users.find({_id: this.userId}).username === 'admin') {
      protected = true;
    }

    Builds.insert({
      config: config.config,
      name: config.name,
      username: username,
      initiator: this.userId,
      configOwner: config.owner,
      queuedTime: new Date(),
      buildNum: buildNum,
      latest: true,
      running: false,
      queued: true,
      protected: protected
    });
  }
});
