import cookie from '../../src/helpers/cookie'
import { describe, expect, test } from '@jest/globals'

describe('helpers:cookie', () => {
  test('should read cookies', () => {
    document.cookie = 'foo=bar'
    expect(cookie.read('foo')).toBe('bar')
  })
  test('should return null if cookie is not exist', () => {
    document.cookie = 'foo=bar'
    expect(cookie.read('bar')).toBeNull()
  })
})
