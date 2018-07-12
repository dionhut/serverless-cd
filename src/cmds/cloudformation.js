export const command = 'cloudformation <command>'
export const desc = 'AWS CloudFormation continous deployment commands'
export function builder (yargs) {
  return yargs.commandDir('cloudformation_cmds')
}
export function handler (argv) {}
