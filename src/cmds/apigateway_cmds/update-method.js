export const command = 'update-method <command>'
export const desc = 'API Gateway commands'
export function builder (yargs) {
  return yargs.commandDir('update_method_cmds')
}
export function handler (argv) {}
