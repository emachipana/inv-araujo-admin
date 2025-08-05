import { COLORS } from "../../styles/colors";
import { Container, IconWrapper } from "./styles";
import { IoIosTime } from "react-icons/io";
import { MdCancel, MdOutlineWallet } from "react-icons/md";
import { FaCheckCircle, FaShippingFast } from "react-icons/fa";
import { FlexColumn, Text } from "../../styles/layout";

function StateCard({ status }) {
  const color = {
    PENDIENTE: {
      main: COLORS.yellow_light,
      sec: COLORS.yellow_hover,
      icon: IoIosTime,
      title: "Pendiente",
      text: "Esperando el pago del pedido"
    },
    PAGADO: {
      main: COLORS.blue_light,
      sec: COLORS.blue,
      icon: MdOutlineWallet,
      title: "Pagado",
      text: "Pago confirmado listo para su entrega"
    },
    AGENCIA: {
      main: COLORS.purple_light,
      sec: COLORS.purple,
      icon: FaShippingFast,
      title: "En agencia",
      text: "El pedido se encuentra en la agencia"
    },
    ENTREGADO: {
      main: COLORS.persian_light,
      sec: COLORS.persian,
      icon: FaCheckCircle,
      title: "Entregado",
      text: "Proceso finalizado, pedido entregado"
    },
    CANCELADO: {
      main: COLORS.red_light,
      sec: COLORS.red,
      icon: MdCancel,
      title: "Cancelado",
      text: "Proceso finalizado, el pedido fue cancelado"
    }
  };

  const Icon = color[status].icon;
  
  return (
    <Container
      isCanceled={status === "CANCELADO"}
      color={color[status].main}
    >
      <IconWrapper>
        <Icon 
          size={22}
          color={color[status].sec}
        />
      </IconWrapper>
      <FlexColumn
        gap={0.1}
      >
        <Text
          color={COLORS.dim}
          weight={600}
        >
          Estado: {color[status].title}
        </Text>
        <Text
          color={COLORS.taupe}
          weight={400}
          size={15}
        >
          {color[status].text}
        </Text>
      </FlexColumn>
    </Container>
  );
}

export default StateCard;
