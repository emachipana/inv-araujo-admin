import { sortQueries } from "../InvitroOrders/filter";

export const filterBuilder = (filters = { invoiceType: { id: null }, sort: null, page: 0 }) => {
  let filter = "";

  if(filters.invoiceType.id) filter += `?type=${filters.invoiceType.id}`;

  if(filters.sort) {
    const op = filters.invoiceType.id ? "&" : "?";
    filter += `${op}${sortQueries[filters.sort]({isInvoice: true})}`;
  }

  if(filters.page > 0) {
    const op = (filters.invoiceType.id || filters.sort) ? "&" : "?";
    filter += `${op}page=${filters.page}`;
  }

  return filter;
}
