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
import { WebSocketProvider } from "./context/websocket";
import Warehouses from "./pages/admin/Warehouses";
import { useAuth } from "./context/auth";
import { ModalProvider } from "./context/modal";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import Employee from "./pages/admin/Employee";

function AuthenticatedApp() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AdminProvider>
      <WebSocketProvider>
        <ModalProvider>
          <PrimeReactProvider>
            <AdminNavbar setIsOpen={setIsOpen} />
            <Aside 
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
            <Section>
              <Routes>
                <Route index path="/" element={<Home />} />
                {
                  user.role.permissions.includes("PRODUCTS_WATCH")
                  &&
                  <>
                    <Route path="/productos" element={<Products />} />
                    <Route path="/productos/:id" element={<Product />} />
                    <Route path="/productos/:id/edit" element={<EditProduct />} />
                  </>
                }
                {
                  user.role.permissions.includes("INVITRO_WATCH")
                  &&
                  <>
                    <Route path="/invitro" element={<InvitroOrders />} />
                    <Route path="/invitro/:id" element={<InvitroOrder />} />
                  </>
                }
                {
                  user.role.permissions.includes("INVITRO_UPDATE")
                  &&
                  <Route path="/invitro/:id/edit" element={<EditVitroOrder />} />
                }
                {
                  user.role.permissions.includes("ORDERS_WATCH")
                  &&
                  <>
                    <Route path="/pedidos" element={<Orders />} />
                    <Route path="/pedidos/:id" element={<Order />} />
                    <Route path="/pedidos/:id/edit" element={<EditOrder />} />
                  </>
                }
                {
                  user.role.permissions.includes("INVOICES_WATCH")
                  &&
                  <>
                    <Route path="/comprobantes" element={<Invoices />} />
                    <Route path="/comprobantes/:id" element={<Invoice />} />
                    <Route path="/comprobantes/:id/edit" element={<EditInvoice />} />
                  </>
                }
                {
                  user.role.permissions.includes("BANNERS_WATCH")
                  &&
                  <>
                    <Route path="/banners" element={<Banners />} />
                    <Route path="/banners/:id" element={<Banner />} />
                    <Route path="/banners/:id/edit" element={<EditBanner />} />
                  </>
                }
                {
                  user.role.permissions.includes("PROFITS_WATCH")
                  &&
                  <Route path="/gastos" element={<Expenses />} />
                }
                {
                  user.role.permissions.includes("EXPENSES_WATCH")
                  &&
                  <Route path="/gastos/:id" element={<Expense />} />
                }
                {
                  user.role.permissions.includes("CLIENTS_WATCH")
                  &&
                  <Route path="/clientes" element={<Clients />} />
                }
                <Route path="/perfil" element={<Profile />} />
                {
                  user.role.permissions.includes("EMPLOYEES_WATCH")
                  &&
                  <>
                    <Route path="/empleados" element={<Employees />} />
                    <Route path="/empleados/:id" element={<Employee />} />
                  </>
                }
                {
                  user.role.permissions.includes("WAREHOUSES_WATCH")
                  &&
                  <Route path="/almacenes" element={<Warehouses />} />
                }
                <Route path="*" element={<NotFound navTo="/" />} />
              </Routes>
            </Section>
          </PrimeReactProvider>
        </ModalProvider>
      </WebSocketProvider>
    </AdminProvider>
  );
}

export default AuthenticatedApp;
