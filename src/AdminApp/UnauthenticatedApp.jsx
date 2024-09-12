import { Route, Routes } from "react-router-dom";
import Login from "../pages/admin/login";

function UnauthenticatedApp() {
  return (
    <Routes>
      <Route index path="login" element={<Login />} />
    </Routes>
  );
}

export default UnauthenticatedApp;
