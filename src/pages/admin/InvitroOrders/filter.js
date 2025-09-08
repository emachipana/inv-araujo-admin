import { numberMonths } from "../../../data/months";

export const sortQueries = {
  "TODAY": () => {
    const today = new Date();
    return `day=${today.getDate()}&month=${numberMonths[today.getMonth()]}`;
  },
  "TOMORROW": () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return `day=${tomorrow.getDate()}&month=${numberMonths[tomorrow.getMonth()]}`;
  },
  "THIS_MONTH": () => {
    const today = new Date();
    return `month=${numberMonths[today.getMonth()]}`;
  },
  "DATE_NEW_TO_OLD": (props = {isOrder: false, isInvoice: false}) =>
    `sortby=${props.isOrder ? "date" : props.isInvoice ? "issueDate" : "initDate"}&direction=DESC`,
  "DATE_OLD_TO_NEW": (props = {isOrder: false, isInvoice: false}) =>
    `sortby=${props.isOrder ? "date" : props.isInvoice ? "issueDate" : "initDate"}&direction=ASC`,
  "AMOUNT_HIGH_TO_LOW": () => "sortby=total&direction=DESC",
  "AMOUNT_LOW_TO_HIGH": () => "sortby=total&direction=ASC",
}

export const filterBuilder = (filters = { tuber: { id: null }, sort: null, range: null, page: 0 }) => {
  let filter = "";

  if(filters.tuber.id) filter += `?tuberId=${filters.tuber.id}`;

  if(filters.sort) {
    const op = filters.tuber.id ? "&" : "?";
    filter += `${op}${sortQueries[filters.sort]()}`;
  }

  if(filters.range) {
    const op = filters.tuber.id || filters.sort ? "&" : "?";
    filter += `${op}${sortQueries[filters.range]()}`;
  }

  if(filters.page > 0) {
    const op = (filters.tuber.id || filters.sort || filters.range) ? "&" : "?";
    filter += `${op}page=${filters.page}`;
  }

  return filter;
}
