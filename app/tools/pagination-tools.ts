export const getNextPages = ({ numberOfPages, totalPages, currentPage }:
  {
    numberOfPages: number, totalPages: number,
    currentPage: number
  }) => Array.from(Array(numberOfPages)
    .keys())
    .map((value) => currentPage - Math.floor(numberOfPages / 2) + value)
    .filter(x => x > 0 && x < totalPages)


