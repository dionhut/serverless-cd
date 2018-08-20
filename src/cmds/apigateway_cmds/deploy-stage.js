import {APIGatewayService} from '../../services/APIGatewayService'

export const command = 'deploy-stage'
export const desc = 'Deploy API gateway stage'
export const builder = (yargs) => {
    yargs.option('rest-api-id', {
        type: 'string',
        describe: 'API gateway Id'
    }).option('stage', {
        type: 'string',
        describe: 'HTTP Method'
    }).demandOption(['rest-api-id', 'stage']);
}
export function handler (argv) {
    return new APIGatewayService().deployStage(argv.restApiId, argv.stage);
}
