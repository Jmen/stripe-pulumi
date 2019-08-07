import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

export function createHostedZone(domain: string, parentDomain: string) {

    const hostedZone = new aws.route53.Zone("hostedZone", {
        name: domain,
    });

    const parentHostedZone = pulumi.output(aws.route53.getZone({
        name: parentDomain,
        privateZone: false,
    }));

    const nsRecord = new aws.route53.Record(domain, {
        name: domain,
        records: hostedZone.nameServers,
        ttl: 172800,
        type: "NS",
        zoneId: parentHostedZone.zoneId,
    });

    return hostedZone;
}