export const paginateItems = (items, currentPage, itemsPerPage) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return items.slice(startIndex, endIndex);
};

export const calculatePaginationRange = (
  currentPage,
  itemsPerPage,
  totalResults
) => {
  const fromProperty =
    totalResults > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const toProperty = Math.min(currentPage * itemsPerPage, totalResults);
  return { fromProperty, toProperty };
};
