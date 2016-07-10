import {Template} from 'meteor/templating';

Template.loginPage.onCreated(function() {
    this.state = new ReactiveDict();
});

Template.loginPage.helpers({
    alertErr() {
        return Template.instance().state.get('alertErr');
    },
});

Template.loginPage.events({
    'submit .login-form'(event, instance) {
        event.preventDefault();
        const target = event.target
        let uOrE = target.enterUOrE.value;
        let password = target.enterPassword.value;
        Meteor.loginWithPassword(uOrE, password, function(error) {
            if(error) {
                instance.state.set('alertErr', error.reason);
            } else {
                FlowRouter.go('dash');
            }
        });
    },
});
