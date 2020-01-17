const Dialog = require('./dialogable')
const Confirm = require('./confirmable')
const Auth = require('./authorizable')
const DataSet = require('./dataset')
const Pagination = require('./pagination')
const PrimaryKey = require('./primaryKey')
const Base = require('./base/baseMixin')

module.exports = {
  Dialog,
  Confirm,
  DataSet,
  Pagination,
  Auth,
  Base,
  PrimaryKey
}