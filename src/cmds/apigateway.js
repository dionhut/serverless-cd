export const command = 'apigateway <command>'
export const desc = 'API Gateway CD commands'
export function builder (yargs) {
  return yargs.commandDir('apigateway_cmds')
}
export function handler (argv) {}
