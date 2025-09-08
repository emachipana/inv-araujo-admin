import { COLORS } from "../../styles/colors";
import { FlexRow, Text } from "../../styles/layout";
import { CheckContainer } from "./styles";
import { FaCheck } from "react-icons/fa6";

function SelectBox({ size, checked, onChange, label, labelColor }) {
  return (
    <FlexRow 
      onClick={onChange}
      width="fit-content"
    >
      <CheckContainer 
        checked={checked}
        size={size}
      >
        {
          checked
          &&
          <FaCheck 
            color="white"
          />
        }
      </CheckContainer>
      <Text
        weight={600}
        color={labelColor || COLORS.platinium}
      >
        { label }
      </Text>
    </FlexRow>
  );
}

export default SelectBox;
