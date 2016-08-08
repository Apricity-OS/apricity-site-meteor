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

BlazeLayout.setRoot('#templateRoot');

Template.navbar.onRendered(function() {
  let fav = document.createElement('link');
  fav.rel = 'icon';
  fav.sizes = '16x16 32x3';
  fav.href = '/assets/img/favicon.ico?v=3';
  document.getElementsByTagName('head')[0].appendChild(fav);

  let viewport = document.createElement('meta');
  viewport.name = 'viewport';
  viewport.content = 'width=device-width, initial-scale=1, maximum-scale=1';
  document.getElementsByTagName('head')[0].appendChild(viewport);

  let roboto = document.createElement('link');
  roboto.href = 'https://fonts.googleapis.com/css?family=Roboto+Slab:100,300,400';
  roboto.rel = 'stylesheet';
  roboto.type = 'text/css';
  document.getElementsByTagName('head')[0].appendChild(roboto);

  let lato = document.createElement('link');
  lato.href = 'https://fonts.googleapis.com/css?family=Lato:300,400,700';
  lato.rel = 'stylesheet';
  lato.type = 'text/css';
  document.getElementsByTagName('head')[0].appendChild(lato);

  let title = document.createElement('title');
  title.innerHTML = 'Apricity OS';
  document.getElementsByTagName('head')[0].appendChild(title);
});

Template.registerHelper("checkedIf", function(value){
  return value ? "checked" : "";
});

Template.registerHelper("selectedIf", function(value){
  return value ? "selected" : "";
});

Template.registerHelper("disabledIf", function(value){
  return value ? "disabled" : "";
});

Template.registerHelper('last',
                        function(list, elem) {
                          return _.last(list) === elem;
                        }
                       );

FlowRouter.wait();

Tracker.autorun(() => {
  // wait on roles to intialise so we can check is use is in proper role
  if (Roles.subscription.ready() && !FlowRouter._initialized) {
    FlowRouter.initialize();
  }
});

Template.auth.onCreated(function() {
  let self = this;
  self.routeName = new ReactiveVar();
  Tracker.autorun(function() {
    FlowRouter.watchPathChange();
    self.routeName.set(FlowRouter.current().route.name);
  });
});

Template.auth.helpers({
  resetRedirect() {
    console.log(Template.instance().routeName);
    return Template.instance().routeName.get() === 'login';
  }
});
