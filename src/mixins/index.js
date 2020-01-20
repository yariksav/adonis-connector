const Dialog = require('./dialogable')
const Confirmable = require('./confirmable')
const Auth = require('./authorizable')
const DataSet = require('./dataset')
const Paginatable = require('./pagination')
const PrimaryKey = require('./primaryKey')
const Base = require('./base/baseMixin')

module.exports = {
  Base,
  Dialog,
  DataSet,
  PrimaryKey,
  Auth,
  Confirmable,
  Paginatable,
}