import { processHeaders, parseHeaders, flattenHeaders } from '../../src/helpers/headers'
import { describe, expect, test } from '@jest/globals'

describe('helpers::headers', () => {
  describe('parseHeaders', () => {
    test('should parse headers', () => {
      const parsed = parseHeaders(`
      Content-Type: application/json\r\n
      Connection: keep-alive\r\n
      Transfer-Encoding: chunked\r\n
      Date: Tue, 21 May 2019 09:23:44 GMT\r\n
      :aa
      key:
      `)
      expect(parsed['content-type']).toBe('application/json')
      expect(parsed['connection']).toBe('keep-alive')
      expect(parsed['transfer-encoding']).toBe('chunked')
      expect(parsed['date']).toBe('Tue, 21 May 2019 09:23:44 GMT')
      expect(parsed['key']).toBe(undefined)
    })
    test('should return empty object if headers is empty thing', () => {
      const parsed = parseHeaders('')
      expect(parsed).toEqual({})
    })
  })
  describe('processHeaders', () => {
    test('should normlize Content-Type header name', () => {
      const headers: any = {
        'conTenT-Type': 'foo/bar',
        'Content-length': 1024
      }
      processHeaders(headers, {})
      expect(headers['Content-Type']).toBe('foo/bar')
      expect(headers['conTenT-Type']).toBeUndefined()
      expect(headers['Content-length']).toBe(1024)
    })
    test('should set content-type if not set and data is plainObject', () => {
      const headers: any = {}
      processHeaders(headers, { a: 1 })
      expect(headers['Content-Type']).toBe('application/json;charset=utf-8')
    })
    test('should do nothing if headers is undefined or null', () => {
      expect(processHeaders(undefined, {})).toBeUndefined()
      expect(processHeaders(null, {})).toBeNull()
    })
    test('should set not content-type if not set and data is not plainObject', () => {
      const headers: any = {}
      processHeaders(headers, new URLSearchParams('a=b'))
      expect(headers['Content-Type']).toBeUndefined()
    })
  })
  describe('flattenHeaders', () => {
    test('should flatten the headers and include common headers', () => {
      const headers = {
        Accept: 'application/json',
        common: {
          'X-COMMON-HEADER': 'common-header-value'
        },
        get: {
          'X-GET-HEADER': 'get-header-value'
        },
        post: {
          'X-POST-HEADER': 'post-header-value'
        }
      }
      expect(flattenHeaders(headers, 'get')).toEqual({
        Accept: 'application/json',
        'X-COMMON-HEADER': 'common-header-value',
        'X-GET-HEADER': 'get-header-value'
      })
    })
    test('should flatten the headers without common headers', () => {
      const headers = {
        Accept: 'application/json',
        get: {
          'X-GET-HEADER': 'get-header-value'
        }
      }
      expect(flattenHeaders(headers, 'patch')).toEqual({
        Accept: 'application/json'
      })
    })
    test('should do nothing if headers is undefined or null', () => {
      expect(flattenHeaders(null, 'get')).toBeNull()
      expect(flattenHeaders(undefined, 'post')).toBeUndefined()
    })
  })
})
