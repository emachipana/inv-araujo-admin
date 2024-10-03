import { useNavigate } from "react-router-dom";
import { FlexColumn, FlexRow } from "../../styles/layout";
import Badge from "../Badge";
import { Container, Section, Text } from "./styles";
import { FaCalendarAlt } from "react-icons/fa";

function Order({ id, clientName, date, destination, total, ship, status }) {
  const navigate = useNavigate();
  const parsedDate = new Date(date);
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric"
  }

  return (
    <Container onClick={() => navigate(`/admin/${ship ? "pedidos" : "invitro"}/${id}`)}>
      <Section>
        <Text
          size="16.8px"
        >
          { clientName.toLowerCase() }
        </Text>
        <FlexRow>
          <FaCalendarAlt 
            color="white"
            size={15}
          />
          <Text
            weight={700}
            size="15px"
          >
            { 
              !date
              ? "Por asignar"
              : parsedDate.toLocaleDateString("es-ES", options)
            }
          </Text>
        </FlexRow>
      </Section>
      <FlexRow
        style={{padding: "0 0.25rem"}}
        width="100%"
        justify="space-between"
      >
        <FlexColumn
          align="center"
        >
          <Text
            weight={700}
          >
            Destino
          </Text>
          <Text
            weight={600}
          >
            { destination }
          </Text>
        </FlexColumn>
        <FlexColumn
          align="center"
        >
          <Text
            weight={700}
          >
            {
              ship ? "Envío" : "Total"
            }
          </Text>
          <Text
            weight={600}
          >
            { 
              !ship
              ? `S/. ${total}`
              : ship
            }
          </Text>
        </FlexColumn>
        <FlexColumn
          align="center"
        >
          <Text
            weight={700}
          >
            Estado
          </Text>
          <Badge
            color={status === "PENDIENTE" ? "warning" : (status === "CANCELADO" ? "danger" : "primary")}
          >
            { status }
          </Badge>
        </FlexColumn>
      </FlexRow>
    </Container>
  );
}

export default Order;
