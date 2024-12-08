import toast from "react-hot-toast";
import { errorParser } from "../../../helpers/errorParser";
import apiFetch from "../../../services/apiFetch";

export const handleClick = (event, id, navigate) => {
  event.stopPropagation();
  navigate(`${id}/edit`);
}

export const onSearchChange = async (e, isGetting, setSearch, setIsGetting, setSearched, from, backup, setIsSearching) => {
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

    if(value.length <= 0) setIsSearching(false);
  }catch(error) {
    toast.error(errorParser(error.message));
    setIsGetting(false);
  }
}
