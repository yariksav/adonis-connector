const { validate } = use('Validation')
const { pick, pickBy } = require('lodash')
const promiseo = require('promiseo')
const { isFunction, checkVisibility, isPromise } = require('./base/utils')
const contextable = require('./base/contextable')
const baseMixin = require('./base/baseMixin')
const primaryKey = require('./primaryKey')()

module.exports = {
  mixins: [baseMixin, contextable, primaryKey],
  props: {
    id: [Number, String],
    inputs: Object
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
    validate (inputs, rules) {
      const _rules = rules || inputs || this.rules
      const _inputs = rules ? inputs : this.inputs
      // use pickBy for remove nullable items
      return validate(_inputs, pickBy(_rules))
    },

    getAllowedInputs () {
      // todo move controls to cache and check async?
      const res = {}
      const controls = isFunction(this.controls) ? this.controls() : this.controls
      for (const key in controls) {
        const control = controls[key]
        const disabled = isFunction(control.disabled) ? control.disabled() : control.disabled
        const readonly = isFunction(control.readonly) ? control.readonly() : control.readonly
        if (checkVisibility(control) && !disabled && !readonly) {
          res[key] = this.inputs[key]
          if (isFunction(control.type)) {
            res[key] = control.type(res[key])
          }
        }
      }
      return res
    },

    only (params) {
      const _params = Array.isArray(params) ? params : arguments
      return pick(this.inputs, _params)
    },

    async renderData (controls, model = {}) {
      const data = {}
      const controlsOptions = {}
      for (const key in controls) {
        const control = controls[key]
        if (!checkVisibility(control)) {
          continue
        }
        data[key] = isFunction(control) ? control : (control.value !== undefined ? control.value : model[key])
        if (data[key] === undefined) {
          data[key] = control.default || null
        }
        if (isFunction(data[key])) {
          data[key] = data[key].call(this)
        }
        if (isPromise(data[key])) {
          data[key] = await data[key]
        }
        if (isFunction(control.type)) {
          data[key] = control.type(data[key])
        }
        delete control.default
        delete control.value
        if (typeof control === 'object' && Object.keys(control).length) {
          controlsOptions[key] = control
        }
      }
      return {
        data,
        controls: controlsOptions
      }
    },

    async $$get () {
      if (!this.model || this.model.isNew) {
        return null
      }
      const controls = await promiseo.call(this, this.controls, { deep: true })
      const res = await this.renderData(controls, this.model)
      return res.data
    },

    async $$load () {
      const controls = await promiseo.call(this, this.controls, { deep: true })
      const res = await this.renderData(controls, this.model)
      return {
        title: this.title,
        rules: this.rules,
        description: this.description,
        actions: this.actions,
        ...res
      }
    },

    async $$save () {
      const fn = isFunction(this.save) ? 'save' : (this.isNew ? 'create' : 'update')
      isFunction(this[fn]) && await this[fn]()
      return this.renderData(this.controls, this.model)
    },

    async $$delete () {
      if (!isFunction(this.delete)) {
        throw new Error('You can\'t delete in this component')
      }
      await this.delete()
    }
  }
}
