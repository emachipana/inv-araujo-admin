import { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { Section } from "../styles/layout";
import { Route, Routes } from "react-router-dom";
import Aside from "../components/Aside";

function AuthenticatedApp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
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
        </Routes>
      </Section>
    </>
  );
}

export default AuthenticatedApp;
