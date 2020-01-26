const ConnectorException = require('./ConnectorException')

class ConfirmException extends ConnectorException {
  constructor (data) {
    super('E_CONFIRM_EXCEPTION', data)
  }
}
module.exports = ConfirmException
