import toast from "react-hot-toast";
import { errorParser } from "../../../helpers/errorParser";
import apiFetch from "../../../services/apiFetch";

export const handleClick = (event, id, navigate) => {
  event.stopPropagation();
  navigate(`${id}/edit`);
}

export const onSearchChange = async (e, isGetting, setSearch, setIsGetting, setSearched, from, backup) => {
  const value = e.target.value;
  
  try {
    if(isGetting) return;
    setSearch(value);

    if(value.length >= 3) {
      setIsGetting(true);
      const searched = await apiFetch(`${from}/search?param=${value}`);
      setSearched(searched);
      setIsGetting(false);
      return;
    }

    setSearched(backup);
  }catch(error) {
    toast.error(errorParser(error.message));
    setIsGetting(false);
  }
}

const sortData = {
  "PRICE_HIGH_TO_LOW": "sortby=price&direction=DESC",
  "PRICE_LOW_TO_HIGH": "sortby=price&direction=ASC",
  "STOCK_HIGH_TO_LOW": "sortby=stock&direction=DESC",
  "STOCK_LOW_TO_HIGH": "sortby=stock&direction=ASC",
}

export const filterBuilder = (filters = { category: { id: null }, sort: null, page: 0 }) => {
  let filter = "";

  if(filters.category.id) filter += `?categoryId=${filters.category.id}`;
  
  if(filters.sort) {
    const op = filters.category.id ? "&" : "?";
    filter += `${op}${sortData[filters.sort]}`;
  } 

  if(filters.page > 0) {
    const op = (filters.category.id || filters.sort) ? "&" : "?";
    filter += `${op}page=${filters.page}`;
  }

  return filter;
}
