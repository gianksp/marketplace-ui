import { formatPrice } from 'utils/format'

describe('Format Utils', () => {
  test('Returns formated value with 3 decimal points rounded from input string', () => {
    const value = formatPrice('123.4566789')
    expect(value).toBe(123.457)
  })

  test('Returns formated value with 3 decimal points rounded from input number', () => {
    expect(formatPrice(123.4566789)).toEqual(123.457)
    expect(formatPrice(25 * 4)).toEqual(100.0)
    expect(formatPrice(35.5 * 72.12)).toEqual(2560.26)
  })

  test('Returns 0 if empty, null or not defined', () => {
    expect(formatPrice()).toEqual(0)
    expect(formatPrice('')).toEqual(0)
    expect(formatPrice(undefined)).toEqual(0)
    expect(formatPrice(null)).toEqual(0)
  })
})
