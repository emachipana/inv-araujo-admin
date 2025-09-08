export const filterBuilder = (filters = { sort: null, page: 0 }) => {
  let filter = "";

  if(filters.sort) {
    const op = filters.page > 0 ? "&" : "?";
    filter += `${op}sort=${filters.sort}`;
  }

  if(filters.page > 0) {
    const op = filters.sort ? "&" : "?";
    filter += `${op}page=${filters.page}`;
  }

  return filter;
}
