module.exports = (key = 'id', type = [Number, String]) => {
  return {
    props: {
      [key]: type
    },
    computed: {
      isNew () {
        return !this[key]
      }
    }
  }
}
