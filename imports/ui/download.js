import {Template} from 'meteor/templating';
import {getContent} from './home.js';

Template.downloadPage.helpers({
  gnomeStableDesc() {
    return getContent('gnomeStableDesc');
  },
  gnomeBetaDesc() {
    return getContent('gnomeBetaDesc');
  },
  cinnamonStableDesc() {
    return getContent('cinnamonStableDesc');
  },
  cinnamonBetaDesc() {
    return getContent('cinnamonBetaDesc');
  }
});

