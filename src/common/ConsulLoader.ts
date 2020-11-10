import { Utils } from '@semo/core'
import consul from 'consul'
import { ConsulOptions, Consul } from 'consul'

export class ConsulLoader {
  instances: { [propName: string]: Consul }
  currentConsulKey: string
  constructor(consulKey: string = '') {
    this.instances = {}
    this.currentConsulKey = consulKey ? consulKey : this.defaultConnection
  }

  // Try to get instance
  private async ensureInstance() {
    if (!this.currentConsulKey) {
      throw new Error('Consul key not found')
    }

    let consulInstance
    if (this.instances[this.currentConsulKey]) {
      consulInstance = this.instances[this.currentConsulKey]
    } else {
      consulInstance = await this.load(this.currentConsulKey)
    }
    return consulInstance
  }

  // Get default connection from semo config
  get defaultConnection() {
    return Utils.config('$plugin.consul.defaultConnection', '')
  }

  // Get all registered consul config options
  async getConfigs(): Promise<ConsulOptions[]> {
    const rcConsulConfig = Utils.config('$plugin.consul.connection')
    const hookConsulConfig = await Utils.invokeHook('consul:connection')
    const finalConsulConfig = Utils._.merge(rcConsulConfig, hookConsulConfig)
    return finalConsulConfig
  }

  // Get consul config option
  async getConfig(consulKey): Promise<ConsulOptions> {

    if (!consulKey) {
      throw new Error(`consulKey is required`)
    }

    const configs = await this.getConfigs()
    const config = configs[consulKey]
    if (!config) {
      throw new Error(`${consulKey} not found in db config`)
    }

    return config
  }

  // Load consul instance
  async load(consulKey?: string | ConsulOptions): Promise<Consul> {
    consulKey = consulKey || this.currentConsulKey

    let options!: ConsulOptions

    if (typeof consulKey === 'string') {
      options = await this.getConfig(consulKey)
    } else {
      options = <ConsulOptions>consulKey
    }

    const consulInstance = new consul(Object.assign({}, options, {
      promisify: true
    }))

    const instanceKey: string = Utils._.isString(consulKey) ? <string>consulKey : Utils.md5(JSON.stringify(consulKey))
    if (this.instances[instanceKey]) {
      return this.instances[instanceKey]
    }

    this.instances[instanceKey] = consulInstance
    this.currentConsulKey = instanceKey

    return consulInstance
  }

  // Set currentConsulKey
  setConsulKey(consulKey) {
    this.currentConsulKey = consulKey
    return this
  }

  // Get key from consul
  async get(key: string) {
    let consulInstance = await this.ensureInstance()

    const data = await consulInstance.kv.get({ key })
    if (!data) {
      return null
    }
    const { Value } = data
    return Value
  }

  async getMulti(keys: string[]) {
    return Promise.all(keys.map(key => this.get(key)))
  }

  // Set key/value to consul
  async set(key, value) {
    let consulInstance = await this.ensureInstance()
    return consulInstance.kv.set({ key, value })
  }

  

  // Delete key from consul
  async del(key) {
    let consulInstance = await this.ensureInstance()

    return consulInstance.kv.del({ key })
  }
  
}