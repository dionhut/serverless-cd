import AWS from 'aws-sdk';

export class FunctionCommands {

    async promoteFunction(functionName, fromAlias, toAlias) {
        var lambda = new AWS.Lambda();

        var version;
        if(!fromAlias) {
            let functionVersion = await lambda.publishVersion({
                FunctionName: functionName
            }).promise();
            version = functionVersion.Version;
            console.log('Version ', version);
        } else {
            let alias = await lambda.getAlias({
                FunctionName: functionName,
                Name: fromAlias
            }).promise();
            version = alias.FunctionVersion;
            console.log('From Alias ', fromAlias, ' Version ', version);
        }

        var aliases = await lambda.listAliases({
            FunctionName: functionName,
        }).promise();
        var alias = aliases.Aliases.find(a => {
            return a.Name === toAlias;
        });

        if(!alias) {
            alias = await lambda.createAlias({
                FunctionName: functionName,
                Name: toAlias,
                FunctionVersion: version
            }).promise();
        } else {
            alias = await lambda.updateAlias({
                FunctionName: functionName,
                Name: toAlias,
                FunctionVersion: version
            }).promise();
        }

        console.log('Promote ', functionName, ' Done.');
    }
}
