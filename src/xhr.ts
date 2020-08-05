import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from './types'
import { parseHeaders } from './helpers/headers'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { method = 'get', data = null, url, headers, responseType, timeout } = config
    const request = new XMLHttpRequest()
    if (responseType) {
      request.responseType = responseType
    }
    if (timeout) {
      request.timeout = timeout
    }

    request.open(method.toLowerCase(), url, true)

    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== XMLHttpRequest.DONE) {
        return
      }
      if (request.status === 0) {
        return
      }
      const responseHeader = parseHeaders(request.getAllResponseHeaders())
      const responseData =
        responseType && responseType !== 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        headers: responseHeader,
        status: request.status,
        statusText: request.statusText,
        config,
        request
      }
      handleResponse(response)
    }

    function handleResponse(response: AxiosResponse) {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(new Error(`Request failed with status code ${response.status}`))
      }
    }

    request.onerror = function handleError() {
      reject(new Error('Network Error'))
    }

    request.ontimeout = function handleTimeout() {
      reject(new Error(`Timeout of ${timeout} ms exceeded`))
    }

    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        // data为空，content-type没有意义
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    request.send(data)
  })
}
