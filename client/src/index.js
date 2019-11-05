//
/* eslint-disable no-console, react/no-multi-comp */
import React from 'react';
import { render } from 'react-dom';
import {Route, BrowserRouter as Router, Link} from 'react-router-dom';
import PaymentPage from "./stripe/PaymentPage";
import CheckoutPage from "./stripe/CheckoutPage";

const Nav = () => {
    return (
        <>
            <p><Link to='/self-hosted-page'>Self Hosted page using Payment Intents</Link></p>
            <p><Link to='/stripe-hosted-page'>Stripe Hosted page using Checkout</Link></p>
        </>
    );
};

const App = () => {
    return (
        <>
            <Router>
                <Nav/>
                <Route path='/self-hosted-page' exact component={PaymentPage}/>
                <Route path='/stripe-hosted-page' exact component={CheckoutPage}/>
            </Router>
        </>
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