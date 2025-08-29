import Modal from "../../../components/Modal";
import { FlexColumn, FlexRow, Text } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";
import ProductionSummary from "../../../components/ProductionSummary";

function ProductionModal({ isActive, setIsActive }) {
  return (
    <Modal
      size="lg"
      isActive={isActive}
      setIsActive={setIsActive}
    >
      <FlexColumn
        width="100%"
        align="center"
        gap={1.5}
      >
        <Text
          size={20}
          weight={700}
          color={COLORS.persian}
        >
          Producción pendiente
        </Text>
        <FlexRow
          width="100%"
          justify="space-around"
          style={{flexWrap: "wrap"}}
          gap={1}
        >
          <ProductionSummary />
        </FlexRow>
      </FlexColumn>
    </Modal>
  );
}

export default ProductionModal;
