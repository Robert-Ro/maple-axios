import { buildURL, isURLSameOrigin, isAbsoluteURL, combineURL } from '../../src/helpers/url'
import { describe, expect, test } from '@jest/globals'

describe('helpers::url', () => {
  describe('combineURL', () => {
    test('should combine url', () => {
      const baseURL = 'http://api.io'
      const relativeURL = '/config'
      expect(combineURL(baseURL, relativeURL)).toBe('http://api.io/config')
    })
    test('should remove duplicate slashed', () => {
      const baseURL = 'http://api.io/'
      const relativeURL = '/config'
      expect(combineURL(baseURL, relativeURL)).toBe('http://api.io/config')
    })
    test('should insert missing slash', () => {
      const baseURL = 'http://api.io/'
      const relativeURL = '/config'
      expect(combineURL(baseURL, relativeURL)).toBe('http://api.io/config')
    })
    test('should not insert slash when relative url missing/empty', () => {
      const baseURL = 'http://api.io/'
      const relativeURL = ''
      expect(combineURL(baseURL, relativeURL)).toBe('http://api.io/')
    })
    test('should allow a single slash for relative url', () => {
      expect(combineURL('http://api.io', '/')).toBe('http://api.io/')
    })
  })
  describe('isAbsoluteURL', () => {
    test('should return true if URL begins with valid scheme name', () => {
      expect(isAbsoluteURL('http://api.github.com/users')).toBeTruthy()
      expect(isAbsoluteURL('custom-scheme-v1.0://example.com/')).toBeTruthy()
      expect(isAbsoluteURL('HTTP://example.com/')).toBeTruthy()
    })
    test('should return true if URL is protocol-relative', () => {
      expect(isAbsoluteURL('//example.com/')).toBeTruthy()
    })
    test('should return false if URL begins with valid scheme name', () => {
      expect(isAbsoluteURL('123://example.com')).toBeFalsy()
      expect(isAbsoluteURL('!valid://example.com')).toBeFalsy()
    })
    test('should return false if URL is relative', () => {
      expect(isAbsoluteURL('/foo')).toBeFalsy()
      expect(isAbsoluteURL('foo')).toBeFalsy()
    })
  })
  describe('isURLSameOrigin', () => {
    test('should detect same origin', () => {
      expect(isURLSameOrigin(window.location.href)).toBeTruthy()
    })
    test('should detect different origin', () => {
      expect(isURLSameOrigin('https://github.com/axios/axios')).toBeFalsy()
    })
  })
  describe('buildURL', () => {
    test('should support null params', () => {
      expect(buildURL('/foo')).toBe('/foo')
    })
    test('should support params', () => {
      expect(
        buildURL('/foo', {
          foo: 'bar'
        })
      ).toBe('/foo?foo=bar')
    })
    test('should ignore if some params value is null', () => {
      expect(
        buildURL('/foo', {
          foo: 'bar',
          baz: null
        })
      ).toBe('/foo?foo=bar')
    })
    test('should ignore if the only param value is null', () => {
      expect(
        buildURL('/foo', {
          baz: null
        })
      ).toBe('/foo')
    })
    test('should support object params', () => {
      expect(
        buildURL('/foo', {
          foo: { bar: 'baz' }
        })
      ).toBe('/foo?foo=' + encodeURI('{"bar":"baz"}'))
    })
    test('should support data params', () => {
      const date = new Date()
      expect(buildURL('/foo', { date })).toBe('/foo?date=' + date.toISOString())
    })
    test('should support array params', () => {
      expect(
        buildURL('/foo', {
          foo: ['bar', 'baz']
        })
      ).toBe('/foo?foo[]=bar&foo[]=baz')
    })
    test('should support special char params', () => {
      expect(
        buildURL('/foo', {
          foo: '@:$'
        })
      ).toBe('/foo?foo=@:$')
    })
    test('should support existing params', () => {
      expect(
        buildURL('/foo?foo=bar', {
          bar: 'baz'
        })
      ).toBe('/foo?foo=bar&bar=baz')
    })
    test('should correct discard url hard mark', () => {
      expect(
        buildURL('/foo#bar', {
          foo: '123'
        })
      ).toBe('/foo?foo=123')
    })
    test('should use serializer if provided', () => {
      const serializer = jest.fn(() => {
        return 'foo=bar'
      })
      const params = { foo: 'bar' }
      expect(buildURL('/foo', params, serializer)).toBe('/foo?foo=bar')
      expect(serializer).toHaveBeenCalled()
      expect(serializer).toHaveBeenCalledWith(params)
    })
    test('should support URLSearchParams', () => {
      expect(buildURL('/foo', new URLSearchParams('bar=baz'))).toBe('/foo?bar=baz')
    })
  })
})
