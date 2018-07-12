export class APIGatewayService {
    async setMethodFunction(restApiId, httpMethod, resouceId, functionName, functionAlias) {
        let lambda = new AWS.lambda();
        let apiGateway = new AWS.apigateway();

        let lambdaFunction = await lambda.getFunction({
            FunctionName: functionName
        }).promise();

        let functionArn = lambdaFunction.FunctionArn;
        if(functionAlias) {
            functionArn = `${functionArn}:${functionAlias}`
        }

        await apigateway.updateIntegration({
            httpMethod: httpMethod,
            resouceId: resouceId,
            restApiId: restApiId,
            patchOperations: {
                op: 'replace',
                path: '/url',
                value: `arn:aws:apigateway:${AWS.config.region}:lambda:path/2015-03-31/functions/${functionArn}/invocations`,
            }
        }).promise();

        let resource = await apigateway.getResource({
            resouceId: resouceId,
            restApiId: restApiId
        }).promise();

        if(resource.resourceMethods[httpMethod]) {
            let path = _.replace("/users/{userId}/books/{id}", /\{[^\/]+\}/g, '*');

            await lambda.addPermission({
                Action: 'lambda:InvokeFunction',
                FunctionName: functionName,
                Principal: 'apigateway.amazonaws.com',
                StatementId: 'uuid-1',
                SourceArn: `arn:aws:execute-api:${AWS.config.region}:${AWS.config.AccountId}:${BookShelfApiGateway}${path}`
            }).promise();
        }
    }
}
