import AWS from 'aws-sdk';
import uuid from "uuid/v1";
import _ from 'lodash';
import {CloudFormationService} from '../services/CloudFormationService';

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
            console.log(`${httpMethod} ${resource.path} already set to ${functionName}`);
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

        console.log(`Done setting ${httpMethod} ${resource.path} to ${functionName}`);
    }

    async setStackMethodFunction(stackName, httpMethod, resource, functionName, functionAlias, aliasStageVariable) {
        let apiGateway = new AWS.APIGateway();
        let cloudFormationService = new CloudFormationService();

        let restApis = await cloudFormationService.getStackAPIGateways(stackName);

        if(!restApis || restApis.length == 0) {
            throw new Error("Rest api not found");
        }
        let restApi = restApis[0];

        let apiResources = await apiGateway.getResources({
            restApiId: restApi.PhysicalResourceId
        }).promise();

        let apiResource = _.filter(apiResources.items, res => {
            return res.resourceMethods ? res.resourceMethods[httpMethod] && res.path === resource : false
        });
        if(!apiResource || apiResource.length === 0) {
            throw new Error("Method not found");
        }

        await this.setMethodFunction(restApi.PhysicalResourceId, httpMethod, apiResource[0].id, functionName, functionAlias, aliasStageVariable);
    }
}
