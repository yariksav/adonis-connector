const dataSet = require('./dataSet')

module.exports = {
  mixins: [
    dataSet
  ],
  props: {
    tree: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    primaryKey () {
      return 'id'
    },
    parentKey () {
      return 'parent_id'
    }
  },
  methods: {
    listToTree (data, options = {}) {
      const ID_KEY = options.idKey || this.primaryKey
      const PARENT_KEY = options.parentKey || this.parentKey
      const CHILDREN_KEY = options.childrenKey || '$children'

      const tree = []
      const childrenOf = {}
      let item
      let id
      let parentId

      for (let i = 0, { length } = data; i < length; i += 1) {
        item = data[i]
        id = item[ID_KEY]
        parentId = item[PARENT_KEY] || 0
        // every item may have children
        childrenOf[id] = childrenOf[id] || []
        // init its children
        item[CHILDREN_KEY] = childrenOf[id]
        if (parentId !== id) {
          // init its parent's children object
          childrenOf[parentId] = childrenOf[parentId] || []
          // push it into its parent's children object
          childrenOf[parentId].push(item)
        } else {
          tree.push(item)
        }
      }
      return tree
    },

    renderTree (items) {
      return Promise.all(items.map(async item => {
        const res = await this.renderItem(this.fields, item)
        if (item.$children && item.$children.length) {
          res.children = await this.renderTree(item.$children)
        } else if (item.children_count) {
          res.children = []
        }
        return res
      }))
    },

    async $$load () {
      let items = await this.load()
      if (this.tree) {
        items = this.listToTree(items)
      }
      return {
        data: await this.renderTree(items)
      }
    }
  }
}
