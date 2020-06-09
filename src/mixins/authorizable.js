const GE = require('@adonisjs/generic-exceptions')

module.exports = {
  created () {
    this.beforeInit(() => {
      if (this.user) {
        return true
      }
      if (!this.auth) {
        throw new GE.HttpException('User not defined', 401, 'E_AUTH_USER_NOT_DEFINED')
      }
      return this.auth.check()
    })
  },
  computed: {
    user () {
      return this.$options.user || (this.auth && this.auth.user)
    }
  }
}
