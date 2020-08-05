import { AxiosRequestConfig } from './types'
export default function xhr(config: AxiosRequestConfig): void {
  const { method = 'get', data = null, paramas, url } = config
  const request = new XMLHttpRequest()
  request.open(method.toLowerCase(), url, true)
  request.send(data)
}
