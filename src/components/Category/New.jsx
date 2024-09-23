import { Text } from "../../styles/layout";
import { Container } from "./styles";

function NewCategory({children, Icon, ...props}) {
  return (
    <Container
      isToCreate
      {...props}
    >
      <Text weight={600}>
        { children }
      </Text>
      <Icon />
    </Container>
  );
}

export default NewCategory;
