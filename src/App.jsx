import { Route, Routes } from "react-router-dom";
import { useAuth } from "./context/auth";
import ClientApp from "./ClientApp";
import AdminApp from "./AdminApp";
import Loader from "./components/Loader";

function App() {
  const { isLoading } = useAuth();

  return (
    isLoading
    ? <Loader />
    :
    <Routes>
      <Route index path="/*" element={<ClientApp />} />
      <Route path="admin/*" element={<AdminApp />} />
    </Routes>
  );
}

export default App;
