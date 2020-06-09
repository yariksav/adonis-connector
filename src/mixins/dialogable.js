const { omit } = require('lodash')
const promiseo = require('promiseo')
const { isFunction, checkVisibility } = require('./base/utils')
const contextable = require('./base/contextable')
const baseMixin = require('./base/baseMixin')
const api = require('./api')
const GE = require('@adonisjs/generic-exceptions')

module.exports = {
  mixins: [
    baseMixin,
    contextable,
    api
  ],

  props: {
    id: [Number, String],
    schema: Boolean
  },

  computed: {
    primaryKey () {
      return 'id'
    },
    isNew () {
      return !this[this.primaryKey]
    }
  },

  methods: {
    renderControls (controls) {
      return Object.keys(controls).reduce((acc, key) => {
        const control = controls[key]
        if (typeof control === 'object' && checkVisibility(control) && Object.keys(control).length) {
          acc[key] = omit(control, ['deafult', 'value'])
        }
        return acc
      }, {})
    },

    async $$load () {
      const controls = await promiseo.call(this, this.controls, { deep: Boolean(this.schema) })
      const res = {
        data: await this.renderData(controls, this.model)
      }
      if (this.schema) {
        res.schema = {
          title: this.title,
          rules: this.rules,
          description: this.description,
          actions: this.actions,
          controls: this.renderControls(controls)
        }
      }
      return res
    },

    async $$save () {
      const fn = isFunction(this.save) ? 'save' : (this.isNew ? 'create' : 'update')
      isFunction(this[fn]) && await this[fn]()
      return {
        data: await this.renderData(this.controls, this.model)
      }
    },

    async $$delete () {
      if (!isFunction(this.delete)) {
        throw new GE.HttpException('You can\'t delete in this component', 403, 'E_CANNOT_DELETE')
      }
      await this.delete()
      return true
    }
  }
}
