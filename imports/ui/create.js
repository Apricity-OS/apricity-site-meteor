import {Template} from 'meteor/templating';

import {Configs} from '../api/configs.js';
import {getContent} from './home.js';

Template.createPage.onRendered(function() {
  if (!Roles.userIsInRole(Meteor.userId(), 'createdConfig')) {
    $('#welcome-modal').modal('show');
  }
});

Template.createPage.onCreated(function() {
  this.state = new ReactiveDict();

  this.state.set('uploadWallpaperText', 'Choose image');
  this.state.set('cinUploadWallpaperText', 'Choose image');
  this.state.set('uploadLockText', 'Choose image');

  this.state.set('uploadWallpaperTab', false);
  this.state.set('cinUploadWallpaperTab', false);
  this.state.set('uploadLockTab', false);

  this.state.set('uploadScreenshotText', 'Choose image');
  this.state.set('uploadScreenshotTab', false);

  this.config = new ReactiveVar({});

  this.hasBaseConfig = new ReactiveVar(false);
  let self = this;
  Meteor.subscribe('content');
  Meteor.subscribe('configs', {
    onReady() {
      if (FlowRouter.getParam('username') && FlowRouter.getParam('configName')) {
        if (FlowRouter.current().route.name === 'specificConfigClone') {
          self.creating = true;
          let baseConfig = Configs.findOne({
            name: FlowRouter.getParam('configName'),
            username: FlowRouter.getParam('username')
          });
          self.state.set('screenshotUrl', baseConfig.screenshot);
          self.state.set('fullName', baseConfig.fullName);
          self.state.set('description', baseConfig.description);
          self.baseConfig = () => baseConfig.config;
          console.log('Cloning');
          console.log(self.baseConfig());
          self.hasBaseConfig.set(true);
        } else if (FlowRouter.current().route.name === 'specificConfigEdit') {
          self.edit = true;
          let baseConfig = Configs.findOne({
            name: FlowRouter.getParam('configName'),
            username: FlowRouter.getParam('username')
          });
          self.baseConfigId = baseConfig._id;
          console.log('Base config id');
          console.log(self.baseConfigId);
          self.state.set('screenshotUrl', baseConfig.screenshot);
          self.state.set('fullName', baseConfig.fullName);
          self.state.set('description', baseConfig.description);
          self.baseConfig = () => baseConfig.config;
          console.log('Editing');
          self.hasBaseConfig.set(true);
          self.hasBaseConfig = new ReactiveVar(true);
        } else {
          console.log('Not sure');
        }
      } else {
        self.creating = true;
        self.baseConfig = function() {return {};};
        console.log(self.baseConfig());
        self.hasBaseConfig.set(true);
        console.log('Creating blank');
        self.state.set('uploadScreenshotTab', true);
        self.state.set('cinUploadScreenshotTab', true);
        self.state.set('uploadGtkThemeTab', true);
        self.state.set('cinUploadGtkThemeTab', true);
        self.state.set('uploadShellThemeTab', true);
        self.state.set('cinUploadShellThemeTab', true);
        self.state.set('uploadIconThemeTab', true);
        self.state.set('cinUploadIconThemeTab', true);
      }

      console.log(self.baseConfig());
      if (self.baseConfig().gnome) {
        self.state.set('gnomeTab', true);
      } else if (self.baseConfig().cinnamon) {
        self.state.set('cinnamonTab', true);
      }

      self.state.set('gdmTab', self.baseConfig().gdm ? true : false);
      self.state.set('zshTab', self.baseConfig().zsh ? true : false);

      self.config.set(_.deepClone(self.baseConfig(), 3));
    }
  });
});

