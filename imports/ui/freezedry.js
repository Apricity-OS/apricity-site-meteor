import {Template} from 'meteor/templating';

import {Configs} from '../api/configs.js';

import tomlify from 'tomlify';

Template.freezedry.helpers({
    toml() {
        return tomlify(this.config.config);
    },
});
