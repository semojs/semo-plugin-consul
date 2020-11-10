export const disabled = false // Set to true to disable this command temporarily
// export const plugin = '' // Set this for importing plugin config
export const command = 'set'
export const desc = 'Consul kv set'
// export const aliases = ''
// export const middleware = (argv) => {}

export const builder = function (yargs: any) {
  // yargs.option('option', { default, describe, alias })
  // yargs.commandDir('set')
}

export const handler = async function (argv: any) {
  console.log('Start to draw your dream code!')
}
