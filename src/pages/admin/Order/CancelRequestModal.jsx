import Modal from "../../../components/Modal";
import { FlexColumn, Text } from "../../../styles/layout";
import CancelRequest from "../../../components/CancelRequest";

function CancelRequestModal({ isActive, setIsActive, requests, setRequests, setOrder }) {
  return (
    <Modal
      size="md"
      align="center"
      isActive={isActive}
      setIsActive={setIsActive}
    >
      <FlexColumn>
        <Text
          weight={700}
          size={18}
        >
          Solicitudes de cancelación
        </Text>
        {
          requests.map((request, index) => (
            <CancelRequest
              key={index}
              request={request}
              setRequests={setRequests}
              setIsActive={setIsActive}
              setOrder={setOrder}
            />
          ))
        }
      </FlexColumn>
    </Modal>
  );
}

export default CancelRequestModal;
