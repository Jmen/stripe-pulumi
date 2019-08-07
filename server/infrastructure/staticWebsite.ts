import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as mime from "mime";
import * as glob from "glob";

export function createWebsiteBucket(domain: string, environment, buildDirectory) {
    let siteBucket = new aws.s3.Bucket(`stripe-client-${environment}`, {
        website: {
            indexDocument: "index.html",
        }
    });

    glob("**/*.*", { cwd: buildDirectory }, function (er, files) {
        for (const file of files) {
            let object = new aws.s3.BucketObject(file, {
                bucket: siteBucket,
                source: new pulumi.asset.FileAsset(`${buildDirectory}/${file}`),     // use FileAsset to point to a file
                contentType: mime.getType(`${buildDirectory}/${file}`) || undefined, // set the MIME type of the file
            });

            console.log(`${buildDirectory}/${file}`);
        }
    });

    let bucketPolicy = new aws.s3.BucketPolicy("bucketPolicy", {
        bucket: siteBucket.bucket,
        policy: siteBucket.bucket.apply(publicReadPolicyForBucket)
    });

    return siteBucket;
}

function publicReadPolicyForBucket(bucketName) {
    return JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Effect: "Allow",
            Principal: "*",
            Action: [
                "s3:GetObject"
            ],
            Resource: [
                `arn:aws:s3:::${bucketName}/*` // policy refers to bucket name explicitly
            ]
        }]
    })
}



