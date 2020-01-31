const { validate } = use('Validation')
const { pick, pickBy, omit } = require('lodash')
const promiseo = require('promiseo')
const { isFunction, checkVisibility, isPromise } = require('./base/utils')
const contextable = require('./base/contextable')
const baseMixin = require('./base/baseMixin')
const api = require('./api')

module.exports = {
  mixins: [baseMixin, contextable, api],

  props: {
    id: [Number, String]
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
      const controls = await promiseo.call(this, this.controls, { deep: true })
      return {
        title: this.title,
        rules: this.rules,
        description: this.description,
        actions: this.actions,
        data: await this.renderData(controls, this.model),
        controls: this.renderControls(controls)
      }
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
        throw new Error('You can\'t delete in this component')
      }
      await this.delete()
    }
  }
}
