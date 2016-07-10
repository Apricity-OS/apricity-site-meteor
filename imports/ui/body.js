import {Template} from 'meteor/templating';

import {Content} from '../api/content.js';

import './body.html';
import './home.html';
import './home.js';
import './download.html';
import './download.js';
import './footer.html';
import './signup.html';
import './signup.js';
import './login.html';
import './login.js';
import './dash.html';
import './dash.js';
import './account.html';
import './account.js';
import './create.html';
import './create.js';
import './my-configs.html';
import './my-configs.js';
import './freezedry.html';
import './freezedry.js';

Template.registerHelper("checkedIf", function(value){
  return value ? "checked" : "";
});

Template.registerHelper("selectedIf", function(value){
  return value ? "selected" : "";
});
