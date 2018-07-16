import {APIGatewayService} from '../../services/APIGatewayService'

export const command = 'set-method-function'
export const desc = 'Set API gateway method lambda function and update lambda permissions'
export const builder = (yargs) => {
    yargs.option('rest-api-id', {
        type: 'string',
        describe: 'API gateway Id'
    }).option('http-method', {
        type: 'string',
        describe: 'HTTP Method'
    }).option('resource-id', {
        type: 'string',
        describe: 'Resource Id'
    }).option('function-name', {
        type: 'string',
        describe: 'Lambda function name (Thumbnail)'
    }).option('function-alias', {
        type: 'string',
        describe: 'Lambda function alias'
    }).option('alias-stage-variable', {
        type: 'string',
        describe: 'Variable to associate API Gateway stage deployment to lambda deployed version'
    }).demandOption(['rest-api-id', 'http-method', 'resource-id', 'function-name', 'alias-stage-variable']);
}
export function handler (argv) {
    return new APIGatewayService().setMethodFunction(argv.restApiId, argv.httpMethod, argv.resourceId,
        argv.functionName, argv.functionAlias, argv.aliasStageVariable);
}
