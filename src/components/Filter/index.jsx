import { FaListUl } from "react-icons/fa";
import { FlexRow } from "../../styles/layout";
import { Group, Wrapper } from "./styles";
import { HiSquares2X2 } from "react-icons/hi2";
import { IoClose, IoSearchOutline } from "react-icons/io5";
import Input from "../Input";
import { BiSearch } from "react-icons/bi";

function Filter({ 
  localStorageKey, setType, type, isSearching,
  setIsSearching, labelSearch, resetFilters, onSearchChange, searchValue, reset
}) {
  const handleClick = (type) => {
    setType(type);
    localStorage.setItem(localStorageKey, type);
  }

  const handleSearchClick = () => {
    setIsSearching(!isSearching);
    resetFilters();

    if(isSearching) reset();
  }

  return (
    <FlexRow gap={0.8}>
      <Group>
        <Wrapper
          isActive={type === "list"} 
          onClick={() => handleClick("list")}
        >
          <FaListUl
            size={17}
          />
        </Wrapper>
        <Wrapper 
          isActive={type === "group"}
          onClick={() => handleClick("group")}
        >
          <HiSquares2X2
            size={19}
          />
        </Wrapper>
      </Group>
      <Wrapper
        style={{margin: isSearching ? "0 -0.5rem" : 0}}
      >
        {
          isSearching
          ? <IoClose 
              size={25}
              onClick={handleSearchClick}
            />
          : <IoSearchOutline
              size={25}
              onClick={handleSearchClick}
            /> 
        }
      </Wrapper>
      {
        isSearching
        &&
        <Input
          Icon={BiSearch}
          placeholder={labelSearch}
          style={{maxWidth: "280px"}}
          handleChange={onSearchChange}
          value={searchValue}
        />
      }
      
    </FlexRow>
  );
}

export default Filter;
