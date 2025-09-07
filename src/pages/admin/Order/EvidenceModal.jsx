import Modal from "../../../components/Modal";
import { COLORS } from "../../../styles/colors";
import { FlexColumn, FlexRow, Image, Text } from "../../../styles/layout";
import { EvidenceSection } from "./styles";

function EvidenceModal({isActive, setIsActive, order}) {
  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Lima'
  }
  const parsedDate = new Date(order.deliveredAt);

  return (
    <Modal
      size="md"
      isActive={isActive}
      setIsActive={setIsActive}
    >
      <EvidenceSection>
        <Text
          size={18}
          color={COLORS.persian}
          weight={700}
        >
          {
            order.shippingType === "ENVIO_AGENCIA"
            ? "Evidencia de envío"
            : "Evidencia de recojo"
          }
        </Text>
        <FlexRow
          width="100%"
          gap={1}
          style={{flexWrap: "wrap", justifyContent: "space-between"}}
        >
          {
            order.shippingType === "ENVIO_AGENCIA"
            ? <>
                <FlexColumn
                  gap={0.1}
                >
                  <Text
                    size={15}
                    color={COLORS.taupe}
                    weight={600}
                  >
                    Codigo de seguimiento
                  </Text>
                  <Text
                    size={15}
                    color={COLORS.dim}
                    weight={700}
                  >
                    {order.receiverInfo?.trackingCode || "Sin especificar"}
                  </Text>
                </FlexColumn>
                <FlexColumn
                  gap={0.1}
                >
                  <Text
                    size={15}
                    color={COLORS.taupe}
                    weight={600}
                  >
                    Codigo de recojo
                  </Text>
                  <Text
                    size={15}
                    color={COLORS.dim}
                    weight={700}
                  >
                    {order.receiverInfo?.code || "Sin especificar"}
                  </Text>
                </FlexColumn>
                <FlexColumn
                  gap={0.1}
                >
                  <Text
                    size={15}
                    color={COLORS.taupe}
                    weight={600}
                  >
                    Fecha de envío
                  </Text>
                  <Text
                    size={15}
                    color={COLORS.dim}
                    weight={700}
                  >
                    {parsedDate.toLocaleDateString("es-ES", options)}
                  </Text>
                </FlexColumn>
              </>
            : <>
                <FlexColumn
                  gap={0.1}
                >
                  <Text
                    size={15}
                    color={COLORS.taupe}
                    weight={600}
                  >
                    Fecha de recojo
                  </Text>
                  <Text
                    size={15}
                    color={COLORS.dim}
                    weight={700}
                  >
                    {parsedDate.toLocaleDateString("es-ES", options)}
                  </Text>
                </FlexColumn>
              </>
          }
        </FlexRow>
        <FlexColumn
          width="100%"
          gap={0.1}
        >
          <Text
            weight={700}
            color={COLORS.blue}
          >
            Entregado por
          </Text>
          <FlexRow
            width="100%"
            gap={1}
            style={{flexWrap: "wrap", justifyContent: "space-between"}}
          >
            <FlexColumn
              gap={0.1}
            >
              <Text
                size={15}
                color={COLORS.taupe}
                weight={600}
              >
                Nombre
              </Text>
              <Text
                size={15}
                color={COLORS.dim}
                weight={700}
                style={{textTransform: "capitalize"}}
              >
                {order.employee?.rsocial?.toLowerCase()}
              </Text>
            </FlexColumn>
            <FlexColumn
              gap={0.1}
            >
              <Text
                size={15}
                color={COLORS.taupe}
                weight={600}
              >
                DNI
              </Text>
              <Text
                size={15}
                color={COLORS.dim}
                weight={700}
              >
                {order.employee?.document}
              </Text>
            </FlexColumn>
            <FlexColumn
              gap={0.1}
            >
              <Text
                size={15}
                color={COLORS.taupe}
                weight={600}
              >
                Cargo
              </Text>
              <Text
                size={15}
                color={COLORS.dim}
                weight={700}
              >
                {order.employee?.role?.name}
              </Text>
            </FlexColumn>
          </FlexRow>
        </FlexColumn>
        <FlexColumn
          width="100%"
          gap={0.1}
        >
          <Text
            size={15}
            color={COLORS.taupe}
            weight={600}
          >
            Evidencia
          </Text>
          <Image
            width="100%"
            style={{maxHeight: "350px"}}
            src={order.evidence?.url}
          />
        </FlexColumn>
      </EvidenceSection>
    </Modal>
  );
}

export default EvidenceModal;
