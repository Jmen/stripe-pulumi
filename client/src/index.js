//
/* eslint-disable no-console, react/no-multi-comp */
import React from 'react';
import { render } from 'react-dom';
import PaymentPage from "./stripe/PaymentPage";

const App = () => {
    return (
        <PaymentPage/>
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