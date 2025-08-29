import { useAdmin } from "../../context/admin";
import { FlexColumn, FlexRow, Text } from "../../styles/layout";
import { Card } from "./styles";
import Badge from "../Badge";
import { monthsProduction } from "../../data/months";
import { COLORS } from "../../styles/colors";
import { IoLeaf } from "react-icons/io5";

function ProductionSummary() {
  const { productionSummary } = useAdmin();

  return (
    <>
      {
        productionSummary.map((item, index) => {
          const total = item.varieties.reduce((acc, variety) => acc + variety.quantity, 0);
          return (
            <Card 
              key={index}
            >
              <FlexRow
                width="100%"
                justify="space-between"
              >
                <Badge
                  size={13}
                  color="primary"
                >
                  {monthsProduction[item.month]}
                </Badge>
                <Text
                  size={13}
                  weight={700}
                  color={COLORS.dim}
                >
                  {total} plántulas
                </Text>
              </FlexRow>
              <FlexColumn
                width="100%"
              >
                {
                  item.varieties.map((variety, index) => (
                    <FlexRow
                      key={index}
                      width="100%"
                      justify="space-between"
                    >
                      <FlexRow>
                        <IoLeaf 
                          size={18}
                          color={COLORS.persian}
                        />
                        <Text
                          size={13}
                          weight={700}
                          color={COLORS.dim}
                        >
                          { `${variety.tuber} (${variety.variety})` }
                        </Text>
                      </FlexRow>
                      <Text
                        size={13}
                        weight={700}
                        color={COLORS.blue}
                      >
                        {variety.quantity} und.
                      </Text>
                    </FlexRow>
                  ))
                }
              </FlexColumn>
            </Card>
          );
        })
      }
    
    </>
  );
}

export default ProductionSummary;
