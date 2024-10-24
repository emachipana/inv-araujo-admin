import { ClipLoader } from "react-spinners";
import { Container } from "./styles";
import { COLORS } from "../../styles/colors";

function Loader() {
  return (
    <Container>
      <ClipLoader 
        size={80}
        color={COLORS.persian}
      />
    </Container>
  );
}

export default Loader;
