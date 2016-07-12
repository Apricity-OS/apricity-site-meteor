import {Template} from 'meteor/templating';

import {Configs} from '../api/configs.js';

import sanitizeFnm from 'sanitize-filename';

Template.createPage.onCreated(function() {
    this.state = new ReactiveDict();

    this.state.set('uploadWallpaperText', 'Choose image');
    this.state.set('uploadLockText', 'Choose image');

    this.state.set('uploadWallpaperTab', false);
    this.state.set('uploadLockTab', false);

    this.state.set('uploadScreenshotText', 'Choose image');

    this.config = new ReactiveVar({});

    let self = this;
    Meteor.subscribe('configs', {
        onReady() {
            if (FlowRouter.getParam('username') && FlowRouter.getParam('configName')) {
                if (FlowRouter.current().route.name === 'specificConfigClone') {
                    self.create = true;
                    self.baseConfig = () => Configs.findOne({
                        name: FlowRouter.getParam('configName'),
                        username: FlowRouter.getParam('username'),
                    });
                    console.log('Cloning')
                    console.log(self.baseConfig());
                } else if (FlowRouter.current().route.name === 'speceficConfigEdit') {
                    self.edit = true;
                    self.baseConfig = () => Configs.findOne({
                        name: FlowRouter.getParam('configName'),
                        username: FlowRouter.getParam('username'),
                    });
                    console.log('Editing');
                    console.log(self.baseConfig());
                } else {
                    console.log('Not sure');
                }
            } else {
                self.create = true;
                self.baseConfig = () => Configs.findOne({name: 'apricity-gnome'}).config;
            }

            self.state.set('gnomeTab', self.baseConfig().gnome ? true : false);
            self.state.set('gdmTab', self.baseConfig().gdm ? true : false);
            self.state.set('zshTab', self.baseConfig().zsh ? true : false);
        },
    });
});

Template.createPage.helpers({
    uploadWallpaperTab() {
        return Template.instance().state.get('uploadWallpaperTab');
    },
    uploadLockTab() {
        return Template.instance().state.get('uploadLockTab');
    },

    pasteWallpaperTab() {
        return !Template.instance().state.get('uploadWallpaperTab');
    },
    pasteLockTab() {
        return !Template.instance().state.get('uploadLockTab');
    },

    wallpaperCallbacks() {
        let instance = Template.instance();
        return {
            finished(index, fileInfo, context) {
                fileInfo.path = fileInfo.path.replace(Meteor.user().username + "//", Meteor.user().username + "/");
                fileInfo.url = fileInfo.url.replace(Meteor.user().username + "//", Meteor.user().username + "/");
                console.log(fileInfo.url);
                instance.state.set('wallpaperUrl', fileInfo.url);
                console.log(instance.state);
            }
        };
    },
    lockCallbacks() {
        let instance = Template.instance();
        return {
            finished(index, fileInfo, context) {
                fileInfo.path = fileInfo.path.replace(Meteor.user().username + "//", Meteor.user().username + "/");
                fileInfo.url = fileInfo.url.replace(Meteor.user().username + "//", Meteor.user().username + "/");
                console.log(fileInfo.url);
                instance.state.set('lockUrl', fileInfo.url);
            }
        };
    },
    screenshotCallbacks() {
        let instance = Template.instance();
        return {
            finished(index, fileInfo, context) {
                fileInfo.path = fileInfo.path.replace(Meteor.user().username + "//", Meteor.user().username + "/");
                fileInfo.url = fileInfo.url.replace(Meteor.user().username + "//", Meteor.user().username + "/");
                console.log(fileInfo.url);
                instance.state.set('screenshotUrl', fileInfo.url);
            }
        };
    },

    alertErr() {
        return Template.instance().state.get('alertErr');
    },
    pacmanErr() {
        return Template.instance().state.get('pacmanErr');
    },
    systemdErr() {
        return Template.instance().state.get('systemdErr');
    },
    appErr() {
        return Template.instance().state.get('appErr');
    },
    extensionErr() {
        return Template.instance().state.get('extensionErr');
    },

    codeMirrorOptions() {
        return {
            lineNumbers: true,
            mode: 'shell',
            // theme: 'paraiso-dark'
        };
    },

    config() {
        return Template.instance().config;
    },
    baseConfig() {
        return Template.instance().baseConfig();
    },
    username() {
        return FlowRouter.getParam('username');
    },
    configName() {
        return FlowRouter.getParam('configName');
    },

    pacman() {
        return Template.instance().config.get().pacman;
    },
    systemd() {
        return Template.instance().config.get().systemd;
    },
    gnome() {
        return Template.instance().config.get().gnome;
    },
    gnomeTab() {
        return Template.instance().state.get('gnomeTab');
    },
    gdm() {
        return Template.instance().config.get().gdm;
    },
    gdmTab() {
        return Template.instance().state.get('gdmTab');
    },
    zsh() {
        return Template.instance().config.get().zsh;
    },
    zshrc() {
        // console.log(Template.instance().config.get());
        if (Template.instance().config.get().zsh) {
            return Template.instance().config.get().zsh.zshrc.join('\n');
        }
    },
    zshTab() {
        return Template.instance().state.get('zshTab');
    },

    userCode() {
        console.log('Getting user code');
        if (Template.instance().config.get().code) {
            console.log(Template.instance().config.get().code.user.join('\n'));
            return Template.instance().config.get().code.user.join('\n');
        } else {
            console.log('User code is false');
        }
    },
    rootCode() {
        if (Template.instance().config.get().code) {
            console.log(Template.instance().config.get().code);
            return Template.instance().config.get().code.root.join('\n');
        }
    },
})

