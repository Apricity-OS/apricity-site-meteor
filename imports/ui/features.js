import {Template} from 'meteor/templating';

import {Content} from '../api/content.js';
import {getContent} from './home.js';

Template.featuresPage.onCreated(function() {
  Meteor.subscribe('content', {
    onReady() {
      // console.log(Content.find({}).length);
    }
  });
});

Template.featuresPage.helpers({
  tagline() {
    return getContent('tagline');
  },
  featuresFreezedry() {
    return getContent('featuresFreezedry');
  },
  featuresIntro() {
    return getContent('featuresIntro');
  },
  featuresUpdates() {
    return getContent('featuresUpdates');
  },
  featuresSecurity() {
    return getContent('featuresSecurity');
  },
  featuresOffice() {
    return getContent('featuresOffice');
  },
  featuresWindows() {
    return getContent('featuresWindows');
  },
  featuresBackup() {
    return getContent('featuresBackup');
  },
  featuresCloud() {
    return getContent('featuresCloud');
  },
  featuresMultimedia() {
    return getContent('featuresMultimedia');
  }
});
