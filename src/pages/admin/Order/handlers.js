import toast from "react-hot-toast";
import apiFetch from "../../../services/apiFetch";
import { errorParser } from "../../../helpers/errorParser";

export const filterProducts = (items, backup) => { 
  return backup.filter(product => !items.find(item => item.product.id === product.id));
}

export const onSearchChange = async (e, setSearch, setIsLoading, items, setSearchProducts, toFind, isLoading) => {
  try {
    if(isLoading) return;

    const value = e.target.value;
    setSearch(value);
    if(value.length >= 3) {
      setIsLoading(true);
      const searchedProducts = await apiFetch(`products/search?param=${value}`);
      const filteredProducts = filterProducts(items, searchedProducts);
      setSearchProducts(filteredProducts);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    const filteredProducts = filterProducts(items, toFind);
    setSearchProducts(filteredProducts);
  }catch(error) {
    toast.error(errorParser(error.message));
    setIsLoading(false);
  }
}
