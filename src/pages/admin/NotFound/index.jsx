import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import { Text } from "../../../styles/layout";
import { Container } from "./styles";
import { TbError404 } from "react-icons/tb";

function NotFound({ navTo }) {
  const navigate = useNavigate();

  return (
    <Container>
      <TbError404 
        size={100}
      />
      <Text
        size={17}
        weight={700}
      >
        Lo sentimos, la página que buscas no esta disponible
      </Text>
      <Button
        fontSize={17}
        onClick={() => navigate(navTo)}
      >
        {
          navTo.includes("login")
          ? "Iniciar sesión"
          : "Ir al inicio"
        }
      </Button>
    </Container>
  );
}

export default NotFound;
