const stripeSecretKey = process.env.StripeSecretKey;

if (!stripeSecretKey)
    throw Error("missing export StripeSecretKey");

export function getPaymentIntentHandler() {
    return async () => {

        const stripe = require('stripe')(stripeSecretKey);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: 30,
            currency: 'gbp',
            payment_method_types: ['card'],
            receipt_email: 'jaimenlathia@gmail.com',
        });

        console.log(JSON.stringify(paymentIntent));

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ client_secret: paymentIntent.client_secret }),
        }
    };
}