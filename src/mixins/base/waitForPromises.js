module.exports = {
  beforeCreate () {
    this.promisesForWait = []
    this.promisesAfterInit = []
  },
  methods: {
    beforeInit (fn) {
      this.promisesForWait.push(fn())
    },
    async waitForPromises () {
      this.promisesForWait.length && await Promise.all(this.promisesForWait)
      this.promisesAfterInit.length && await Promise.all(this.promisesAfterInit.map(item => item()))
    },
    afterInit (fn) {
      this.promisesAfterInit.push(fn)
    }
  }
}
