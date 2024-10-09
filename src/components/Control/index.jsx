import { COLORS } from "../../styles/colors";
import { Text } from "../../styles/layout";
import { Container, Disabled, Item } from "./styles";

function Control({ number, setNumber, size, stock, onClick, controlSize, fontSize, disabled }) {
  const handleAdd = () => {
    if(number >= stock) return;

    setNumber(number + 1);
    onClick && onClick(number + 1);
  }

  const handleRes = () => {
    if(number <= 1) return;

    setNumber(number - 1);
    onClick && onClick(number - 1);
  }

  return (
    <Container size={size}>
      {
        disabled
        &&
        <Disabled />
      }
      <Item
        onClick={handleRes}
      >
        <Text
          size={controlSize || 20}
          color={COLORS.white}
          weight={700}
        >
          - 
        </Text>
      </Item>
      <Item
        isNumber
      >
        <Text
          size={fontSize || 19} 
          color={COLORS.gray}
          weight={600}
        >
          { number }  
        </Text>
      </Item>
      <Item
        onClick={handleAdd}
      >
        <Text
          size={controlSize || 20}
          color={COLORS.white}
          weight={700}
        >
          +
        </Text>
      </Item>
    </Container>
  )
}

export default Control;
