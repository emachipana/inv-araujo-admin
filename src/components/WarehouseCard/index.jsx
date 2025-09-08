import { Container, RowBetween, Section, Text } from "../OrderCard/styles";
import { COLORS } from "../../styles/colors";
import { FlexColumn, FlexRow } from "../../styles/layout";
import { FaMapMarkerAlt } from "react-icons/fa";

function WarehouseCard({ name, location }) {
  return (
    <Container style={{ height: "125px" }}>
      <Section isWarehouse>
        <Text
          color={COLORS.white}
          size="17px"
        >
          { name.toLowerCase() }
        </Text>
      </Section>
      <RowBetween
        style={{padding: "0.5rem 1rem", justifyContent: "center"}}
      >
        <FlexColumn
          align="center"
        >
          <FlexRow>
            <FaMapMarkerAlt
              color={COLORS.taupe}
            />
            <Text
              color={COLORS.taupe}
              weight={600}
            >
              Ubicación
            </Text>
          </FlexRow>
          <Text
            weight={700}
          >
            { location }
          </Text>
        </FlexColumn>
      </RowBetween>
    </Container>
  );
}

export default WarehouseCard;
