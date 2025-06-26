import Modal from "../../../components/Modal";
import { COLORS } from "../../../styles/colors";
import { FlexColumn, Image, Text } from "../../../styles/layout";
import { Variety } from "../InvitroOrder/styles";
import { Wrapper } from "../Product/styles";

function EvidenceModal({isActive, setIsActive, employee, evidence}) {
  return (
    <Modal
      size="md"
      isActive={isActive}
      setIsActive={setIsActive}
    >
      <FlexColumn>
        <Text
          size={22}
          weight={800}
          color={COLORS.persian}
        >
          Evidencia de la entrega
        </Text>
        {
          employee
          &&
          <FlexColumn width="100%">
            <Text
              size={17}
              weight={700}
            >
              Entregado por
            </Text>
            <Variety style={{alignSelf: "center"}}>
              <Wrapper>
                <FlexColumn gap={0.1}>
                  <Text 
                    weight={700}
                    size={15}
                  >
                    DNI
                  </Text>
                  <Text
                    style={{whiteSpace: "nowrap"}}
                    weight={600}
                    size={15}
                    color={COLORS.dim}
                  >
                    {employee.document}
                  </Text>
                </FlexColumn>
                <FlexColumn gap={0.1}>
                  <Text 
                    weight={700}
                    size={15}
                  >
                    Nombre
                  </Text>
                  <Text
                    style={{whiteSpace: "nowrap", textTransform: "capitalize"}}
                    weight={600}
                    size={15}
                    color={COLORS.dim}
                  >
                    {employee.rsocial?.toLowerCase()?.split(" ")?.slice(0, 2)?.join(" ")}
                  </Text>
                </FlexColumn>
                <FlexColumn gap={0.1}>
                  <Text 
                    weight={700}
                    size={15}
                  >
                    Correo
                  </Text>
                  <Text
                    style={{whiteSpace: "nowrap"}}
                    weight={600}
                    size={15}
                    color={COLORS.dim}
                  >
                    {employee.email}
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
                    style={{whiteSpace: "nowrap"}}
                    weight={600}
                    size={15}
                    color={COLORS.dim}
                  >
                    {employee.role}
                  </Text>
                </FlexColumn>  
              </Wrapper>
            </Variety>
          </FlexColumn>
        }
        {
          evidence
          &&
          <FlexColumn width="100%">
            <Text
              weight={700}
              size={17}
            >
              Evidencia:
            </Text>
            <Image
              style={{maxHeight: "420px", alignSelf: "center"}}
              width="80%"
              src={evidence.url}
              alt="evidencia-entrega"
            />
          </FlexColumn>
        }
      </FlexColumn>
    </Modal>
  );
}

export default EvidenceModal;
