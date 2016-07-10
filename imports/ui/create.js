import {Template} from 'meteor/templating';

import {Configs} from '../api/configs.js';

import sanitizeFnm from 'sanitize-filename';

Slingshot.fileRestrictions('screenshots', {
    allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
    maxSize: 10 * 1024 * 1024,
});

Template.createPage.onCreated(function() {
    this.state = new ReactiveDict();

    this.state.set('uploadWallpaperText', 'Choose image');
    this.state.set('uploadLockText', 'Choose image');

    this.state.set('uploadWallpaperTab', false);
    this.state.set('uploadLockTab', false);

    this.state.set('uploadScreenshotText', 'Choose image');

    this.config = new ReactiveVar({});

    let baseName = FlowRouter.current().params.baseName;
    this.baseName = baseName;
    let self = this;
    Meteor.subscribe('configs', {
        onReady() {
            console.log(Configs.findOne({name: baseName}));
            self.baseConfig = () => Configs.findOne({name: baseName}).config;
            if (!self.baseConfig()) {
                self.state.set('alertErr', 'Unknown base configuration `' +  baseName + '` (the tail of the above url)');
                self.baseConfig = () => Configs.findOne({name: 'apricity-gnome'}).config;
            }
            console.log(self.baseConfig());
            self.config.set(self.baseConfig());
            console.log(self.config.get());

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

    uploadWallpaperText() {
        return Template.instance().state.get('uploadWallpaperText');
    },
    uploadLockText() {
        return Template.instance().state.get('uploadLockText');
    },

    uploadScreenshotText() {
        return Template.instance().state.get('uploadScreenshotText');
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
        return Template.instance().config.get().zsh.zshrc.join('\n');
    },
    zshTab() {
        return Template.instance().state.get('zshTab');
    },

    code() {
        return Template.instance().config.get().code;
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
    config.gnome = {
        'gtk_theme': document.getElementById('gtkTheme').value,
        'shell_theme': document.getElementById('shellTheme').value,
        'icon_theme': document.getElementById('iconTheme').value,
        'gtk_button_layout': document.getElementById('gtkButtonLayout').value,
        'dynamic_workspaces': document.getElementById('dynamicWorkspaces').value,
        'desktop_icons': document.getElementById('desktopIcons').value,
    };
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

    'change .uploadWallpaperInput'(event, instance) {
        if (event.target.files.length > 0) {
            file = event.target.files[0];
            instance.state.set('wallpaperText', file.name);
            let uploader = new Slingshot.Upload('wallpapers');
            uploader.send(file, function(err, url) {
                if (err) {
                    console.log(err);
                } else {
                    instance.state.set('wallpaperUrl', url);
                    instance.state.set('wallpaperUploaded', true);
                    console.log(url);
                }
            });
        }
    },
    'change .uploadLockInput'(event, instance) {
        if (event.target.files.length > 0) {
            file = event.target.files[0];
            instance.state.set('lockBackgroundText', file.name);
            let uploader = new Slingshot.Upload('wallpapers');
            uploader.send(file, function(err, url) {
                if (err) {
                    console.log(err);
                } else {
                    instance.state.set('lockUrl', url);
                    instance.state.set('lockUploaded', true);
                    console.log(url);
                }
            });
        }
    },

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

    'change .screenshotInput'(event, instance) {
        if (event.target.files.length > 0) {
            file = event.target.files[0];
            instance.state.set('uploadScreenshotText', file.name);
            let uploader = new Slingshot.Upload('screenshots');
            uploader.send(file, function(err, url) {
                if (err) {
                    console.log(err);
                } else {
                    instance.state.set('screenshotUrl', url);
                    instance.state.set('screenshotUploaded', true);
                    console.log(url);
                }
            });
        }
    },

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

        let screenshotUrl = '/assets/img/no-screenshot.png';
        if (target.screenshotInput.files.length > 0) {
            if (instance.state.get('screenshotUploaded')) {
                screenshotUrl = instance.state.get('screenshotUrl');
            } else {
                Template.instance().state.set('alertErr', 'Please wait for the screenshot to upload');
                FlowRouter.go('/create/' + Template.instance().baseName + '#create-form-head');
                return;
            }
        }

        if (!target.configName.value) {
            Template.instance().state.set('alertErr', 'Please enter a name for this configuration');
            FlowRouter.go('/create/' + Template.instance().baseName + '#create-form-head');
            return;
        }
        let cleanName = target.configName.value.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        if (Configs.findOne({owner: Meteor.userId(), name: cleanName})) {
            Template.instance().state.set('alertErr', 'You already have a config with this name. Please select another one.');
            FlowRouter.go('/create/' + Template.instance().baseName + '#create-form-head');
            return;
        }

        setCodeConfig(instance, true);

        console.log(instance.config.get());
        console.log(cleanName);
        Configs.insert({
            config: instance.config.get(),
            name: cleanName,
            fullName: target.configName.value,
            screenshot: screenshotUrl,
            description: target.configDesc.value,
            public: false,
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });
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
