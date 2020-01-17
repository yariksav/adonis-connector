const waitForPromises = require('./waitForPromises')
const asyncData = require('./asyncData')

module.exports = {
  mixins: [
    waitForPromises,
    asyncData
  ],
  methods: {
    async $run (action) {
      await this.waitForPromises()
      const method = '$$' + (action || this.$options.action)
      return this[method] && this[method]()
    }
  }
}
