import { Route, Routes } from "react-router-dom";
import { useAuth } from "./context/auth";
import ClientApp from "./ClientApp";
import AdminApp from "./AdminApp";

function App() {
  const { isLoading } = useAuth();

  return (
    isLoading
    ? "Cargando..."
    :
    <Routes>
      <Route index path="/*" element={<ClientApp />} />
      <Route path="admin/*" element={<AdminApp />} />
    </Routes>
  );
}

export default App;
