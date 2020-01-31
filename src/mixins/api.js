const { validate } = use('Validation')
const { pick, pickBy } = require('lodash')
const { isFunction, checkVisibility, isPromise } = require('./base/utils')
const contextable = require('./base/contextable')
const baseMixin = require('./base/baseMixin')
module.exports = {
  mixins: [baseMixin, contextable],
  props: {
    inputs: Object
  },
  methods: {
    validate (inputs, rules) {
      const _rules = rules || inputs || this.rules
      const _inputs = rules ? inputs : this.inputs
      if (!_rules) {
        return true
      }
      // use pickBy for remove nullable items
      return validate(_inputs, pickBy(_rules))
    },

    getAllowedInputs () {
      // todo move controls to cache and check async?
      const res = {}
      for (const key in this.controls) {
        const control = this.controls[key]
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
      }
      return data
    }
  }
}
