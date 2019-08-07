export function getWebhookHandler() {
    return async (event, context) => {
        let buff = new Buffer(event.body, 'base64');
        console.log(buff.toString('ascii'));

        console.log(JSON.stringify(event));
        console.log(JSON.stringify(context));

        return {
            statusCode: 200,
            body: JSON.stringify({hello: "world"}),
        }
    };
}