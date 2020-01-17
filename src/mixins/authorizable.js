module.exports = {
  created () {
    this.registerWaitFor(() => {
      return Boolean(this.userInstance) || this.auth.check()
    })
  },
  computed: {
    userInstance () {
      return this.$options.user || this.auth.user
    }
  }
}
