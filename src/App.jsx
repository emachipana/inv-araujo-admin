import { useAuth } from "./context/auth";
import Loader from "./components/Loader";
import { Container } from "./styles/layout";
import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";

function App() {
  const { isLoading, user } = useAuth();

  return (
    isLoading
    ? <Loader />
    :
    <Container>
      {
        user && user.role === "ADMINISTRADOR"
        ? <AuthenticatedApp />
        : <UnauthenticatedApp />
      }
    </Container>
  );
}

export default App;
