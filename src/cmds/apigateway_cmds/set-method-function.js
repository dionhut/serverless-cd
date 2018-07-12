import AWS from 'aws-sdk';
import _ from 'lodash';

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
    }).demandOption(['rest-api-id', 'http-method', 'resource-id', 'function-name']);
}
export function handler (argv) {
    return setMethodFunction(argv.restApiId, argv.httpMethod, argv.resouceId, argv.functionName,
        argv.functionAlias);
}
