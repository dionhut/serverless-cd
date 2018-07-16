# Serverless CD CLI

Some useful serverless CD commands to more easily execute combined AWS lambda, apigateway and cloudformation CLI commands for Serverless continuous deployment within CodePipeline and CodeBuild buildspecs in conjunction with CloudFormation template(s).

## --help
```
19:36 $ ./bin/serverless-cd.js --help
serverless-cd.js <command>

Commands:
  serverless-cd.js apigateway <command>      AWS API Gateway continous deployment commands
  serverless-cd.js cloudformation <command>  AWS CloudFormation continous deployment commands
  serverless-cd.js lambda <command>          AWS Lambda continous deployment commands

Options:
  --version  Show version number                                                                               [boolean]
  --help     Show help                                                                                         [boolean]
```

## lambda
```
20:34 $ ./bin/serverless-cd.js lambda
serverless-cd.js lambda <command>

AWS Lambda continous deployment commands

Commands:
  serverless-cd.js lambda deploy <function-name>  Create or update Lambda function alias to a new version or a version
                                                  linked to another alias
```

## apigateway
```
20:35 $ ./bin/serverless-cd.js apigateway
serverless-cd.js apigateway <command>

AWS API Gateway continous deployment commands

Commands:
  serverless-cd.js apigateway set-method-function  Set API gateway method lambda function and update lambda permissions
```

## cloudformation
```
20:35 $ ./bin/serverless-cd.js cloudformation
serverless-cd.js cloudformation <command>

AWS CloudFormation continous deployment commands

Commands:
  serverless-cd.js cloudformation deploy-all-functions          Create or update Lambda function alias to a new version
  <stack-name>                                                  or a version linked to another alias for each lambda
                                                                created by cloudformation stack
```
