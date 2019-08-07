import * as aws from "@pulumi/aws";

export function createAliasRecord(region, apiGatewayCustomDomain, hostedZone, sslCertValidationIssues) {

    const alias = new aws.route53.Record(`alias-${region}`, {
        name: '',
        type: "A",
        zoneId: hostedZone.id,
        latencyRoutingPolicies: [{region}],
        setIdentifier: region,
        aliases: [{
            evaluateTargetHealth: true,
            name: apiGatewayCustomDomain.regionalDomainName,
            zoneId: apiGatewayCustomDomain.regionalZoneId,
        }]
    }, {dependsOn: sslCertValidationIssues[region]});
}