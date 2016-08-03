import {Template} from 'meteor/templating';

import {Categories, ParentCategories} from '../api/categories.js';
import {Discussions} from '../api/discussions.js';
import {Comments} from '../api/comments.js';

Template.forumPage.onCreated(function() {
  Meteor.subscribe('categories');
  Meteor.subscribe('parentCategories');
});

Template.forumPage.helpers({
  parentCategories() {
    return _.map(ParentCategories.find().fetch(), function(parentCategory) {
      return {
        'name': parentCategory.name,
        'categories': Categories.find({parent: parentCategory._id})
      };
    });
  }
});

Template.categoryRow.helpers({
  url() {
    return '/forum/category/' + this.category._id;
  }
});

Template.forumCategoryPage.onCreated(function() {
  Meteor.subscribe('categories');
  Meteor.subscribe('parentCategories');
  Meteor.subscribe('discussions');
  Meteor.subscribe('comments');
});

Template.forumCategoryPage.helpers({
  categoryName() {
    if (Categories.findOne({_id: FlowRouter.getParam('_id')})) {
      return Categories.findOne({_id: FlowRouter.getParam('_id')}).name;
    }
    return undefined;
  },
  discussions() {
    return Discussions.find({category: FlowRouter.getParam('_id')},
                            {sort: {createdAt: -1}});
  }
});

Template.discussionRow.helpers({
  numComments() {
    return Comments.find({discussion: this.discussion._id}).fetch().length;
  },
  url() {
    return '/forum/discussion/' + this.discussion._id;
  },
  userUrl() {
    return '/user/' + this.discussion.username;
  }
});

Template.forumDiscussionPage.onCreated(function() {
  Meteor.subscribe('categories');
  Meteor.subscribe('parentCategories');
  Meteor.subscribe('discussions');
  Meteor.subscribe('comments');
  this.state = new ReactiveDict();
  this.state.set('editDiscussion', false);
});

Template.forumDiscussionPage.helpers({
  discussionExists() {
    return Discussions.findOne({_id: FlowRouter.getParam('_id')});
  },
  discussionName() {
    let discussion = Discussions.findOne({_id: FlowRouter.getParam('_id')});
    if (discussion) {
      return discussion.name;
    }
    return undefined;
  },
  discussionUsername() {
    let discussion = Discussions.findOne({_id: FlowRouter.getParam('_id')});
    if (discussion) {
      return discussion.username;
    }
    return undefined;
  },
  discussionBody() {
    let discussion = Discussions.findOne({_id: FlowRouter.getParam('_id')});
    if (discussion) {
      return discussion.body;
    }
    return undefined;
  },
  canModify() {
    let discussion = Discussions.findOne({_id: FlowRouter.getParam('_id')});
    return discussion.username === Meteor.user().username ||
      Roles.userIsInRole(Meteor.userId(), 'admin') ||
      Roles.userIsInRole(Meteor.userId(), 'moderator');
  },
  editDiscussion() {
    return Template.instance().state.get('editDiscussion');
  },
  comments() {
    return Comments.find({discussion: FlowRouter.getParam('_id')},
                         {$sort: {createdAt: -1}});
  },
  userUrl() {
    let discussion = Discussions.findOne({_id: FlowRouter.getParam('_id')});
    if (discussion) {
      return '/user/' + discussion.username;
    }
    return undefined;
  },
  alertErr() {
    return Template.instance().state.get('alertErr');
  }
});

Template.forumDiscussionPage.events({
  'submit .add-comment-form'(event, instance) {
    event.preventDefault();
    if (event.target.commentText.value.length === 0) {
      instance.state.set('alertErr', 'Please enter a comment');
      return;
    }
    Meteor.call('comments.add', FlowRouter.getParam('_id'), event.target.commentText.value);
    event.target.commentText.value = '';
    instance.state.set('alertErr', undefined);
  },
  'click .delete-discussion'(event, instance) {
    event.preventDefault();
    console.log(event.target);
    let modal = $('#deleteDiscussion');
    modal.modal('hide');
    modal.on('hidden.bs.modal', function() {
      Meteor.call('discussions.delete', FlowRouter.getParam('_id'));
      FlowRouter.go('forum');
    });
  },
  'click .edit-discussion'(event, instance) {
    event.preventDefault();
    instance.state.set('editDiscussion', true);
  },
  'submit .edit-discussion-form'(event, instance) {
    event.preventDefault();
    Meteor.call('discussions.edit', FlowRouter.getParam('_id'), event.target.discussionText.value);
    event.target.discussionText.value = '';
    instance.state.set('editDiscussion', false);
  }
});

Template.commentCard.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.set('editComment', false);
});

Template.commentCard.helpers({
  userUrl() {
    return '/user/' + this.comment.username;
  },
  canModify() {
    return this.comment.username === Meteor.user().username ||
      Roles.userIsInRole(Meteor.userId(), 'admin') ||
      Roles.userIsInRole(Meteor.userId(), 'moderator');
  },
  editComment() {
    return Template.instance().state.get('editComment');
  }
});

Template.commentCard.events({
  'click .delete-comment'(event, instance) {
    event.preventDefault();
    console.log(event.target);
    let modal = $('#deleteComment' + this.comment._id);
    modal.modal('hide');
    let self = this;
    modal.on('hidden.bs.modal', function() {
      Meteor.call('comments.delete', self.comment._id);
    });
  },
  'click .edit-comment'(event, instance) {
    event.preventDefault();
    instance.state.set('editComment', true);
  },
  'submit .edit-comment-form'(event, instance) {
    event.preventDefault();
    Meteor.call('comments.edit', this.comment._id, event.target.commentText.value);
    event.target.commentText.value = '';
    instance.state.set('editComment', false);
  }
});

Template.addDiscussionPage.onCreated(function() {
  Meteor.subscribe('categories');
  this.state = new ReactiveDict();
});

Template.addDiscussionPage.helpers({
  categories() {
    if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
      return Categories.find();
    } else {
      return Categories.find({restricted: {$ne: true}});
    }
  },
  alertErr() {
    return Template.instance().state.get('alertErr');
  }
});

Template.addDiscussionPage.events({
  'submit .add-discussion'(event, instance) {
    event.preventDefault();
    if (event.target.discussionTitle.value.length === 0) {
      instance.state.set('alertErr', 'Please enter a title');
      return;
    }

    if (event.target.discussionBody.value.length === 0) {
      instance.state.set('alertErr', 'Please enter a discussion body');
      return;
    }

    Meteor.call('discussions.add',
                event.target.discussionTitle.value,
                event.target.discussionBody.value,
                event.target.discussionCategory.value);
    FlowRouter.go('/forum');
  }
});
