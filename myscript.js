let counter = 0
let parsedCommentsCount = 0
let retries = 0

function getCommentCount() {
  const comments = [
    ...document.getElementsByClassName('style-scope ytd-comment-renderer')
  ]
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
    .filter((s) => !!s)
  const commentsArray = []

  for (let i = 0; i < all.length; i = i + 2) {
    const element = {
      user: all[i],
      message: all[i + 1]
    }
    commentsArray.push(element)
  }

  return commentsArray.length
}

function fetchAndUploadComments() {
  const commentsToProcess = [
    ...document.getElementsByClassName('style-scope ytd-comment-renderer')
  ]
  const all = commentsToProcess
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
    .filter((s) => !!s)
  const commentsString = all.join('\n')
  const comments = []

  for (let i = 0; i < all.length; i = i + 2) {
    const element = {
      user: all[i],
      message: all[i + 1]
    }
    comments.push(element)
  }
  // console.log(commentsString)
  // console.log(commentsArray)
  const url = window.location.href
  let id = url.split('watch?v=').pop()
  if (id.includes('&')) {
    id = id.split('&').shift()
  }

  let title = document.title
  title = title.startsWith('(')
    ? title.trim().substring(4, title.length)
    : title.trim()

  const stats = {
    url,
    id,
    title,
    comments
  }

  fetch('https://processdata-lbp2t5jgca-ew.a.run.app', {
    method: 'POST',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(stats)
  })

  console.log(stats)
  console.log('DONE!!!')
}

//initial delay
setTimeout(() => {
  const interval = setInterval(() => {
    counter++
    console.log('counter: ', counter)
    window.scrollTo({ top: counter * 2000, behavior: 'smooth' })
    const commentsOnScreen = getCommentCount()
    if (parsedCommentsCount < commentsOnScreen && retries < 5) {
      retries = 0
      parsedCommentsCount = commentsOnScreen
      console.log('parsedCommentsCount: ', parsedCommentsCount)
      return
    } else {
      retries++
    }

    if (retries > 5) {
      fetchAndUploadComments()
      clearInterval(interval)
    }
  }, 3000)
}, 5000)
