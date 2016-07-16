import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {Meteor} from 'meteor/meteor';

import {Configs} from './configs.js';

import tomlify from 'tomlify';

export const Builds = new Mongo.Collection('builds');

export function configToToml(config) {
    // Turn arrays into dicts
    config.pacman.packages = {'gen': config.pacman.packages};
    config.systemd.services = {'gen': config.systemd.services};
    config.gnome.extensions = {'gen': config.gnome.extensions};
    config.gnome.favorite_apps = {'gen': config.gnome.favorite_apps};
    config.vim.plugins = {'gen': config.vim.plugins};
    config.vim.vimrc = {'gen': config.vim.vimrc};
    config.zsh.zshrc = {'gen': config.zsh.zshrc};
    config.code.root = {'gen': config.code.root};
    config.code.user = {'gen': config.code.user};

    let toml = 'inherits = "base.toml"\n' + tomlify(config);
    return toml;
}

function startQueuedBuild() {
    let build = Builds.findOne({queued: true}, {sort: {queuedTime: 1}});
    let toml = configToToml(build.config);

    HTTP.del('http://45.55.247.46/build');
    HTTP.put('http://45.55.247.46/build', {
        params: {
            'oname': build.name,
            'username': build.username,
            'config': toml,
            'num': build.buildNum,
        },
    }, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            Builds.update({_id: build._id}, {$set: {running: true, queued: false}});
            console.log(response);
        }
    });
}

if (Meteor.isServer) {
    Meteor.publish('builds', function() {
        return Builds.find();
    });

    // Reset build queue
    // Builds.remove({});

    Meteor.setInterval(function checkBuildQueue() {
        if (!Builds.findOne({running: true})) {
            if (Builds.find({queued: true}).fetch().length) {
                startQueuedBuild();
            }
        } else {  // a build is running
            HTTP.get('http://45.55.247.46/build', {}, function(error, response) {
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
                            download: 'http://192.241.147.116/freezedry-build/' +
                                runningBuild.username + '/apricity_os-' + runningBuild.name + 
                                '-' + runningBuild.buildNum + '.iso',
                            log: 'http://192.241.147.116/freezedry-build/' +
                                runningBuild.username + '/apricity_os-' + runningBuild.name + 
                                '-' + runningBuild.buildNum + '.log',
                        }});
                    } else if (data.status === 'failure') {
                        Builds.update({running: true}, {$set: {
                            running: false,
                            queued: false,
                            completed: false,
                            failed: true,
                            log: 'http://192.241.147.116/freezedry-build/' +
                                runningBuild.username + '/apricity_os-' + runningBuild.name + 
                                '-' + runningBuild.buildNum + '.log',
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
    'builds.add'(configId) {
        check(configId, String);

        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        let config = Configs.findOne({_id: configId});
        let buildNum = Builds.find({
            username: config.username,
            name: config.name,
        }).fetch().length + 1;
        if (config) {
            Builds.insert({
                config: config.config,
                name: config.name,
                username: Meteor.user().username,
                configOwner: config.owner,
                queuedTime: new Date(),
                buildNum: buildNum,
                running: false,
                queued: true,
            });
        } else {
            throw new Meteor.Error('config-not-found');
        }
    },
});
