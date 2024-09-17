/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { Container } from "./styles";
import { Alert } from "reactstrap";

function AlertError({ setError, error }) {
  const [isVisible, setIsVisible] = useState(true);

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
        { error.includes("Bad credentials") ? "Credenciales incorrectas" : error }
      </Alert>
    </Container>
  );
}

export default AlertError;
