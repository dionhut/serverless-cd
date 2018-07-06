# Serverless CD CLI

Some useful serverless CD commands to more easily execute combined AWS lambda, apigateway and cloudformation CLI commands for Serverless continuous deployment within CodePipeline and CodeBuild buildspecs in conjunction with CloudFormation template(s).

## --help
```
09:09 $ ./bin/serverless-cd.js --help
serverless-cd.js <command>

Commands:
  serverless-cd.js apigateway <command>  API Gateway CD commands
  serverless-cd.js lambda <command>      Lambda CD commands

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

## lambda
```
09:09 $ ./bin/serverless-cd.js lambda --help
serverless-cd.js lambda <command>

Lambda CD commands

Commands:
  serverless-cd.js lambda promote           Create or update Lambda function
  <function-name>                           alias to a new version or a version
                                            linked to another alias

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

## apigateway
```
09:13 $ ./bin/serverless-cd.js apigateway --help
serverless-cd.js apigateway <command>

API Gateway CD commands

Commands:
  serverless-cd.js apigateway               API Gateway commands
  update-method <command>

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```
