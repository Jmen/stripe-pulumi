import React from "react";
import { CardElement, injectStripe } from "react-stripe-elements";

const PAYMENT_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

class _PaymentForm extends React.Component {
    state = {
        clientSecret: null,
        error: null,
        disabled: true,
        succeeded: false,
        processing: false,
        message: null,
    };

    componentDidMount() {

        fetch(`https://${PAYMENT_API_BASE_URL}/payment-intent/`)
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

    createOptions = (padding) => {
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

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    stripe.handleCardPayment
                    <CardElement {...this.createOptions()} />
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

export const PaymentForm = injectStripe(_PaymentForm);