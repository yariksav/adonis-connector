
class ConnectorException extends Error {
  constructor (message, state) {
    super(message)
    this.state = state
  }
}
module.exports = ConnectorException
