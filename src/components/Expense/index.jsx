import { useNavigate } from "react-router-dom";
import { months } from "../../data/months";
import { COLORS } from "../../styles/colors";
import { FlexRow, Text } from "../../styles/layout";
import { Card, Container } from "./styles";
import { FONTS } from "../../styles/fonts";

function Expense({ id, month, totalExpenses, profit, income }) {
  const navigate = useNavigate();

  return (
    <Container onClick={() => navigate(`${id}`)}>
      <Text
        weight={900}
        size={26}
        style={{fontFamily: FONTS.secondary}}
      >
        { months[month] }
      </Text>
      <FlexRow
        width="100%"
        justify="space-between"
      >
        <Card>
          <Text
            weight={700}
            size={18}
          >
            Gastos
          </Text>
          <Text
            weight={800}
            size={17}
          >
            S/. { totalExpenses.toFixed(1) }
          </Text>
        </Card>
        <Card
          color={COLORS.emerald}
        >
          <Text
            weight={700}
            size={18}
          >
            Ingresos
          </Text>
          <Text
            weight={800}
            size={17}
          >
            S/. { income.toFixed(1) }
          </Text>
        </Card>
        <Card
          color={(profit * 1) < 0 ? COLORS.red : COLORS.blue}
        >
          <Text
            weight={700}
            size={18}
          >
            Ganancia
          </Text>
          <Text
            weight={800}
            size={17}
          >
            S/. { profit.toFixed(1) }
          </Text>
        </Card>
      </FlexRow>
    </Container>
  );
}

export default Expense;
