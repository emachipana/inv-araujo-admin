import { Route, Routes } from "react-router-dom";
import Login from "../pages/admin/Login";
import NotFound from "../pages/admin/NotFound";
import Recovery from "../pages/admin/Recovery";

function UnauthenticatedApp() {
  return (
    <Routes>
      <Route index path="login" element={<Login />} />
      <Route path="recuperar-contraseña" element={<Recovery />} />
      <Route path="*" element={<NotFound navTo="/admin/login" />} />
    </Routes>
  );
}

export default UnauthenticatedApp;
