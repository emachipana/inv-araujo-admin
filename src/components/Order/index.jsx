import { useNavigate } from "react-router-dom";
import { FlexColumn, FlexRow } from "../../styles/layout";
import Badge from "../Badge";
import { Container, Text } from "./styles";
import Header from "./Header";

function Order({ id, clientName, date, destination, total, status, isOrder = false }) {
  const navigate = useNavigate();

  return (
    <Container onClick={() => navigate(`/${isOrder ? "pedidos" : "invitro"}/${id}`)}>
      <Header 
        name={clientName}
        date={date}
      />
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
            Total
          </Text>
          <Text
            weight={600}
          >
            S/. { total.toFixed(2) }
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
