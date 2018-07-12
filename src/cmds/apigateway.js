export const command = 'apigateway <command>'
export const desc = 'AWS API Gateway continous deployment commands'
export function builder (yargs) {
  return yargs.commandDir('apigateway_cmds')
}
export function handler (argv) {}
