//
/* eslint-disable no-console, react/no-multi-comp */
import React from 'react';
import { render } from 'react-dom';
import {
    CardElement,
    StripeProvider,
    Elements,
    injectStripe,
} from 'react-stripe-elements'

const STRIPE_PUBLISHABLE_KEY = "pk_test_9NUatS7vphlNOEkCMccpFpAW00mV12pWK0";

const createOptions = (padding) => {
    return {
        style: {
            base: {
                fontSize: '18px',
                color: '#424770',
                letterSpacing: '0.025em',
                fontFamily: 'Source Code Pro, monospace',
                '::placeholder': {
                    color: '#aab7c4',
                },
                ...(padding ? {padding} : {}),
            },
            invalid: {
                color: '#9e2146',
            },
        },
    };
};

class _HandleCardPayment extends React.Component {
    state = {
        clientSecret: null,
        error: null,
        disabled: true,
        succeeded: false,
        processing: false,
        message: null,
    };

    componentDidMount() {

        const environment = process.env.REACT_APP_ENVIRONMENT;

        fetch(`https://stripe-api-${environment}.jaimen-pulumi.com/payment-intent/`)
            .then((res) => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    return null;
                }
            })
            .then((data) => {
                if (!data || data.error) {
                    console.log('API error:', {data});
                    throw new Error('PaymentIntent API Error');
                } else {

                    console.log(JSON.stringify(data));

                    this.setState({
                        clientSecret: data.client_secret,
                        disabled: false
                    });
                }
            }
        );
    }

    handleSubmit = (ev) => {
        ev.preventDefault();
        if (this.props.stripe) {
            this.props.stripe
                .handleCardPayment(this.state.clientSecret)
                .then((payload) => {
                    if (payload.error) {
                        this.setState({
                            error: `Charge failed: ${payload.error.message}`,
                            disabled: false,
                        });
                        console.log('[error]', payload.error);
                    } else {
                        this.setState({
                            succeeded: true,
                            message: `Charge succeeded! PaymentIntent is in state: ${
                                payload.paymentIntent.status
                            }`,
                        });
                        console.log('[PaymentIntent]', payload.paymentIntent);
                    }
                });
            this.setState({disabled: true, processing: true});
        } else {
            console.log("Stripe.js hasn't loaded yet.");
        }
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    stripe.handleCardPayment
                    <CardElement {...createOptions()} />
                </label>
                {this.state.error && <div className="error">{this.state.error}</div>}
                {this.state.message && (
                    <div className="message">{this.state.message}</div>
                )}
                {!this.state.succeeded && (
                    <button disabled={this.state.disabled}>
                        {this.state.processing ? 'Processing…' : 'Pay'}
                    </button>
                )}
            </form>
        );
    }
}

const HandleCardPayment = injectStripe(_HandleCardPayment);

class Checkout extends React.Component{
    render() {
        return (
            <div className="Checkout">
                <h1>React Stripe Elements with PaymentIntents</h1>
                <Elements>
                    <HandleCardPayment />
                </Elements>
            </div>
        );
    }
}

const App = () => {
    return (
        <StripeProvider apiKey={STRIPE_PUBLISHABLE_KEY || 'pk_test_dCyfhfyeO2CZkcvT5xyIDdJj'}>
            <Checkout />
        </StripeProvider>
    );
};

const appElement = document.querySelector('.App');
if (appElement) {
    render(<App />, appElement);
} else {
    console.error(
        'We could not find an HTML element with a class name of "App" in the DOM. Please make sure you copy index.html as well for this demo to work.'
    );
}