import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

import { createProvidersFor } from "./infrastructure/provider";
import { createHostedZone } from "./infrastructure/hostedZone";
import { createSSLCertificatesFor, waitForSSLCertificateVerification } from "./infrastructure/sslCertificate";
import { createApiGateway } from "./infrastructure/apiGateway";
import { createAliasRecord } from "./infrastructure/dnsRecord";
import { createWebsiteBucket } from "./infrastructure/staticWebsite";

const parentDomain = new pulumi.Config().require("parentDomain");
const backendComponentName = new pulumi.Config().require("backendComponentName");
const environment = pulumi.getStack();

const domain = `${backendComponentName}-${environment}.${parentDomain}`;
const regions = ['us-east-1', 'eu-west-1', 'ap-southeast-2'];

const providers = createProvidersFor(regions);

const hostedZone = createHostedZone(domain, parentDomain);

const sslCertificates = createSSLCertificatesFor(regions, domain, providers);

const sslCertificateValidationRecord = new aws.route53.Record(`sslCertificateValidationRecord`, {
    zoneId: hostedZone.id,
    name: sslCertificates[regions[0]].domainValidationOptions[0].resourceRecordName,
    type: sslCertificates[regions[0]].domainValidationOptions[0].resourceRecordType,
    records: [sslCertificates[regions[0]].domainValidationOptions[0].resourceRecordValue],
    ttl: 10 * 60 /* 10 minutes */,
});

const sslCertValidationIssues = waitForSSLCertificateVerification(regions, sslCertificates, sslCertificateValidationRecord, providers);

for (const region of regions) {

    const apiGatewayCustomDomain = createApiGateway(region, domain, sslCertValidationIssues, providers[region], environment);

    createAliasRecord(region, apiGatewayCustomDomain, hostedZone, sslCertValidationIssues);
}

exports.api_url = `https://${domain}`;


let siteBucket = createWebsiteBucket(domain, environment, "../client/build");

exports.websiteUrl = pulumi.interpolate `http://${siteBucket.websiteEndpoint}`;