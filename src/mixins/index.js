const Dialog = require('./dialogable')
const Confirmable = require('./confirmable')
const Auth = require('./authorizable')
const DataSet = require('./dataset')
const Paginatable = require('./pagination')
const Base = require('./base/baseMixin')

module.exports = {
  Base,
  Dialog,
  DataSet,
  Auth,
  Confirmable,
  Paginatable,
}