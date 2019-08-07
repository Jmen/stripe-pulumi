import * as aws from "@pulumi/aws";

export function createProvidersFor(regions) {

    const providers = [];

    for (const region of regions) {
        providers[region] = new aws.Provider(`provider-${region}`, {region});
    }
    return providers;
}