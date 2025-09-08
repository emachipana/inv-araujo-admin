const sortQueries = {
  "NEW_TO_OLD": "sortby=id&direction=DESC",
  "OLD_TO_NEW": "sortby=id&direction=ASC",
  "HIGHEST_CONSUMPTION": "sortby=consumption&direction=DESC",
  "LOWEST_CONSUMPTION": "sortby=consumption&direction=ASC"
}

export const filterBuilder = (filters = { sort: null, page: 0 }) => {
  let filter = "";

  if(filters.sort) filter += `?${sortQueries[filters.sort]}`;

  if(filters.page > 0) {
    const op = filters.sort ? "&" : "?";
    filter += `${op}page=${filters.page}`;
  }

  return filter;
}
