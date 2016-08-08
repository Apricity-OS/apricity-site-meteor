import {Template} from 'meteor/templating';

import {Docs} from '../api/docs.js';

Template.docsPage.onCreated(function() {
  Meteor.subscribe('docs');
});

Template.docsPage.helpers({
  docs() {
    // console.log(Docs.find().fetch());
    return Docs.find({}, {sort: {name: 1}});
  }
});

Template.docsTitleCard.helpers({
  docsEntryPreview() {
    return this.docsEntry.body.split('.').slice(0, 5).join('.') + '. [...]';
  },
  showLine() {
    return this.index !== Docs.find({}).fetch().length - 1;
  }
});

Template.docsEntryPage.onCreated(function() {
  Meteor.subscribe('docs');
  this.state = new ReactiveDict();
});

Template.docsEntryPage.helpers({
  docsEntry() {
    return Docs.findOne({cleanName: FlowRouter.getParam('cleanName')});
  },
  canDelete() {
    let docsEntry = Docs.findOne({cleanName: FlowRouter.getParam('cleanName')});
    return Roles.userIsInRole(Meteor.userId(), 'admin') || docsEntry.owner === Meteor.userId();
  },
  editDocsEntry() {
    return Template.instance().state.get('editDocsEntry');
  }
});

Template.docsEntryPage.events({
  'click .delete-docs-entry'(event, instance) {
    event.preventDefault();
    // console.log(event.target);
    let modal = $('#deleteDocsEntry');
    modal.modal('hide');
    let docsEntryId = Docs.findOne({cleanName: FlowRouter.getParam('cleanName')})._id;
    modal.on('hidden.bs.modal', function() {
      Meteor.call('docs.delete', docsEntryId);
      FlowRouter.go('docs');
    });
  },
  'click .edit-docs-entry'(event, instance) {
    event.preventDefault();
    instance.state.set('editDocsEntry', true);
  },
  'submit .edit-docs-entry-form'(event, instance) {
    event.preventDefault();
    let docsEntryId = Docs.findOne({cleanName: FlowRouter.getParam('cleanName')})._id;
    Meteor.call('docs.edit', docsEntryId, event.target.docsEntryText.value);
    event.target.docsEntryText.value = '';
    instance.state.set('editDocsEntry', false);
  }
});

Template.addDocsEntryPage.onCreated(function() {
  this.state = new ReactiveDict();
});

Template.addDocsEntryPage.helpers({
  alertErr() {
    return Template.instance().state.get('alertErr');
  }
});

Template.addDocsEntryPage.events({
  'submit .add-docs-entry'(event, instance) {
    event.preventDefault();
    if (event.target.docsEntryTitle.value.length === 0) {
      instance.state.set('alertErr', 'Please enter a title');
      return;
    }
    let cleanName = event.target.docsEntryTitle.value.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    if (Docs.findOne({cleanName: cleanName})) {
      instance.state.set('alertErr', 'A docs entry with that name already exists');
      return;
    }

    if (event.target.docsEntryBody.value.length === 0) {
      instance.state.set('alertErr', 'Please enter a docs entry body');
      return;
    }

    Meteor.call('docs.add',
                event.target.docsEntryTitle.value,
                event.target.docsEntryBody.value);
    FlowRouter.go('/docs');
  }
});