Template.createPage.helpers({
  creating() {
    return Template.instance().creating;
  },
  freezedryCreateWelcome() {
    return getContent('freezedryCreateWelcome');
  },

  uploadWallpaperTab() {
    return Template.instance().state.get('uploadWallpaperTab');
  },
  cinUploadWallpaperTab() {
    return Template.instance().state.get('cinUploadWallpaperTab');
  },
  uploadGtkThemeTab() {
    return Template.instance().state.get('uploadGtkThemeTab');
  },
  cinUploadGtkThemeTab() {
    return Template.instance().state.get('cinUploadGtkThemeTab');
  },
  uploadShellThemeTab() {
    return Template.instance().state.get('uploadShellThemeTab');
  },
  cinUploadShellThemeTab() {
    return Template.instance().state.get('cinUploadShellThemeTab');
  },
  uploadIconThemeTab() {
    return Template.instance().state.get('uploadIconThemeTab');
  },
  cinUploadIconThemeTab() {
    return Template.instance().state.get('cinUploadIconThemeTab');
  },
  uploadLockTab() {
    return Template.instance().state.get('uploadLockTab');
  },
  uploadScreenshotTab() {
    return Template.instance().state.get('uploadScreenshotTab');
  },

  pasteWallpaperTab() {
    return !Template.instance().state.get('uploadWallpaperTab');
  },
  cinPasteWallpaperTab() {
    return !Template.instance().state.get('cinUploadWallpaperTab');
  },
  pasteGtkThemeTab() {
    return !Template.instance().state.get('uploadGtkThemeTab');
  },
  cinPasteGtkThemeTab() {
    return !Template.instance().state.get('cinUploadGtkThemeTab');
  },
  pasteShellThemeTab() {
    return !Template.instance().state.get('uploadShellThemeTab');
  },
  cinPasteShellThemeTab() {
    return !Template.instance().state.get('cinUploadShellThemeTab');
  },
  pasteIconThemeTab() {
    return !Template.instance().state.get('uploadIconThemeTab');
  },
  cinPasteIconThemeTab() {
    return !Template.instance().state.get('cinUploadIconThemeTab');
  },
  pasteLockTab() {
    return !Template.instance().state.get('uploadLockTab');
  },
  pasteScreenshotTab() {
    return !Template.instance().state.get('uploadScreenshotTab');
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
  cinWallpaperCallbacks() {
    let instance = Template.instance();
    return {
      finished(index, fileInfo, context) {
        fileInfo.path = fileInfo.path.replace(Meteor.user().username + "//", Meteor.user().username + "/");
        fileInfo.url = fileInfo.url.replace(Meteor.user().username + "//", Meteor.user().username + "/");
        console.log(fileInfo.url);
        instance.state.set('cinWallpaperUrl', fileInfo.url);
        console.log(instance.state);
      }
    };
  },

  gtkThemeCallbacks() {
    let instance = Template.instance();
    return {
      finished(index, fileInfo, context) {
        fileInfo.path = fileInfo.path.replace(Meteor.user().username + "//", Meteor.user().username + "/");
        fileInfo.url = fileInfo.url.replace(Meteor.user().username + "//", Meteor.user().username + "/");
        console.log(fileInfo.url);
        instance.state.set('gtkThemeUrl', fileInfo.url);
        console.log(instance.state);
      }
    };
  },
  cinGtkThemeCallbacks() {
    let instance = Template.instance();
    return {
      finished(index, fileInfo, context) {
        fileInfo.path = fileInfo.path.replace(Meteor.user().username + "//", Meteor.user().username + "/");
        fileInfo.url = fileInfo.url.replace(Meteor.user().username + "//", Meteor.user().username + "/");
        console.log(fileInfo.url);
        instance.state.set('cinGtkThemeUrl', fileInfo.url);
        console.log(instance.state);
      }
    };
  },

  shellThemeCallbacks() {
    let instance = Template.instance();
    return {
      finished(index, fileInfo, context) {
        fileInfo.path = fileInfo.path.replace(Meteor.user().username + "//", Meteor.user().username + "/");
        fileInfo.url = fileInfo.url.replace(Meteor.user().username + "//", Meteor.user().username + "/");
        console.log(fileInfo.url);
        instance.state.set('shellThemeUrl', fileInfo.url);
        console.log(instance.state);
      }
    };
  },
  cinShellThemeCallbacks() {
    let instance = Template.instance();
    return {
      finished(index, fileInfo, context) {
        fileInfo.path = fileInfo.path.replace(Meteor.user().username + "//", Meteor.user().username + "/");
        fileInfo.url = fileInfo.url.replace(Meteor.user().username + "//", Meteor.user().username + "/");
        console.log(fileInfo.url);
        instance.state.set('cinShellThemeUrl', fileInfo.url);
        console.log(instance.state);
      }
    };
  },

  iconThemeCallbacks() {
    let instance = Template.instance();
    return {
      finished(index, fileInfo, context) {
        fileInfo.path = fileInfo.path.replace(Meteor.user().username + "//", Meteor.user().username + "/");
        fileInfo.url = fileInfo.url.replace(Meteor.user().username + "//", Meteor.user().username + "/");
        console.log(fileInfo.url);
        instance.state.set('iconThemeUrl', fileInfo.url);
        console.log(instance.state);
      }
    };
  },
  cinIconThemeCallbacks() {
    let instance = Template.instance();
    return {
      finished(index, fileInfo, context) {
        fileInfo.path = fileInfo.path.replace(Meteor.user().username + "//", Meteor.user().username + "/");
        fileInfo.url = fileInfo.url.replace(Meteor.user().username + "//", Meteor.user().username + "/");
        console.log(fileInfo.url);
        instance.state.set('cinIconThemeUrl', fileInfo.url);
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

  screenshotUrl() {
    return Template.instance().state.get('screenshotUrl');
  },
  fullName() {
    return Template.instance().state.get('fullName');
  },
  description() {
    return Template.instance().state.get('description');
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
      mode: 'shell'
      // theme: 'paraiso-dark'
    };
  },

  config() {
    return Template.instance().config;
  },
  hasBaseConfig() {
    return Template.instance().hasBaseConfig.get();
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
  cinnamon() {
    return Template.instance().config.get().cinnamon;
  },
  gnomeTab() {
    return Template.instance().state.get('gnomeTab');
  },
  cinnamonTab() {
    return Template.instance().state.get('cinnamonTab');
  },
  noDeTab() {
    let state = Template.instance().state;
    return !state.get('gnomeTab') && !state.get('cinnamonTab');
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
    return undefined;
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
      return undefined;
    }
  },
  rootCode() {
    if (Template.instance().config.get().code) {
      console.log(Template.instance().config.get().code);
      return Template.instance().config.get().code.root.join('\n');
    }
    return undefined;
  }
});

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

function setGnomeGtkThemeConfig(instance, alert) {
  let config = instance.config.get();
  if (instance.state.get('uploadGtkThemeTab')) {
    if (instance.state.get('gtkThemeUrl')) {
      config.gnome.gtk_theme = instance.state.get('gtkThemeUrl');
    } else if (alert) {
      instance.state.set('alertErr', 'Please upload a GTK theme');
    }
  } else {
    config.gnome.gtk_theme = document.getElementById('pasteGtkThemeInput').value;
  }
  instance.config.set(config);
}

function setGnomeShellThemeConfig(instance, alert) {
  let config = instance.config.get();
  if (instance.state.get('uploadShellThemeTab')) {
    if (instance.state.get('shellThemeUrl')) {
      config.gnome.shell_theme = instance.state.get('shellThemeUrl');
    } else if (alert) {
      instance.state.set('alertErr', 'Please upload a shell theme');
    }
  } else {
    config.gnome.shell_theme = document.getElementById('pasteShellThemeInput').value;
  }
  instance.config.set(config);
}

function setGnomeIconThemeConfig(instance, alert) {
  let config = instance.config.get();
  if (instance.state.get('uploadIconThemeTab')) {
    if (instance.state.get('iconThemeUrl')) {
      config.gnome.icon_theme = instance.state.get('iconThemeUrl');
    } else if (alert) {
      instance.state.set('alertErr', 'Please upload a icon theme');
    }
  } else {
    config.gnome.icon_theme = document.getElementById('pasteIconThemeInput').value;
  }
  instance.config.set(config);
}

function setGnomeConfig(instance, alert) {
  let config = instance.config.get();

  console.log(document.getElementById('gtkTheme'));
  // config.gnome.gtk_theme = document.getElementById('gtkTheme').value;
  // config.gnome.shell_theme = document.getElementById('shellTheme').value;
  // config.gnome.icon_theme = document.getElementById('iconTheme').value;
  config.gnome.gtk_button_layout = document.getElementById('gtkButtonLayout').value;
  config.gnome.dynamic_workspaces = document.getElementById('dynamicWorkspaces').checked;
  config.gnome.desktop_icons = document.getElementById('desktopIcons').checked;

  instance.config.set(config);
  console.log(instance.config.get());
  setGnomeWallpaperConfig(instance, alert);
  setGnomeGtkThemeConfig(instance, alert);
  setGnomeShellThemeConfig(instance, alert);
  setGnomeIconThemeConfig(instance, alert);
  setGnomeLockConfig(instance, alert);
}

function setCinnamonWallpaperConfig(instance, alert) {
  let config = instance.config.get();
  if (instance.state.get('cinUploadWallpaperTab')) {
    if (instance.state.get('cinWallpaperUrl')) {
      config.cinnamon.wallpaper = instance.state.get('cinWallpaperUrl');
    } else if (alert) {
      instance.state.set('alertErr', 'Please upload a wallpaper');
    }
  } else {
    config.cinnamon.wallpaper = document.getElementById('cinPasteWallpaperInput').value;
  }
  instance.config.set(config);
}

function setCinnamonGtkThemeConfig(instance, alert) {
  console.log('Setting cinnamon gtk theme config');
  let config = instance.config.get();
  if (instance.state.get('cinUploadGtkThemeTab')) {
    console.log('On upload gtk theme tab');
    if (instance.state.get('cinGtkThemeUrl')) {
      config.cinnamon.gtk_theme = instance.state.get('cinGtkThemeUrl');
    } else if (alert) {
      instance.state.set('alertErr', 'Please upload a GTK theme');
    }
  } else {
    config.cinnamon.gtk_theme = document.getElementById('cinPasteGtkThemeInput').value;
  }
  instance.config.set(config);
}

function setCinnamonShellThemeConfig(instance, alert) {
  console.log('Setting cinnamon shell theme config');
  let config = instance.config.get();
  if (instance.state.get('cinUploadShellThemeTab')) {
    console.log('On upload shell theme tab');
    if (instance.state.get('cinShellThemeUrl')) {
      config.cinnamon.shell_theme = instance.state.get('cinShellThemeUrl');
    } else if (alert) {
      instance.state.set('alertErr', 'Please upload a shell theme');
    }
  } else {
    config.cinnamon.shell_theme = document.getElementById('cinPasteShellThemeInput').value;
  }
  instance.config.set(config);
}

function setCinnamonIconThemeConfig(instance, alert) {
  console.log('Setting cinnamon icon theme config');
  let config = instance.config.get();
  if (instance.state.get('cinUploadIconThemeTab')) {
    console.log('On upload icon theme tab');
    if (instance.state.get('cinIconThemeUrl')) {
      config.cinnamon.icon_theme = instance.state.get('cinIconThemeUrl');
    } else if (alert) {
      instance.state.set('alertErr', 'Please upload a icon theme');
    }
  } else {
    config.cinnamon.icon_theme = document.getElementById('cinPasteIconThemeInput').value;
  }
  instance.config.set(config);
}

function setCinnamonConfig(instance, alert) {
  let config = instance.config.get();

  console.log(document.getElementById('cinGtkTheme'));
  // config.cinnamon.gtk_theme = document.getElementById('cinGtkTheme').value;
  // config.cinnamon.shell_theme = document.getElementById('cinShellTheme').value;
  // config.cinnamon.icon_theme = document.getElementById('cinIconTheme').value;
  config.cinnamon.gtk_button_layout = document.getElementById('cinGtkButtonLayout').value;

  instance.config.set(config);
  console.log(instance.config.get());
  setCinnamonWallpaperConfig(instance, alert);
  setCinnamonGtkThemeConfig(instance, alert);
  setCinnamonShellThemeConfig(instance, alert);
  setCinnamonIconThemeConfig(instance, alert);
}

function setGdmConfig(instance, alert) {
  let config = instance.config.get();
  config.gdm = {'empty': true};
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
    zshrc: processCode(document.getElementById('zshrc').value)
  };
  instance.config.set(config);
}

function setCodeConfig(instance, alert) {
  let config = instance.config.get();
  config.code = {
    root: processCode(document.getElementById('rootCode').value),
    user: processCode(document.getElementById('userCode').value)
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
    config.pacman = _.deepClone(instance.baseConfig().pacman, 2);
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
    config.systemd = _.deepClone(instance.baseConfig().systemd, 3);
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

  'submit .cin-favorite-apps-form'(event, instance) {
    event.preventDefault();
    let appName = event.target.appName.value;
    if (appName) {
      let config = instance.config.get();
      let apps = config.cinnamon.favorite_apps;
      if (apps.indexOf(appName) === -1) {
        apps.push(appName);
        config.cinnamon.favorite_apps = apps;
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

  'change .configName'(event, instance) {
    event.preventDefault();
    instance.state.set('fullName', event.target.value);
  },
  'change .description'(event, instance) {
    event.preventDefault();
    instance.state.set('description', event.target.value);
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
    config.gnome.favorite_apps = _.deepClone(instance.baseConfig().gnome.favorite_apps, 2);
    instance.config.set(config);
    console.log(instance.config.get());
  },

  'click .cin-app-clear-btn'(event, instance) {
    event.preventDefault();
    let config = instance.config.get();
    config.cinnamon.favorite_apps = [];
    instance.config.set(config);
  },
  'click .cin-app-reset-btn'(event, instance) {
    event.preventDefault();
    let config = instance.config.get();
    console.log(instance.config.get());
    console.log(instance.baseConfig());
    config.cinnamon.favorite_apps = _.deepClone(instance.baseConfig().cinnamon.favorite_apps, 2);
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
    config.gnome.extensions = _.deepClone(instance.baseConfig().gnome.extensions, 2);
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

  'click .cinUploadWallpaper'(event, instance) {
    event.preventDefault();
    Template.instance().state.set('cinUploadWallpaperTab', true);
  },
  'click .cinPasteWallpaper'(event, instance) {
    event.preventDefault();
    Template.instance().state.set('cinUploadWallpaperTab', false);
  },

  'click .uploadGtkTheme'(event, instance) {
    event.preventDefault();
    Template.instance().state.set('uploadGtkThemeTab', true);
  },
  'click .pasteGtkTheme'(event, instance) {
    event.preventDefault();
    Template.instance().state.set('uploadGtkThemeTab', false);
  },

  'click .cinUploadGtkTheme'(event, instance) {
    event.preventDefault();
    Template.instance().state.set('cinUploadGtkThemeTab', true);
  },
  'click .cinPasteGtkTheme'(event, instance) {
    event.preventDefault();
    Template.instance().state.set('cinUploadGtkThemeTab', false);
  },

  'click .uploadShellTheme'(event, instance) {
    event.preventDefault();
    Template.instance().state.set('uploadShellThemeTab', true);
  },
  'click .pasteShellTheme'(event, instance) {
    event.preventDefault();
    Template.instance().state.set('uploadShellThemeTab', false);
  },

  'click .cinUploadShellTheme'(event, instance) {
    event.preventDefault();
    Template.instance().state.set('cinUploadShellThemeTab', true);
  },
  'click .cinPasteShellTheme'(event, instance) {
    event.preventDefault();
    Template.instance().state.set('cinUploadShellThemeTab', false);
  },

  'click .uploadIconTheme'(event, instance) {
    event.preventDefault();
    Template.instance().state.set('uploadIconThemeTab', true);
  },
  'click .pasteIconTheme'(event, instance) {
    event.preventDefault();
    Template.instance().state.set('uploadIconThemeTab', false);
  },

  'click .cinUploadIconTheme'(event, instance) {
    event.preventDefault();
    Template.instance().state.set('cinUploadIconThemeTab', true);
  },
  'click .cinPasteIconTheme'(event, instance) {
    event.preventDefault();
    Template.instance().state.set('cinUploadIconThemeTab', false);
  },

  'click .uploadLock'(event, instance) {
    event.preventDefault();
    Template.instance().state.set('uploadLockTab', true);
  },
  'click .pasteLock'(event, instance) {
    event.preventDefault();
    Template.instance().state.set('uploadLockTab', false);
  },
  'click .uploadScreenshot'(event, instance) {
    event.preventDefault();
    Template.instance().state.set('uploadScreenshotTab', true);
  },
  'click .pasteScreenshot'(event, instance) {
    event.preventDefault();
    Template.instance().state.set('uploadScreenshotTab', false);
  },

  'click .gnome'(event, instance) {
    instance.state.set('gnomeTab', true);
    instance.state.set('cinnamonTab', false);
    setGnomeConfig(instance);
  },
  'click .cinnamon'(event, instance) {
    instance.state.set('gnomeTab', false);
    instance.state.set('cinnamonTab', true);
    setCinnamonConfig(instance);
  },
  'click .noDe'(event, instance) {
    instance.state.set('gnomeTab', false);
    instance.state.set('cinnamonTab', false);
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

  'submit .set-settings'(event, instance) {
    event.preventDefault();
    let target = event.target;

    if (instance.state.get('gnomeTab')) {
      setGnomeConfig(instance, true);
    } else if (instance.state.get('cinnamonTab')){
      setCinnamonConfig(instance, true);
    }

    if (instance.state.get('gdmTab')) {
      setGdmConfig(instance, true);
    } else {
      if (!Template.instance().state.get('sureNoDM')) {
        Template.instance().state.set('alertErr', 'Are you sure you don\'t want to select a desktop manager?');
        Template.instance().state.set('sureNoDM', true);
        FlowRouter.go(FlowRouter.current().path + '#create-form-head');
        return;
      }
    }

    if (instance.state.get('zshTab')) {
      setZshConfig(instance, true);
    } else {
      if (!Template.instance().state.get('sureNoShell')) {
        Template.instance().state.set('alertErr', 'Are you sure you don\'t want to select a shell?');
        Template.instance().state.set('sureNoShell', true);
        FlowRouter.go(FlowRouter.current().path + '#create-form-head');
        return;
      }
    }

    let screenshotUrl = '';
    if (instance.state.get('uploadScreenshotTab')) {
      screenshotUrl = instance.state.get('screenshotUrl');
    } else {
      screenshotUrl = document.getElementById('pasteScreenshotInput').value;
    }

    console.log(screenshotUrl);
    if (!screenshotUrl) {
      screenshotUrl = '/assets/img/no-screenshot.png';
    }

    if (!target.configName.value) {
      Template.instance().state.set('alertErr', 'Please enter a name for this configuration');
      FlowRouter.go(FlowRouter.current().path + '#create-form-head');
      return;
    }

    let fullName = target.configName.value;
    let cleanName = fullName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    if (instance.creating) {
      if (Configs.findOne({owner: Meteor.userId(), name: cleanName})) {
        Template.instance().state.set('alertErr', 'You already have a config with this name. Please select another one.');
        FlowRouter.go(FlowRouter.current().path + '#create-form-head');
        return;
      }
    }
    let description = target.configDesc.value;

    setCodeConfig(instance, true);

    console.log(instance.config.get());
    console.log(cleanName);
    if (instance.creating) {
      Meteor.call('configs.create', instance.config.get(), cleanName, fullName, screenshotUrl, description);
    } else {
      Meteor.call('configs.edit', Configs.findOne({name: FlowRouter.getParam('configName'),
                                                   username: FlowRouter.getParam('username')})._id,
                  instance.config.get(), cleanName, fullName, screenshotUrl, description);
    }
    FlowRouter.go('myConfigs');
  }
});

Template.packageLI.events({
  'click .remove-btn'(event, instance) {
    event.preventDefault();
    console.log(this.package);
    let config = this.config.get();
    let packages = config.pacman.packages;
    packages.splice(packages.indexOf(this.package), 1);
    config.pacman.packages = packages;
    this.config.set(config);
  }
});

Template.serviceLI.events({
  'click .remove-btn'(event, instance) {
    event.preventDefault();
    let config = this.config.get();
    let services = config.systemd.services;
    services.splice(services.indexOf(this.service), 1);
    config.systemd.services = services;
    this.config.set(config);
  }
});

Template.appLI.events({
  'click .remove-btn'(event, instance) {
    event.preventDefault();
    let config = this.config.get();
    let apps = config.gnome.favorite_apps;
    apps.splice(apps.indexOf(this.app), 1);
    config.gnome.favorite_apps = apps;
    this.config.set(config);
  }
});

Template.cinAppLI.events({
  'click .remove-btn'(event, instance) {
    event.preventDefault();
    let config = this.config.get();
    let apps = config.cinnamon.favorite_apps;
    apps.splice(apps.indexOf(this.app), 1);
    config.cinnamon.favorite_apps = apps;
    this.config.set(config);
  }
});

Template.extensionLI.events({
  'click .remove-btn'(event, instance) {
    event.preventDefault();
    let config = this.config.get();
    let extensions = config.gnome.extensions;
    extensions.splice(extensions.indexOf(this.extension), 1);
    config.gnome.extensions = extensions;
    this.config.set(config);
  }
});

Template.customUpload.created = function() {
  Uploader.init(this);
};

Template.customUpload.rendered = function () {
  Uploader.render.call(this);
};

Template.customUpload.events({
  'click .start': function (e) {
    Uploader.startUpload.call(Template.instance(), e);
    console.log('Started upload');
  }
});

function roundDecimals(num, decimals) {
  return Math.round(num * decimals * 10) / (decimals * 10);
}

Template.customUpload.helpers({
  'infoLabel': function() {
    var instance = Template.instance();

    // we may have not yet selected a file
    var info = instance.info.get();
    if (!info) {
      return 'Select a file';
    }

    var progress = instance.globalInfo.get();

    // we display different result when running or not
    if (progress.running) {
      return info.name + ' - ' + progress.progress + '% - [' + progress.bitrate + ']';
    }
    return info.name + ' - ' + roundDecimals(info.size / 1000000, 2) + 'M';
  },
  'progress': function() {
    return Template.instance().globalInfo.get().progress + '%';
  },
  'submitData': function() {
    if (this.formData) {
      this.formData.contentType = this.contentType;
    } else {
      this.formData = {contentType: this.contentType};
    }
    return typeof this.formData == 'string' ? this.formData : JSON.stringify(this.formData);
  }
});
