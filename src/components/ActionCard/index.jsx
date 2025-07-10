import { IoPersonAdd } from "react-icons/io5";
import { COLORS } from "../../styles/colors";
import { PiPlantFill } from "react-icons/pi";
import { FaBasketShopping, FaBoxesStacked, FaFileInvoice, FaMoneyBillTransfer, FaTruckRampBox, FaWarehouse } from "react-icons/fa6";
import { RiSlideshow2Fill } from "react-icons/ri";
import { BsFillPersonBadgeFill } from "react-icons/bs";
import { Container, Icon } from "./styles";
import { FlexColumn, Text } from "../../styles/layout";
import { useNavigate } from "react-router-dom";

function ActionCard({ type, setModal, navigateTo }) {
  const types = {
    "INVITRO_CREATE": {
      title: "Nuevo pedido invitro",
      description: "Registra el pedido de el cliente",
      Icon: PiPlantFill,
      mainColor: COLORS.persian_light,
      subColor: COLORS.persian_card_hover,
      iconColor: COLORS.persian
    },
    "PRODUCTS_CREATE": {
      title: "Crear producto",
      description: "Añadir nuevo producto al inventario",
      Icon: FaBoxesStacked,
      mainColor: COLORS.blue_light,
      subColor: COLORS.blue_card_hover,
      iconColor: COLORS.blue
    },
    "ORDERS_CREATE": {
      title: "Nuevo pedido",
      description: "Registra el pedido de el cliente",
      Icon: FaBasketShopping,
      mainColor: COLORS.orange_light,
      subColor: COLORS.orange_card_hover,
      iconColor: COLORS.orange
    },
    "INVOICES_CREATE": {
      title: "Nuevo comprobante",
      description: "Generar comprobante de venta",
      Icon: FaFileInvoice,
      mainColor: COLORS.gray_light,
      subColor: COLORS.gray_card_hover,
      iconColor: COLORS.gray
    },
    "BANNERS_CREATE": {
      title: "Nuevo banner",
      description: "Añadir nuevo banner",
      Icon: RiSlideshow2Fill,
      mainColor: COLORS.yellow_light,
      subColor: COLORS.yellow_card_hover,
      iconColor: COLORS.yellow
    },
    "EXPENSES_CREATE": {
      title: "Registrar gasto",
      description: "Añadir gasto empresarial",
      Icon: FaMoneyBillTransfer,
      mainColor: COLORS.red_light,
      subColor: COLORS.red_card_hover,
      iconColor: COLORS.red
    },
    "CLIENTS_CREATE": {
      title: "Registrar cliente",
      description: "Añadir nuevo cliente",
      Icon: IoPersonAdd,
      mainColor: COLORS.purple_light,
      subColor: COLORS.purple_card_hover,
      iconColor: COLORS.purple
    },
    "EMPLOYEES_CREATE": {
      title: "Registrar empleado",
      description: "Añadir nuevo empleado",
      Icon: BsFillPersonBadgeFill,
      mainColor: COLORS.purple_light,
      subColor: COLORS.purple_card_hover,
      iconColor: COLORS.purple
    },
    "WAREHOUSES_CREATE": {
      title: "Registrar almacén",
      description: "Añadir nuevo almacén",
      Icon: FaWarehouse,
      mainColor: COLORS.blue_light,
      subColor: COLORS.blue_card_hover,
      iconColor: COLORS.blue
    },
    "PRODUCTS_BATCH_CREATE": {
      title: "Registrar nuevo lote",
      description: "Añadir lote de productos al inventario",
      Icon: FaTruckRampBox,
      mainColor: COLORS.blue_light,
      subColor: COLORS.blue_card_hover,
      iconColor: COLORS.blue
    },
  }
  
  const navigate = useNavigate();

  const data = types[type];

  const handleClick = () => {
    navigate(navigateTo);

    setTimeout(() => setModal(true), 500);
  }

  return (
    <Container
      onClick={handleClick}
      mainColor={data.mainColor}
      subColor={data.subColor}
    >
      <Icon>
        <data.Icon 
          size={24}
          color={data.iconColor}
        />
      </Icon>
      <FlexColumn 
        gap={0.1}
        justify="center"
        align="center"
      >
        <Text
          weight={700}
        >
          {data.title}
        </Text>
        <Text
          size={13}
          color={COLORS.dim}
        >
          {data.description}
        </Text>
      </FlexColumn>
    </Container>
  );
}

export default ActionCard;
