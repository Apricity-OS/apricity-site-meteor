import {Template} from 'meteor/templating';

import {Configs} from '../api/configs.js';

Template.dashPage.helpers({
    configs() {
        return Configs.find({public: true});
    },
});

