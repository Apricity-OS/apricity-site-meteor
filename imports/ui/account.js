import {Template} from 'meteor/templating';

Template.accountPage.onCreated(function() {
    this.state = new ReactiveDict();
});

Template.accountPage.helpers({
    alertErr() {
        return Template.instance().state.get('alertErr');
    },
    alertSucc() {
        return Template.instance().state.get('alertSucc');
    },
});

Template.accountPage.events({
    'submit .change-password'(event, instance) {
        event.preventDefault();
        const target = event.target
        let currentPassword = target.currentPassword.value;
        let newPassword = target.newPassword.value;

        Accounts.changePassword(currentPassword, newPassword, function(error) {
            console.log(error)
            if (error) {
                instance.state.set('alertSucc', undefined);
                instance.state.set('alertErr', error.reason);
            } else {
                instance.state.set('alertErr', undefined);
                instance.state.set('alertSucc', 'Password changed');
            }
        });
    }
});

