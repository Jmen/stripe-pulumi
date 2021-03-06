import React from 'react';
import { Elements, StripeProvider } from "react-stripe-elements";
import { PaymentForm } from "./PaymentForm";

const STRIPE_PUBLISHABLE_KEY = "pk_test_9NUatS7vphlNOEkCMccpFpAW00mV12pWK0";

const PaymentPage = () => {
    return (
        <>
            <h1>React Stripe Elements with PaymentIntents</h1>
            <StripeProvider apiKey={STRIPE_PUBLISHABLE_KEY}>
                <Elements>
                    <PaymentForm />
                </Elements>
            </StripeProvider>
        </>
    );
};

export default PaymentPage;