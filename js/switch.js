import Component from './component'

class Switch extends Component {
  constructor (swit, opts) {
    super({ value: false }, opts)
    this.swit = swit
    this.slider = swit.querySelector('.switch-slider')
    this.setSwitchWidth()
  }

  setSwitchWidth () {
    const switWidth = this.swit.offsetWidth
    const sliderWidth = this.slider.offsetWidth
    const sliderLeft = this.slider.offsetLeft
    this.switchWidth = [
      sliderLeft,
      switWidth - sliderWidth - sliderLeft
    ]
  }

  activeView () {
    const classList = this.swit.classList
    const isActive = classList.contains('active')
    if (this.value) {
      if (!isActive) {
        classList.add('active')
      }
    } else if (isActive) {
      classList.remove('active')
    }
  }

  setView () {
    let i = this.value ? 1 : 0
    this.slider.style.marginLeft = this.switchWidth[i] + 'px'
    this.activeView()
  }

  init () {
    this.setView()
    this.slider.addEventListener('click', event => {
      event.stopPropagation()
      this.value = !this.value
      this.setView()
    })
  }
}

export default Switch
