import {Template} from 'meteor/templating';

import {Content} from '../api/content.js';

function getContent(name){
    let field = Content.findOne({name: name});
    return field && field.text;
}

Template.homePage.helpers({
    tagline() {
        return getContent('tagline');
    },
    homeIntro() {
        return getContent('homeIntro');
    },
    apricityLaptopImg() {
        return getContent('apricityLaptopImg');
    },
});
