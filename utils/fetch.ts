export default function fetchRetry(url: string, maxTrying = 3): Promise<unknown> {
  let data: unknown = null
  let trying = 0
  const delay = 1000

  return new Promise((resolve) => {
    let timerId = setTimeout(async function request() {
      try {
        data = await $fetch(url)
      }
      catch {
        // retry on failure
      }

      if (trying++ >= maxTrying || (data as Record<string, unknown>)?.result) {
        clearTimeout(timerId)
        resolve(data)
      }
      else {
        timerId = setTimeout(request, trying * delay)
      }
    })
  })
}