function setGnomeLockConfig(instance, alert) {
    let config = instance.config.get();
    if (instance.state.get('uploadLockTab')) {
        if (instance.state.get('lockUrl')) {
            config.gnome.lock_background = instance.state.get('lockUrl');
        } else if (alert) {
            instance.state.set('alertErr', 'Please upload a lock screen background');
        }
    } else {
        config.gnome.lock_background = document.getElementById('pasteLockInput').value;
    }
    instance.config.set(config);
}

function setGnomeWallpaperConfig(instance, alert) {
    let config = instance.config.get();
    if (instance.state.get('uploadWallpaperTab')) {
        if (instance.state.get('wallpaperUrl')) {
            config.gnome.wallpaper = instance.state.get('wallpaperUrl');
        } else if (alert) {
            instance.state.set('alertErr', 'Please upload a wallpaper');
        }
    } else {
        config.gnome.wallpaper = document.getElementById('pasteWallpaperInput').value;
    }
    instance.config.set(config);
}

function setGnomeConfig(instance, alert) {
    let config = instance.config.get();

    config.gnome.gtk_theme = document.getElementById('gtkTheme').value;
    config.gnome.shell_theme = document.getElementById('shellTheme').value;
    config.gnome.icon_theme = document.getElementById('iconTheme').value;
    config.gnome.gtk_button_layout = document.getElementById('gtkButtonLayout').value;
    config.gnome.dynamic_workspaces = document.getElementById('dynamicWorkspaces').value;
    config.gnome.desktop_icons = document.getElementById('desktopIcons').value;

    instance.config.set(config);
    setGnomeWallpaperConfig(instance, alert);
    setGnomeLockConfig(instance, alert);
}

function setGdmConfig(instance, alert) {
    let config = instance.config.get();
    config.gdm = {};
    instance.config.set(config);
}

function processCode(code) {
    if (code) {
        return code.split('\n');
    } else {
        return [];
    }
}

function setZshConfig(instance, alert) {
    let config = instance.config.get();
    config.zsh = {
        'zshrc': processCode(document.getElementById('zshrc').value),
    };
    instance.config.set(config);
}

function setCodeConfig(instance, alert) {
    let config = instance.config.get();
    config.code = {
        'root': processCode(document.getElementById('rootCode').value),
        'user': processCode(document.getElementById('userCode').value),
    };
    instance.config.set(config);
}

