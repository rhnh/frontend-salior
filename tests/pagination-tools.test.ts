import { getNextPages } from "~/tools/pagination-tools";

describe('getNextPages', () => {
  // test('first few pages from the start', () => {
  //   const result = getNextPages({
  //     numberOfPages: 15,
  //     totalPages: 16,
  //     currentPage: 1,
  //   })
  //   expect(result).toStrictEqual([1, 2, 3,4,5,6,7,7])
  // })
  test('first few pages any value', () => {
    const result = getNextPages({
      numberOfPages: 6,
      totalPages: 16,
      currentPage: 5,
    })
    expect(result).toStrictEqual([2, 3, 4, 5, 6, 7])
  })
  test('another one', () => {
    const result = getNextPages({
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
    const result = getNextPages({
      numberOfPages: 3,
      totalPages: 16,
      currentPage: 16,
    })
    expect(result).toStrictEqual([15])

  })
  test('around the last', () => {
    const result = getNextPages({
      numberOfPages: 4,
      totalPages: 16,
      currentPage: 15,
    })
    expect(result).toStrictEqual([13, 14, 15])
  })
})