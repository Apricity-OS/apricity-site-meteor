import {Template} from 'meteor/templating';

import {Configs} from '../api/configs.js';
import {Content} from '../api/content.js';

Template.dashPage.onCreated(function() {
  Meteor.subscribe('configs');
  Meteor.subscribe('content');
});

Template.dashPage.onRendered(function() {
  if (Roles.userIsInRole(Meteor.userId(), 'newUser')) {
    $('#welcome-modal').modal('show');
    Meteor.call('users.removeFromNew');
  }
});

Template.dashPage.helpers({
  configs() {
    console.log(Configs.find({public: true}).fetch());
    return Configs.find({public: true}, {sort: {createdAt: -1}});
  },
  freezedryWelcome() {
    let freezedryWelcome = Content.findOne({name: 'freezedryWelcome'});
    if (freezedryWelcome) {
      return freezedryWelcome.text;
    }
  },
});

