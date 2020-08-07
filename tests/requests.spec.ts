import axios, { AxiosResponse, AxiosError } from '../src/index'
import { getAjaxRequest } from './helper'
import { describe, expect, test, beforeEach, afterEach, jest } from '@jest/globals'

describe('requests', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })
  test('should treat single string arg as url', () => {
    axios('/foo')
    return getAjaxRequest().then((request: JasmineAjaxRequest) => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('get')
    })
  })
  test('should treat method value as lowercase string', done => {
    axios({
      url: '/foo',
      method: 'post'
    }).then(res => {
      expect(res.config.method).toBe('post')
      done!()
    })

    return getAjaxRequest().then((request: JasmineAjaxRequest) => {
      request.respondWith({
        status: 200
      })
    })
  })
  test('should reject on network errors', done => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })

    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })
    jasmine.Ajax.uninstall()
    axios('/foo')
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)

    function next(reason: AxiosResponse | AxiosError) {
      expect(resolveSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect(reason instanceof Error).toBeTruthy()
      expect((reason as AxiosError).message).toBe('Network Error')
      expect(reason.request).toEqual(expect.any(XMLHttpRequest))

      jasmine.Ajax.install()

      done!()
    }
  })
  test('should reject when request timeout', done => {
    let err: AxiosError
    axios('/foo', {
      timeout: 2000,
      method: 'post'
    }).catch(error => {
      err = error
    })
    getAjaxRequest().then(request => {
      request.eventBus.trigger('timeout')
      setTimeout(() => {
        expect(err instanceof Error).toBeTruthy()
        expect(err.message).toBe('Timeout of 2000 ms exceeded')
        done!()
      }, 100)
    })
  })
  test('should reject when validateStatus return false', done => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })
    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })
    let err: AxiosError
    axios('/foo', {
      validateStatus: status => status !== 500
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)
    getAjaxRequest().then(request => {
      request.respondWith({
        status: 500
      })
    })
    function next(reason: AxiosError | AxiosResponse) {
      expect(resolveSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect(reason instanceof Error).toBeTruthy()
      expect((reason as AxiosError).message).toBe('Request failed with status code 500')
      expect((reason as AxiosError).response!.status).toBe(500)

      done!()
    }
  })
})
