import {APIGatewayService} from '../../../services/APIGatewayService'

export const command = 'set-method-function'
export const desc = 'Set API gateway method lambda permissions managed by specified cloudformation stack'
export const builder = (yargs) => {
    yargs.option('stack-name', {
        type: 'string',
        describe: 'CloudFormation Stack name or ARN'
    }).option('http-method', {
        type: 'string',
        describe: 'HTTP Method'
    }).option('resource', {
        type: 'string',
        describe: 'Resource'
    }).option('function-name', {
        type: 'string',
        describe: 'Lambda function name (Thumbnail)'
    }).option('function-alias', {
        type: 'string',
        describe: 'Lambda function alias'
    }).demandOption(['stack-name', 'http-method', 'resource', 'function-name']);
}
export function handler (argv) {
    return new APIGatewayService().setStackMethodFunction(argv.stackName, argv.httpMethod, argv.resource,
        argv.functionName, argv.functionAlias);
}
