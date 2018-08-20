import {APIGatewayService} from '../../../services/APIGatewayService'

export const command = 'deploy-stage'
export const desc = 'Deploy API gateway stage managed by specified cloudformation stack'
export const builder = (yargs) => {
    yargs.option('stack-name', {
        type: 'string',
        describe: 'CloudFormation Stack name or ARN'
    }).option('stage', {
        type: 'string',
        describe: 'HTTP Method'
    }).demandOption(['stack-name', 'stage']);
}
export function handler (argv) {
    return new APIGatewayService().deployStackStage(argv.stackName, argv.stage);
}
