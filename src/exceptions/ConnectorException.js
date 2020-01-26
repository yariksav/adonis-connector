
class ConnectorException extends Error {
  constructor (message, state) {
    this.state = state
    super(message, data)
  }
}
module.exports = ConnectorException
