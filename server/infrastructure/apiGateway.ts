import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

import { getPaymentIntentHandler } from "../entrypoints/paymentIntent";
import { getWebhookHandler } from "../entrypoints/webhook";
import { getCheckoutSession } from "../entrypoints/checkoutSession";

export function createApiGateway(region, domain, sslCertValidationIssues, provider, environment) {

    let apiGateway = new awsx.apigateway.API(`stripe-${region}-${environment}`, {
        routes: [{
            path: "/payment-intent",
            method: "GET",
            eventHandler: getPaymentIntentHandler(),
        },
        {
            path: "/checkout-session",
            method: "GET",
            eventHandler: getCheckoutSession(),
        },
        {
            path: "/webhook",
            method: "POST",
            eventHandler: getWebhookHandler(),
        }],
    }, { provider: provider });

    exports[`api_url_${region}`] = apiGateway.url;

    const apiGatewayCustomDomain = new aws.apigateway.DomainName(`apiGatewayCustomDomain-${region}`, {
        domainName: domain,
        endpointConfiguration: {
            types: "REGIONAL",
        },
        regionalCertificateArn: sslCertValidationIssues[region].certificateArn,
    }, {provider: provider});

    const webDomainMapping = new aws.apigateway.BasePathMapping(`basePathMapping-${region}`, {
        restApi: apiGateway.restAPI,
        stageName: apiGateway.stage.stageName,
        domainName: apiGatewayCustomDomain.id,
    }, { provider: provider });

    return apiGatewayCustomDomain;
}