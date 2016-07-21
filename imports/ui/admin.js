import {Template} from 'meteor/templating';
import {Content} from '../api/content.js';

Template.adminUserPage.onCreated(function() {
  console.log('Admin user page created');
  Meteor.subscribe('users')
});

Template.adminUserPage.helpers({
  users() {
    console.log(Meteor.user());
    return Meteor.users.find({}, {sort: {username: 1}});
  },
});

Template.adminContentPage.onCreated(function() {
  Meteor.subscribe('content');
});

Template.adminContentPage.helpers({
  allContent() {
    return Content.find();
  },
})

Template.contentChanger.events({
  'submit .content-change-form'(event, instance) {
    event.preventDefault();
    Meteor.call('content.change', this.content.name, event.target.contentText.value);
  },
});

Template.userRow.helpers({
  noChangeRole() {
    console.log(this.user._id);
    return this.user._id === Meteor.userId() || this.user.username === 'admin';
  },
})

Template.userRow.events({
  'click .makeUser'(event, instance) {
    Meteor.call('users.makeUser', this.user._id);
  },
  'click .makeMod'(event, instance) {
    Meteor.call('users.makeMod', this.user._id);
  },
  'click .makeAdmin'(event, instance) {
    Meteor.call('users.makeAdmin', this.user._id);
  },
});
