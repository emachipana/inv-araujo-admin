import { Route, Routes } from "react-router-dom";
import Login from "./pages/admin/Login";
import Recovery from "./pages/admin/Recovery";
import NotFound from "./pages/admin/NotFound";

function UnauthenticatedApp() {
  return (
    <Routes>
      <Route index path="login" element={<Login />} />
      <Route path="recuperar-contraseña" element={<Recovery />} />
      <Route path="*" element={<NotFound navTo="/login" />} />
    </Routes>
  );
}

export default UnauthenticatedApp;
