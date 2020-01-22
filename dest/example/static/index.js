const range = new uiKit.Range(document.querySelector('.range'), {
  value: 0,
  scope: [0, 10000],
  step: 2000
})

range.init()

const swit = new uiKit.Switch(document.querySelector('.switch'), {
  value: false
})
swit.init()
