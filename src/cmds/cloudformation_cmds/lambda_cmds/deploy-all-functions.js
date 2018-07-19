import {LambdaService} from '../../../services/LambdaService';
import {CloudFormationService} from '../../../services/CloudFormationService';

export const command = 'deploy-all-functions <stack-name>';
export const desc = 'Create or update Lambda function alias to a new version or a version linked to another alias for each ' +
    'lambda created by cloudformation stack';
export const builder = (yargs) => {
    yargs.positional('stack-name', {
        type: 'string',
        describe: 'CloudFormation Stack name or ARN'
    }).option('to-alias', {
        type: 'string',
        describe: 'To Alias'
    }).option('from-alias', {
        type: 'string',
        describe: 'From Alias'
    }).demandOption(['to-alias']);
}
export function handler (argv) {
    return deployAllFunctions(argv.stackName, argv.fromAlias, argv.toAlias);
}

async function deployAllFunctions(stackName, fromAlias, toAlias) {
    let funtions = await new CloudFormationService().getAllStackFunctions(stackName);

    let lambdaService = new LambdaService();
    for (let index = 0; index < funtions.length; index++) {
        const func = funtions[index];
        await lambdaService.deployFunction(func.PhysicalResourceId, fromAlias, toAlias);
    }
}
