window.addEventListener('load', function () {
  const range = new uiKit.Range(document.querySelector('.range'), {
    value: 0,
    scope: [0, 100],
    step: 20
  })
  
  const swit = new uiKit.Switch(document.querySelector('.switch'), {
    value: false
  })
  
  const progress = new uiKit.Progress(document.querySelector('.progress'), {
    value: 10
  })
  
  const notification = new uiKit.Notification(document.querySelector('.notification'), {
    direction: 'right'
  })
  document.querySelector('#notification-trigger').addEventListener('click', function () {
    notification.toggle()
  })
})
