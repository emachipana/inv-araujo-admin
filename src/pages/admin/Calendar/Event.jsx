import { PiPottedPlantFill } from "react-icons/pi";
import { FaCartShopping } from "react-icons/fa6";
import { FlexColumn, FlexRow, Text } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";
import { capitalize } from "../../../helpers/capitalize";
import { useNavigate } from "react-router-dom";

function Event({ type, date, id }) {
  const navigate = useNavigate();

  const icons = {
    invitro: PiPottedPlantFill,
    productos: FaCartShopping
  }

  const Icon = icons[type];
  const parsedDate = new Date(date);
  parsedDate.setUTCHours(12);

  return (
    <FlexRow
      style={{cursor: "pointer"}}
      onClick={() => navigate(`/admin/${type === "invitro" ? "invitro" : "pedidos"}/${id}`)}
    >
      <Icon 
        size={28}
        color={COLORS.persian}
      />
      <FlexColumn gap={0}>
        <Text
          weight={600}
          align="start"
          style={{ whiteSpace: "nowrap", overflow: "hidden", maxWidth: "180px", textOverflow: "ellipsis" }}
        >
          { 
            type === "invitro"
            ? "Pedido invitro"
            : "Productos"
          }
        </Text>
        <Text
          style={{ marginTop: "-0.6rem" }}
          size={13}
          color={COLORS.taupe}
        >
          { capitalize(parsedDate.toLocaleDateString("es-ES", { month: "long", day: "numeric", timeZone: "UTC" })) }
        </Text>
      </FlexColumn>
    </FlexRow>
  );
}

export default Event;
