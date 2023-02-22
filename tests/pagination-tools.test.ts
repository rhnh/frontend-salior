import { getRowPageNumbers, next, previous } from "~/tools/pagination-tools";

describe('getNextPages', () => {
  test('first few pages from the start', () => {
    const result = getRowPageNumbers({
      numberOfPages: 15,
      totalPages: 16,
      currentPage: 1,
    })
    expect(result).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
  })
  test('first few pages any value', () => {
    const result = getRowPageNumbers({
      numberOfPages: 6,
      totalPages: 16,
      currentPage: 5,
    })
    console.log(result)
    expect(result).toStrictEqual([2, 3, 4, 5, 6,])
  })
  test('another one', () => {
    const result = getRowPageNumbers({
      numberOfPages: 16,
      totalPages: 16,
      currentPage: 10,
    })
    expect(result).toStrictEqual([
      2, 3, 4, 5, 6, 7,
      8, 9, 10, 11, 12, 13,
      14, 15
    ])
  })
  test('more', () => {
    const result = getRowPageNumbers({
      numberOfPages: 3,
      totalPages: 16,
      currentPage: 16,
    })
    expect(result).toStrictEqual([15])

  })
  test('around the last', () => {
    const result = getRowPageNumbers({
      numberOfPages: 4,
      totalPages: 16,
      currentPage: 15,
    })
    expect(result).toStrictEqual([13, 14, 15])
  })
})

describe('Next number', () => {
  test('gives the next number', () => {
    expect(next(3, 5)).toBe(4)
  })
  test('should return 5 if it is the last', () => {
    expect(next(5, 5)).toBe(5)
  })
})
describe('previous number', () => {
  test('gives the previous number', () => {
    expect(previous(3)).toBe(2)
  })
  test('gives the 1 if 0', () => {
    expect(previous(0)).toBe(1)
  })
  test('gives the 1 if 1', () => {
    expect(previous(1)).toBe(1)
  })
})