let exposed = FlowRouter.group({});

function redirectIfLoggedIn (ctx, redirect) {  
    if (Meteor.userId()) {
        FlowRouter.go('dash');
    }
}

function redirectIfNotLoggedIn (ctx, redirect) {  
    if (!Meteor.userId()) {
        FlowRouter.go('signup');
    }
}

function redirectToLoginPage (ctx, redirect) {
    FlowRouter.go('login');
}

exposed.route('/', {
    triggersEnter: [redirectIfLoggedIn],
    action: function() {
        BlazeLayout.render('app', {
            page: 'homePage',
        });
    },
    name: 'home'
});

exposed.route('/download', {
    action: function() {
        BlazeLayout.render('app', {
            page: 'downloadPage',
        });
    },
    name: 'download'
});

exposed.route('/dash', {
    triggersEnter: [redirectIfNotLoggedIn],
    action: function() {
        BlazeLayout.render('app', {
            page: 'dashPage',
        });
    },
    name: 'dash'
});

exposed.route('/my-configs', {
    triggersEnter: [redirectIfNotLoggedIn],
    action: function() {
        BlazeLayout.render('app', {
            page: 'myConfigsPage',
        });
    },
    name: 'myConfigs'
});

exposed.route('/user/:username', {
    triggersEnter: [redirectIfNotLoggedIn],
    action: function() {
        BlazeLayout.render('app', {
            page: 'userConfigsPage',
        });
    },
    name: 'userConfigs'
});

exposed.route('/user/:username/config/:configName', {
    triggersEnter: [redirectIfNotLoggedIn],
    action: function() {
        BlazeLayout.render('app', {
            page: 'specificConfigPage',
        });
    },
    name: 'specificConfig'
});

exposed.route('/user/:username/config/:configName/iso', {
    triggersEnter: [redirectIfNotLoggedIn],
    action: function() {
        BlazeLayout.render('app', {
            page: 'isoPage',
        });
    },
    name: 'iso'
});

exposed.route('/user/:username/config/:configName/edit', {
    triggersEnter: [redirectIfNotLoggedIn],
    action: function() {
        BlazeLayout.render('app', {
            page: 'createPage',
        });
    },
    name: 'specificConfigEdit'
});

exposed.route('/user/:username/config/:configName/clone', {
    triggersEnter: [redirectIfNotLoggedIn],
    action: function() {
        BlazeLayout.render('app', {
            page: 'createPage',
        });
    },
    name: 'specificConfigClone'
});

exposed.route('/create/', {
    triggersEnter: [redirectIfNotLoggedIn],
    action: function() {
        BlazeLayout.render('app', {
            page: 'createPage',
        });
    },
    name: 'create'
});

exposed.route('/account', {
    triggersEnter: [redirectIfNotLoggedIn],
    action: function() {
        BlazeLayout.render('app', {
            page: 'accountPage',
        });
    },
    name: 'account'
});

exposed.route('/signup', {
    triggersEnter: [redirectIfLoggedIn],
    action: function() {
        BlazeLayout.render('app', {
            page: 'signupPage',
        });
    },
    name: 'signup'
});

exposed.route('/signout', {
    action: function() {
        Meteor.logout(function() {
            FlowRouter.go('login');
        });
    },
    name: 'signout'
});

exposed.route('/login', {
    triggersEnter: [redirectIfLoggedIn],
    action: function() {
        BlazeLayout.render('app', {
            page: 'loginPage',
        });
    },
    name: 'login'
});
