const text = document.getElementById('notify-text')
const notify = document.getElementById('notify-button')
const reset = document.getElementById('notify-reset')
const counter = document.getElementById('notify-count')

chrome.storage.local.get(['notifyCount'], (data) => {
  let value = data.notifyCount || 0
  counter.innerHTML = value
})

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.notifyCount) {
    let value = changes.notifyCount.newValue || 0
    counter.innerHTML = value
  }
})

reset.addEventListener('click', () => {
  chrome.storage.local.clear()
  text.value = ''
})

function display_h1(res) {
  const comments = [...res]
  const all = comments
    .filter((el) => el.tagName === 'YT-FORMATTED-STRING')
    .map((item, index) => {
      let res = ''
      switch (index % 3) {
        case 0:
          res += item.getInnerHTML() + ': '
          break
        case 1:
          break
        case 2:
          res += item.getInnerHTML() + '\n'
          break
        default:
          break
      }
      return res
    })
  const message = all.filter((s) => !!s).join('\n')
  console.log(message)
  chrome.runtime.sendMessage('', {
    type: 'notification',
    message
  })
}
function reddenPage() {
  document.body.style.backgroundColor = 'red';
}
notify.addEventListener('click', () => {
  chrome.tabs.query({ active: true }, function (tabs) {
    var tab = tabs[0]
    console.log('tab: ', tab)
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: reddenPage
    })
  })
  // const comments = [
  //   ...document.getElementsByClassName('style-scope ytd-comment-renderer')
  // ]
})
