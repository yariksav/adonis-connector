
const { isFunction } = require('./utils')
module.exports = {
  created () {
    if (isFunction(this.$options.asyncData)) {
      this.registerWaitFor(async () => {
        const res = await this.$options.asyncData.call(this, this.$options)
        if (res && typeof res === 'object') {
          for (const key in res) {
            this[key] = res[key]
          }
        }
      })
    }
  }
}
