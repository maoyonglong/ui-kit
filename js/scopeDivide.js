class ScopeDivide {
  constructor (scope, step, format = 'normal') {
    this.scope = scope
    this.step = step
    this.format = format
    this._divide()
  }
  _divide () {
    const scope = this.scope
    const step = this.step
    const points = []
    for (let i = scope[0]; i <= scope[1]; i += step) {
      points.push(i)
    }
    this.points = points
  }
  distance () {
    return this.last - this.first
  }
  get last () {
    return this.nth(this.points.length-1)
  }
  get first () {
    return this.nth(0)
  }
  length () {
    return this.points.length
  }
  nth (key) {
    return this.points[key] 
  }
  isCrossLeft (key) {
    return key < 0
  }
  isCrossRight (key) {
    return key >= this.points.length
  }
  hasKey (key) {
    return key > 0 && key <= this.points.length
  }
  getPos (value) {
    const points = this.points
    const len = points.length
    const format = this.format
    let pos = 0
    if (value < points[0]) return -1
    else if (value > points[len-1]) return -2
    else {
      let prePoint = points[0] - 1
      for (let i = 1; i < len; i++) {
        let point = points[i]
        if (value === point) {
          pos = i
          break
        }
        if (prePoint < value && value < point) {
          if (format === 'normal') {
            pos = i
          }
          else if (format === 'round') {
            pos = i
            if (value < (prePoint + point) / 2) {
              pos--
            }
          }
          break
        }

        prePoint = point
      }
    }
    return pos
  }
}

export default ScopeDivide