Template.createPage.events({
    'submit .package-form'(event, instance) {
        event.preventDefault();
        console.log(instance.config);
        let packageName = event.target.packageName.value;
        if (packageName) {
            let config = instance.config.get();
            let packages = config.pacman.packages;
            if (packages.indexOf(packageName) === -1) {
                packages.push(packageName);
                config.pacman.packages = packages;
                instance.config.set(config);
                instance.state.set('pacmanErr', undefined);
                event.target.packageName.value = '';
            } else {
                instance.state.set('pacmanErr', 'That package has already been added');
            }
        } else {
            instance.state.set('pacmanErr', 'Please enter a package');
        }
    },

    'click .package-clear-btn'(event, instance) {
        event.preventDefault();
        instance.state.set('alertErr', undefined);
        let config = instance.config.get();
        config.pacman.packages = [];
        instance.config.set(config);
    },
    'click .package-reset-btn'(event, instance) {
        event.preventDefault();
        instance.state.set('alertErr', undefined);
        let config = instance.config.get();
        config.pacman = instance.baseConfig().pacman;
        instance.config.set(config);
    },

    'submit .systemd-form'(event, instance) {
        event.preventDefault();
        let serviceName = event.target.serviceName.value;
        if (serviceName) {
            let config = instance.config.get();
            let services = config.systemd.services;
            if (services.indexOf(serviceName) === -1) {
                services.push(serviceName);
                config.systemd.services = services;
                instance.config.set(config);
                instance.state.set('systemdErr', undefined);
                event.target.serviceName.value = '';
            } else {
                instance.state.set('systemdErr', 'That service has already been added');
            }
        } else {
            instance.state.set('systemdErr', 'Please enter a service');
        }
    },

    'click .service-clear-btn'(event, instance) {
        event.preventDefault();
        instance.state.set('alertErr', undefined);
        let config = instance.config.get();
        config.systemd.services = [];
        instance.config.set(config);
    },
    'click .service-reset-btn'(event, instance) {
        event.preventDefault();
        instance.state.set('alertErr', undefined);
        let config = instance.config.get();
        console.log(instance.config.get());
        config.systemd = instance.baseConfig().systemd;
        console.log(instance.baseConfig().systemd);
        instance.config.set(config);
        console.log(instance.config.get());
    },

    'submit .favorite-apps-form'(event, instance) {
        event.preventDefault();
        let appName = event.target.appName.value;
        if (appName) {
            let config = instance.config.get();
            let apps = config.gnome.favorite_apps;
            if (apps.indexOf(appName) === -1) {
                apps.push(appName);
                config.gnome.favorite_apps = apps;
                instance.config.set(config);
                instance.state.set('appErr', undefined);
                event.target.appName.value = '';
            } else {
                instance.state.set('appErr', 'That app has already been added');
            }
        } else {
            instance.state.set('appErr', 'Please enter an app');
        }
    },

    'click .app-clear-btn'(event, instance) {
        event.preventDefault();
        let config = instance.config.get();
        config.gnome.favorite_apps = [];
        instance.config.set(config);
    },
    'click .app-reset-btn'(event, instance) {
        event.preventDefault();
        let config = instance.config.get();
        console.log(instance.config.get());
        config.gnome.favorite_apps = instance.baseConfig().gnome.favorite_apps;
        instance.config.set(config);
        console.log(instance.config.get());
    },

    'submit .extensions-form'(event, instance) {
        event.preventDefault();
        let extensionName = event.target.extensionName.value;
        if (extensionName) {
            let config = instance.config.get();
            let extensions = config.gnome.extensions;
            if (extensions.indexOf(extensionName) === -1) {
                extensions.push(extensionName);
                config.gnome.extensions = extensions;
                instance.config.set(config);
                instance.state.set('extensionErr', undefined);
                event.target.extensionName.value = '';
            } else {
                instance.state.set('extensionErr', 'That extension has already been added');
            }
        } else {
            instance.state.set('extensionErr', 'Please enter an extension');
        }
    },

    'click .extension-clear-btn'(event, instance) {
        event.preventDefault();
        let config = instance.config.get();
        config.gnome.extensions = [];
        instance.config.set(config);
    },
    'click .extension-reset-btn'(event, instance) {
        event.preventDefault();
        let config = instance.config.get();
        console.log(instance.config.get());
        config.gnome.extensions = instance.baseConfig().gnome.extensions;
        instance.config.set(config);
        console.log(instance.config.get());
    },

    'click .uploadWallpaper'(event, instance) {
        event.preventDefault();
        Template.instance().state.set('uploadWallpaperTab', true);
    },
    'click .pasteWallpaper'(event, instance) {
        event.preventDefault();
        Template.instance().state.set('uploadWallpaperTab', false);
    },
    'click .uploadLock'(event, instance) {
        event.preventDefault();
        Template.instance().state.set('uploadLockTab', true);
    },
    'click .pasteLock'(event, instance) {
        event.preventDefault();
        Template.instance().state.set('uploadLockTab', false);
    },

    // 'change .uploadWallpaperInput'(event, instance) {
    //     if (event.target.files.length > 0) {
    //         file = event.target.files[0];
    //         instance.state.set('wallpaperText', file.name);
    //         // let uploader = new Slingshot.Upload('wallpapers');
    //         // uploader.send(file, function(err, url) {
    //         //     if (err) {
    //         //         console.log(err);
    //         //     } else {
    //         //         instance.state.set('wallpaperUrl', url);
    //         //         instance.state.set('wallpaperUploaded', true);
    //         //         console.log(url);
    //         //     }
    //         // });
    //     }
    // },
    // 'change .uploadLockInput'(event, instance) {
    //     if (event.target.files.length > 0) {
    //         file = event.target.files[0];
    //         instance.state.set('lockBackgroundText', file.name);
    //         // let uploader = new Slingshot.Upload('wallpapers');
    //         // uploader.send(file, function(err, url) {
    //         //     if (err) {
    //         //         console.log(err);
    //         //     } else {
    //         //         instance.state.set('lockUrl', url);
    //         //         instance.state.set('lockUploaded', true);
    //         //         console.log(url);
    //         //     }
    //         // });
    //     }
    // },

    'click .gnome'(event, instance) {
        instance.state.set('gnomeTab', true);
        setGnomeConfig(instance);
    },
    'click .gdm'(event, instance) {
        instance.state.set('gdmTab', true);
        // setGdmConfig(instance);
    },
    'click .zsh'(event, instance) {
        instance.state.set('zshTab', true);
        // setZshConfig(instance);
    },

    // 'change .screenshotInput'(event, instance) {
    //     if (event.target.files.length > 0) {
    //         file = event.target.files[0];
    //         instance.state.set('uploadScreenshotText', file.name);
    //         // let uploader = new Slingshot.Upload('screenshots');
    //         // uploader.send(file, function(err, url) {
    //         //     if (err) {
    //         //         console.log(err);
    //         //     } else {
    //         //         instance.state.set('screenshotUrl', url);
    //         //         instance.state.set('screenshotUploaded', true);
    //         //         console.log(url);
    //         //     }
    //         // });
    //     }
    // },

    'submit .set-settings'(event, instance) {
        event.preventDefault();
        let target = event.target;

        if (instance.state.get('gnomeTab')) {
            setGnomeConfig(instance, true);
        } else {
            if (!Template.instance().state.get('sureNoDE')) {
                Template.instance().state.set('alertErr', 'Are you sure you don\'t want to select a desktop environment?');
                Template.instance().state.set('sureNoDE', true);
                FlowRouter.go('/create/' + Template.instance().baseName + '#create-form-head');
                return;
            }
        }

        if (instance.state.get('gdmTab')) {
            setGdmConfig(instance, true);
        } else {
            if (!Template.instance().state.get('sureNoDM')) {
                Template.instance().state.set('alertErr', 'Are you sure you don\'t want to select a desktop manager?');
                Template.instance().state.set('sureNoDM', true);
                FlowRouter.go('/create/' + Template.instance().baseName + '#create-form-head');
                return;
            }
        }

        if (instance.state.get('zshTab')) {
            setZshConfig(instance, true);
        } else {
            if (!Template.instance().state.get('sureNoShell')) {
                Template.instance().state.set('alertErr', 'Are you sure you don\'t want to select a shell?');
                Template.instance().state.set('sureNoShell', true);
                FlowRouter.go('/create/' + Template.instance().baseName + '#create-form-head');
                return;
            }
        }

        let screenshotUrl = instance.state.get('screenshotUrl');
        console.log(screenshotUrl);
        if (!screenshotUrl) {
            screenshotUrl = '/assets/img/no-screenshot.png';
        }
        // if (target.screenshotInput.files.length > 0) {
        //     if (instance.state.get('screenshotUploaded')) {
        //         screenshotUrl = ;
        //     } else {
        //         Template.instance().state.set('alertErr', 'Please wait for the screenshot to upload');
        //         FlowRouter.go('/create/' + Template.instance().baseName + '#create-form-head');
        //         return;
        //     }
        // }

        if (!target.configName.value) {
            Template.instance().state.set('alertErr', 'Please enter a name for this configuration');
            FlowRouter.go('/create/' + Template.instance().baseName + '#create-form-head');
            return;
        }

        let fullName = target.configName.value;
        let cleanName = fullName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        if (Configs.findOne({owner: Meteor.userId(), name: cleanName})) {
            Template.instance().state.set('alertErr', 'You already have a config with this name. Please select another one.');
            FlowRouter.go('/create/' + Template.instance().baseName + '#create-form-head');
            return;
        }
        let description = target.configDesc.value;

        setCodeConfig(instance, true);

        console.log(instance.config.get());
        console.log(cleanName);
        Meteor.call('configs.create', instance.config.get(), cleanName, fullName, screenshotUrl, description);
        FlowRouter.go('myConfigs');
    },
});

Template.packageLI.events({
    'click .remove-btn'(event, instance) {
        event.preventDefault();
        console.log(this.package);
        let config = this.config.get();
        let packages = config.pacman.packages;
        packages.splice(packages.indexOf(this.package), 1)
        config.pacman.packages = packages;
        this.config.set(config);
    },
});

Template.serviceLI.events({
    'click .remove-btn'(event, instance) {
        event.preventDefault();
        let config = this.config.get();
        let services = config.systemd.services;
        services.splice(services.indexOf(this.service), 1)
        config.systemd.services = services;
        this.config.set(config);
    },
});

Template.appLI.events({
    'click .remove-btn'(event, instance) {
        event.preventDefault();
        let config = this.config.get();
        let apps = config.gnome.favorite_apps;
        apps.splice(apps.indexOf(this.app), 1)
        config.gnome.favorite_apps = apps;
        this.config.set(config);
    },
});

Template.extensionLI.events({
    'click .remove-btn'(event, instance) {
        event.preventDefault();
        let config = this.config.get();
        let extensions = config.gnome.extensions;
        extensions.splice(extensions.indexOf(this.extension), 1)
        config.gnome.extensions = extensions;
        this.config.set(config);
    },
});
