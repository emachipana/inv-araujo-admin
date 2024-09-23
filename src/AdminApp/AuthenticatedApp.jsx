import { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { Section } from "../styles/layout";
import { Route, Routes } from "react-router-dom";
import Aside from "../components/Aside";
import Products from "../pages/admin/Products";
import { AdminProvider } from "../context/admin";

function AuthenticatedApp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AdminProvider>
      <AdminNavbar 
        setIsOpen={setIsOpen}
      />
      <Aside 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <Section>
        <Routes>
          <Route index exact path="/" element={<h1>Home page</h1>} />
          <Route path="/productos" element={<Products />} />
        </Routes>
      </Section>
    </AdminProvider>
  );
}

export default AuthenticatedApp;
