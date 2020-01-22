import ScopeDivide from './scopeDivide'
import Component from './component'

const debounce = _.debounce

class Range extends Component {
  constructor (range, opts) {
    super({
      step: 20,
      scope: [0, 100],
      value: 0,
      format: 'number',
      area: document
    }, opts)
    this.range = range
    this.slider = range.querySelector('.range-slider')
    this.track = range.querySelector('.range-track')
    this.progress = range.querySelector('.range-progress.active')
    this.labels = range.querySelectorAll('.range-label')
    this.viewPoints = range.querySelectorAll('.range-progress-point')
    this.trackWidth = this.track.clientWidth
    this.trackLeft = this.track.getBoundingClientRect().left
    this.valueDivide()
    this.viewDivide()
  }

  widthToValue (width) {
    let pos = this.viewDivide.getPos(width)
    if (pos === -1) {
      pos = 0
    } else if (pos === -2) {
      pos = this.viewDivide.length() - 1
    }
    return this.divide.nth(pos)
  }

  normalizeValue () {
    const pos = this.divide.getPos(this.value)
    if (pos === -1) this.value = this.divide.first
    else if (pos === -2) this.value = this.divide.last
  }

  valueToWidth (value) {
    let pos = this.divide.getPos(value)
    let offset = this.slider.offsetWidth / 2
    // get point
    if (pos === -1 || pos === 0) {
      pos = 0
      offset = 0
    } else if (pos === -2 || pos === this.divide.length() - 1) {
      pos = this.divide.length() - 1
      offset *= 2
    }
    
    return this.viewDivide.nth(pos) - offset
  }

  valueDivide () {
    this.divide = new ScopeDivide(this.scope, this.step, 'round')
  }

  viewDivide () {
    const len = this.divide.length()
    this.viewDivide = new ScopeDivide([0, this.trackWidth], this.trackWidth / (len-1), 'round')
  }

  go (num) {
    this.value = this.divide.nth(num)
    this.setView()
  }

  setValue (value) {
    this.value = value
    this.setView()
  }

  prev () {
    this.value -= this.step
    this.setView()
  }

  next () {
    this.value += this.step
    this.setView()
  }

  setView () {
    this.normalizeValue()
    let width = this.valueToWidth(this.value) + 'px'
    this.slider.style.marginLeft = this.progress.style.width = width
    this.activePoint(this.divide.getPos(this.value))
  }

  setPointView () {
    const points = this.divide.points
    const viewPoints = this.viewPoints
    points.forEach((point, idx) => {
      viewPoints[idx].style.left = this.valueToWidth(point) + 'px'
    })
  }

  setLabelView () {
    const points = this.divide.points
    const labels = this.labels
    points.forEach((point, idx) => {
      let isEnd = idx === labels.length - 1
      if (isEnd) labels[idx].style.right = 0
      else labels[idx].style.left = this.valueToWidth(point) + 'px'
    })
  }

  activePoint (pos) {
    const viewPoints = this.viewPoints
    for (let i = 0, len = viewPoints.length; i < len; i++) {
      let viewPoint = viewPoints[i]
      let isActive = viewPoint.classList.contains('active')
      if (i <= pos) {
        if (!isActive) viewPoint.classList.add('active')
      } else if (isActive) {
        viewPoint.classList.remove('active')
      }
    }
  }

  setSlowView (viewWidth) {
    const viewDivide = this.viewDivide
    const offset = this.slider.offsetWidth
    if (viewWidth >= viewDivide.last) {
      viewWidth = viewDivide.last - offset
    } else if (viewWidth < viewDivide.first) {
      viewWidth = viewDivide.first
    }
    this.viewWidth = viewWidth
    this.slider.style.marginLeft = this.progress.style.width = viewWidth + 'px'
  }

  on () {
    let canSlide = false
    // start
    const start = (event) => {
      event.preventDefault()
      event.stopPropagation()
      canSlide = true
    }
    const end = (event) => {
      canSlide = false
      if (event.target !== this.slider) return
      event.stopPropagation()
      this.setValue(this.widthToValue(this.viewWidth))
    }
    const move = debounce((event) => {
      event.preventDefault()
      event.stopPropagation()
      // move slowly
      if (canSlide) {
        let distance = (event.type === 'mousemove' ? event.clientX : event.changedTouches[0].clientX) - this.trackLeft
        this.setSlowView(distance)
      }
    }, 100)

    const click = event => {
      event.stopPropagation()
      const point = event.target
      let i = 0, len = this.viewPoints.length
      // find point
      while (i < len) {
        if (point === this.viewPoints[i]) break
        i++
      }
      // if found
      if (i <= len) {
        this.setValue(this.divide.nth(i))
      }
    }

    this.slider.addEventListener('mousedown', start, false)
    this.slider.addEventListener('touchstart', start, false)
    this.range.querySelector('.range-progress-wrap').addEventListener('click', click, false)
    this.area.addEventListener('mouseup', end, false)
    this.area.addEventListener('touchend', end, false)
    this.area.addEventListener('mousemove', move, false)
    this.area.addEventListener('touchmove', move, false)
  }

  init () {
    this.on()
    this.setView()
    this.setPointView()
    this.setLabelView()
  }
}

export default Range
