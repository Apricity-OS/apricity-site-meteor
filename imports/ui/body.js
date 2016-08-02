import {Template} from 'meteor/templating';
import {check} from 'meteor/check';

import {Content} from '../api/content.js';

import './body.html';
import './home.html';
import './home.js';
import './features.html';
import './features.js';
import './download.html';
import './download.js';
import './footer.html';
import './dash.html';
import './dash.js';
import './account.html';
import './create.html';
import './create.js';
import './my-configs.html';
import './my-configs.js';
import './user-configs.html';
import './user-configs.js';
import './specificconfig.html';
import './specificconfig.js';
import './freezedry.html';
import './freezedry.js';
import './iso.html';
import './iso.js';
import './admin.html';
import './admin.js';
import './forum.html';
import './forum.js';
import './blog.html';
import './blog.js';
import './docs.html';
import './docs.js';
import './donate.js';
import './bootstrap/collapse.js';
import './bootstrap/modal.js';
import './bootstrap/dropdown.js';

Template.registerHelper("checkedIf", function(value){
  return value ? "checked" : "";
});

Template.registerHelper("selectedIf", function(value){
  return value ? "selected" : "";
});

Template.registerHelper("disabledIf", function(value){
  return value ? "disabled" : "";
});

FlowRouter.wait();

Tracker.autorun(() => {
  // wait on roles to intialise so we can check is use is in proper role
  if (Roles.subscription.ready() && !FlowRouter._initialized) {
    FlowRouter.initialize();
  }
});

