import Modal from "../../../components/Modal";
import { COLORS } from "../../../styles/colors";
import { FlexColumn, Text } from "../../../styles/layout";
import { Variety } from "../InvitroOrder/styles";
import { Wrapper } from "./styles";
import { capitalizeAll } from "../../../helpers/capitalize";

function RemoveStockModal({ isActive, setIsActive, discounts }) {
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "America/Lima",
    hour: "numeric",
    minute: "numeric",
    hour12: true
  }

  return (
    <Modal
      size="md"
      align="flex-start"
      isActive={isActive}
      setIsActive={setIsActive}
    >
      <FlexColumn
        width="100%"
      >
        <Text
          weight={700}
          size={18}
        >
          Disminuciones de stock
        </Text>
        <FlexColumn
          width="100%"
          align="center"
          gap={1}
        >
          {
            discounts.length <= 0
            ? <Text
                size={15}
                weight={600}
                color={COLORS.dim}
              >
                No hay disminuciones de stock
              </Text>
            : discounts.map((discount, index) => {
                const parsedDate = new Date(discount.createdAt).toLocaleString("es-ES", options);

                return (
                  <Variety
                    key={index}
                  >
                    <Wrapper wrap>
                      <FlexColumn gap={0.1}>
                        <Text
                          weight={700}
                          size={15}
                        >
                          Cantidad
                        </Text>
                        <Text
                          weight={600}
                          size={14}
                          color={COLORS.dim}
                        >
                          { discount.quantity }
                        </Text>
                      </FlexColumn>
                      <FlexColumn gap={0.1}>
                        <Text
                          weight={700}
                          size={15}
                        >
                          Razón
                        </Text>
                        <Text
                          weight={600}
                          size={14}
                          color={COLORS.dim}
                          align="start"
                        >
                          { discount.reason }
                        </Text>
                      </FlexColumn>
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
                          align="start"
                        >
                          { parsedDate }
                        </Text>
                      </FlexColumn>
                    </Wrapper>
                    <Wrapper wrap>
                      <FlexColumn gap={0.1}>
                        <Text
                          weight={700}
                          size={15}
                        >
                          Hecho por
                        </Text>
                        <Text
                          weight={600}
                          size={14}
                          color={COLORS.dim}
                        >
                          { capitalizeAll(discount.employee?.rsocial?.toLowerCase()) }
                        </Text>
                      </FlexColumn>
                      <FlexColumn gap={0.1}>
                        <Text
                          weight={700}
                          size={15}
                        >
                          Documento
                        </Text>
                        <Text
                          weight={600}
                          size={14}
                          color={COLORS.dim}
                        >
                          { discount.employee?.document }
                        </Text>
                      </FlexColumn>
                      <FlexColumn gap={0.1}>
                        <Text
                          weight={700}
                          size={15}
                        >
                          Cargo
                        </Text>
                        <Text
                          weight={600}
                          size={14}
                          color={COLORS.dim}
                        >
                          { discount.employee?.role?.name }
                        </Text>
                      </FlexColumn>

                    </Wrapper>
                  </Variety>
                )
              })
          }
        </FlexColumn>

      </FlexColumn>
    </Modal>
  );
}

export default RemoveStockModal;
