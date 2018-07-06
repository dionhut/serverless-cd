import AWS from 'aws-sdk';

export const command = 'set-function'
export const desc = 'Set API Gateway method lambda function'
export const builder = (yargs) => {
    yargs.option('apigateway-id', {
        type: 'string',
        describe: 'API Gateway Id'
    }).option('method-id', {
        type: 'string',
        describe: 'Method Id'
    }).option('function-name', {
        type: 'string',
        describe: 'Lambda function name (Thumbnail)'
    }).demandOption(['apigateway-id', 'method-id', 'function-name']);
}
export function handler (argv) {
    (async () => {
        let functionCommands = new APIGatewayCommands();
        try {
            await functionCommands.setMethodFunction(argv.apiGatewayId, argv.methodId, argv.functionName);
        } catch(error) {
            console.error(error);
        }
    })().then();
}

class APIGatewayCommands {
    async setMethodFunction(apiGatewayId, methodId, functionName) {
        console.log('Method function update Done.');
    }
}
