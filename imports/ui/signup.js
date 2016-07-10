import {Template} from 'meteor/templating';

Template.signupPage.onCreated(function() {
    this.state = new ReactiveDict();
});

Template.signupPage.helpers({
    alertErr() {
        return Template.instance().state.get('alertErr');
    },
});

Template.signupPage.events({
    'submit .signup-form'(event, instance) {
        event.preventDefault();
        const target = event.target
        let username = target.registerUsername.value;
        let email = target.registerEmail.value;
        let password = target.registerPassword.value;

        Accounts.createUser({
            username: username,
            email: email,
            password: password,
        }, function(error) {
            if (error) {
                instance.state.set('alertErr', error.reason);
            } else {
                FlowRouter.go('dash');
            }
        });
    }
});

