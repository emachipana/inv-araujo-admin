import { COLORS } from "../../styles/colors";
import { FlexRow, Text } from "../../styles/layout";
import { Container } from "./styles";
import { FaChevronDown } from "react-icons/fa";

function SelectButton({ children, Icon, isActive, ...props }) {
  return (
    <Container 
      {...props}
      isActive={isActive}
    >
      <FlexRow>
        <Icon 
          color={isActive ? COLORS.white : COLORS.dim}
        />
        <Text
          color={isActive ? COLORS.white : COLORS.dim}
          size={15}
        >
          {children}
        </Text>
      </FlexRow>
      <FaChevronDown
        size={10}
        color={isActive ? COLORS.white : COLORS.dim}
      />
    </Container>
  );
}

export default SelectButton;
