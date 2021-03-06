const stripeSecretKey = process.env.StripeSecretKey;

if (!stripeSecretKey)
    throw Error("missing export StripeSecretKey");

export function getCheckoutSession() {
    return async () => {

        const stripe = require('stripe')(stripeSecretKey);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                name: 'T-shirt',
                description: 'Comfortable cotton t-shirt',
                images: ['https://example.com/t-shirt.png'],
                amount: 500,
                currency: 'gbp',
                quantity: 1,
            }],
            success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'https://example.com/cancel',
        });

        console.log(JSON.stringify(session));

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ checkoutSession: session.id }),
        }
    };
}