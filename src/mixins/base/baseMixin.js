const waitForPromises = require('./waitForPromises')
const asyncData = require('./asyncData')

module.exports = {
  mixins: [
    waitForPromises,
    asyncData
  ],
  methods: {
    async $run (action, params) {
      await this.waitForPromises()
      const method = '$$' + (action || this.$options.action)
      return this[method] && this[method](params)
    },
    $connector (name) {
      return new Proxy({ parent: this, name }, proxyHandler)
    }
  }
}

const proxyHandler = {
  get (target, action) {
    return function(params, options) {
      if (typeof (action) === 'symbol' || action === 'inspect') {
        return target[action]
      }
      return target.parent.$options.connectorConstructor.component(target.name)[action](params, {
        request: target.parent.$options.request,
        auth: target.parent.$options.auth,
        user: target.parent.user,
        ...options
      })
    }
  }
}
