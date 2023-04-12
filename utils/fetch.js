export default function (url, maxTrying = 3) {
  let data = null
  let trying = 0
  let delay = 1000

  return new Promise((resolve) => {
    let timerId = setTimeout(async function request () {
      try {
        data = await $fetch(url)
      } catch (e) {
      }

      if (trying++ >= maxTrying || data?.result) {
        clearTimeout(timerId)
        resolve(data)
      } else {
        timerId = setTimeout(request, trying * delay)
      }
    })
  })
}
