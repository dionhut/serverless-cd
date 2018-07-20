# Serverless CD CLI

Some useful serverless CD commands to more easily execute combined AWS lambda, apigateway and cloudformation CLI commands for Serverless continuous deployment within CodePipeline and CodeBuild buildspecs in conjunction with CloudFormation template(s).

## How to install

`npm install -g serverless-cd`

## --help
```
$ serverless-cd.js --help
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
$ serverless-cd.js lambda
serverless-cd.js lambda <command>

AWS Lambda continous deployment commands

Commands:
  serverless-cd.js lambda deploy <function-name>  Create or update Lambda function alias to a new version or a version
                                                  linked to another alias
```

## apigateway
```
$ serverless-cd.js apigateway --help
serverless-cd.js apigateway <command>

AWS API Gateway continous deployment commands

Commands:
  serverless-cd.js apigateway set-method-function  Set API gateway method lambda permissions
```

## cloudformation
```
$ serverless-cd.js cloudformation --help
serverless-cd.js cloudformation <command>

AWS CloudFormation continous deployment commands

Commands:
  serverless-cd.js cloudformation apigateway <command>  AWS API Gateway continous deployment commands
  serverless-cd.js cloudformation lambda <command>      AWS Lambda continous deployment commands
```
### cloudformation apigateway
```
$ serverless-cd.js cloudformation apigateway --help
serverless-cd.js cloudformation apigateway <command>

AWS API Gateway continous deployment commands

Commands:
  serverless-cd.js cloudformation apigateway                    Set API gateway method lambda permissions managed by
  set-method-function                                           specified cloudformation stack
```
### cloudformation lambda
```
$ serverless-cd.js cloudformation lambda --help
serverless-cd.js cloudformation lambda <command>

AWS Lambda continous deployment commands

Commands:
  serverless-cd.js cloudformation lambda deploy-all-functions   Create or update Lambda function alias to a new version
  <stack-name>                                                  or a version linked to another alias for each lambda
                                                                managed by cloudformation stack
```
