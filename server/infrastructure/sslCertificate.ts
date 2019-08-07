import * as aws from "@pulumi/aws";

export function createSSLCertificatesFor(regions, domain, providers) {

    const sslCertificates = [];

    for (const region of regions) {

        const sslCertificate = new aws.acm.Certificate(`sslCertificate-${region}`, {
            domainName: domain,
            validationMethod: "DNS",
        }, {provider: providers[region]});

        sslCertificates[region] = sslCertificate;
    }
    return sslCertificates;
}

export function waitForSSLCertificateVerification(regions, sslCertificates: any[], sslCertificateValidationRecord, providers) {

    const sslCertValidationIssues = [];

    for (const region of regions) {

        const sslCertificateValidationIssued = new aws.acm.CertificateValidation(`sslCertificateValidationIssued-${region}`, {
            certificateArn: sslCertificates[region].arn,
            validationRecordFqdns: [sslCertificateValidationRecord.fqdn],
        }, {
            provider: providers[region],
            dependsOn: sslCertificateValidationRecord
        });

        sslCertValidationIssues[region] = sslCertificateValidationIssued;
    }
    return sslCertValidationIssues;
}