const crypto = require('crypto')
const GraphQLError = require('adonis-graphql-extra/src/Errors')

class ConfirmException extends GraphQLError {
  constructor (data) {
    super('E_CONFIRM_EXCEPTION', data)
  }
}

module.exports = {
  props: {
    confirmData: {
      type: Object,
      default: () => ({})
    },
    force: Boolean
  },
  methods: {
    confirm (message, options = {}) {
      if (this.force) {
        return true
      }
      const hash = crypto.createHash('md5').update(message).digest('hex')
      if (this.confirmData[hash] === undefined) {
        throw new ConfirmException({
          options: {
            text: message,
            ...options
          },
          hash,
          confirmData: this.confirmData
        })
      } else {
        return this.confirmData[hash]
      }
    },
    warning (message, options) {
      return this.confirm(message, { type: 'warning', title: 'Warning', ...options })
    }
  }
}
