import { Utils } from '@semo/core'
import { ConsulLoader } from '../common/ConsulLoader'

export const hook_repl = new Utils.Hook('semo', () => {
  const consulLoader = new ConsulLoader()
  return { consulLoader }
})

export const hook_connection = new Utils.Hook('consul', () => {
  return {
    local: {
      host: '127.0.0.1',
      port: 8500,
    }
  }
})