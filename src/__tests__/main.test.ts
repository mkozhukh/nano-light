import { it, expect } from 'vitest'
import { hello } from '../lib/main'

it('should return greeting', () => {
  expect(hello('World')).toBe('Hello, World!')
})