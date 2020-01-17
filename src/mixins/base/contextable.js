
module.exports = {
  created () {
    this.$i18n.locale = this.request ? this.request.header('language') : 'en'
  },

  computed: {
    auth () {
      return this.$options.auth
    },
    request () {
      return this.$options.request
    }
  }
}
