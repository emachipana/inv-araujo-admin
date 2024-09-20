import { Text } from "../../styles/layout";
import { Container } from "./styles";

function Category({ name, setCurrentCategory, currentCategory }) {
  return (
    <Container 
      onClick={() => setCurrentCategory(name)}
      isActive={name === currentCategory}
    >
      <Text
        weight={600}
      >
        { name }
      </Text>
    </Container>
  );
}

export default Category;
