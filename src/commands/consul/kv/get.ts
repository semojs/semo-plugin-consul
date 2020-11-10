import { ConsulLoader } from '../../../common/ConsulLoader'
import { Utils } from '@semo/core'
import { Argv } from 'yargs'

export const disabled = false // Set to true to disable this command temporarily
export const plugin = 'consul' // Set this for importing plugin config
export const command = 'get <keys...>'
export const desc = 'Consul kv get'
// export const aliases = ''
// export const middleware = (argv) => {}

export const builder = function (yargs: Argv) {
  yargs.option('json', {
    describe: 'Output as json format'
  })
  yargs.option('existed-only', {
    describe: 'Only return existed keys value'
  })
}

interface CustomArgv {
  keys: string[],
  consulKey?: string
  existedOnly?: boolean
  json?: boolean
}

export const handler = async function (argv: CustomArgv) {
  const consulLoader = new ConsulLoader(argv.consulKey)

  const result = await consulLoader.getMulti(argv.keys)

  let zip = Utils._.zipObject(argv.keys, result)

  if (argv.existedOnly) {
    zip = Utils._.pickBy(zip)
  }

  if (argv.json) {
    console.log(JSON.stringify(zip, null, 2))
  } else {
    console.log(zip)
  }
}
