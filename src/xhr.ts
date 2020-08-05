import { AxiosRequestConfig } from './types'
export default function xhr(config: AxiosRequestConfig): void {
  const { method = 'get', data = null, url, headers } = config
  const request = new XMLHttpRequest()
  request.open(method.toLowerCase(), url, true)

  Object.keys(headers).forEach(name => {
    if (data === null && name.toLowerCase() === 'content-type') {
      // data为空，content-type没有意义
      delete headers[name]
    } else {
      request.setRequestHeader(name, headers[name])
    }
  })

  request.send(data)
}
