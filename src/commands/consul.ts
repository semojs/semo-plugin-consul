export const disabled = false // Set to true to disable this command temporarily
// export const plugin = '' // Set this for importing plugin config
export const command = 'consul'
export const desc = 'Consul tools'
// export const aliases = ''
// export const middleware = (argv) => {}

export const builder = function (yargs: any) {
  yargs.option('consul-key', { default: '', describe: 'Set consul key', alias: 'K' })
  yargs.commandDir('consul')
}

export const handler = async function (argv: any) {
}
