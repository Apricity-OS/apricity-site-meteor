import {check} from 'meteor/check';

AccountsTemplates.configure({
  // Behavior
  confirmPassword: true,
  enablePasswordChange: true,
  forbidClientAccountCreation: false,
  overrideLoginErrors: true,
  sendVerificationEmail: true,
  lowercaseUsername: true,
  focusFirstInput: true,

  // Appearance
  showAddRemoveServices: false,
  showForgotPasswordLink: true,
  showLabels: true,
  showPlaceholders: true,
  showResendVerificationEmailLink: false,

  // Client-side Validation
  continuousValidation: true,
  negativeFeedback: true,
  negativeValidation: true,
  positiveValidation: true,
  positiveFeedback: true,
  showValidating: true,

  // Privacy Policy and Terms of Use
  // privacyUrl: 'privacy',
  // termsUrl: 'terms-of-use',

  // Redirects
  homeRoutePath: '/',
  redirectTimeout: 4000,

  // Hooks
  onLogoutHook: function() {
    FlowRouter.go('/login');
  },

  postSignUpHook: function(userId, info) {
    Roles.addUsersToRoles(userId, 'newUser');
    Roles.addUsersToRoles(userId, 'user');
  },
  // onSubmitHook: mySubmitFunc,
  // preSignUpHook: myPreSubmitFunc,
  // postSignUpHook: myPostSubmitFunc,

  // Texts
  texts: {
    button: {
      signUp: "Register Now!"
    },
    title: {
      forgotPwd: "Recover Your Password"
    },
  },

  defaultLayout: 'auth',
  defaultContentRegion: 'page',
  defaultLayoutRegions: {}
});

AccountsTemplates.configureRoute('signIn', {
  name: 'login',
  path: '/login',
  redirect: '/',
});

AccountsTemplates.configureRoute('signUp', {
  name: 'signup',
  path: '/signup'
});

AccountsTemplates.configureRoute('forgotPwd', {
  name: 'forgotPwd',
  path: '/forgot-password',
});

AccountsTemplates.configureRoute('resetPwd', {
  name: 'resetPwd',
  path: '/reset-password'
});

AccountsTemplates.configureRoute('verifyEmail', {
  name: 'verifyEmail',
  path: '/verify-email'
});

AccountsTemplates.configureRoute('enrollAccount', {
  name: 'enrollAccount',
  path: '/enroll-account'
});

Meteor.methods({
  'users.removeFromNew'() {
    Roles.removeUsersFromRoles(Meteor.userId(), 'newUser');
  },
  'users.makeUser'(userId) {
    check(userId, String);
    if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-authorized');
    }
    if (userId === Meteor.userId() || Meteor.users.findOne({_id: userId}).username === 'admin') {
      throw new Meteor.Error('not-allowed');
    }
    Roles.removeUsersFromRoles(userId, 'admin');
    Roles.removeUsersFromRoles(userId, 'moderator');
    Roles.addUsersToRoles(userId, 'user');
  },
  'users.makeMod'(userId) {
    check(userId, String);
    if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-authorized');
    }
    if (userId === Meteor.userId() || Meteor.users.findOne({_id: userId}).username === 'admin') {
      throw new Meteor.Error('not-allowed');
    }
    Roles.removeUsersFromRoles(userId, 'admin');
    Roles.removeUsersFromRoles(userId, 'user');
    Roles.addUsersToRoles(userId, 'moderator');
  },
  'users.makeAdmin'(userId) {
    check(userId, String);
    if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-authorized');
    }
    Roles.removeUsersFromRoles(userId, 'moderator');
    Roles.removeUsersFromRoles(userId, 'user');
    Roles.addUsersToRoles(userId, 'admin');
  },
})

var pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
    _id: "username",
    type: "text",
    displayName: "username",
    required: true,
    minLength: 5,
  },
  {
    _id: 'email',
    type: 'email',
    required: true,
    displayName: "email",
    re: /.+@(.+){2,}\.(.+){2,}/,
    errStr: 'Invalid email',
  },
  pwd
]);
