import AWS from 'aws-sdk';

export const command = 'promote <function-name>'
export const desc = 'Create or update Lambda function alias to a new version or a version linked to another alias'
export const builder = (yargs) => {
    yargs.positional('function-name', {
        type: 'string',
        describe: 'Lambda Thumbnail or ARN'
    }).option('to-alias', {
        type: 'string',
        describe: 'To Alias'
    }).option('from-alias', {
        type: 'string',
        describe: 'From Alias'
    }).demandOption(['to-alias']);
}
export function handler (argv) {
    (async () => {
        let functionCommands = new FunctionCommands();
        try {
            await functionCommands.promoteFunction(argv.functionName, argv.fromAlias, argv.toAlias);
        } catch(error) {
            console.error(error);
        }
    })().then();
}

class FunctionCommands {
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

        console.log('Promotion of ', functionName, ' Done.');
    }
}
