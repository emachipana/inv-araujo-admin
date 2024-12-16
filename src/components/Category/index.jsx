import { Text } from "../../styles/layout";
import { Blocker } from "../Categories/styles";
import { Container } from "./styles";

function Category({ id, name, setCurrentCategory, currentCategory, isBlocked }) {
  return (
    <Container 
      onClick={() => setCurrentCategory(id, name)}
      isActive={name === currentCategory || (!currentCategory && name === "Todo" )}
      isBlocked={isBlocked}
    >
      <Text
        weight={600}
      >
        { name }
      </Text>
      {
        isBlocked
        &&
        <Blocker />
      }
    </Container>
  );
}

export default Category;
