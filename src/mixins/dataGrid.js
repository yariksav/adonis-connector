const { get } = require('lodash')
const dataSet = require('./dataset')

module.exports = {
  mixins: [
    dataSet
  ],
  methods: {
    renderColumns (fields) {
      return Object.keys(fields)
        .filter(item => typeof fields[item] === 'object' && (fields[item].component || fields[item].text))
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
      const items = await this.renderData(this.fields, data)
      const columns = await this.renderColumns(this.fields)
      return {
        total: total || items.length,
        items,
        columns,
        actions: this.actions,
        options: this.options || {}
      }
    }
  }
}
