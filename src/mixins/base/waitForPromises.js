module.exports = {
  beforeCreate () {
    this.promisesForWait = []
  },
  methods: {
    registerWaitFor (fn) {
      this.promisesForWait.push(fn())
    },
    waitForPromises () {
      return this.promisesForWait.length && Promise.all(this.promisesForWait)
    }
  }
}
