import { useAuth } from "../context/auth";
import { Container } from "../styles/layout";
import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";

function AdminApp() {
  const { user } = useAuth();

  return (
    <Container>
      {
        user && user.role === "ADMINISTRADOR"
        ? <AuthenticatedApp />
        : <UnauthenticatedApp />
      }
    </Container>
  );
}

export default AdminApp;
