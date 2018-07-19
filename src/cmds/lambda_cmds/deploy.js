import {LambdaService} from '../../services/LambdaService';

export const command = 'deploy <function-name>'
export const desc = 'Create or update Lambda function alias to a new version or a version linked to another alias'
export const builder = (yargs) => {
    yargs.positional('function-name', {
        type: 'string',
        describe: 'Lambda Thumbnail or ARN'
    }).option('to-alias', {
        type: 'string',
        describe: 'To Alias'
    }).option('from-alias', {
        type: 'string',
        describe: 'From Alias'
    }).demandOption(['to-alias']);
}
export function handler (argv) {
    return new LambdaService().deployFunction(argv.functionName, argv.fromAlias, argv.toAlias);
}
