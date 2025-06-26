import { TiHome } from "react-icons/ti";
import NavItem from "./NavItem";
import { BackDrop, Container } from "./styles";
import { FaCalendarAlt, FaClipboardList } from "react-icons/fa";
import { PiPottedPlantFill } from "react-icons/pi";
import { GiShoppingBag, GiWallet } from "react-icons/gi";
import { FaUserGroup, FaMoneyBillTransfer, FaWarehouse } from "react-icons/fa6";
import { MdDiscount } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { BsFillPersonBadgeFill } from "react-icons/bs";

function Aside({ isOpen, setIsOpen }) {
  const { pathname } = useLocation();

  return (
    <>
      <Container isOpen={isOpen}>
        <NavItem
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          redirectTo="/"
          Icon={TiHome}
        >
          Inicio
        </NavItem>
        <NavItem
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          redirectTo="/calendario"
          Icon={FaCalendarAlt}
        >
          Calendario
        </NavItem>
        <NavItem
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          redirectTo="/invitro"
          Icon={PiPottedPlantFill}
          isActive={pathname.includes("invitro")}
        >
          Invitro
        </NavItem>
        <NavItem
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          redirectTo="/productos"
          Icon={GiShoppingBag}
          isActive={pathname.includes("productos")}
        >
          Productos
        </NavItem>
        <NavItem
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          redirectTo="/pedidos"
          Icon={FaClipboardList}
          isActive={pathname.includes("pedidos")}
        >
          Pedidos
        </NavItem>
        <NavItem
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          redirectTo="/comprobantes"
          Icon={GiWallet}
          isActive={pathname.includes("comprobantes")}
        >
          Facturación
        </NavItem>
        <NavItem
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          redirectTo="/banners"
          Icon={MdDiscount}
          isActive={pathname.includes("banners")}
        >
          Banners
        </NavItem>
        <NavItem
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          redirectTo="/gastos"
          Icon={FaMoneyBillTransfer}
          isActive={pathname.includes("gastos")}
        >
          Gastos
        </NavItem>
        <NavItem
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          redirectTo="/clientes"
          Icon={FaUserGroup}
        >
          Clientes
        </NavItem>
        <NavItem
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          redirectTo="/empleados"
          Icon={BsFillPersonBadgeFill}
        >
          Empleados
        </NavItem>
        <NavItem
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          redirectTo="/almacenes"
          Icon={FaWarehouse}
        >
          Almacenes
        </NavItem>
      </Container>
      {
        isOpen
        &&
        <BackDrop 
          onClick={() => setIsOpen(false)}
        />
      }
    </>
  );
}

export default Aside;
