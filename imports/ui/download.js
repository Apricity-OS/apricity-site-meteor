import {Template} from 'meteor/templating';
import {getContent} from './home.js'

Template.downloadPage.helpers({
  tagline() {
    return getContent('tagline');
  },
  downloadIntro() {
    return getContent('downloadIntro');
  },
});

