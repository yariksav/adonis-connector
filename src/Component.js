'use strict'
/**
 * adonis-connector
 *
 * @license MIT
 * @copyright Yaroslav Savaryn - <yariksav@gmail.com>
 */

const Vue = require('vue')
const debugreq = require('debug')('connector:request')
const debugrsp = require('debug')('connector:response')
Vue.config.devtools = false
Vue.config.productionTip = false
Vue.config.silent = process.env.ENV_MODE === 'development'

const proxyHandler = {
  get (target, name) {
    if (typeof (name) === 'symbol' || name === 'inspect') {
      return target[name]
    }
    if (target[name]) {
      return target[name]
    }

    return async (params, context) => {
      return target.run(name, params, context)
    }
  }
}

class Component {
  constructor (component, connector) {
    this.component = component
    this.connector = connector
    this.Ctor = Vue.extend(component)
    return new Proxy(this, proxyHandler)
  }

  async run (action, params, context) {
    debugreq('%s:%s %o', '', action, params)
    const date = new Date()
    const vm = new this.Ctor({
      connectorConstructor: this.connector,
      ...this.connector.context,
      ...context,
      propsData: { ...params },
      action
    })

    if (!vm['$$' + action]) {
      throw new Error(`Method ${action} doesn't exisit`)
    }
    const res = await vm.$run(action, params)
    vm.$destroy()
    debugrsp('%o %s', res, new Date() - date)
    return res
  }
}
module.exports = Component
