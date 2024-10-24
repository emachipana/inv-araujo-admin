/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { Container } from "./styles";
import { Alert } from "reactstrap";

function AlertError({ setError, error, from = null }) {
  const [isVisible, setIsVisible] = useState(true);

  const parser = () => {
    if(error.includes("Bad credentials")) return "Credenciales incorrectas";

    if(error.includes("Duplicate entry")) return "Correo o documento de identidad en uso";

    if(error.includes("delete or update a parent row") && from === "categories") return "La categoria tiene productos asociados";

    if(error.includes("delete or update a parent row") && from === "product") return "El producto esta asociado a registros";

    if(error.includes("must be greater") && from === "product") return "El descuento tiene que ser menor al precio del producto";

    return error.replaceAll('"', "");
  }

  const onClick = () => {
    setIsVisible(false);
    setError(null);
  }

  setTimeout(onClick, 5000);

  return (
    <Container>
      <Alert 
        color="danger"
        isOpen={isVisible}
        toggle={onClick}
      >
        { parser() }
      </Alert>
    </Container>
  );
}

export default AlertError;
