import {check} from 'meteor/check';

let Stripe = StripeAPI(Meteor.settings.private.stripe);

Meteor.methods({
  processPayment( charge ) {
    check( charge, {
      amount: Number,
      currency: String,
      source: String,
      description: String,
      receipt_email: String
    });

    let handleCharge = Meteor.wrapAsync(Stripe.charges.create, Stripe.charges);
    return handleCharge(charge);
  }
});
