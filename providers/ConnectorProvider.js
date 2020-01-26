'use strict'

/**
 * adonis-connector
 *
 * @license MIT
 * @copyright Yaroslav Savaryn - <yariksav@gmail.com>
 */

const { ServiceProvider } = require('@adonisjs/fold')
const Connector = require('../src/Connector')
const ConnectorException = require('../src/exceptions/ConnectorException')

class ConnectorProvider extends ServiceProvider {
  /**
   * Registers providers for Connectors
   * commands.
   *
   * @return {void}
   */
  _registerConnector () {
    this.app.bind('App/Exceptions/ConnectorException', ConnectorException)
    this.app.singleton('Adonis/Addons/Connector', (app) => {
      const Config = app.use('Adonis/Src/Config')
      const Connector = require('../src/Connector')
      return new Connector(Config)
    })
    this.app.alias('Adonis/Addons/Connector', 'Connector')
  }

  /**
   * Register all the required providers.
   *
   * @return {void}
   */
  register () {
    this._registerConnector()
  }

  /**
   * On boot add commands with ace.
   *
   * @return {void}
   */
  boot () {
  }
}

module.exports = ConnectorProvider
