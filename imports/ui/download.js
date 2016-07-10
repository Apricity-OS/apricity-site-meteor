import {Template} from 'meteor/templating';

Template.downloadPage.helpers({
    tagline() {
        return getContent('tagline');
    },
    downloadIntro() {
        return getContent('downloadIntro');
    },
});

