Template.donate.onCreated(function() {
  console.log(Meteor.settings.public.stripe);
  let self = this;
  this.donate = StripeCheckout.configure({
    key: Meteor.settings.public.stripe,
    image: '/assets/img/logo.png',
    locale: 'auto',
    token(token) {
      charge = {
        amount: self.state.get('donateAmount'),
        currency: token.currency || 'usd',
        source: token.id,
        description: token.description || 'Help keep these services free',
        receipt_email: token.email
      };
      Meteor.call('processPayment', charge, function(error, response) {
        if (error) {
          console.log(error);
          self.state.set('donateErr', error.reason);
        } else {
          console.log(response);
        }
      });
    }
  });
  this.state = new ReactiveDict();
});

function validNumber(num) {
  return !isNaN(parseFloat(num)) && isFinite(num);
}

Template.donate.helpers({
  customDonateBad() {
    let value = Template.instance().state.get('donateOtherVal');
    if (value) {
      return !validNumber(value) || value <= 0;
    } else {
      return false;
    }
  }
});

function openDonate(amount, instance) {
  instance.state.set('donateAmount', amount * 100);
  $('#donateModal').modal('hide');
  instance.donate.open({
    name: 'Donate to Apricity OS',
    description: 'Help keep these services free',
    amount: amount * 100,
    bitcoin: false
  });
}

Template.donate.events({
  'keyup #donate-other'(event, instance) {
    instance.state.set('donateOtherVal', event.target.value);
  },
  'click #donate-1'(event, instance) {
    openDonate(1.00, instance);
  },
  'click #donate-5'(event, instance) {
    openDonate(5.00, instance);
  },
  'click #donate-10'(event, instance) {
    openDonate(10.00, instance);
  },
  'click #donate-20'(event, instance) {
    openDonate(20.00, instance);
  },
  'submit #donate-other-form'(event, instance) {
    event.preventDefault();
    openDonate(instance.state.get('donateOtherVal'), instance);
  }
});
