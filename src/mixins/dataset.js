const { get } = require('lodash')
const contextable = require('./base/contextable')
const baseMixin = require('./base/baseMixin')
const promiseo = require('promiseo')
const { isFunction, checkVisibility, isPromise } = require('./base/utils')

module.exports = {
  mixins: [
    baseMixin,
    contextable
  ],

  methods: {
    async renderItem (fields, model) {
      const item = {}
      for (const key in fields) {
        let field = fields[key]
        if ([String, Number, Array, Object].includes(field)) {
          field = {
            type: field
          }
        }
        if (!checkVisibility(field)) {
          continue
        }
        item[key] = isFunction(field) ? field : (field.value || model[key])
        if (item[key] === undefined) {
          item[key] = field.default || null
        }
        if (isFunction(item[key])) {
          item[key] = item[key].call(this, model)
        }
        if (isPromise(item[key])) {
          item[key] = await item[key]
        }
        if (isFunction(field.type)) {
          item[key] = field.type(item[key])
        }
      }
      return item
    },

    async renderData (fields, items) {
      // if (Array.isArray(fields)) {
      //   fields = fields.reduce((obj, item) => { // eslint-disable-line
      //     obj[item] = true
      //     return obj
      //   }, {})
      // }
      return Promise.all(items.map(item => this.renderItem(fields, item)))
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
      return {
        total: total || items.length,
        items,
        ...(await promiseo.call(this, this.response))
      }
    }
  }
}
