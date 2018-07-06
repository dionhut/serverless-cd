export const command = 'lambda <command>'
export const desc = 'Lambda CD commands'
export function builder (yargs) {
  return yargs.commandDir('lambda_cmds')
}
export function handler (argv) {}
