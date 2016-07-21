import {Meteor} from 'meteor/meteor';

Meteor.publish('users', function() {
  if (Roles.userIsInRole(this.userId, 'admin')) {
    return Meteor.users.find({}, {fields: {'emails.address': true,
                                           'username': true,
                                           'roles': true}});
  } else {
    return null;
  }
});
