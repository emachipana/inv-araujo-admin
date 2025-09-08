import { useState } from "react";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import { FlexColumn, Text } from "../../../styles/layout";
import { FaMoneyBillWheat } from "react-icons/fa6";
import Advance from "./Advance";
import AdvanceForm from "./AdvanceForm";
import { Variety } from "./styles";
import { COLORS } from "../../../styles/colors";

function AdvancesModal({ isActive, setIsActive, advances, setVitroOrder, vitroId, currentAdvance, total, setAdvances, createdBy }) {
  const [isCreating, setIsCreating] = useState(false);
  
  return (
    <Modal
      size="md"
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
            advances.length <= 0
            ? <Text
                size={15}
                weight={600}
                color={COLORS.dim}
              >
                Registra el primer adelanto
              </Text>
            : advances.map((advance, index) => (
                <Advance 
                  amount={advance.amount}
                  date={advance.createdAt}
                  key={index}
                  paymentType={advance.paymentType}
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
                total={total}
                setAdvances={setAdvances}
              />
            </Variety>
          }
          {
            (currentAdvance < total && createdBy === "ADMINISTRADOR")
            &&
            <Button
              disabled={isCreating}
              fontSize={14}
              iconSize={16}
              Icon={FaMoneyBillWheat}
              onClick={() => setIsCreating(true)}
            >
              Registrar adelanto
            </Button>
          }
        </FlexColumn>
      </FlexColumn>
    </Modal>
  );
}

export default AdvancesModal;
