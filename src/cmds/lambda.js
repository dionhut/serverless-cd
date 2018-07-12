export const command = 'lambda <command>'
export const desc = 'AWS Lambda continous deployment commands'
export function builder (yargs) {
  return yargs.commandDir('lambda_cmds')
}
export function handler (argv) {}
