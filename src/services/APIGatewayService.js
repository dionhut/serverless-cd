import AWS from 'aws-sdk';
import uuid from "uuid/v1";
import _ from 'lodash';

export class APIGatewayService {
    async setMethodFunction(restApiId, httpMethod, resourceId, functionName, functionAlias, aliasStageVariable) {
        let lambda = new AWS.Lambda();
        let apiGateway = new AWS.APIGateway();

        let lambdaFunction = await lambda.getFunction({
            FunctionName: functionName
        }).promise();

        let integration = await apiGateway.getIntegration({
            httpMethod: httpMethod,
            resourceId: resourceId,
            restApiId: restApiId,
        }).promise();

        let resource = await apiGateway.getResource({
            resourceId: resourceId,
            restApiId: restApiId
        }).promise();

        let functionArn = lambdaFunction.Configuration.FunctionArn;
        if(functionAlias) {
            functionArn = `${functionArn}:${functionAlias}`;
        }

        let integrationFunctionArn = lambdaFunction.Configuration.FunctionArn;
        if(aliasStageVariable) {
            integrationFunctionArn = `${integrationFunctionArn}:\${stageVariables.${aliasStageVariable}}`
        } else if(functionAlias) {
            integrationFunctionArn = `${integrationFunctionArn}:${functionAlias}`
        }

        let methodPath = _.replace(resource.path, /\{[^\/]+\}/g, '*');
        let accountId = functionArn.split(':')[4];
        let integartionUrl = `arn:aws:apigateway:${AWS.config.region}:lambda:path/2015-03-31/functions/${integrationFunctionArn}/invocations`;

        if(integration.uri === integartionUrl) {
            console.log(`Method ${httpMethod} ${methodPath} already set to ${integartionUrl}`);
            return;
        }

        if(!resource.resourceMethods[httpMethod]) {
            throw new Error(`Method ${httpMethod} ${methodPath} not found`);
        }

        await apiGateway.updateIntegration({
            httpMethod: httpMethod,
            resourceId: resourceId,
            restApiId: restApiId,
            patchOperations: [{
                op: 'replace',
                path: '/uri',
                value: integartionUrl,
            }]
        }).promise();

        let sourceArn = `arn:aws:execute-api:${AWS.config.region}:${accountId}:${restApiId}/*/${httpMethod}${methodPath}`;
        await lambda.addPermission({
            Action: 'lambda:InvokeFunction',
            FunctionName: functionArn,
            Principal: 'apigateway.amazonaws.com',
            StatementId: uuid(),
            SourceArn: sourceArn
        }).promise();

        console.log(`Done setting ${httpMethod} ${methodPath} ${lambdaFunction}`);
    }
}
