import { sortQueries } from "../InvitroOrders/filter";

export const filterBuilder = (filters = { status: { id: null }, sort: null, page: 0, range: null }) => {
  let filter = "";

  if(filters.status.id) filter += `?status=${filters.status.id}`;

  if(filters.sort) {
    const op = filters.status.id ? "&" : "?";
    filter += `${op}${sortQueries[filters.sort]({isOrder: true})}`;
  }

  if(filters.range) {
    const op = filters.status.id || filters.sort ? "&" : "?";
    filter += `${op}${sortQueries[filters.range]({isOrder: true})}`;
  }

  if(filters.page > 0) {
    const op = (filters.status.id || filters.sort || filters.range) ? "&" : "?";
    filter += `${op}page=${filters.page}`;
  }

  return filter;
}
