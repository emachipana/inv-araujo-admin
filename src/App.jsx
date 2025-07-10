import { useAuth } from "./context/auth";
import Loader from "./components/Loader";
import { Container } from "./styles/layout";
import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";
import { Toaster } from "react-hot-toast";

function App() {
  const { isLoading, user } = useAuth();

  return (
    isLoading
    ? <Loader />
    :
    <Container>
      <Toaster />
      {
        user && user.employeeId
        ? <AuthenticatedApp />
        : <UnauthenticatedApp />
      }
    </Container>
  );
}

export default App;
