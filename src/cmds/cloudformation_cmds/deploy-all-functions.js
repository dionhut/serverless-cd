import AWS from 'aws-sdk';
import _ from 'lodash';
import {LambdaService} from '../../services/LambdaService';

export const command = 'deploy-all-functions <stack-name>';
export const desc = 'Create or update Lambda function alias to a new version or a version linked to another alias for each ' +
    'lambda created by cloudformation stack';
export const builder = (yargs) => {
    yargs.positional('stack-name', {
        type: 'string',
        describe: 'Stack name or ARN'
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
    let funtions = await getAllStackFunctions(stackName);

    let lambdaService = new LambdaService();
    for (let index = 0; index < funtions.length; index++) {
        const func = funtions[index];
        await lambdaService.deployFunction(func.PhysicalResourceId, fromAlias, toAlias);
    }
}

async function getAllStackFunctions(stackName) {
    let cloudFormation = new AWS.CloudFormation();

    // Get all resources created by stack
    let resources = await cloudFormation.listStackResources({
        StackName: stackName
    }).promise();

    // Get all functions created by any nested stacks
    let funcResources = _.flatMap(await Promise.all(_.map(_.filter(resources.StackResourceSummaries, resource =>
        (resource.ResourceStatus === "CREATE_COMPLETE" || resource.ResourceStatus === "UPDATE_COMPLETE")
            && resource.ResourceType === "AWS::CloudFormation::Stack"
    ), stackRes => {
        return getAllStackFunctions(stackRes.PhysicalResourceId);
    })));

    // Add functions created by root stack
    funcResources = _.concat(funcResources, _.filter(resources.StackResourceSummaries, resource =>
        (resource.ResourceStatus === "CREATE_COMPLETE" || resource.ResourceStatus === "UPDATE_COMPLETE")
            && resource.ResourceType === "AWS::Lambda::Function"
    ));

    return funcResources;
}
