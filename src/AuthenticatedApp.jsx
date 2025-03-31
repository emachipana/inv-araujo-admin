import { useState } from "react";
import { AdminProvider } from "./context/admin";
import AdminNavbar from "./components/AdminNavbar";
import Aside from "./components/Aside";
import { Section } from "./styles/layout";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/admin/Home";
import Products from "./pages/admin/Products";
import EditProduct from "./pages/admin/Product/Edit";
import InvitroOrders from "./pages/admin/InvitroOrders";
import InvitroOrder from "./pages/admin/InvitroOrder";
import EditVitroOrder from "./pages/admin/InvitroOrder/Edit";
import Orders from "./pages/admin/Orders";
import Product from "./pages/admin/Product";
import Order from "./pages/admin/Order";
import EditOrder from "./pages/admin/Order/Edit";
import Calendar from "./pages/admin/Calendar";
import Invoices from "./pages/admin/Invoices";
import Invoice from "./pages/admin/Invoice";
import EditInvoice from "./pages/admin/Invoice/Edit";
import Banners from "./pages/admin/Banners";
import Banner from "./pages/admin/Banner";
import EditBanner from "./pages/admin/Banner/Edit";
import Expenses from "./pages/admin/Expenses";
import Expense from "./pages/admin/Expense";
import Clients from "./pages/admin/Clients";
import Profile from "./pages/admin/Profile";
import NotFound from "./pages/admin/NotFound";
import Employees from "./pages/admin/Employees";

function AuthenticatedApp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AdminProvider>
      <AdminNavbar setIsOpen={setIsOpen} />
      <Aside 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <Section>
        <Routes>
          <Route index path="/" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/productos/:id" element={<Product />} />
          <Route path="/productos/:id/edit" element={<EditProduct />} />
          <Route path="/invitro" element={<InvitroOrders />} />
          <Route path="/invitro/:id" element={<InvitroOrder />} />
          <Route path="/invitro/:id/edit" element={<EditVitroOrder />} />
          <Route path="/pedidos" element={<Orders />} />
          <Route path="/pedidos/:id" element={<Order />} />
          <Route path="/pedidos/:id/edit" element={<EditOrder />} />
          <Route path="/calendario" element={<Calendar />} />
          <Route path="/comprobantes" element={<Invoices />} />
          <Route path="/comprobantes/:id" element={<Invoice />} />
          <Route path="/comprobantes/:id/edit" element={<EditInvoice />} />
          <Route path="/banners" element={<Banners />} />
          <Route path="/banners/:id" element={<Banner />} />
          <Route path="/banners/:id/edit" element={<EditBanner />} />
          <Route path="/gastos" element={<Expenses />} />
          <Route path="/gastos/:id" element={<Expense />} />
          <Route path="/clientes" element={<Clients />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/empleados" element={<Employees />} />
          <Route path="*" element={<NotFound navTo="/" />} />
        </Routes>
      </Section>
    </AdminProvider>
  );
}

export default AuthenticatedApp;
