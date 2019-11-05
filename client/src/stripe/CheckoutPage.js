import React from 'react';

const PAYMENT_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const STRIPE_PUBLISHABLE_KEY = "pk_test_9NUatS7vphlNOEkCMccpFpAW00mV12pWK0";

const CheckoutPage = () => {

    function redirectToStripeCheckout(ev) {
        ev.preventDefault();

        fetch(`https://${PAYMENT_API_BASE_URL}/checkout-session/`)
            .then((res) => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    console.log(`checkout api did not return 200  ${JSON.stringify(res)}`)
                    return null;
                }
            })
            .then((data) => {
                    if (data && !data.error) {

                        console.log(JSON.stringify(data));

                        const stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);

                        stripe.redirectToCheckout( { sessionId: data.checkoutSession})
                            .then(function (result) {
                                console.log(JSON.stringify(result.error));
                        });
                    } else {
                        console.log('API error:', {data});
                        throw new Error('Checkout Session API Error');
                    }
                }
            );
    }

    return (
        <div>
            <button onClick={redirectToStripeCheckout}>Goto Stripe Hosted Checkout Page</button>
        </div>
    );
};

export default CheckoutPage;