import { Text } from "../../styles/layout";
import { Blocker } from "../Categories/styles";
import { Container } from "./styles";

function Category({ name, setCurrentCategory, currentCategory, isBlocked }) {
  return (
    <Container 
      onClick={() => setCurrentCategory(name)}
      isActive={name === currentCategory}
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
