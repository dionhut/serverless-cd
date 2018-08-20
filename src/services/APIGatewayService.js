import AWS from 'aws-sdk';
import uuid from "uuid/v1";
import _ from 'lodash';
import {CloudFormationService} from '../services/CloudFormationService';

export class APIGatewayService {
    async setMethodFunction(restApiId, httpMethod, resourceId, functionName, functionAlias) {
        let lambda = new AWS.Lambda();
        let apiGateway = new AWS.APIGateway();

        let lambdaFunction = await lambda.getFunction({
            FunctionName: functionName
        }).promise();

        let resource = await apiGateway.getResource({
            resourceId: resourceId,
            restApiId: restApiId
        }).promise();

        let functionArn = lambdaFunction.Configuration.FunctionArn;
        if(functionAlias) {
            let alias = await lambda.getAlias({
                FunctionName: functionName,
                Name: functionAlias
            }).promise();
            if(!alias) {
                throw new Error(`Alias ${functionAlias} not found`);
            }
            functionArn = alias.AliasArn;
        }

        let methodPath = _.replace(resource.path, /\{[^\/]+\}/g, '*');
        let accountId = functionArn.split(':')[4];

        if(!resource.resourceMethods[httpMethod]) {
            throw new Error(`Method ${httpMethod} ${methodPath} not found`);
        }

        let policy;
        try {
            policy = await lambda.getPolicy({
                FunctionName: functionName,
                Qualifier: functionAlias
            }).promise();
        } catch(error) {
        }
        if(policy) {
            console.log(`${httpMethod} ${resource.path} already set to ${functionName}`);
            return;
        }

        let sourceArn = `arn:aws:execute-api:${AWS.config.region}:${accountId}:${restApiId}/*/${httpMethod}${methodPath}`;
        await lambda.addPermission({
            Action: 'lambda:InvokeFunction',
            FunctionName: functionArn,
            Principal: 'apigateway.amazonaws.com',
            StatementId: uuid(),
            SourceArn: sourceArn
        }).promise();

        console.log(`Done setting ${httpMethod} ${resource.path} to ${functionName}${functionAlias ? ':' + functionAlias : ''}`);
    }

    async deployStage(restApiId, stageName) {
        let apiGateway = new AWS.APIGateway();

        var params = {
            restApiId: restApiId,
            stageName: stageName,
            variables: {
              'fnAlias': stageName,
            }
        };
        let result = await apiGateway.createDeployment(params).promise();
    }

    async deployStackStage(stackName, stageName) {
        let apiGateway = new AWS.APIGateway();
        let cloudFormationService = new CloudFormationService();

        let restApis = await cloudFormationService.getStackAPIGateways(stackName);

        if(!restApis || restApis.length == 0) {
            throw new Error("Rest api not found");
        }
        let restApi = restApis[0];

        await this.deployStage(restApi.PhysicalResourceId, stageName);
    }

    async setStackMethodFunction(stackName, httpMethod, resource, functionName, functionAlias) {
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

        await this.setMethodFunction(restApi.PhysicalResourceId, httpMethod, apiResource[0].id, functionName, functionAlias);
    }
}
