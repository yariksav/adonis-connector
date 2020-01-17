const waitForPromises = require('./waitForPromises')
module.exports = {
  mixins: [waitForPromises],
  computed: {
    // context () {
    //   return this.$options.context.auth
    // },
    // request () {
    //   return this.$options.context.request
    // },
  },
  methods: {
    async $run (action) {
      if (this.$options.asyncData) {
        await this.$options.asyncData.call(this)
      }
      await this.waitForPromises()
      const method = '$$' + (action || this.$options.action)
      return this[method] && this[method]()
    }
  }
}
