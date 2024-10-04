import { useState } from "react";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import { FlexColumn, Text } from "../../../styles/layout";
import { FaMoneyBillWheat } from "react-icons/fa6";
import Advance from "./Advance";
import AdvanceForm from "./AdvanceForm";
import { Variety } from "./styles";

function AdvancesModal({ isActive, setIsActive, advances, setVitroOrder, vitroId }) {
  const [isCreating, setIsCreating] = useState(false);
  
  return (
    <Modal
      align={advances.length <= 3 ? "center" : "flex-start"}
      isActive={isActive}
      setIsActive={setIsActive}
    >
      <FlexColumn>
        <Text
          weight={700}
          size={18}
        >
          Adelantos
        </Text>
        <FlexColumn
          width="100%"
          align="center"
          gap={1}
        >
          {
            advances.map((advance, index) => (
              <Advance 
                amount={advance.amount}
                date={advance.date}
                key={index}
                id={advance.id}
                setOrder={setVitroOrder}
                vitroId={vitroId}
              />
            ))
          }
          {
            isCreating
            &&
            <Variety>
              <AdvanceForm 
                setIsActive={setIsCreating}
                setVitroOrder={setVitroOrder}
                vitroOrderId={vitroId}
              />
            </Variety>
          }
          <Button
            disabled={isCreating}
            fontSize={16}
            iconSize={18}
            Icon={FaMoneyBillWheat}
            onClick={() => setIsCreating(true)}
          >
            Registrar adelanto
          </Button>
        </FlexColumn>
      </FlexColumn>
    </Modal>
  );
}

export default AdvancesModal;
