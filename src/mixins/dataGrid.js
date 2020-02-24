const { get } = require('lodash')
const dataSet = require('./dataSet')

module.exports = {
  mixins: [
    dataSet
  ],
  props: {
    schema: Boolean
  },
  methods: {
    renderColumns (fields) {
      return Object.keys(fields)
        .filter(item => typeof fields[item] === 'object' && (fields[item].component || fields[item].text !== undefined))
        .map(item => {
          delete fields[item].value
          fields[item].value = item
          return fields[item]
        })
    },
    async $$load () {
      let data = await this.load()
      let total
      if (get(data, 'constructor.name') === 'VanillaSerializer') {
        if (data.pages) {
          total = +data.pages.total
        }
        data = data.rows
      }
      const res = {
        data: await this.renderData(this.fields, data),
      }
      res.total = total || res.data.length

      if (this.schema) {
        res.schema = {
          columns: await this.renderColumns(this.fields),
          actions: this.actions,
          ...this.options
        }
      }
      return res
    }
  }
}
