export const filterBuilder = (filters = { role: { id: null, name: null }, sort: null, page: 0 }) => {
  let filter = "";

  if(filters.role.id) filter += `?roleId=${filters.role.id}`;

  if(filters.sort) {
    const op = filters.role.id ? "&" : "?";
    filter += `${op}sort=${filters.sort}`;
  }

  if(filters.page > 0) {
    const op = (filters.role.id || filters.sort) ? "&" : "?";
    filter += `${op}page=${filters.page}`;
  }

  return filter;
}
