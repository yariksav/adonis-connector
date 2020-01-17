module.exports = {
  created () {
    this.registerWaitFor(() => {
      return !!this.$options.user || this.auth.check()
    })
  },
  computed: {
    userInstance () {
      return this.$options.user || this.auth.user
    }
  }
}
