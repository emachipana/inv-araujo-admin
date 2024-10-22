import { Route, Routes } from "react-router-dom";
import Login from "../pages/admin/Login";
import NotFound from "../pages/admin/NotFound";

function UnauthenticatedApp() {
  return (
    <Routes>
      <Route index path="login" element={<Login />} />
      <Route path="*" element={<NotFound navTo="/admin/login" />} />
    </Routes>
  );
}

export default UnauthenticatedApp;
