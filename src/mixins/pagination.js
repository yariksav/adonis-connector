module.exports = {
  props: {
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 10
    },
    search: String,
    sortBy: {
      type: String
    },
    sortDirection: {
      type: String,
      validator (val) {
        return ['ASC', 'DESC'].includes(val)
      }
    }
  }
}
