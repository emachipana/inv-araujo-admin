export const filterBuilder = (filters = { page: 0 }) => {
  let filter = "";

  if(filters.page > 0) filter += `?page=${filters.page}`;

  return filter;
}
