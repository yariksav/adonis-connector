module.exports = {
  created () {
    this.beforeInit(() => {
      if (this.user) {
        return true
      }
      if (!this.auth) {
        throw new Error('E_AUTH_USER_NOT_DEFIGNED')
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
