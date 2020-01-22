class Component {
  constructor (defaultOpts, opts) {
    this.applyOptions(defaultOpts, opts)
  }
  applyOptions (defaultOpts, opts) {
    Object.assign(defaultOpts, opts)
    for (let key of Object.keys(defaultOpts)) {
      this[key] = defaultOpts[key]
    }
  }
}

export default Component
