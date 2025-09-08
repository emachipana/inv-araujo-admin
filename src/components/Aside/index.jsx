import { TiHome } from "react-icons/ti";
import NavItem from "./NavItem";
import { BackDrop, Container } from "./styles";
import { FaClipboardList } from "react-icons/fa";
import { PiPottedPlantFill } from "react-icons/pi";
import { GiShoppingBag, GiWallet } from "react-icons/gi";
import { FaUserGroup, FaMoneyBillTransfer } from "react-icons/fa6";
import { MdDiscount } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { BsFillPersonBadgeFill } from "react-icons/bs";
import { useAuth } from "../../context/auth";
import { BiSolidMessageRoundedDetail } from "react-icons/bi";
import { RiRobot3Fill } from "react-icons/ri";

function Aside({ isOpen, setIsOpen }) {
  const { user } = useAuth();
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
        {
          user.role.permissions.includes("INVITRO_WATCH")
          &&
          <NavItem
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            redirectTo="/invitro"
            Icon={PiPottedPlantFill}
            isActive={pathname.includes("invitro")}
          >
            Invitro
          </NavItem>
        }
        {
          user.role.permissions.includes("PRODUCTS_WATCH")
          &&
          <NavItem
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            redirectTo="/productos"
            Icon={GiShoppingBag}
            isActive={pathname.includes("productos")}
          >
            Productos
          </NavItem>
        }
        {
          user.role.permissions.includes("ORDERS_WATCH")
          &&
          <NavItem
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            redirectTo="/pedidos"
            Icon={FaClipboardList}
            isActive={pathname.includes("pedidos")}
          >
            Pedidos
          </NavItem>
        }
        {
          <NavItem
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            redirectTo="/asistente"
            Icon={RiRobot3Fill}
          >
            Asistente virtual
          </NavItem>
        }
        {
          user.role.permissions.includes("MESSAGES_WATCH")
          &&
          <NavItem
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            redirectTo="/mensajes"
            Icon={BiSolidMessageRoundedDetail}
          >
            Mensajes
          </NavItem>
        }
        {
          user.role.permissions.includes("INVOICES_WATCH")
          &&
          <NavItem
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            redirectTo="/comprobantes"
            Icon={GiWallet}
            isActive={pathname.includes("comprobantes")}
          >
            Facturación
          </NavItem>
        }
        {
          user.role.permissions.includes("BANNERS_WATCH")
          &&
          <NavItem
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            redirectTo="/banners"
            Icon={MdDiscount}
            isActive={pathname.includes("banners")}
          >
            Banners
          </NavItem>
        }
        {
          user.role.permissions.includes("PROFITS_WATCH")
          &&
          <NavItem
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            redirectTo="/gastos"
            Icon={FaMoneyBillTransfer}
            isActive={pathname.includes("gastos")}
          >
            Gastos
          </NavItem>
        }
        {
          user.role.permissions.includes("CLIENTS_WATCH")
          &&
          <NavItem
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            redirectTo="/clientes"
            Icon={FaUserGroup}
            isActive={pathname.includes("clientes")}
          >
            Clientes
          </NavItem>
        }
        {
          user.role.permissions.includes("EMPLOYEES_WATCH")
          &&
          <NavItem
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            redirectTo="/empleados"
            Icon={BsFillPersonBadgeFill}
            isActive={pathname.includes("empleados")}
          >
            Empleados
          </NavItem>
        }
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
