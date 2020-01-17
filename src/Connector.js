
const Component = require('./Component')
const { get } = require('lodash')
const { join } = require('path')
const requireAll = require('require-all')
const Vue = require('vue')
'use strict'
/**
 * adonis-connector
 *
 * @license MIT
 * @copyright Yaroslav Savaryn - <yariksav@gmail.com>
 */

class Connector {
  constructor (Config) {
    this.Config = Config
    this.context = {}
    const path = Config.get('services.connector.path')
    const messagesPath = Config.get('services.connector.messages')

    this._mixins = require('./mixins')

    this.components = {}
    if (path) {
      this.components = requireAll({
        dirname: path,
        excludeDirs:  /^(mixins|src)$/,
        recursive: true
      })
    }

    if (messagesPath) {
      this.messages = requireAll({
        dirname: messagesPath,
        recursive: true
      })
    }
    if (this.messages) {
      const VueI18n = require('vue-i18n')
      Vue.use(VueI18n)
      this.context.i18n = new VueI18n({
        locale: 'en',
        messages: this.messages
      })
    }
  }

  mixins (names) {
    return names.map(name => {
      return this.mixin(name)
    })
  }

  mixin (key, value) {
    if (value) {
      this._mixins[key] = value
    } else {
      if (!this._mixins[key]) {
        throw new Error(`Mixin ${key} not found`)
      }
      return this._mixins[key]
    }
  }

  component (name) {
    const component = get(this.components, name.replace(/\//g, '.'))
    if (!component) {
      throw new Error(`Component "${name}" was not found`)
    }
    if (component.mixins) {
      for (const index in component.mixins) {
        if (typeof component.mixins[index] === 'string') {
          component.mixins[index] = this.mixin(component.mixins[index])
        }
      }
    }
    return new Component(component, this)
  }
}

module.exports = Connector
