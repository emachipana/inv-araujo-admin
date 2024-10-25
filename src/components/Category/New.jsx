import { Text } from "../../styles/layout";
import { Blocker } from "../Categories/styles";
import { Container } from "./styles";

function NewCategory({children, Icon, isBlocked, ...props}) {
  return (
    <Container
      isBlocked={isBlocked}
      isToCreate
      {...props}
    >
      <Text weight={600}>
        { children }
      </Text>
      <Icon />
      {
        isBlocked
        &&
        <Blocker />
      }
    </Container>
  );
}

export default NewCategory;
