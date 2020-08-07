import { AxiosError, createError } from '../../src/helpers/error'
import { AxiosRequestConfig, AxiosResponse } from '../../src/types'
import { describe, expect, it, test } from '@jest/globals'

describe('helpers::error', () => {
  test('should create an Error with message, config, code, request, response and isAxiosError', () => {
    const request = new XMLHttpRequest()
    const config: AxiosRequestConfig = {
      method: 'post'
    }
    const response: AxiosResponse = {
      status: 200,
      config,
      statusText: 'OK',
      headers: null,
      request,
      data: { foo: 'bar' }
    }
    const error = createError('Boom!', config, 'SOMETHING', request, response)
    expect(error instanceof Error).toBeTruthy()
    expect(error.message).toBe('Boom!')
    expect(error.config).toBe(config)
    expect(error.code).toBe('SOMETHING')
    expect(error.request).toBe(request)
    expect(error.response).toBe(response)
    expect(error instanceof AxiosError).toBeTruthy()
  })
})
