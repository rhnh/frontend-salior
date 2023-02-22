export const getRowPageNumbers = ({ numberOfPages = 8, totalPages, currentPage }:
  {
    numberOfPages?: number, totalPages: number,
    currentPage: number
  }) => Array.from(Array(numberOfPages)
    .keys())
    .map((value) => currentPage - Math.floor(numberOfPages / 2) + value)
    .filter(x => x >= 0 && x < totalPages).slice(0, numberOfPages - 1)


export const previous = (page: number = 0) => (page > 1 ? page - 1 : 1);
export const next = (page: number = 0, total: number) =>
  page < total ? page + 1 : total;