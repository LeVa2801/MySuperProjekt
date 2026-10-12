import { describe, expect, it } from 'vitest'
import { isHexColor } from './colors'

describe('isHexColor', () => {
  it('accepts six-digit hex colors with a leading hash', () => {
    expect(isHexColor('#38BDF8')).toBe(true)
    expect(isHexColor('#a1b2c3')).toBe(true)
  })

  it('rejects values that are not six-digit hex colors', () => {
    expect(isHexColor('38BDF8')).toBe(false)
    expect(isHexColor('#123')).toBe(false)
    expect(isHexColor('#12345678')).toBe(false)
    expect(isHexColor('#GGGGGG')).toBe(false)
  })
})
