const checkVisibility = function checkVisibility (obj) {
  if (obj && obj.visible !== undefined) {
    const visible = isFunction(obj.visible) ? obj.visible() : obj.visible
    if (!visible) {
      return false
    }
  }
  return true
}

const isFunction = fn => typeof fn === 'function'

const isNil = s => s === null || s === undefined

const isPromise = promise => {
  return promise && (promise instanceof Promise || typeof promise.then === 'function')
}

module.exports = {
  checkVisibility,
  isFunction,
  isNil,
  isPromise
}
