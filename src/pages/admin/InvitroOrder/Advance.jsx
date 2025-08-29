import { Variety as Container } from "./styles";
import { Wrapper } from "../Product/styles";
import { FlexColumn, Text } from "../../../styles/layout";
import { capitalize } from "../../../helpers/capitalize";
import { COLORS } from "../../../styles/colors";

function Advance({ date, amount, paymentType }) {
  const options = {
    day: "numeric",
    weekday: "long",
    month: "long",
    year: "numeric",
    timeZone: "America/Lima",
    hour: "numeric",
    minute: "numeric",
    hour12: true
  }

  const parsedDate = new Date(date).toLocaleString("es-ES", options);

  const payment = {
    "TARJETA_ONLINE": "Tarjeta",
    "YAPE": "Yape",
    "TRANSFERENCIA": "Transferecia"
  }

  return (
    <Container>
      <Wrapper>
        <FlexColumn gap={0.1}>
          <Text
            weight={700}
            size={15}
          >
            Fecha
          </Text>
          <Text
            weight={600}
            size={14}
            color={COLORS.dim}
          >
            { capitalize(parsedDate) }
          </Text>
        </FlexColumn>
        <FlexColumn gap={0.1}>
          <Text
            weight={700}
            size={15}
          >
            Monto
          </Text>
          <Text
            weight={600}
            size={14}
            color={COLORS.dim}
          >
            S/. { amount }
          </Text>
        </FlexColumn>
        <FlexColumn gap={0.1}>
          <Text
            weight={700}
            size={15}
          >
            Método
          </Text>
          <Text
            weight={600}
            size={14}
            color={COLORS.dim}
          >
            { payment[paymentType] }
          </Text>
        </FlexColumn>
      </Wrapper>
    </Container>
  );
}

export default Advance;
