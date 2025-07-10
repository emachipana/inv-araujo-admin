import { ItemContainer } from "./styles";

function SelectItem({children, isActive, ...props}) {
  return (
    <ItemContainer {...props} isActive={isActive}>
      { children }
    </ItemContainer>
  );
}

export default SelectItem;
