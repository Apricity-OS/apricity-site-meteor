let exposedRoutes = FlowRouter.group({});

exposedRoutes.route('/download', {
    action: function() {
        BlazeLayout.render('app', {
            page: 'downloadPage'
        });
    },
    name: 'download'
});

exposedRoutes.route('/forum', {
    action: function() {
        BlazeLayout.render('app', {
            page: 'forumPage'
        });
    },
    name: 'forum'
});

exposedRoutes.route('/forum/category/:_id', {
    action: function() {
        BlazeLayout.render('app', {
            page: 'forumCategoryPage'
        });
    },
    name: 'forumCategory'
});

exposedRoutes.route('/forum/discussion/:_id', {
  action: function() {
    BlazeLayout.render('app', {
      page: 'forumDiscussionPage'
    });
  },
  name: 'forumDiscussion'
});

exposedRoutes.route('/blog', {
  action: function() {
    BlazeLayout.render('app', {
      page: 'blogPage'
    });
  },
  name: 'blog'
});

exposedRoutes.route('/blog/post/:cleanName', {
  action: function() {
    BlazeLayout.render('app', {
      page: 'blogPostPage'
    });
  },
  name: 'blogPost'
});

exposedRoutes.route('/docs', {
  action: function() {
    BlazeLayout.render('app', {
      page: 'docsPage'
    });
  },
  name: 'docs'
});

exposedRoutes.route('/blog/docs/:cleanName', {
  action: function() {
    BlazeLayout.render('app', {
      page: 'docsEntryPage'
    });
  },
  name: 'docsEntry'
});

exposedRoutes.route('/docs/entry/:cleanName', {
  action: function() {
    BlazeLayout.render('app', {
      page: 'docsEntryPage'
    });
  },
  name: 'docsEntry'
});

function redirectIfLoggedIn(ctx, redirect) {
    if (Meteor.userId()) {
        FlowRouter.go('dash');
    }
}

let marketing = FlowRouter.group({
    name: 'marketing',
    triggersEnter: [redirectIfLoggedIn]
});

marketing.route('/', {
    action: function() {
        BlazeLayout.render('app', {
            page: 'homePage'
        });
    },
    name: 'home'
});

marketing.route('/features', {
  action: function() {
    BlazeLayout.render('app', {
      page: 'featuresPage'
    });
  },
  name: 'features'
});

function redirectIfNotLoggedIn(ctx, redirect) {
    if (!Meteor.userId()) {
        FlowRouter.go('signup');
    }
}

let authenticatedRoutes = FlowRouter.group({
    name: 'authenticatedRoutes',
    triggersEnter: [redirectIfNotLoggedIn]
});

authenticatedRoutes.route('/dash', {
    action: function() {
        BlazeLayout.render('app', {
            page: 'dashPage'
        });
    },
    name: 'dash'
});

authenticatedRoutes.route('/my-configs', {
    action: function() {
        BlazeLayout.render('app', {
            page: 'myConfigsPage'
        });
    },
    name: 'myConfigs'
});

authenticatedRoutes.route('/user/:username', {
    action: function() {
        BlazeLayout.render('app', {
            page: 'userConfigsPage'
        });
    },
    name: 'userConfigs'
});

authenticatedRoutes.route('/user/:username/config/:configName', {
    action: function() {
        BlazeLayout.render('app', {
            page: 'specificConfigPage'
        });
    },
    name: 'specificConfig'
});

authenticatedRoutes.route('/user/:username/config/:configName/iso', {
    action: function() {
        BlazeLayout.render('app', {
            page: 'isoPage'
        });
    },
    name: 'iso'
});

authenticatedRoutes.route('/user/:username/config/:configName/edit', {
    action: function() {
        BlazeLayout.render('app', {
            page: 'createPage'
        });
    },
    name: 'specificConfigEdit'
});

authenticatedRoutes.route('/user/:username/config/:configName/clone', {
    action: function() {
        BlazeLayout.render('app', {
            page: 'createPage'
        });
    },
    name: 'specificConfigClone'
});

authenticatedRoutes.route('/create/', {
    action: function() {
        BlazeLayout.render('app', {
            page: 'createPage'
        });
    },
    name: 'create'
});

authenticatedRoutes.route('/account', {
    action: function() {
        BlazeLayout.render('app', {
            page: 'accountPage'
        });
    },
    name: 'account'
});

authenticatedRoutes.route('/signout', {
    action: function() {
        AccountsTemplates.logout();
    },
    name: 'signout'
});

authenticatedRoutes.route('/forum/add-discussion', {
  action: function() {
    BlazeLayout.render('app', {
      page: 'addDiscussionPage'
    });
  },
  name: 'addDiscussion'
});

authenticatedRoutes.route('/docs/add-entry', {
  action: function() {
    BlazeLayout.render('app', {
      page: 'addDocsEntryPage'
    });
  },
  name: 'addDocsEntry'
});

function redirectIfNotAdmin() {
    if (!Roles.userIsInRole(Meteor.userId(), 'admin')) {
        FlowRouter.go('dash');
    }
}

let adminRoutes = FlowRouter.group({
    name: 'admin',
    triggersEnter: [redirectIfNotLoggedIn,
        redirectIfNotAdmin
    ]
});

adminRoutes.route('/admin', {
    action: function() {
        FlowRouter.go('adminUsers');
    },
    name: 'admin'
});

adminRoutes.route('/admin/users', {
    action: function() {
        BlazeLayout.render('app', {
            page: 'adminUserPage'
        });
    },
    name: 'adminUsers'
});

adminRoutes.route('/admin/content', {
    action: function() {
        BlazeLayout.render('app', {
            page: 'adminContentPage'
        });
    },
    name: 'adminContent'
});

FlowRouter.notFound = {
  action: function() {
    BlazeLayout.render('app', {
      page: 'pageNotFound'
    });
  }
};
