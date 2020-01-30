const Dialog = require('./dialogable')
const Confirmable = require('./confirmable')
const Auth = require('./authorizable')
const DataSet = require('./dataset')
const Paginatable = require('./pagination')
const Base = require('./base/baseMixin')
const Api = require('./api')

module.exports = {
  Base,
  Dialog,
  DataSet,
  Api,
  Auth,
  Confirmable,
  Paginatable
}