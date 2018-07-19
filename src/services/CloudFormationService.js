import AWS from 'aws-sdk';
import _ from 'lodash';

export class CloudFormationService {

    async getAllStackFunctions(stackName) {
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
            return this.getAllStackFunctions(stackRes.PhysicalResourceId);
        })));

        // Add functions created by root stack
        funcResources = _.concat(funcResources, _.filter(resources.StackResourceSummaries, resource =>
            (resource.ResourceStatus === "CREATE_COMPLETE" || resource.ResourceStatus === "UPDATE_COMPLETE")
                && resource.ResourceType === "AWS::Lambda::Function"
        ));

        return funcResources;
    }

    async getStackAPIGateways(stackName) {
        let cloudFormation = new AWS.CloudFormation();

        // Get all resources created by stack
        let resources = await cloudFormation.listStackResources({
            StackName: stackName
        }).promise();

        // Get all API Gateways created by any nested stacks
        let apiGateways = _.flatMap(await Promise.all(_.map(_.filter(resources.StackResourceSummaries, resource =>
            (resource.ResourceStatus === "CREATE_COMPLETE" || resource.ResourceStatus === "UPDATE_COMPLETE")
                && resource.ResourceType === "AWS::CloudFormation::Stack"
        ), stackRes => {
            return this.getStackAPIGateways(stackRes.PhysicalResourceId);
        })));

        // Add API Gateways created by root stack
        apiGateways = _.concat(apiGateways, _.filter(resources.StackResourceSummaries, resource =>
            (resource.ResourceStatus === "CREATE_COMPLETE" || resource.ResourceStatus === "UPDATE_COMPLETE")
                && resource.ResourceType === "AWS::ApiGateway::RestApi"
        ));

        return apiGateways;
    }
}
