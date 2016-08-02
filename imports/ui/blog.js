import {Template} from 'meteor/templating';

import {Posts} from '../api/posts.js';

Template.blogPage.onCreated(function() {
  Meteor.subscribe('posts');
});

Template.blogPage.helpers({
  posts() {
    console.log(Posts.find().fetch());
    return Posts.find({}, {sort: {createdAt: -1}});
  }
});

// Template.postCard.helpers({
//   postCleanName() {
//     return this.post.name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
//   }
// });

Template.blogPostPage.onCreated(function() {
  Meteor.subscribe('posts');
});

Template.blogPostPage.helpers({
  post() {
    return Posts.findOne({cleanName: FlowRouter.getParam('cleanName')});
  }
});
