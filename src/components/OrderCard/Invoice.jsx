import { useNavigate } from "react-router-dom";
import { Container, Text } from "./styles";
import Header from "./Header";
import { FlexColumn, FlexRow } from "../../styles/layout";
import Badge from "../Badge";

function Invoice({ id, date, rsocial, type, document, total }) {
  const navigate = useNavigate();

  return (
    <Container onClick={() => navigate(`/comprobantes/${id}`)}>
      <Header 
        date={date}
        name={rsocial}
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
            Documento
          </Text>
          <Text
            weight={600}
          >
            { document }
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
            Tipo
          </Text>
          <Badge
            color="orange"
          >
            { type }
          </Badge>
        </FlexColumn>
      </FlexRow>
    </Container>
  );
}

export default Invoice;
