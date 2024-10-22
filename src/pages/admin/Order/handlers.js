import apiFetch from "../../../services/apiFetch";

export const filterProducts = (items, backup) => { 
  return backup.filter(product => !items.find(item => item.product.id === product.id));
}

export const onSearchChange = async (e, setSearch, setIsLoading, items, setSearchProducts, toFind, setError) => {
  try {
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
    setIsLoading(false);
    console.error(error);
    setError(error.message);
  }
}
